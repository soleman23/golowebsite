/**
 * Glossary records. Ids, slugs, categories and aliases come from
 * docs/glossary/inventory.md; the lifecycle and the review record from
 * docs/glossary/editorial-review.md.
 *
 * The records live in ./terms/, one file per content batch (#158–#162),
 * and reach `approved` only through the review stages. Drafts never reach a
 * page, the search index, the sitemap, llms.txt or structured data
 * (./selectors).
 *
 * Copy here is golf education: scripts/check-content.mjs counts only strings
 * that mention GoLo or "the app" as claims, plus every `goloNote`, which gets
 * the full check.
 */

import type { GlossaryTerm } from "./types";
import { formatsTerms } from "./terms/formats";
import { sideGamesTerms } from "./terms/side-games";
import { handicapsTerms } from "./terms/handicaps";
import { scoringShotsTerms } from "./terms/scoring-shots";

export const glossaryTerms: GlossaryTerm[] = [
  ...formatsTerms,
  ...sideGamesTerms,
  ...handicapsTerms,
  ...scoringShotsTerms,
];
