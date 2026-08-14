/**
 * /features block 1: the new-round setup card — course, players and tees,
 * games on the card, start button. Decorative marketing content.
 *
 * Card-shaped rather than a phone frame, matching the reference design.
 */

import { setupGameChips, setupPlayers } from "@/lib/mockData";
import styles from "./mockups.module.css";

const CHIP_CLASS = {
  accent: styles.setupChipAccent,
  plain: styles.setupChipPlain,
  add: styles.setupChipAdd,
} as const;

export function SetupCard() {
  return (
    <div
      className={styles.photoCard}
      role="img"
      aria-label="GoLo new-round setup card for Pinehurst No. 8 — three players with their tees, and Nassau, skins and junk added to the card."
    >
      <div
        className={`${styles.photoCardBg} golo-bd-mock-turf`}
        style={{ backgroundPosition: "50% 40%" }}
        aria-hidden="true"
      />
      <div className={styles.photoCardScrim} aria-hidden="true" />
      <div className={styles.setupInner} aria-hidden="true">
        <div className={styles.rowBetween}>
          <span className={styles.setupKicker}>NEW ROUND</span>
          <span className={styles.setupWhen}>Sat · 8:10 AM</span>
        </div>

        <div className={styles.setupCourse}>
          <span className={styles.setupCourseBadge}>18</span>
          <div className={styles.setupCourseBody}>
            <div className={styles.setupCourseName}>Pinehurst No. 8</div>
            <div className={styles.setupCourseMeta}>
              Par 72 · 6,698 y · CR 72.6 / 137
            </div>
          </div>
        </div>

        <div className={styles.setupGroup}>
          <div className={styles.setupLabel}>PLAYERS &amp; TEES</div>
          {setupPlayers.map((p) => (
            <div key={p.name} className={styles.setupPlayer}>
              <span
                className={styles.setupAvatar}
                style={{ background: p.color }}
              >
                {p.initial}
              </span>
              <span className={styles.setupName}>
                {p.name}
                {p.guest ? (
                  <span className={styles.setupGuest}> · guest</span>
                ) : null}
              </span>
              <span className={styles.setupIndex}>{p.index}</span>
              <span className={styles.setupTee}>{p.tee}</span>
            </div>
          ))}
        </div>

        <div className={styles.setupGroup}>
          <div className={styles.setupLabel}>GAMES ON THE CARD</div>
          <div className={styles.setupChips}>
            {setupGameChips.map((chip) => (
              <span
                key={chip.label}
                className={`${styles.setupChip} ${CHIP_CLASS[chip.tone]}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.setupStart}>Start the round</div>
      </div>
    </div>
  );
}
