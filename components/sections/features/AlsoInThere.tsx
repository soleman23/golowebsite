/**
 * "Also in there" — the two supporting capabilities that don't warrant a full
 * feature row, each carrying an honest status pill.
 */

import { alsoInThere } from "@/lib/content";
import { StatusPill } from "@/components/ui/StatusPill";
import styles from "./AlsoInThere.module.css";

export function AlsoInThere() {
  return (
    <section className={styles.section} aria-labelledby="also-heading">
      <div className={styles.inner}>
        <h2 id="also-heading" className={styles.label}>
          ALSO IN THERE
        </h2>
        <div className={styles.grid}>
          {alsoInThere.map((card) => (
            <div key={card.title} className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <StatusPill
                  variant={card.status.variant}
                  label={card.status.label}
                />
              </div>
              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
