/**
 * Glossary records. Ids, slugs, categories and aliases come from
 * docs/glossary/inventory.md; the lifecycle and the review record from
 * docs/glossary/editorial-review.md.
 *
 * The records live in ./terms/, one file per content batch (#158–#162, and
 * the expansion batches under #168),
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
import { courseEquipmentSlangTerms } from "./terms/course-equipment-slang";
import { sideGamesBatch1Terms } from "./terms/side-games-batch-1";
import { expansionBatch2Terms } from "./terms/expansion-batch-2";
import { expansionBatch3Terms } from "./terms/expansion-batch-3";
import { expansionBatch4Terms } from "./terms/expansion-batch-4";
import { expansionBatch5Terms } from "./terms/expansion-batch-5";
import { expansionBatch6Terms } from "./terms/expansion-batch-6";

export const glossaryTerms: GlossaryTerm[] = [
  ...formatsTerms,
  ...sideGamesTerms,
  ...handicapsTerms,
  ...scoringShotsTerms,
  ...courseEquipmentSlangTerms,
  ...sideGamesBatch1Terms,
  ...expansionBatch2Terms,
  ...expansionBatch3Terms,
  ...expansionBatch4Terms,
  ...expansionBatch5Terms,
  ...expansionBatch6Terms,
];
