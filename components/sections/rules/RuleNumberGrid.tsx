/**
 * The 1–25 number grid (docs/rules/ux.md D3): plain anchor links to each
 * overview, in place of a rail. Works without JavaScript and never filters.
 * A rule whose overview isn't on the page is plain text in its place, so
 * the numbers keep their positions.
 */

import {
  RULE_NUMBERS,
  rulesDirectoryCopy as copy,
  rulesRuleLabel,
  type PublicRuleOverview,
} from "@/lib/content";
import styles from "./RuleNumberGrid.module.css";

export function RuleNumberGrid({ overviews }: { overviews: readonly PublicRuleOverview[] }) {
  const byNumber = new Map(overviews.map((r) => [r.number, r]));
  return (
    <nav id="rules-numbers" className={styles.nav} aria-label={copy.numbersLabel}>
      <ul className={styles.grid}>
        {RULE_NUMBERS.map((n) => {
          const rule = byNumber.get(n);
          return (
            <li key={n}>
              {rule ? (
                <a
                  href={`#${rule.id}`}
                  className={styles.number}
                  aria-label={rulesRuleLabel(n)}
                  data-category={rule.category}
                >
                  {n}
                </a>
              ) : (
                <span className={`${styles.number} ${styles.empty}`}>{n}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
