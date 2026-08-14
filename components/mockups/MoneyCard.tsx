/**
 * The "money on the line" standings card — a flexible-width glass card over a
 * course photo. Decorative marketing content.
 *
 * Two moments of the same screen: "games" (home) lists what each side game is
 * worth; "players" (/features) lists what each player is up or down, which is
 * the leaderboard the features page is describing.
 */

import { Icon } from "@/components/ui/Icon";
import { moneyRows, standingRows } from "@/lib/mockData";
import styles from "./mockups.module.css";

type MoneyCardProps = { variant?: "games" | "players" };

const LABEL = {
  games:
    "GoLo money-on-the-line card showing Skins, Nassau, Stroke Purse and Closest to Pin standings.",
  players:
    "GoLo live leaderboard through 12 holes: Mike up $42, Sarah up $11, Tom down $18, Dave down $35, with $32 carried in the skins pot.",
};

export function MoneyCard({ variant = "games" }: MoneyCardProps) {
  return (
    <div
      className={styles.moneyCard}
      role="img"
      aria-label={LABEL[variant]}
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

        {variant === "games" ? (
          moneyRows.map((m) => (
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
          ))
        ) : (
          <>
            <div className={styles.viewToggle}>
              <span className={`${styles.viewChip} ${styles.viewChipActive}`}>
                MONEY
              </span>
              <span className={styles.viewChip}>NET</span>
              <span className={styles.viewChip}>GROSS</span>
            </div>

            <div className={styles.standings}>
              {standingRows.map((row) => (
                <div
                  key={row.name}
                  className={`${styles.standingRow} ${row.leader ? styles.standingRowLeader : ""}`}
                >
                  <span
                    className={styles.standingAvatar}
                    style={{ background: row.color }}
                  >
                    {row.initial}
                  </span>
                  <div className={styles.standingBody}>
                    <div className={styles.standingName}>{row.name}</div>
                    <div className={styles.standingReason}>{row.reason}</div>
                  </div>
                  <div className={styles.standingRight}>
                    <div
                      className={`${styles.standingValue} ${row.up ? styles.standingUp : styles.standingDown}`}
                    >
                      {row.value}
                    </div>
                    <div className={styles.standingMove}>{row.move}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.potFooter}>
              <span className={styles.potLabel}>SKINS POT · 4 CARRIED</span>
              <span className={styles.potValue}>$32</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
