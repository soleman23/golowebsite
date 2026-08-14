/**
 * Hero device mockup: a live-leaderboard screen. Decorative marketing content
 * traced from the design handoff; data comes from lib/mockData.
 */

import { Icon } from "@/components/ui/Icon";
import { heroDots, heroRows } from "@/lib/mockData";
import { PhoneShell } from "./PhoneShell";
import styles from "./mockups.module.css";

const dotColor: Record<string, string> = {
  played: "var(--accent)",
  current: "rgba(255,255,255,.85)",
  remaining: "rgba(255,255,255,.22)",
};

export function HeroPhone() {
  return (
    <PhoneShell
      bg="course"
      bgPosition="50% 58%"
      width={300}
      height={610}
      radius={42}
      scrim="linear-gradient(180deg, rgba(6,14,9,.66) 0%, rgba(6,14,9,.5) 26%, rgba(4,12,8,.92) 100%)"
      label="GoLo live leaderboard for a round at Pinehurst No.2 — Tom leading net at 4 under par."
      float
    >
      {/* live pill row */}
      <div className={styles.rowBetween}>
        <div className={styles.livePill}>
          <span className={styles.pulseDot}>
            <span className={styles.pulseCore} />
            <span className={styles.pulseRing} />
          </span>
          <span className={styles.liveLabel}>LIVE</span>
          <span className={styles.liveCourse}>Pinehurst No.2</span>
        </div>
        <span className={styles.gamesLabel}>Skins · Nassau</span>
      </div>

      {/* through */}
      <div className={styles.throughRow}>
        <div>
          <div className={styles.throughKicker}>THROUGH</div>
          <div className={styles.throughNums}>
            <span className={styles.throughBig}>12</span>
            <span className={styles.throughOf}>/ 18</span>
          </div>
        </div>
        <div className={styles.throughRight}>
          <div className={styles.throughToPlay}>6 to play</div>
          <div className={styles.throughHole}>on hole 13</div>
        </div>
      </div>

      {/* progress bar */}
      <div className={styles.progress}>
        {heroDots.map((state, i) => (
          <span
            key={i}
            className={styles.progressSeg}
            style={{ background: dotColor[state] }}
          />
        ))}
      </div>

      {/* segmented control */}
      <div className={styles.segmented}>
        <span className={`${styles.seg} ${styles.segActive}`}>Net</span>
        <span className={styles.seg}>Gross</span>
        <span className={styles.seg}>Money</span>
      </div>

      {/* spotlight */}
      <div className={styles.spotlight}>
        <span className={styles.spotlightGlow} />
        <div className={styles.spotlightHead}>
          <span className={styles.spotlightKicker}>▲ LEADING · NET</span>
          <span className={styles.spotlightBy}>leads by 3</span>
        </div>
        <div className={styles.spotlightBody}>
          <span
            className={styles.spotlightAvatar}
            style={{ background: "#fb923c", boxShadow: "0 0 0 2px var(--accent)" }}
          >
            T
          </span>
          <div className={styles.spotlightName}>
            <div className={styles.spotlightNameMain}>Tom</div>
            <div className={styles.spotlightNameSub}>Gross 71 · Hdcp 5</div>
          </div>
          <div className={styles.spotlightScore}>
            <div className={styles.spotlightScoreBig}>−4</div>
            <div className={styles.spotlightScoreSub}>TO PAR</div>
          </div>
        </div>
      </div>

      {/* leaderboard rows */}
      <div className={styles.leaderRows}>
        {heroRows.map((r) => (
          <div
            key={r.name}
            className={styles.leaderRow}
            style={{
              borderColor: r.highlighted ? "var(--accent-50)" : "var(--card-border)",
            }}
          >
            <span className={styles.leaderPos}>{r.pos}</span>
            <span className={styles.leaderAvatar} style={{ background: r.color }}>
              {r.initial}
            </span>
            <div className={styles.leaderName}>
              <div className={styles.leaderNameInner}>
                {r.name}
                {r.isYou ? <span className={styles.youBadge}>YOU</span> : null}
              </div>
            </div>
            <span
              className={styles.leaderScore}
              style={{ color: r.scoreAccent ? "var(--accent)" : r.scoreColor }}
            >
              {r.score}
            </span>
          </div>
        ))}
      </div>

      {/* money chip */}
      <div className={styles.moneyChip}>
        <span className={styles.moneyChipLeft}>
          <span className={styles.moneyChipIcon}>
            <Icon name="target" size={20} color="var(--accent)" />
          </span>
          <span>
            <span className={styles.moneyChipTitle}>Skins pot</span>
            <span className={styles.moneyChipSub}>2-hole carry live</span>
          </span>
        </span>
        <span className={styles.moneyChipVal}>$120</span>
      </div>
    </PhoneShell>
  );
}
