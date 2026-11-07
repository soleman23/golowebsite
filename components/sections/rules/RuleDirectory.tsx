/**
 * The rule overviews in their five categories (docs/rules/inventory.md
 * § Categories), each group under its own heading so a category is never
 * shown by colour alone. A category with nothing on the page is left out.
 *
 * Previous and next run through the overviews on the page in number order
 * and wrap at the ends (ux.md § 320 px: Rule 1's previous is Rule 25).
 */

import {
  rulesCategories,
  type PublicRuleOverview,
  type PublicRulesScenario,
} from "@/lib/content";
import { RuleOverview } from "./RuleOverview";
import type { GlossaryLinkTarget } from "./RulesEntry";
import styles from "./RuleDirectory.module.css";

type RuleDirectoryProps = {
  /** In number order, as hubRules() returns them. */
  overviews: readonly PublicRuleOverview[];
  scenarios: ReadonlyMap<string, PublicRulesScenario>;
  glossary: ReadonlyMap<string, GlossaryLinkTarget>;
};

export function RuleDirectory({ overviews, scenarios, glossary }: RuleDirectoryProps) {
  const at = (i: number) => overviews[(i + overviews.length) % overviews.length];
  const position = new Map(overviews.map((r, i) => [r.id, i]));

  const groups = rulesCategories.map((category) => {
    const rules = overviews.filter((r) => r.category === category.id);
    if (!rules.length) return null;
    return (
      <div
        key={category.id}
        id={category.anchor}
        className={styles.group}
        data-category={category.id}
      >
        <h3 className={styles.title} tabIndex={-1}>
          {category.label}
        </h3>
        {rules.map((r) => {
          const i = position.get(r.id) ?? 0;
          const paged = overviews.length > 1;
          return (
            <RuleOverview
              key={r.id}
              rule={r}
              scenarios={scenarios}
              glossary={glossary}
              previous={paged ? at(i - 1) : undefined}
              next={paged ? at(i + 1) : undefined}
            />
          );
        })}
      </div>
    );
  });
  return <>{groups}</>;
}
