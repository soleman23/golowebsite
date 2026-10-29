/**
 * Deterministic glossary search (spec §5.4). Pure functions over the
 * published search index, so the hub's client leaf only calls them and the
 * tests can pin the ranking.
 *
 * Ranking, best first:
 *   0 exact name · 1 exact alias · 2 name prefix · 3 partial name ·
 *   4 alias prefix · 5 description or tag (at the start of a word).
 * A term takes its best tier; ties sort alphabetically. Explicit aliases
 * only: there is no fuzzy or typo-tolerant matching.
 */

import type { GlossaryCategoryId, GlossarySearchEntry } from "./types";

/**
 * Case, accents, apostrophes, punctuation and whitespace all normalised away:
 * "Four-Ball", "four ball" and "FOUR  BALL" are one form, as are "Member's"
 * and "members". Used for search, sorting and the alias-collision check.
 */
export function normalizeGlossaryText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’‘]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Alphabetical order for terms: by normalised name, then id. */
export function compareGlossaryTerms(
  a: { term: string; id: string },
  b: { term: string; id: string },
): number {
  const x = normalizeGlossaryText(a.term);
  const y = normalizeGlossaryText(b.term);
  if (x !== y) return x < y ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** The A–Z group a term files under: a letter, or "#" for a leading digit. */
export function glossaryLetter(term: string): string {
  const first = normalizeGlossaryText(term).charAt(0);
  return /[a-z]/.test(first) ? first.toUpperCase() : "#";
}

export type GlossaryMatchTier = 0 | 1 | 2 | 3 | 4 | 5;

export type GlossaryMatch = {
  entry: GlossarySearchEntry;
  tier: GlossaryMatchTier;
  /** The alias that matched, as written, when the match came through one. */
  alias?: string;
};

type Prepared = {
  entry: GlossarySearchEntry;
  name: string;
  aliases: { raw: string; norm: string }[];
  words: string;
  tags: string[];
};

export type PreparedGlossarySearch = readonly Prepared[];

/** Normalise the index once; search runs against the result on every query. */
export function prepareGlossarySearch(
  entries: readonly GlossarySearchEntry[],
): PreparedGlossarySearch {
  return entries.map((entry) => ({
    entry,
    name: normalizeGlossaryText(entry.term),
    aliases: entry.aliases.map((raw) => ({ raw, norm: normalizeGlossaryText(raw) })),
    words: ` ${normalizeGlossaryText(entry.shortDefinition)} `,
    tags: entry.tags.map(normalizeGlossaryText),
  }));
}

function bestMatch(p: Prepared, q: string): Omit<GlossaryMatch, "entry"> | null {
  if (p.name === q) return { tier: 0 };
  const exactAlias = p.aliases.find((a) => a.norm === q);
  if (exactAlias) return { tier: 1, alias: exactAlias.raw };
  if (p.name.startsWith(q)) return { tier: 2 };
  if (p.name.includes(q)) return { tier: 3 };
  const prefixAlias = p.aliases.find((a) => a.norm.startsWith(q));
  if (prefixAlias) return { tier: 4, alias: prefixAlias.raw };
  if (p.words.includes(` ${q}`) || p.tags.some((t) => t.startsWith(q))) {
    return { tier: 5 };
  }
  return null;
}

/**
 * Ranked matches for a query, within one category or all of them. An empty
 * or all-punctuation query matches nothing (the caller shows the directory).
 */
export function searchGlossary(
  index: PreparedGlossarySearch,
  query: string,
  category: GlossaryCategoryId | "all" = "all",
): GlossaryMatch[] {
  const q = normalizeGlossaryText(query);
  if (!q) return [];
  const matches: GlossaryMatch[] = [];
  for (const p of index) {
    if (category !== "all" && p.entry.category !== category) continue;
    const m = bestMatch(p, q);
    if (m) matches.push({ entry: p.entry, ...m });
  }
  return matches.sort(
    (a, b) => a.tier - b.tier || compareGlossaryTerms(a.entry, b.entry),
  );
}

/**
 * The closed `match_type` set for analytics (#165): never the query itself.
 * Taken from the best result.
 */
export function glossaryMatchType(
  matches: readonly GlossaryMatch[],
): "exact" | "alias" | "partial" | "none" {
  const tier = matches[0]?.tier;
  if (tier === undefined) return "none";
  if (tier === 0) return "exact";
  if (tier === 1 || tier === 4) return "alias";
  return "partial";
}

/** The closed `result_bucket` set for analytics (#165). */
export function glossaryResultBucket(count: number): "0" | "1" | "2-5" | "6+" {
  if (count === 0) return "0";
  if (count === 1) return "1";
  return count <= 5 ? "2-5" : "6+";
}
