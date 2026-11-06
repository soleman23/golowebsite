/**
 * The five Rules Center categories, in display order, with the rules each
 * holds (docs/rules/inventory.md § Categories). The ids are also the
 * `?category=` values the hub accepts.
 */

import type { RulesCategoryId } from "./types";

export type RulesCategory = {
  id: RulesCategoryId;
  /** Section heading and filter-status name. */
  label: string;
  /** The chip, kept short so six fit on one line from about 760px. */
  chip: string;
  /** The category section's id on the hub. */
  anchor: string;
  /** First and last rule number, inclusive. */
  rules: readonly [number, number];
};

export const rulesCategories = [
  { id: "foundations", label: "Foundations and equipment", chip: "Foundations", anchor: "cat-foundations", rules: [1, 4] },
  { id: "playing", label: "Playing the round", chip: "Playing", anchor: "cat-playing", rules: [5, 11] },
  { id: "course-areas", label: "Course areas and procedures", chip: "Course areas", anchor: "cat-course-areas", rules: [12, 16] },
  { id: "relief", label: "Relief and penalties", chip: "Relief", anchor: "cat-relief", rules: [17, 19] },
  { id: "formats", label: "Rulings, formats and accessibility", chip: "Formats", anchor: "cat-formats", rules: [20, 25] },
] as const satisfies readonly RulesCategory[];

export const rulesCategoryIds: readonly RulesCategoryId[] = rulesCategories.map((c) => c.id);

export function isRulesCategoryId(id: string): id is RulesCategoryId {
  return (rulesCategoryIds as readonly string[]).includes(id);
}

export function rulesCategory(id: RulesCategoryId): RulesCategory {
  // Every RulesCategoryId is in the list, so this can't miss.
  return rulesCategories.find((c) => c.id === id) as RulesCategory;
}

/** The category a rule number belongs to, or undefined outside 1–25. */
export function rulesCategoryForRule(number: number): RulesCategoryId | undefined {
  return rulesCategories.find((c) => number >= c.rules[0] && number <= c.rules[1])?.id;
}

/**
 * Section ids on the hub that no record may take as its fragment
 * (docs/rules/canonical-map.md § Fragment registry). A link may point at them.
 */
export const RULES_PAGE_IDS: readonly string[] = [
  "rules-search",
  "rules-results",
  "rules-controls",
  "rules-numbers",
  "quick-situations",
  "situations",
  "all-rules",
  "official-sources",
  "related",
  ...rulesCategories.map((c) => c.anchor),
];
