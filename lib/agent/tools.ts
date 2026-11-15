/**
 * The read-only tools behind /mcp (and, through it, the WebMCP tools in the
 * browser). Server-side only: these read the full content records.
 *
 * Every answer is built from the same published records the pages render,
 * through the same selectors and the same search ranking the glossary and
 * Rules Center hubs use, so a tool can't say anything a page doesn't. Each
 * ends with the URL to cite. Nothing here writes, reads a user or stores the
 * query.
 */

import {
  capabilitiesWithStatus,
  findGameDetail,
  games,
  glossaryAnchorHref,
  glossarySearchEntries,
  isGameSlug,
  llmsCopy,
  normalizeGlossaryText,
  prepareGlossarySearch,
  prepareRulesSearch,
  pricing,
  publishedGlossaryTerms,
  publishedRules,
  rulesAnchorHref,
  rulesEdition,
  rulesSearchEntries,
  searchGlossary,
  searchRules,
} from "@/lib/content";
import {
  AGENT_INPUT_MAX,
  agentToolCopy,
  agentTools,
  type AgentToolName,
} from "@/lib/content/agent";
import { siteConfig } from "@/lib/siteConfig";

const absolute = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

export type ToolResult = { text: string; isError?: boolean };

/** Thrown for bad arguments; the endpoint reports it as a tool error. */
export class ToolInputError extends Error {}

function stringArg(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new ToolInputError(`"${key}" must be a non-empty string.`);
  }
  if (value.length > AGENT_INPUT_MAX) {
    throw new ToolInputError(`"${key}" must be ${AGENT_INPUT_MAX} characters or fewer.`);
  }
  return value.trim();
}

/* Indexes, built once per server process, from published records only. */

const glossaryTerms = publishedGlossaryTerms();
const glossaryById = new Map(glossaryTerms.map((t) => [t.id, t]));
const glossaryIndex = prepareGlossarySearch(glossarySearchEntries(glossaryTerms));

const rulesHub = publishedRules();
const rulesIndex = prepareRulesSearch(rulesSearchEntries(rulesHub));
const scenarioById = new Map(rulesHub.scenarios.map((s) => [s.id, s]));
const overviewById = new Map(rulesHub.overviews.map((r) => [r.id, r]));

function gameUrl(slug: string): string {
  return absolute(findGameDetail(slug) ? `/games/${slug}` : "/games");
}

/* The tools. */

function lookupGolfTerm(args: Record<string, unknown>): ToolResult {
  const query = stringArg(args, "term");
  const matches = searchGlossary(glossaryIndex, query).slice(0, 3);
  if (!matches.length) {
    return { text: `${agentToolCopy.noTerm} ${absolute("/glossary")}` };
  }
  const blocks = matches.map(({ entry }) => {
    const term = glossaryById.get(entry.id);
    const lines = [`## ${entry.term}`, "", entry.shortDefinition];
    if (term?.explanation) lines.push("", term.explanation);
    if (term?.example) lines.push("", `Example: ${term.example}`);
    if (term?.ruleNote) lines.push("", term.ruleNote.text);
    if (term?.goloNote) lines.push("", `In GoLo: ${term.goloNote}`);
    lines.push("", absolute(glossaryAnchorHref(entry.slug)));
    return lines.join("\n");
  });
  return { text: blocks.join("\n\n") };
}

function listSideGames(): ToolResult {
  const lines = games.map(
    (g) => `- ${g.name}: ${g.rule} Players: ${g.players}. ${gameUrl(g.slug)}`,
  );
  return { text: lines.join("\n") };
}

function getSideGame(args: Record<string, unknown>): ToolResult {
  const query = normalizeGlossaryText(stringArg(args, "game"));
  const slug = query.replace(/ /g, "-");
  const game =
    games.find((g) => g.slug === slug) ??
    games.find((g) => normalizeGlossaryText(g.name) === query) ??
    games.find((g) => normalizeGlossaryText(g.name).includes(query));
  if (!game) {
    return { text: `${agentToolCopy.noGame}\n\n${listSideGames().text}` };
  }
  const detail = isGameSlug(game.slug) ? findGameDetail(game.slug) : undefined;
  const lines = [
    `## ${game.name}`,
    "",
    game.how,
    "",
    `Players: ${game.players}. Format: ${game.format}.`,
  ];
  if (detail) {
    lines.push("", detail.intro, "");
    for (const step of detail.steps) lines.push(`${step.n}. ${step.title}: ${step.body}`);
  }
  lines.push("", gameUrl(game.slug));
  return { text: lines.join("\n") };
}

function findRulesSituation(args: Record<string, unknown>): ToolResult {
  const query = stringArg(args, "question");
  const matches = searchRules(rulesIndex, query).slice(0, 3);
  if (!matches.length) {
    return { text: `${agentToolCopy.noRules} ${absolute("/rules")}` };
  }
  const blocks = matches.map(({ entry }) => {
    const lines = [`## ${entry.title}`, ""];
    const scenario = entry.kind === "scenario" ? scenarioById.get(entry.id) : undefined;
    const overview = entry.kind === "rule" ? overviewById.get(entry.id) : undefined;
    if (scenario) {
      lines.push(scenario.answer);
      if (scenario.penalty) lines.push("", `Penalty: ${scenario.penalty}`);
      if (scenario.ruleRefs.length) lines.push("", `Rules cited: ${scenario.ruleRefs.join(", ")}`);
    } else if (overview) {
      lines.push(overview.summary);
    } else {
      lines.push(entry.snippet);
    }
    lines.push("", absolute(rulesAnchorHref(entry.anchor)));
    return lines.join("\n");
  });
  const footer = `${rulesEdition.label}. ${agentToolCopy.rulesIndependence}`;
  return { text: [...blocks, footer].join("\n\n") };
}

function getAppFacts(): ToolResult {
  const live = capabilitiesWithStatus("live").filter((c) => c.id !== "web-app");
  const lines = [
    `# ${siteConfig.brandName}`,
    "",
    siteConfig.description,
    "",
    `Price: ${pricing.value}: ${pricing.qualifier}.`,
    llmsCopy.status,
    agentToolCopy.moneyLine,
    "",
    agentToolCopy.liveHeading,
    ...live.map((c) => [`- ${c.label}: ${c.summary}`, ...(c.limits ?? [])].join(" ")),
    "",
    agentToolCopy.testingHeading,
    ...capabilitiesWithStatus("testing").map((c) => `- ${c.label}`),
    "",
    agentToolCopy.plannedHeading,
    ...capabilitiesWithStatus("planned").map((c) => `- ${c.label}`),
    "",
    llmsCopy.contact,
    absolute("/features"),
  ];
  return { text: lines.join("\n") };
}

const runners: Record<AgentToolName, (args: Record<string, unknown>) => ToolResult> = {
  lookup_golf_term: lookupGolfTerm,
  list_side_games: listSideGames,
  get_side_game: getSideGame,
  find_rules_situation: findRulesSituation,
  get_app_facts: getAppFacts,
};

export function isAgentToolName(name: unknown): name is AgentToolName {
  return typeof name === "string" && agentTools.some((t) => t.name === name);
}

export function runAgentTool(name: AgentToolName, args: Record<string, unknown>): ToolResult {
  try {
    return runners[name](args);
  } catch (err) {
    if (err instanceof ToolInputError) return { text: err.message, isError: true };
    throw err;
  }
}
