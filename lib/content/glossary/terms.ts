/**
 * Glossary records. Ids, slugs, categories and aliases come from
 * docs/glossary/inventory.md; the lifecycle and the review record from
 * docs/glossary/editorial-review.md.
 *
 * Only a draft fixture lives here until the content batches (#158–#162) add
 * reviewed records at `approved`. Drafts never reach a page, the search
 * index, the sitemap, llms.txt or structured data (./selectors).
 *
 * Copy here is golf education: scripts/check-content.mjs counts only strings
 * that mention GoLo or "the app" as claims, plus every `goloNote`, which gets
 * the full check.
 */

import type { GlossaryTerm } from "./types";
import { formatsTerms } from "./terms/formats";

export const glossaryTerms: GlossaryTerm[] = [
  {
    // The spec §8.3 example, reworded for the site's vocabulary rule. A
    // fixture for the model and its checks, not reviewed content: #159 writes
    // and reviews the real record.
    id: "press",
    slug: "press",
    term: "Press",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["presses", "match-play"],
    priority: "mvp",
    shortDefinition:
      "A new match started while an existing match is still running, usually called by the side that is behind. It covers only the holes left, and the original match carries on underneath it.",
    example:
      "Two down after six holes of a $5 front nine, you press on the 7th tee. Holes 7 to 9 are now a second $5 match, and the front nine is still a match of its own.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether presses are called or automatic, when they can be called, and whether a press can itself be pressed.",
    },
    goloNote:
      "On GoLo's Overall Match game, the side two or more down calls a press. GoLo doesn't open presses automatically, and its Nassau takes none.",
    relatedTermIds: [],
    relatedContentPaths: ["/games/nassau"],
    canonical: { kind: "existing", path: "/blog/pressing" },
    capabilityIds: ["overall-match-presses", "auto-press", "nassau-presses"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  ...formatsTerms,
];
