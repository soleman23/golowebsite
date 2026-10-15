/**
 * /features block 8: the Locker — season and all-time net and a per-format
 * record table. Decorative. It shows only what the app's Locker has (see
 * season-stats in lib/content/capabilities.ts): no handicap trend.
 *
 * The reference leaves a screenshot slot here; this is the CSS stand-in the
 * build spec calls for, so the page ships without waiting on app captures.
 */

import { lockerFormats } from "@/lib/mockData";
import styles from "./mockups.module.css";

export function LockerCard() {
  return (
    <div
      className={styles.glassCard}
      role="img"
      aria-label="The Locker: $231 net for the season, $1,204 all time, and a win-loss record in each format."
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
