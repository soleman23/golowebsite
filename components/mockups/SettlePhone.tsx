/**
 * Feature 3 mockup: the settle-up screen (final result, "who pays whom"
 * transfers with a paid state, share + mark-all-paid footer). Decorative.
 */

import { settleBreakdown, transferRows } from "@/lib/mockData";
import { PhoneShell } from "./PhoneShell";
import styles from "./mockups.module.css";

/**
 * "features" itemizes the win per game and closes on a single share button;
 * "home" keeps the shorter header and the share / mark-all-paid pair.
 */
type SettlePhoneProps = { variant?: "home" | "features" };

export function SettlePhone({ variant = "home" }: SettlePhoneProps) {
  const isFeatures = variant === "features";

  return (
    <PhoneShell
      bg="course"
      bgPosition="50% 62%"
      scrim="linear-gradient(180deg, rgba(6,14,9,.78) 0%, rgba(6,14,9,.6) 26%, rgba(4,12,8,.92) 100%)"
      label={
        isFeatures
          ? "GoLo settle-up screen — Mike collected $85 across the Nassau, skins and junk, reduced to three transfers with one already marked paid."
          : "GoLo settle-up screen — Mike collected $85, with the who-pays-whom transfers netted out."
      }
    >
      {/* header */}
      <div className={styles.rowBetween}>
        <span className={styles.settleKicker}>
          {isFeatures ? "FINAL · SETTLE UP" : "FINAL · NET STROKE"}
        </span>
        <span className={styles.settleCoursePill}>
          <span className={styles.settleCourseDot} />
          Pinehurst
        </span>
      </div>
      {isFeatures ? null : <div className={styles.settleTitle}>Settle Up</div>}

      {/* hero result */}
      <div className={styles.settleResult}>
        <span className={styles.settleResultGlow} />
        <div className={styles.settleResultKicker}>MIKE · 1ST OF 4 · YOU COLLECTED</div>
        <div className={styles.settleResultRow}>
          <span className={styles.settleResultBig}>+$85</span>
          <span className={styles.settleResultSub}>76 gross · 68 net</span>
        </div>
        {isFeatures ? (
          <div className={styles.settleBreakdown}>
            {settleBreakdown.map((b) => (
              <span key={b.label} className={styles.settleBreakdownChip}>
                {b.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* who pays whom */}
      <div className={styles.settleSectionLabel}>
        {isFeatures ? "WHO PAYS WHOM · 3 TRANSFERS" : "WHO PAYS WHOM"}
      </div>
      <div className={styles.transferRows}>
        {transferRows.map((t, i) => (
          <div
            key={i}
            className={styles.transferRow}
            style={{
              opacity: t.paid ? 0.6 : 1,
              borderColor: t.paid
                ? "rgba(190,242,100,.4)"
                : i === 0
                  ? "var(--accent-45)"
                  : "var(--card-border)",
            }}
          >
            <span className={styles.transferAvatar} style={{ background: t.fromColor }}>
              {t.fromInitial}
            </span>
            <span className={styles.transferArrow}>→</span>
            <span className={styles.transferAvatar} style={{ background: t.toColor }}>
              {t.toInitial}
            </span>
            <span className={styles.transferAmount}>{t.amount}</span>
            <span
              className={styles.transferBtn}
              style={
                t.paid
                  ? {
                      background: "rgba(190,242,100,.18)",
                      borderColor: "rgba(190,242,100,.5)",
                      color: "#bef264",
                    }
                  : undefined
              }
            >
              {t.paid ? (isFeatures ? "Paid ✓" : "✓ Paid") : "Mark paid"}
            </span>
          </div>
        ))}
      </div>

      {/* footer */}
      {isFeatures ? (
        <div className={styles.settleFooter}>
          <span className={styles.settleMarkAll}>Share the card</span>
        </div>
      ) : (
        <div className={styles.settleFooter}>
          <span className={styles.settleShare}>↗ Share</span>
          <span className={styles.settleMarkAll}>Mark all paid</span>
        </div>
      )}
    </PhoneShell>
  );
}
