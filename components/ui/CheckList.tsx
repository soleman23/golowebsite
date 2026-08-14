/**
 * Lime circled-check list: a bold lead-in, an em dash, then the rest.
 * Extracted from FeatureRow so /features, /games and the game detail pages
 * all render the same list.
 */

import { CheckIcon } from "./Icon";
import styles from "./CheckList.module.css";

export type CheckListItem = { lead: string; rest: string };

type CheckListProps = {
  items: CheckListItem[];
  className?: string;
};

export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={`${styles.list} ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item.lead} className={styles.item}>
          <span className={styles.icon}>
            <CheckIcon />
          </span>
          <span className={styles.text}>
            <strong>{item.lead}</strong> — {item.rest}
          </span>
        </li>
      ))}
    </ul>
  );
}
