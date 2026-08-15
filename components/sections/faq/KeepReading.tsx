/**
 * "Keep reading" — three cards out to the pages people go to next when the
 * FAQ didn't cover it.
 */

import Link from "next/link";
import { faqKeepReading } from "@/lib/content";
import styles from "./KeepReading.module.css";

export function KeepReading() {
  return (
    <section className={styles.section} aria-labelledby="keep-reading-heading">
      <div className={styles.inner}>
        <h2 id="keep-reading-heading" className={styles.label}>
          KEEP READING
        </h2>

        <ul className={styles.grid}>
          {faqKeepReading.map((doc) => (
            <li key={doc.href}>
              <Link href={doc.href} className={styles.card}>
                <span className={styles.name}>{doc.label}</span>
                <span className={styles.blurb}>{doc.blurb}</span>
                <span className={styles.cta}>{doc.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
