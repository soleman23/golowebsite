/**
 * Deterministic Rules Center search (spec §8, docs/rules/ux.md § Flows and
 * states). Pure functions over the published search index, so the hub's
 * client leaf only calls them and scripts/test-rules.mjs can pin the ranking.
 *
 * Ranking, best first:
 *   0 the rule a reference names ("18", "rule 18", "18.2b"), or an exact
 *     title or question ·
 *   1 a situation citing that rule or subrule, or an exact alias ·
 *     (a reference matches by reference only, never as text)
 *   2 title or question prefix ·
 *   3 a later word of the title or question starts with the query, or an
 *     alias does ("ob" finds "out of bounds", not "obstructions") ·
 *   4 every word of the query starts a word somewhere in the entry ·
 *     (a word under three letters must be a whole word) ·
 *   5 a near miss: each word within one edit of a word in the entry's
 *     title, question or aliases (words of five letters or more).
 * An entry takes its best tier; ties put situations first, then rule order.
 * Nothing is generated: a query that matches nothing returns nothing.
 */

import { normalizeGlossaryText } from "../glossary/search";
import { knownRuleRef, parseRuleRef } from "./official";
import type { RulesCategoryId, RulesSearchEntry } from "./types";

/**
 * The glossary's normalisation: case, accents, apostrophes, punctuation and
 * whitespace away, so "Can't", "cant" and "CANT" are one form.
 */
export const normalizeRulesText = normalizeGlossaryText;

export type RulesMatchTier = 0 | 1 | 2 | 3 | 4 | 5;

export type RulesMatch = {
  entry: RulesSearchEntry;
  tier: RulesMatchTier;
  /** The alias that matched, as written, when the match came through one. */
  alias?: string;
  /** The query was a rule reference and this entry is that rule or cites it. */
  reference?: true;
};

/** Words that carry no meaning in a question ("can I touch the sand"). */
const STOP_WORDS = new Set(
  "a an and are at can could did do does for how i if im in is it its me my of on or the to was what when where with you your".split(" "),
);
/** Words shorter than this must match exactly; a typo in "ob" is a different word. */
const FUZZY_MIN = 5;
/** Shorter words match whole words only: "ob" is out of bounds, not "obstruction". */
const PREFIX_MIN = 3;

/** Whether `text` has `w` as a word, or as the start of one when `w` is long enough. */
function hasWord(text: string, w: string): boolean {
  return w.length < PREFIX_MIN ? ` ${text} `.includes(` ${w} `) : ` ${text}`.includes(` ${w}`);
}

type Prepared = {
  entry: RulesSearchEntry;
  name: string;
  aliases: { raw: string; norm: string }[];
  /** Every word-start the entry can be found by, padded with spaces. */
  words: string;
  /** Distinct words of the title or question and aliases, for near misses. */
  vocabulary: string[];
};

export type PreparedRulesSearch = readonly Prepared[];

/** Normalise the index once; search runs against the result on every query. */
export function prepareRulesSearch(entries: readonly RulesSearchEntry[]): PreparedRulesSearch {
  return entries.map((entry) => {
    const name = normalizeRulesText(
      entry.kind === "rule" ? entry.title.replace(/^Rule \d+ · /, "") : entry.title,
    );
    const aliases = entry.aliases.map((raw) => ({ raw, norm: normalizeRulesText(raw) }));
    const words = ` ${normalizeRulesText(
      [entry.title, ...entry.aliases, entry.snippet, entry.extra].join(" "),
    )} `;
    // From `name`, so a rule's "Rule N · " prefix doesn't make every overview
    // a near miss for "rules".
    const vocabulary = [
      ...new Set([...name.split(" "), ...aliases.flatMap((a) => a.norm.split(" "))]),
    ].filter((w) => w.length >= FUZZY_MIN - 1);
    return { entry, name, aliases, words, vocabulary };
  });
}

/**
 * Optimal string alignment distance, capped: true when `a` and `b` are at
 * most one insertion, deletion, substitution or adjacent swap apart.
 */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  const restA = a.slice(i);
  const restB = b.slice(i);
  if (restA.slice(1) === restB.slice(1)) return true; // substitution
  if (restA.slice(1) === restB) return true; // deletion from a
  if (restA === restB.slice(1)) return true; // insertion into a
  // adjacent swap
  return restA.length >= 2 && restA[0] === restB[1] && restA[1] === restB[0] && restA.slice(2) === restB.slice(2);
}

/** "bunkers" also answers to "bunker". */
const singular = (w: string) => (w.length > FUZZY_MIN && w.endsWith("s") ? w.slice(0, -1) : w);

function nearMiss(p: Prepared, words: readonly string[]): boolean {
  if (!words.some((w) => w.length >= FUZZY_MIN)) return false;
  return words.every((w) => {
    if (w.length < FUZZY_MIN) return hasWord(p.words, w);
    return p.vocabulary.some((v) => withinOneEdit(w, v) || withinOneEdit(w, singular(v)));
  });
}

function bestMatch(
  p: Prepared,
  q: string,
  words: readonly string[],
  ref: { rule: number; subrule?: string } | null,
): Omit<RulesMatch, "entry"> | null {
  if (ref) {
    if (p.entry.kind === "rule" && p.entry.rule === ref.rule) return { tier: 0, reference: true };
    // "18" finds every 18.x citation; "18.2" finds 18.2a and 18.2b.
    const cited = `${ref.rule}.${ref.subrule ?? ""}`;
    const cites = p.entry.ruleRefs.some((r) =>
      ref.subrule ? r.startsWith(cited) : Number.parseInt(r, 10) === ref.rule,
    );
    if (cites) return { tier: 1, reference: true };
    // A reference is a reference: "1" isn't a word-start of "12" or "14 clubs".
    return null;
  }
  if (p.name === q) return { tier: 0 };
  const exactAlias = p.aliases.find((a) => a.norm === q);
  if (exactAlias) return { tier: 1, alias: exactAlias.raw };
  if (p.name.startsWith(q)) return { tier: 2 };
  if (hasWord(p.name, q)) return { tier: 3 };
  const prefixAlias = p.aliases.find((a) =>
    q.length < PREFIX_MIN ? hasWord(a.norm, q) : a.norm.startsWith(q),
  );
  if (prefixAlias) return { tier: 3, alias: prefixAlias.raw };
  if (words.length && words.every((w) => hasWord(p.words, w))) return { tier: 4 };
  if (nearMiss(p, words)) return { tier: 5 };
  return null;
}

/**
 * A normalised query that is a rule reference: "18", "rule 18", "r18",
 * "rule18", "rules 18", "rule no 18", "18 2b" (from "Rule 18.2b", "#18", "18?").
 */
function asRuleRef(q: string): { rule: number; subrule?: string } | null {
  const bare = q.replace(/^(?:rules? ?(?:no |number )?|r ?)/, "");
  const parsed = parseRuleRef(bare);
  return parsed && knownRuleRef({ rule: parsed.rule }) ? parsed : null;
}

/**
 * Ranked matches for a query, within one category or all of them. An empty
 * or all-punctuation query matches nothing (the caller shows the lists).
 */
export function searchRules(
  index: PreparedRulesSearch,
  query: string,
  category: RulesCategoryId | "all" = "all",
): RulesMatch[] {
  const q = normalizeRulesText(query);
  if (!q) return [];
  const all = q.split(" ");
  const meaningful = all.filter((w) => !STOP_WORDS.has(w));
  const words = meaningful.length ? meaningful : all;
  const ref = asRuleRef(q);
  const matches: RulesMatch[] = [];
  for (const p of index) {
    if (category !== "all" && p.entry.category !== category) continue;
    const m = bestMatch(p, q, words, ref);
    if (m) matches.push({ entry: p.entry, ...m });
  }
  return matches.sort(
    (a, b) =>
      a.tier - b.tier ||
      (a.entry.kind === b.entry.kind ? 0 : a.entry.kind === "scenario" ? -1 : 1) ||
      a.entry.rule - b.entry.rule,
  );
}

/** The closed `match_type` set for analytics (#244), from the best result. Never the query. */
export function rulesMatchType(
  matches: readonly RulesMatch[],
): "exact" | "alias" | "partial" | "fuzzy" | "none" {
  const best = matches[0];
  if (!best) return "none";
  if (best.tier === 0 || best.reference) return "exact";
  if (best.alias) return "alias";
  if (best.tier === 5) return "fuzzy";
  return "partial";
}

/** The closed `result_bucket` set for analytics (#244), as the glossary's. */
export function rulesResultBucket(count: number): "0" | "1" | "2-5" | "6+" {
  if (count === 0) return "0";
  if (count === 1) return "1";
  return count <= 5 ? "2-5" : "6+";
}
