/**
 * Integrity checks for Rules Center records (#233). Pure: the caller passes
 * the served paths, the published glossary slugs and today's date, so
 * `npm run lint:content` runs it on the real records and
 * scripts/test-rules.mjs on fixtures.
 *
 * Each problem is one line that starts with the record's id.
 *
 * On top of what the glossary checks (identity, copy, links, dates, the
 * review record), the rules-specific ones:
 * - Rules 1–25 each have exactly one overview;
 * - every Rules of Golf citation names a rule and subrule the R&A publishes;
 * - a Model Local Rule source needs a visible caveat, and so does a Rules of
 *   Handicapping source (spec §3, canonical-map.md rules 5 and 6);
 * - fragments are unique across overviews and situations and avoid the
 *   hub's own section ids;
 * - from the day the next edition takes effect, every record fails.
 */

import { RULES_PAGE_IDS, rulesCategoryForRule } from "./categories";
import { CLARIFICATIONS_STALE_AFTER_DAYS, rulesEdition } from "./edition";
import type { RulesEdition } from "./edition";
import {
  MODEL_LOCAL_RULES_URL,
  RULES_CLARIFICATIONS_URL,
  RULES_DEFINITIONS_URL,
  RULE_NUMBERS,
  USGA_CLARIFICATIONS_URL,
  knownRuleRef,
  officialRules,
  parseRuleRef,
  ruleUrl,
} from "./official";
import { normalizeRulesText } from "./search";
import type { RuleOverview, RulesScenario, RulesSource } from "./types";

export type RulesValidationContext = {
  /** Every path the site serves: static routes, posts, guides, public files. */
  servedPaths: ReadonlySet<string>;
  /** Published glossary slugs: a related term must be live. */
  glossarySlugs: ReadonlySet<string>;
  /** YYYY-MM-DD. No check, review or publication can be dated after it. */
  today: string;
  /** Defaults to the shipped edition; tests pass their own. */
  edition?: RulesEdition;
  /**
   * Normalised aliases allowed on more than one record. A situation and its
   * primary rule may already share one ("water hazard"); anything else needs
   * a reason in docs/rules/inventory.md first.
   */
  ambiguousAliases?: readonly string[];
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const STAGES = ["rules", "product", "seo", "approval"] as const;
/** Markup in a plain-text field: a tag, a comment or an entity. */
const MARKUP = /<\s*[a-z/!]|&[a-z#][a-z0-9]*;/i;
/** House voice (CLAUDE.md): no emoji, no exclamation marks. */
const EMOJI = /\p{Extended_Pictographic}/u;
/** Where each kind of source lives (docs/rules/source-map.md). Rule pages are checked by number. */
const SOURCE_HOMES: Record<Exclude<RulesSource["document"], "rules">, { authority: RulesSource["authority"]; url: (u: string) => boolean; where: string }> = {
  definitions: { authority: "RANDA", url: (u) => u === RULES_DEFINITIONS_URL, where: RULES_DEFINITIONS_URL },
  "local-rule": { authority: "RANDA", url: (u) => u === MODEL_LOCAL_RULES_URL, where: MODEL_LOCAL_RULES_URL },
  clarifications: {
    authority: "RANDA",
    url: (u) => u === RULES_CLARIFICATIONS_URL || u === USGA_CLARIFICATIONS_URL,
    where: `${RULES_CLARIFICATIONS_URL} or ${USGA_CLARIFICATIONS_URL}`,
  },
  handicapping: {
    authority: "USGA",
    url: (u) => u.startsWith("https://www.usga.org/handicapping/roh/Content/rules/"),
    where: "a page under https://www.usga.org/handicapping/roh/Content/rules/",
  },
};

function realDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

type AnyRecord = RuleOverview | RulesScenario;
const isScenario = (r: AnyRecord): r is RulesScenario => "question" in r;
/** Written: past planning, so its copy and caveats must be there. */
const written = (r: AnyRecord) => r.status !== "planned";

function copyFields(r: AnyRecord): [string, string][] {
  const fields: [string, string | undefined][] = isScenario(r)
    ? [
        ["question", r.question],
        ["answer", r.answer],
        ...r.conditions.map((c, i): [string, string] => [`conditions[${i}]`, c]),
        ...r.options.map((o, i): [string, string] => [`options[${i}]`, o]),
        ["penalty", r.penalty],
        ["example", r.example],
        ["localRuleCaveat", r.localRuleCaveat],
        ["matchVsStrokeCaveat", r.matchVsStrokeCaveat],
        ["handicapCaveat", r.handicapCaveat],
      ]
    : [
        ["summary", r.summary],
        ...r.commonQuestions.map((q, i): [string, string] => [`commonQuestions[${i}]`, q]),
      ];
  return [
    ...fields,
    ...r.aliases.map((a, i): [string, string] => [`aliases[${i}]`, a]),
  ].filter((f): f is [string, string] => typeof f[1] === "string");
}

function sourceProblems(s: RulesSource, today: string): string[] {
  const out: string[] = [];
  const name = `source ${s.ruleRef}`;
  try {
    const url = new URL(s.url);
    if (url.protocol !== "https:") out.push(`${name} needs an https URL`);
    if (url.hash) out.push(`${name} URL carries a fragment; put it in anchor`);
  } catch {
    out.push(`${name} URL "${s.url}" isn't a URL`);
  }
  if (s.document === "rules") {
    const parsed = parseRuleRef(s.ruleRef);
    if (!parsed || !knownRuleRef(parsed)) {
      out.push(`${name} isn't a rule or subrule the R&A publishes`);
    } else {
      // One spelling, so search, the duplicate check and the page agree.
      const canonical = parsed.subrule ? `${parsed.rule}.${parsed.subrule}` : String(parsed.rule);
      if (s.ruleRef !== canonical) out.push(`${name} should be written ${canonical}`);
      const expected = parsed.subrule ? `${parsed.rule}_${parsed.subrule}` : undefined;
      if (s.anchor !== expected) out.push(`${name} anchor should be ${expected ?? "none"}`);
      if (s.authority !== "RANDA" || s.url !== ruleUrl(parsed.rule)) {
        out.push(`${name} should be the R&A's Rule ${parsed.rule} page, ${ruleUrl(parsed.rule)}`);
      }
    }
  } else {
    if (s.anchor) out.push(`${name} has an anchor; only rule pages have stable ones`);
    const home = SOURCE_HOMES[s.document];
    if (s.authority !== home.authority || !home.url(s.url)) {
      out.push(`${name} should point to ${home.where} (${home.authority === "USGA" ? "USGA" : "R&A"})`);
    }
  }
  if (s.checkedOn !== undefined) {
    if (!realDate(s.checkedOn)) out.push(`${name} checkedOn isn't a YYYY-MM-DD date`);
    else if (s.checkedOn > today) out.push(`${name} checkedOn is in the future`);
  }
  return out;
}

export function validateRules(
  overviews: readonly RuleOverview[],
  scenarios: readonly RulesScenario[],
  ctx: RulesValidationContext,
): string[] {
  const problems: string[] = [];
  const say = (r: { id: string }, message: string) =>
    problems.push(`${r.id || "(no id)"}: ${message}`);
  const edition = ctx.edition ?? rulesEdition;
  const records: AnyRecord[] = [...overviews, ...scenarios];

  // Overviews: one per rule, nothing else.
  const byNumber = new Map<number, string[]>();
  for (const r of overviews) {
    if (!Number.isInteger(r.number) || !rulesCategoryForRule(r.number)) {
      say(r, `rule number ${r.number} isn't 1–25`);
    }
    if (r.id !== `rule-${r.number}`) say(r, `id should be rule-${r.number}`);
    byNumber.set(r.number, [...(byNumber.get(r.number) ?? []), r.id]);
  }
  for (const n of RULE_NUMBERS) {
    const ids = byNumber.get(n) ?? [];
    if (ids.length === 0) problems.push(`rule-${n}: no overview for Rule ${n}`);
    if (ids.length > 1) problems.push(`${ids.join(", ")}: more than one overview for Rule ${n}`);
  }

  // Fragments: unique, slug-shaped, clear of the hub's own ids.
  const fragments = new Map<string, string>();
  const claim = (r: AnyRecord, fragment: string) => {
    if (RULES_PAGE_IDS.includes(fragment)) say(r, `fragment "${fragment}" is a hub section id`);
    const owner = fragments.get(fragment);
    if (owner && owner !== r.id) say(r, `fragment "${fragment}" is already used by ${owner}`);
    else fragments.set(fragment, r.id);
  };
  const ids = new Map<string, number>();
  for (const r of records) ids.set(r.id, (ids.get(r.id) ?? 0) + 1);
  for (const r of records) {
    if (!SLUG.test(r.id)) say(r, `id "${r.id}" isn't a lower-case slug`);
    if ((ids.get(r.id) ?? 0) > 1) say(r, "duplicate id");
    if (isScenario(r)) {
      if (!SLUG.test(r.slug)) say(r, `slug "${r.slug}" isn't a lower-case slug`);
      if (/^rule-\d+$/.test(r.slug)) say(r, `slug "${r.slug}" looks like a rule overview`);
      claim(r, r.slug);
    } else {
      claim(r, r.id);
    }
  }

  // Names and aliases: what search matches on.
  const names = new Map<string, string>();
  for (const r of overviews) {
    const title = officialRules[r.number]?.title;
    if (title) names.set(normalizeRulesText(title), r.id);
  }
  for (const s of scenarios) {
    const name = normalizeRulesText(s.question);
    if (!name) say(s, "empty question");
    const owner = names.get(name);
    if (owner) say(s, `question duplicates ${owner}`);
    else names.set(name, s.id);
  }
  const ambiguous = new Set(ctx.ambiguousAliases ?? []);
  const aliasOwners = new Map<string, AnyRecord[]>();
  for (const r of records) {
    const own = new Set<string>();
    for (const alias of r.aliases) {
      const norm = normalizeRulesText(alias);
      if (!norm) {
        say(r, "empty alias");
        continue;
      }
      if (own.has(norm)) say(r, `alias "${alias}" is listed twice`);
      own.add(norm);
      const nameOwner = names.get(norm);
      if (nameOwner && nameOwner !== r.id) say(r, `alias "${alias}" is the title or question of ${nameOwner}`);
      if (parseRuleRef(norm.replace(/^(?:rules? ?|r ?)/, ""))) {
        say(r, `alias "${alias}" reads as a rule reference, which search never matches as text`);
      }
      aliasOwners.set(norm, [...(aliasOwners.get(norm) ?? []), r]);
    }
  }
  for (const [alias, owners] of aliasOwners) {
    if (owners.length < 2 || ambiguous.has(alias)) continue;
    const situations = owners.filter(isScenario);
    const rules = owners.filter((o) => !isScenario(o)) as RuleOverview[];
    const sharedWithPrimary =
      situations.length === 1 && rules.length === 1 && situations[0].primaryRule === rules[0].number;
    if (!sharedWithPrimary) {
      problems.push(
        `${owners.map((o) => o.id).join(", ")}: alias "${alias}" resolves to more than one record (list it as deliberately ambiguous or remove it)`,
      );
    }
  }

  for (const r of records) {
    // Situation specifics
    if (isScenario(r)) {
      if (!rulesCategoryForRule(r.primaryRule)) say(r, `primary rule ${r.primaryRule} isn't 1–25`);
      const cited = r.sources.filter((s) => s.document === "rules");
      if (!cited.length) say(r, "cites no rule");
      else if (
        !cited.some((s) => {
          const parsed = parseRuleRef(s.ruleRef);
          return parsed?.rule === r.primaryRule && parsed.subrule !== undefined;
        })
      ) {
        say(r, `cites no subrule of its primary Rule ${r.primaryRule} (e.g. ${r.primaryRule}.1)`);
      }
    }

    // Copy
    for (const [field, value] of copyFields(r)) {
      if (MARKUP.test(value)) say(r, `${field} contains markup; rules copy is plain text`);
      if (value.includes("!")) say(r, `${field} has an exclamation mark (house voice)`);
      if (EMOJI.test(value)) say(r, `${field} has an emoji (house voice)`);
    }
    if (written(r)) {
      if (isScenario(r)) {
        if (!r.answer.trim()) say(r, `${r.status} without an answer`);
        if (!r.conditions.length) say(r, `${r.status} without "Before you decide" conditions`);
      } else {
        if (!r.summary.trim()) say(r, `${r.status} without a summary`);
        if (r.commonQuestions.length < 2 || r.commonQuestions.length > 4) {
          say(r, `${r.status} needs two to four common questions`);
        }
      }
    }

    // Sources and their caveats
    if (r.edition !== edition.id) say(r, `edition ${r.edition} isn't the ${edition.label}`);
    const refs = new Set<string>();
    for (const s of r.sources) {
      for (const p of sourceProblems(s, ctx.today)) say(r, p);
      if (refs.has(s.ruleRef)) say(r, `source ${s.ruleRef} is listed twice`);
      refs.add(s.ruleRef);
    }
    if (!isScenario(r) && !r.sources.some((s) => s.document === "rules" && s.ruleRef === String(r.number))) {
      say(r, `needs Rule ${r.number}'s own page as a source`);
    }
    const localRule = r.sources.some((s) => s.document === "local-rule");
    const handicapping = r.sources.some((s) => s.document === "handicapping");
    if (!isScenario(r)) {
      // An overview has nowhere to put the caveat (canonical-map.md rules 5 and 6).
      if (localRule || handicapping) {
        say(r, "an overview can't cite a Model Local Rule or the Rules of Handicapping; cite it from a situation, which carries the caveat");
      }
    } else if (written(r)) {
      if (localRule && !r.localRuleCaveat?.trim()) {
        say(r, "cites a Model Local Rule without a localRuleCaveat (in force only where a Committee adopts it)");
      }
      if (handicapping && !r.handicapCaveat?.trim()) {
        say(r, "cites the Rules of Handicapping without a handicapCaveat");
      }
    }

    // Links
    for (const slug of r.relatedGlossaryIds) {
      if (!ctx.glossarySlugs.has(slug)) say(r, `related glossary term "${slug}" isn't published`);
    }
    for (const path of r.relatedContentPaths) {
      if (path.startsWith("/rules")) say(r, `related path ${path} is this hub; link the record instead`);
      else if (!ctx.servedPaths.has(path)) say(r, `related path ${path} isn't a served page`);
    }

    // Dates
    for (const field of ["reviewedOn", "publishedOn", "updatedOn"] as const) {
      const value = r[field];
      if (value === undefined) continue;
      if (!realDate(value)) say(r, `${field} "${value}" isn't a YYYY-MM-DD date`);
      else if (value > ctx.today) say(r, `${field} ${value} is in the future`);
    }
    const approvals = (r.reviewLog ?? [])
      .filter((e) => e.stage === "approval")
      .map((e) => e.on)
      .sort();
    const firstApproval = approvals[0] ?? r.reviewedOn;
    if (firstApproval && r.publishedOn && r.publishedOn < firstApproval) {
      say(r, "publishedOn is before the first approval");
    }
    if (r.reviewedOn && approvals.length && r.reviewedOn !== approvals[approvals.length - 1]) {
      say(r, "reviewedOn isn't the latest approval in the review log");
    }
    if (r.updatedOn && r.publishedOn && r.updatedOn < r.publishedOn) {
      say(r, "updatedOn is before publishedOn");
    }
    for (const entry of r.reviewLog ?? []) {
      if (!realDate(entry.on)) say(r, `review log ${entry.stage} date "${entry.on}" isn't a YYYY-MM-DD date`);
      else if (entry.on > ctx.today) say(r, `review log ${entry.stage} is dated in the future`);
    }

    // Publication requirements
    const reviewed = r.status === "approved" || r.status === "published";
    if (reviewed) {
      if (!r.reviewedOn) say(r, `${r.status} without reviewedOn`);
      if (!r.reviewedBy) say(r, `${r.status} without reviewedBy`);
      const stages = new Set((r.reviewLog ?? []).map((e) => e.stage));
      const missing = STAGES.filter((s) => !stages.has(s));
      if (missing.length) say(r, `${r.status} without a review log entry for ${missing.join(", ")}`);
      const unchecked = r.sources.filter((s) => !s.checkedOn);
      if (unchecked.length) {
        say(r, `${r.status} with unchecked sources: ${unchecked.map((s) => s.ruleRef).join("; ")}`);
      }
    }
    if (r.status === "published" && !r.publishedOn) say(r, "published without publishedOn");
    // An archived record keeps the date it was published.
    if (!reviewed && r.status !== "archived" && r.publishedOn) {
      say(r, `publishedOn set while the record is ${r.status}`);
    }
  }

  // The edition itself
  if (ctx.today >= edition.supersededOn) {
    problems.push(
      `rules: the ${edition.label} stopped being current on ${edition.supersededOn}; move every record to the new edition (#251)`,
    );
  }

  return problems;
}

/** Things to look at that don't fail the build: a clarifications check gone stale. */
export function rulesWarnings(today: string, edition: RulesEdition = rulesEdition): string[] {
  const age =
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${edition.clarificationsCheckedOn}T00:00:00Z`)) /
    86_400_000;
  return age > CLARIFICATIONS_STALE_AFTER_DAYS
    ? [
        `rules: official clarifications last checked ${edition.clarificationsCheckedOn} (${Math.floor(age)} days ago); check them and update lib/content/rules/edition.ts (docs/rules/source-map.md § Recheck triggers)`,
      ]
    : [];
}
