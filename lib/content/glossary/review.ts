/**
 * The MVP records' review log (#158–#162, #166). Every stage happened on
 * October 29, 2026:
 *
 * - rules, product and seo were done by an agent, which the owner delegated
 *   on October 29, 2026 (editorial-review.md § Roles). The agent opened each
 *   source on the date its `accessedOn` gives and recomputed every example
 *   (docs/glossary/review-packet.md). It checked every GoLo note and
 *   capability id against the app's code at golo `main` 2237c1d (GoLo 1.2.1,
 *   capability-check.md), and canonicals, links and metadata against
 *   canonical-map.md and lint:content.
 * - approval is the owner's, given in writing on October 29, 2026, subject to
 *   those checks. The owner didn't open the sources or test the app.
 *
 * Internal: stripped by every public selector.
 */

import type { ReviewEntry } from "./types";

export const MVP_REVIEWED_ON = "2026-10-29";

const rules: ReviewEntry = {
  stage: "rules",
  by: "agent",
  on: MVP_REVIEWED_ON,
  note: "Sources opened on their accessedOn dates; examples recomputed (review-packet.md).",
};

const seo: ReviewEntry = {
  stage: "seo",
  by: "agent",
  on: MVP_REVIEWED_ON,
  note: "Canonical per canonical-map.md; related links and fragments pass lint:content.",
};

const approval: ReviewEntry = {
  stage: "approval",
  by: "owner",
  on: MVP_REVIEWED_ON,
  note: "Approved in the owner's written instruction of 2026-10-29, subject to the agent's checks.",
};

/** A record with a GoLo note or capability ids, checked against the app's code. */
export const mvpReviewLogApp: ReviewEntry[] = [
  rules,
  {
    stage: "product",
    by: "agent",
    on: MVP_REVIEWED_ON,
    note: "GoLo note and capability ids checked against golo main 2237c1d (GoLo 1.2.1).",
  },
  seo,
  approval,
];

/** A record that says nothing about GoLo. */
export const mvpReviewLogNone: ReviewEntry[] = [
  rules,
  { stage: "product", by: "agent", on: MVP_REVIEWED_ON, note: "No GoLo claim and no capability ids." },
  seo,
  approval,
];
