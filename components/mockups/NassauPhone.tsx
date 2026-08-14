/**
 * The worked-example phone on a game detail page: the finished match, its
 * hole-by-hole momentum strip, each bet's standing, the press that turned the
 * back nine, and the single transfer it all nets to. Decorative.
 */

import type { GameDetail } from "@/lib/content";
import { PhoneShell } from "./PhoneShell";
import styles from "./mockups.module.css";

const DOT_CLASS = {
  w: styles.momentumWon,
  l: styles.momentumLost,
  h: styles.momentumHalved,
} as const;

export function NassauPhone({
  phone,
  gameName,
  label,
}: {
  phone: GameDetail["example"]["phone"];
  gameName: string;
  label: string;
}) {
  return (
    <PhoneShell
      bg="course"
      bgPosition="50% 58%"
      width={290}
      height={588}
      radius={42}
      scrim="linear-gradient(180deg, rgba(6,14,9,.66) 0%, rgba(6,14,9,.5) 26%, rgba(4,12,8,.94) 100%)"
      label={label}
      float
    >
      <div className={styles.rowBetween}>
        <div className={styles.livePill}>
          <span className={styles.pulseDot}>
            <span className={styles.pulseCore} />
            <span className={styles.pulseRing} />
          </span>
          <span className={styles.liveLabel}>LIVE</span>
          <span className={styles.liveCourse}>{gameName}</span>
        </div>
        <span className={styles.matchOpponent}>{phone.opponent}</span>
      </div>

      <div className={styles.throughRow}>
        <div>
          <div className={styles.throughKicker}>THROUGH</div>
          <div className={styles.throughNums}>
            <span className={styles.throughBig}>{phone.through}</span>
            <span className={styles.throughOf}>{phone.of}</span>
          </div>
        </div>
        <div className={styles.throughRight}>
          <div className={styles.throughToPlay}>{phone.state}</div>
          <div className={styles.throughHole}>{phone.stateSub}</div>
        </div>
      </div>

      <div className={styles.momentum}>
        {phone.sequence.map((result, i) => (
          <span
            key={i}
            className={`${styles.momentumDot} ${DOT_CLASS[result]}`}
          />
        ))}
      </div>

      <div className={styles.betTiles}>
        {phone.bets.map((bet) => (
          <div
            key={bet.label}
            className={`${styles.betTile} ${bet.tone === "good" ? styles.betTileGood : ""}`}
          >
            <div className={styles.betTileLabel}>{bet.label}</div>
            <div
              className={`${styles.betTileStatus} ${bet.tone === "good" ? styles.toneGood : styles.toneBad}`}
            >
              {bet.status}
            </div>
            <div
              className={`${styles.betTileValue} ${bet.tone === "good" ? styles.toneGood : styles.toneBad}`}
            >
              {bet.value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pressCallout}>
        <span className={styles.pressTag}>{phone.pressLabel}</span>
        <span className={styles.pressNote}>{phone.pressNote}</span>
      </div>

      <div className={styles.settleChip}>
        <span>
          <span className={styles.settleChipTitle}>{phone.settleTitle}</span>
          <span className={styles.settleChipSub}>{phone.settleSub}</span>
        </span>
        <span className={styles.settleChipValue}>{phone.settleValue}</span>
      </div>
    </PhoneShell>
  );
}
