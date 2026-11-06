/**
 * Eight cards that jump to the commonest situations (docs/rules/ux.md D1):
 * a reader mid-round looks for "lost ball", not Rule 18. Plain anchor
 * links, so they work without JavaScript. A card shows only while its
 * situation is on the page, so it never points at nothing.
 */

import {
  rulesQuickSituations as copy,
  rulesRuleLabel,
  type PublicRulesScenario,
} from "@/lib/content";
import styles from "./QuickSituations.module.css";

export function QuickSituations({ scenarios }: { scenarios: readonly PublicRulesScenario[] }) {
  const byId = new Map(scenarios.map((s) => [s.id, s]));
  const cards = copy.cards.flatMap((card) => {
    const scenario = byId.get(card.id);
    return scenario ? [{ label: card.label, scenario }] : [];
  });
  if (!cards.length) return null;

  return (
    <nav id="quick-situations" className={styles.nav} aria-labelledby="quick-situations-label">
      <p id="quick-situations-label" className={styles.title}>
        {copy.label}
      </p>
      <ul className={styles.grid}>
        {cards.map(({ label, scenario: s }) => (
          <li key={s.id} data-category={s.category}>
            <a href={`#${s.slug}`} className={styles.card} data-scenario-id={s.id}>
              <span className={styles.label}>{label}</span>
              <span className={styles.rule}>{rulesRuleLabel(s.primaryRule)}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
