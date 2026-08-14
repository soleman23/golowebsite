/**
 * /features block 5: the Nassau press ladder — base bets and presses as rungs,
 * live ones in lime, plus the worst-case exposure footer. Decorative.
 */

import { pressRungs } from "@/lib/mockData";
import styles from "./mockups.module.css";

const AMOUNT_CLASS = {
  positive: styles.rungAmountPositive,
  negative: styles.rungAmountNegative,
  plain: "",
} as const;

export function PressLadder() {
  return (
    <div
      className={styles.glassCard}
      role="img"
      aria-label="A $5 Nassau press ladder between Tom and Mike: the front nine and its press are closed, the back nine and an auto-press are still live, with $25 of total exposure."
    >
      <div className={styles.glassCardInner} aria-hidden="true">
        <div className={styles.rowBetween}>
          <span className={styles.cardKicker}>NASSAU · $5 · THE LADDER</span>
          <span className={styles.cardMeta}>Tom vs Mike</span>
        </div>

        <div className={styles.rungs}>
          {pressRungs.map((rung) => (
            <div
              key={rung.holes + rung.title}
              className={`${styles.rung} ${rung.live ? styles.rungLive : ""}`}
            >
              <span
                className={`${styles.rungHoles} ${rung.live ? styles.rungHolesLive : ""}`}
              >
                {rung.holes}
              </span>
              <div className={styles.rungBody}>
                <div className={styles.rungTitle}>{rung.title}</div>
                <div
                  className={`${styles.rungState} ${rung.live ? styles.rungStateLive : ""}`}
                >
                  {rung.state}
                </div>
              </div>
              <span
                className={`${styles.rungAmount} ${AMOUNT_CLASS[rung.amountTone]}`}
              >
                {rung.amount}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.exposure}>
          <span className={styles.exposureLabel}>
            EXPOSURE IF EVERYTHING FALLS BADLY
          </span>
          <span className={styles.exposureValue}>$25</span>
        </div>
      </div>
    </div>
  );
}
