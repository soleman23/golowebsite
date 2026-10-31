/**
 * "Keep reading" — three cards out to the pages people go to next when the
 * FAQ didn't cover it. The glossary hub passes its own cards and heading.
 */

import Link from "next/link";
import { faqKeepReading, type FaqReadNext } from "@/lib/content";
import styles from "./KeepReading.module.css";

type KeepReadingProps = {
  items?: readonly FaqReadNext[];
  heading?: string;
  /** For aria-labelledby; unique per page. */
  headingId?: string;
};

export function KeepReading({
  items = faqKeepReading,
  heading = "KEEP READING",
  headingId = "keep-reading-heading",
}: KeepReadingProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <h2 id={headingId} className={styles.label}>
          {heading}
        </h2>

        <ul className={styles.grid}>
          {items.map((doc) => (
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
