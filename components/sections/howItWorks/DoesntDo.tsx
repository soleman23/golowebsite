/** "A scorekeeper. Not a bookie." — four things GoLo deliberately doesn't do. */

import { doesntDo } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./DoesntDo.module.css";

export function DoesntDo() {
  return (
    <section className={styles.section} aria-labelledby="doesnt-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={doesntDo.kicker}
          title={doesntDo.title}
          headingId="doesnt-heading"
          className={styles.header}
        />
        <ul className={styles.grid}>
          {doesntDo.items.map((item) => (
            <li key={item.title} className={styles.card}>
              <span className={styles.mark} aria-hidden="true">
                ✕
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
