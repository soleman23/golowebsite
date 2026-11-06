/**
 * The only way Rules Center records leave the server.
 *
 * Two selection paths, kept apart on purpose, as the glossary's:
 *
 * - **published**: `status: "published"` and nothing else. Production, the
 *   sitemap, llms.txt, structured data and the content checks use this, and
 *   only once `rulesLive` is true.
 * - **review**: published plus `approved`, each approved record marked
 *   `unpublished`. Only `next dev` uses it (NODE_ENV "development").
 *
 * Planned, draft, in-review and archived records reach neither. Public
 * records are built field by field, so a field added to a record type later
 * stays server-side until it's listed here.
 */

import { rulesCategoryForRule } from "./categories";
import { rulesLive } from "./launch";
import { officialRules } from "./official";
import { ruleOverviews } from "./overviews";
import { rulesScenarios } from "./scenarios";
import { rulesSourceHref } from "./sources";
import type {
  PublicRuleOverview,
  PublicRulesLink,
  PublicRulesScenario,
  RuleOverview,
  RulesCategoryId,
  RulesScenario,
  RulesSearchEntry,
  RulesSource,
} from "./types";

export type RulesSelection = "published" | "review";

const STATUSES: Record<RulesSelection, readonly RuleOverview["status"][]> = {
  published: ["published"],
  review: ["published", "approved"],
};

/** Which path the hub takes in this build. */
export function rulesSelection(): RulesSelection {
  return process.env.NODE_ENV === "development" ? "review" : "published";
}

/** Whether /rules renders at all: live, or local review in `next dev`. */
export function rulesRouteVisible(): boolean {
  return rulesLive || rulesSelection() === "review";
}

/** A record's Rules of Golf citations, in source order: "18.2b", "17". */
export function rulesCitations(sources: readonly RulesSource[]): string[] {
  return sources.filter((s) => s.document === "rules").map((s) => s.ruleRef);
}

/** The rule number a citation belongs to: 18 for "18.2b". */
function citedRule(ref: string): number {
  return Number.parseInt(ref, 10);
}

function toLinks(sources: readonly RulesSource[]): PublicRulesLink[] {
  return sources.map((s) => {
    const link: PublicRulesLink = {
      authority: s.authority,
      document: s.document,
      ruleRef: s.ruleRef,
      href: rulesSourceHref(s),
    };
    if (s.document === "local-rule") link.localRule = true;
    return link;
  });
}

function reviewFields(
  r: RuleOverview | RulesScenario,
): Pick<PublicRuleOverview, "reviewedOn" | "publishedOn" | "updatedOn" | "unpublished"> {
  const out: Pick<PublicRuleOverview, "reviewedOn" | "publishedOn" | "updatedOn" | "unpublished"> = {};
  if (r.reviewedOn) out.reviewedOn = r.reviewedOn;
  if (r.publishedOn) out.publishedOn = r.publishedOn;
  if (r.updatedOn) out.updatedOn = r.updatedOn;
  if (r.status !== "published") out.unpublished = true;
  return out;
}

function scenarioToPublic(s: RulesScenario): PublicRulesScenario {
  const out: PublicRulesScenario = {
    id: s.id,
    slug: s.slug,
    question: s.question,
    aliases: [...s.aliases],
    primaryRule: s.primaryRule,
    category: rulesCategoryForRule(s.primaryRule) as RulesCategoryId,
    ruleRefs: rulesCitations(s.sources),
    answer: s.answer,
    conditions: [...s.conditions],
    options: [...s.options],
    relatedGlossaryIds: [...s.relatedGlossaryIds],
    relatedContentPaths: [...s.relatedContentPaths],
    links: toLinks(s.sources),
    ...reviewFields(s),
  };
  if (s.penalty) out.penalty = s.penalty;
  if (s.example) out.example = s.example;
  if (s.localRuleCaveat) out.localRuleCaveat = s.localRuleCaveat;
  if (s.matchVsStrokeCaveat) out.matchVsStrokeCaveat = s.matchVsStrokeCaveat;
  if (s.handicapCaveat) out.handicapCaveat = s.handicapCaveat;
  return out;
}

function overviewToPublic(
  r: RuleOverview,
  shownScenarios: readonly PublicRulesScenario[],
): PublicRuleOverview {
  // Situations governed by this rule first, then those that cite it.
  const primary = shownScenarios.filter((s) => s.primaryRule === r.number);
  const citing = shownScenarios.filter(
    (s) => s.primaryRule !== r.number && s.ruleRefs.some((ref) => citedRule(ref) === r.number),
  );
  return {
    id: r.id,
    number: r.number,
    title: officialRules[r.number]?.title ?? "",
    category: rulesCategoryForRule(r.number) as RulesCategoryId,
    aliases: [...r.aliases],
    summary: r.summary,
    commonQuestions: [...r.commonQuestions],
    scenarioIds: [...primary, ...citing].map((s) => s.id),
    relatedGlossaryIds: [...r.relatedGlossaryIds],
    relatedContentPaths: [...r.relatedContentPaths],
    links: toLinks(r.sources),
    ...reviewFields(r),
  };
}

export type RulesHub = {
  overviews: PublicRuleOverview[];
  scenarios: PublicRulesScenario[];
};

/**
 * Records for a selection, internals stripped: overviews by rule number,
 * situations in display order. An overview only lists situations in the
 * same selection, so a published rule never links to an unpublished answer.
 */
export function selectRules(
  overviews: readonly RuleOverview[],
  scenarios: readonly RulesScenario[],
  selection: RulesSelection,
): RulesHub {
  const allowed = STATUSES[selection];
  const shownScenarios = scenarios
    .filter((s) => allowed.includes(s.status))
    .map(scenarioToPublic);
  const shownOverviews = overviews
    .filter((r) => allowed.includes(r.status))
    .sort((a, b) => a.number - b.number)
    .map((r) => overviewToPublic(r, shownScenarios));
  return { overviews: shownOverviews, scenarios: shownScenarios };
}

/** Published records only, whatever the build. For every public surface. */
export function publishedRules(
  overviews: readonly RuleOverview[] = ruleOverviews,
  scenarios: readonly RulesScenario[] = rulesScenarios,
): RulesHub {
  return selectRules(overviews, scenarios, "published");
}

/** What the hub shows in this build (see rulesSelection). */
export function hubRules(): RulesHub {
  return selectRules(ruleOverviews, rulesScenarios, rulesSelection());
}

/** Every fragment a published or shown record answers to on /rules. */
export function rulesRecordIds(hub: RulesHub): Set<string> {
  return new Set([...hub.overviews.map((r) => r.id), ...hub.scenarios.map((s) => s.slug)]);
}

function firstSentence(text: string): string {
  const m = /^.*?[.?](?=\s|$)/.exec(text.trim());
  return (m ? m[0] : text).trim();
}

/** The client search index: only the fields search reads and shows. */
export function rulesSearchEntries(hub: RulesHub): RulesSearchEntry[] {
  return [
    ...hub.scenarios.map(
      (s): RulesSearchEntry => ({
        kind: "scenario",
        id: s.id,
        anchor: s.slug,
        title: s.question,
        rule: s.primaryRule,
        category: s.category,
        snippet: firstSentence(s.answer),
        aliases: [...s.aliases],
        ruleRefs: [...s.ruleRefs],
        extra: [...s.conditions, ...s.options].join(" "),
      }),
    ),
    ...hub.overviews.map(
      (r): RulesSearchEntry => ({
        kind: "rule",
        id: r.id,
        anchor: r.id,
        title: `Rule ${r.number} · ${r.title}`,
        rule: r.number,
        category: r.category,
        snippet: firstSentence(r.summary),
        aliases: [...r.aliases],
        ruleRefs: [String(r.number)],
        extra: r.commonQuestions.join(" "),
      }),
    ),
  ];
}

/**
 * The hub's honest last-modified date for the sitemap: the latest real
 * publishedOn or updatedOn among published records, or undefined if none.
 */
export function rulesLastModified(hub: RulesHub): string | undefined {
  const dates = [...hub.overviews, ...hub.scenarios]
    .filter((r) => !r.unpublished)
    .flatMap((r) => [r.publishedOn, r.updatedOn])
    .filter((d): d is string => Boolean(d));
  return dates.length ? dates.sort().at(-1) : undefined;
}

/** The link to a record on the hub. */
export function rulesAnchorHref(id: string): string {
  return `/rules#${id}`;
}
