/**
 * /features block 5: the Overall Match press ladder — the base match and its
 * presses as rungs, live ones in lime, plus Tom's worst-case exposure footer.
 * Overall Match because it's the only game the app takes presses on.
 * Decorative.
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
      aria-label="A $5 Overall Match press ladder between Tom and Mike: the base match closed on 6 with Mike 2 up when Tom pressed at double the amount; that press and a second one at triple, from the 14th, are both live, with $30 of total exposure."
    >
      <div className={styles.glassCardInner} aria-hidden="true">
        <div className={styles.rowBetween}>
          <span className={styles.cardKicker}>OVERALL MATCH · $5</span>
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
          <span className={styles.exposureValue}>$30</span>
        </div>
      </div>
    </div>
  );
}
