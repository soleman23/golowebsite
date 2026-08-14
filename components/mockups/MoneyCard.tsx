/**
 * Feature 2 mockup: a "money on the line" standings card (not a phone — a
 * flexible-width glass card over a course photo). Decorative marketing content.
 */

import { Icon } from "@/components/ui/Icon";
import { moneyRows } from "@/lib/mockData";
import styles from "./mockups.module.css";

export function MoneyCard() {
  return (
    <div
      className={styles.moneyCard}
      role="img"
      aria-label="GoLo money-on-the-line card showing Skins, Nassau, Stroke Purse and Closest to Pin standings."
    >
      <div
        className={`${styles.moneyCardBg} golo-bd-mock-course`}
        aria-hidden="true"
      />
      <div className={styles.moneyCardScrim} aria-hidden="true" />
      <div className={styles.moneyCardInner} aria-hidden="true">
        <div className={styles.moneyCardHead}>
          <span className={styles.moneyCardKicker}>MONEY ON THE LINE</span>
          <span className={styles.moneyCardThrough}>through 12</span>
        </div>
        {moneyRows.map((m) => (
          <div key={m.title} className={styles.moneyItem}>
            <span
              className={styles.moneyItemIcon}
              style={{ background: m.iconBg, borderColor: m.iconBorder }}
            >
              <Icon name={m.icon} size={20} color={m.iconColor} />
            </span>
            <div className={styles.moneyItemBody}>
              <div className={styles.moneyItemTitle}>{m.title}</div>
              <div className={styles.moneyItemWho}>{m.who}</div>
            </div>
            <div className={styles.moneyItemRight}>
              <div
                className={styles.moneyItemVal}
                style={{ color: m.valAccent ? "var(--accent)" : "#fff" }}
              >
                {m.val}
              </div>
              <div className={styles.moneyItemTag}>{m.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
