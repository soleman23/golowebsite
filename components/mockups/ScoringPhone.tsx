/**
 * Feature 1 mockup: the scoring screen (hole 7, tap-in stepper for Mike, other
 * players' rows, progress bar). Decorative marketing content.
 */

import { featureScoreRows, heroDots, scoreRows } from "@/lib/mockData";
import { PhoneShell } from "./PhoneShell";
import styles from "./mockups.module.css";

const dotColor: Record<string, string> = {
  played: "var(--accent)",
  current: "rgba(255,255,255,.85)",
  remaining: "rgba(255,255,255,.22)",
};

/**
 * "home" closes on the hole-progress bar; "features" closes on the junk
 * buttons instead, which is the moment /features is describing.
 */
type ScoringPhoneProps = { variant?: "home" | "features" };

export function ScoringPhone({ variant = "home" }: ScoringPhoneProps) {
  const isFeatures = variant === "features";
  const rows = isFeatures ? featureScoreRows : scoreRows;

  return (
    <PhoneShell
      bg="turf"
      bgPosition="50% 60%"
      label={
        isFeatures
          ? "GoLo scoring screen for hole 7 — Mike's score being tapped in, the rest of the foursome's net and gross below, and buttons to log a greenie or a sandie."
          : "GoLo scoring screen for hole 7 — tapping in Mike's score with net and gross for the group."
      }
    >
      {/* hole nav */}
      <div className={styles.rowBetween}>
        <span className={styles.navCircle}>‹</span>
        <div className={styles.holeCenter}>
          <div className={styles.holeKicker}>HOLE 7</div>
          <div className={styles.holeMeta}>Par 3 · 168y · SI 15</div>
        </div>
        <span className={`${styles.navCircle} ${styles.navCircleActive}`}>›</span>
      </div>

      {/* big hole numeral */}
      <div className={styles.holeNumeralWrap}>
        <span className={styles.holeNumeral}>7</span>
      </div>

      {/* you scoring card */}
      <div className={styles.scoreCard}>
        <div className={styles.scoreCardHead}>
          <span className={styles.scoreCardPlayer}>
            <span className={styles.scoreCardAvatar} style={{ background: "#2dd4bf" }}>
              M
            </span>
            <span>
              <span className={styles.scoreCardName}>Mike</span>
              <span className={styles.scoreCardStroke}>+1 stroke · net 2</span>
            </span>
          </span>
        </div>
        <div className={styles.stepper}>
          <span className={styles.stepperBtn}>−</span>
          <span className={styles.stepperValue}>3</span>
          <span className={`${styles.stepperBtn} ${styles.stepperBtnPlus}`}>+</span>
        </div>
      </div>

      {/* other players */}
      <div className={styles.scoreRows}>
        {rows.map((r) => (
          <div key={r.name} className={styles.scoreRow}>
            <span className={styles.scoreRowAvatar} style={{ background: r.color }}>
              {r.initial}
            </span>
            <span className={styles.scoreRowName}>{r.name}</span>
            <span className={styles.scoreRowNet}>net {r.net}</span>
            <span className={styles.scoreRowGross}>{r.gross}</span>
          </div>
        ))}
      </div>

      {isFeatures ? (
        /* junk logged on the hole */
        <div className={styles.junkRow}>
          <span className={`${styles.junkBtn} ${styles.junkBtnAccent}`}>
            + Greenie
          </span>
          <span className={styles.junkBtn}>+ Sandie</span>
        </div>
      ) : (
        /* progress bar */
        <div className={`${styles.progress} ${styles.progressBottom}`}>
          {heroDots.map((state, i) => (
            <span
              key={i}
              className={styles.progressSeg}
              style={{ background: dotColor[state] }}
            />
          ))}
        </div>
      )}
    </PhoneShell>
  );
}
