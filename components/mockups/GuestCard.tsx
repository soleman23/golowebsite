/**
 * /how-it-works guests section: the round's player list with Tom tagged as a
 * guest, and the "Add a guest" sheet. A picture of the form, not a form —
 * nothing here is focusable. Decorative marketing content.
 */

import { guestCardPlayers, hiwPlayerColor } from "@/lib/content";
import styles from "./mockups.module.css";

export function GuestCard() {
  return (
    <div
      className={styles.photoCard}
      role="img"
      aria-label="GoLo player list for the round — Mike, Jess and Sarah, plus Tom added as a guest with a 22 index — and an Add a guest form that takes just a name and an index."
    >
      <div
        className={`${styles.photoCardBg} golo-bd-mock-turf`}
        style={{ backgroundPosition: "50% 40%" }}
        aria-hidden="true"
      />
      <div className={styles.photoCardScrim} aria-hidden="true" />
      <div className={styles.guestInner} aria-hidden="true">
        <div className={`${styles.rowBetween} ${styles.guestHead}`}>
          <span className={styles.guestKicker}>PLAYERS</span>
          <span className={styles.guestCount}>4 of 6</span>
        </div>

        {guestCardPlayers.map((p) => (
          <div
            key={p.name}
            className={`${styles.guestRow} ${p.guest ? styles.guestRowGuest : ""}`}
          >
            <span
              className={styles.guestAvatar}
              style={{ background: `var(--avatar-${hiwPlayerColor[p.name]})` }}
            >
              {p.name[0]}
            </span>
            <span className={styles.guestName}>
              {p.name}
              {p.you ? <span className={styles.guestYou}> · you</span> : null}
            </span>
            {p.guest ? <span className={styles.guestTag}>GUEST</span> : null}
            <span className={styles.guestIndex}>{p.index}</span>
          </div>
        ))}

        <div className={styles.guestSheet}>
          <div className={styles.guestSheetLabel}>ADD A GUEST</div>
          <div className={styles.guestFields}>
            <span className={`${styles.guestField} ${styles.guestFieldName}`}>
              Name
            </span>
            <span className={`${styles.guestField} ${styles.guestFieldIndex}`}>
              Index
            </span>
          </div>
          <div className={styles.guestAdd}>Add to round</div>
        </div>
      </div>
    </div>
  );
}
