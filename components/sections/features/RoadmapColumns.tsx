/**
 * The honest three-column roadmap: what ships today, what's in testing, and
 * what isn't built. Shipped items get a lime check; the other two columns get
 * a plain dot and dimmer text, so nothing unbuilt reads as finished.
 */

import { roadmap } from "@/lib/content";
import { StatusPill } from "@/components/ui/StatusPill";
import styles from "./RoadmapColumns.module.css";

export function RoadmapColumns() {
  return (
    <section className={styles.section} aria-labelledby="roadmap-heading">
      <div className={styles.inner}>
        <p className={styles.kicker}>WHERE THE APP ACTUALLY IS</p>
        <h2 id="roadmap-heading" className={styles.title}>
          We&rsquo;re in beta, so here&rsquo;s the honest list.
        </h2>
        <p className={styles.lead}>
          Nothing on this page is a mockup of something we hope to build
          someday, but not everything is finished either. Three columns, no
          marketing.
        </p>

        <div className={styles.columns}>
          {roadmap.map((column) => (
            <div
              key={column.heading}
              className={`${styles.column} ${column.status === "today" ? styles.columnToday : ""}`}
            >
              <StatusPill variant={column.status} label={column.heading} />
              <ul className={styles.items}>
                {column.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {column.status === "today" ? (
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                    ) : (
                      <span
                        className={`${styles.dot} ${column.status === "planned" ? styles.dotFaint : ""}`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`${styles.text} ${column.status === "planned" ? styles.textFaint : ""}`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
