/**
 * The eight glossary categories, in display order (docs/glossary/inventory.md
 * § Totals). The ids are also the `?category=` values the hub accepts.
 *
 * Side games is "Side games", not the spec's "Side games and friendly
 * wagers": the site's vocabulary check fails "wager" in any copy
 * (scripts/check-content.mjs, NEVER_WORDS).
 */

import type { GlossaryCategoryId } from "./types";

export type GlossaryCategory = {
  id: GlossaryCategoryId;
  /** Section and filter-status name. */
  label: string;
  /** The chip, kept short so eight fit on one line from about 1000px. */
  chip: string;
};

export const glossaryCategories = [
  { id: "scoring", label: "Scoring", chip: "Scoring" },
  { id: "formats", label: "Games and formats", chip: "Games & formats" },
  { id: "side-games", label: "Side games", chip: "Side games" },
  { id: "handicaps", label: "Handicaps and course ratings", chip: "Handicaps" },
  { id: "shots", label: "Shots and ball flight", chip: "Shots" },
  { id: "course-rules", label: "Course, rules and etiquette", chip: "Course & rules" },
  { id: "equipment", label: "Equipment and technology", chip: "Equipment" },
  { id: "slang", label: "Slang and golf culture", chip: "Slang" },
] as const satisfies readonly GlossaryCategory[];

export const glossaryCategoryIds: readonly GlossaryCategoryId[] =
  glossaryCategories.map((c) => c.id);

export function isGlossaryCategoryId(id: string): id is GlossaryCategoryId {
  return (glossaryCategoryIds as readonly string[]).includes(id);
}

export function glossaryCategory(id: GlossaryCategoryId): GlossaryCategory {
  // Every GlossaryCategoryId is in the list, so this can't miss.
  return glossaryCategories.find((c) => c.id === id) as GlossaryCategory;
}
