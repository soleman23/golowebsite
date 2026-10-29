/**
 * The only way glossary records leave the server.
 *
 * Two selection paths, kept apart on purpose:
 *
 * - **published**: `status: "published"` and nothing else. Production, the
 *   sitemap, llms.txt, structured data and the content checks use this, and
 *   only once `glossaryLive` is true.
 * - **review**: published plus `approved`, each approved term marked
 *   `unpublished`. Only `next dev` uses it (NODE_ENV "development"), so the
 *   owner can read approved content before the launch PR publishes it. A
 *   Hostinger build is a production build and never takes this path.
 *
 * Draft, in-review, planned and archived records reach neither. Public terms
 * are built field by field rather than by deleting internals, so a field
 * added to GlossaryTerm later stays server-side until it's listed here.
 */

import { glossaryLive } from "./launch";
import { compareGlossaryTerms, glossaryLetter } from "./search";
import { glossaryTerms } from "./terms";
import type {
  GlossaryCategoryId,
  GlossarySearchEntry,
  GlossaryTerm,
  PublicGlossaryTerm,
} from "./types";

export type GlossarySelection = "published" | "review";

const STATUSES: Record<GlossarySelection, readonly GlossaryTerm["status"][]> = {
  published: ["published"],
  review: ["published", "approved"],
};

/** Which path the hub takes in this build. */
export function glossarySelection(): GlossarySelection {
  return process.env.NODE_ENV === "development" ? "review" : "published";
}

/** Whether /glossary renders at all: live, or local review in `next dev`. */
export function glossaryRouteVisible(): boolean {
  return glossaryLive || glossarySelection() === "review";
}

function toPublic(t: GlossaryTerm, shown: ReadonlySet<string>): PublicGlossaryTerm {
  const out: PublicGlossaryTerm = {
    id: t.id,
    slug: t.slug,
    term: t.term,
    aliases: [...t.aliases],
    primaryCategory: t.primaryCategory,
    tags: [...t.tags],
    shortDefinition: t.shortDefinition,
    relatedTermIds: t.relatedTermIds.filter((id) => shown.has(id)),
    relatedContentPaths: [...t.relatedContentPaths],
    canonical: { ...t.canonical },
    capabilityIds: [...t.capabilityIds],
  };
  if (t.explanation) out.explanation = t.explanation;
  if (t.example) out.example = t.example;
  if (t.ruleNote) out.ruleNote = { ...t.ruleNote };
  if (t.goloNote) out.goloNote = t.goloNote;
  if (t.ctaIntent) out.ctaIntent = t.ctaIntent;
  if (t.reviewedOn) out.reviewedOn = t.reviewedOn;
  if (t.publishedOn) out.publishedOn = t.publishedOn;
  if (t.updatedOn) out.updatedOn = t.updatedOn;
  if (t.status !== "published") out.unpublished = true;
  return out;
}

/**
 * Terms for a selection, alphabetical, internals stripped. Related-term ids
 * that point outside the selection are dropped, so a published term never
 * links to an unpublished one.
 */
export function selectGlossaryTerms(
  terms: readonly GlossaryTerm[],
  selection: GlossarySelection,
): PublicGlossaryTerm[] {
  const allowed = STATUSES[selection];
  const chosen = terms
    .filter((t) => allowed.includes(t.status))
    .sort(compareGlossaryTerms);
  const shown = new Set(chosen.map((t) => t.id));
  return chosen.map((t) => toPublic(t, shown));
}

/** Published terms only, whatever the build. For every public surface. */
export function publishedGlossaryTerms(
  terms: readonly GlossaryTerm[] = glossaryTerms,
): PublicGlossaryTerm[] {
  return selectGlossaryTerms(terms, "published");
}

/** What the hub shows in this build (see glossarySelection). */
export function hubGlossaryTerms(): PublicGlossaryTerm[] {
  return selectGlossaryTerms(glossaryTerms, glossarySelection());
}

/** The client search index: only the fields search reads and shows. */
export function glossarySearchEntries(
  terms: readonly PublicGlossaryTerm[],
): GlossarySearchEntry[] {
  return terms.map((t) => ({
    id: t.id,
    slug: t.slug,
    term: t.term,
    category: t.primaryCategory,
    shortDefinition: t.shortDefinition,
    aliases: [...t.aliases],
    tags: [...t.tags],
  }));
}

export type GlossaryLetterGroup = {
  letter: string;
  terms: PublicGlossaryTerm[];
  /** Categories present in the group, for the CSS category filter. */
  categories: GlossaryCategoryId[];
};

/** "#" then A–Z, every letter present whether or not it has terms. */
export const GLOSSARY_LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"] as const;

/** Terms grouped by letter in GLOSSARY_LETTERS order; empty letters omitted. */
export function glossaryLetterGroups(
  terms: readonly PublicGlossaryTerm[],
): GlossaryLetterGroup[] {
  const groups = new Map<string, PublicGlossaryTerm[]>();
  for (const t of [...terms].sort(compareGlossaryTerms)) {
    const letter = glossaryLetter(t.term);
    groups.set(letter, [...(groups.get(letter) ?? []), t]);
  }
  return GLOSSARY_LETTERS.filter((l) => groups.has(l)).map((letter) => {
    const list = groups.get(letter) ?? [];
    return {
      letter,
      terms: list,
      categories: [...new Set(list.map((t) => t.primaryCategory))],
    };
  });
}

/**
 * The hub's honest last-modified date for the sitemap: the latest real
 * publishedOn or updatedOn among published terms, or undefined if none.
 */
export function glossaryLastModified(
  terms: readonly PublicGlossaryTerm[],
): string | undefined {
  const dates = terms
    .filter((t) => !t.unpublished)
    .flatMap((t) => [t.publishedOn, t.updatedOn])
    .filter((d): d is string => Boolean(d));
  return dates.length ? dates.sort().at(-1) : undefined;
}

/** The id of a letter's heading on the hub: "letter-a", or "letter-0-9" for "#". */
export function glossaryLetterId(letter: string): string {
  return letter === "#" ? "letter-0-9" : `letter-${letter.toLowerCase()}`;
}

/** The fragment id a term's anchor uses on the hub. */
export function glossaryAnchorHref(slug: string): string {
  return `/glossary#${slug}`;
}
