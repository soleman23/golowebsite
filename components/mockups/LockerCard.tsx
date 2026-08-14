/**
 * /features block 8: the Locker — season and all-time net, a handicap trend
 * sparkline, and a per-format record table. Decorative.
 *
 * The reference leaves a screenshot slot here; this is the CSS stand-in the
 * build spec calls for, so the page ships without waiting on app captures.
 */

import { lockerFormats, lockerTrend } from "@/lib/mockData";
import styles from "./mockups.module.css";

const MIN = Math.min(...lockerTrend);
const MAX = Math.max(...lockerTrend);

export function LockerCard() {
  return (
    <div
      className={styles.glassCard}
      role="img"
      aria-label="The Locker: $231 net for the season, $1,204 all time, a handicap index trending from 12.4 down to 11.6, and a win-loss record in each format."
    >
      <div className={styles.glassCardInner} aria-hidden="true">
        <div className={styles.rowBetween}>
          <span className={styles.cardKicker}>YOUR LOCKER · MIKE</span>
          <span className={styles.cardMeta}>28 rounds this season</span>
        </div>

        <div className={styles.lockerTotals}>
          <div className={styles.lockerTotal}>
            <span className={styles.lockerTotalLabel}>SEASON NET</span>
            <span className={styles.lockerTotalValue}>+$231</span>
          </div>
          <div className={styles.lockerTotal}>
            <span className={styles.lockerTotalLabel}>ALL TIME</span>
            <span
              className={`${styles.lockerTotalValue} ${styles.lockerTotalMuted}`}
            >
              +$1,204
            </span>
          </div>
        </div>

        <div>
          <div className={styles.strokeLabel}>HANDICAP TREND · 12.4 → 11.6</div>
          <div className={styles.trend}>
            {lockerTrend.map((value, i) => (
              <span
                key={i}
                className={styles.trendBar}
                // Lower index is better, so invert: the best round is tallest.
                style={{
                  height: `${18 + ((MAX - value) / (MAX - MIN)) * 30}px`,
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.lockerTable}>
          {lockerFormats.map((row) => (
            <div key={row.format} className={styles.lockerRow}>
              <span className={styles.lockerFormat}>{row.format}</span>
              <span className={styles.lockerRecord}>{row.record}</span>
              <span
                className={`${styles.lockerNet} ${
                  row.net.startsWith("−") ? styles.lockerNetDown : ""
                }`}
              >
                {row.net}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
