/**
 * Feature 3 mockup: the settle-up screen (final result, "who pays whom"
 * transfers with a paid state, share + mark-all-paid footer). Decorative.
 */

import { transferRows } from "@/lib/mockData";
import { PhoneShell } from "./PhoneShell";
import styles from "./mockups.module.css";

export function SettlePhone() {
  return (
    <PhoneShell
      bg="/images/course.png"
      bgPosition="50% 62%"
      scrim="linear-gradient(180deg, rgba(6,14,9,.78) 0%, rgba(6,14,9,.6) 26%, rgba(4,12,8,.92) 100%)"
      label="GoLo settle-up screen — Mike collected $85, with the who-pays-whom transfers netted out."
    >
      {/* header */}
      <div className={styles.rowBetween}>
        <span className={styles.settleKicker}>FINAL · NET STROKE</span>
        <span className={styles.settleCoursePill}>
          <span className={styles.settleCourseDot} />
          Pinehurst
        </span>
      </div>
      <div className={styles.settleTitle}>Settle Up</div>

      {/* hero result */}
      <div className={styles.settleResult}>
        <span className={styles.settleResultGlow} />
        <div className={styles.settleResultKicker}>MIKE · 1ST OF 4 · YOU COLLECTED</div>
        <div className={styles.settleResultRow}>
          <span className={styles.settleResultBig}>+$85</span>
          <span className={styles.settleResultSub}>76 gross · 68 net</span>
        </div>
      </div>

      {/* who pays whom */}
      <div className={styles.settleSectionLabel}>WHO PAYS WHOM</div>
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
              {t.paid ? "✓ Paid" : "Mark paid"}
            </span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className={styles.settleFooter}>
        <span className={styles.settleShare}>↗ Share</span>
        <span className={styles.settleMarkAll}>Mark all paid</span>
      </div>
    </PhoneShell>
  );
}
