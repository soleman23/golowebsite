/**
 * Stats band: four big-numeral stats in an auto-fit grid, bordered top+bottom.
 */

import { stats } from "@/lib/content";
import styles from "./StatsBand.module.css";

export function StatsBand() {
  return (
    <section className={styles.band} aria-label="GoLo by the numbers">
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div
              className={`${styles.value} ${stat.accentValue ? styles.accent : ""}`}
            >
              {stat.value}
            </div>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.sub}>{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
