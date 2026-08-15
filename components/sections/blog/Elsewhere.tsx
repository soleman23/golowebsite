/**
 * "Elsewhere on GoLo" — three cards out of the blog and into the product.
 */

import Link from "next/link";
import { blogElsewhere } from "@/lib/content";
import styles from "./Elsewhere.module.css";

export function Elsewhere() {
  return (
    <section className={styles.section} aria-labelledby="elsewhere-heading">
      <div className={styles.inner}>
        <h2 id="elsewhere-heading" className={styles.label}>
          ELSEWHERE ON GOLO
        </h2>

        <ul className={styles.grid}>
          {blogElsewhere.map((doc) => (
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
