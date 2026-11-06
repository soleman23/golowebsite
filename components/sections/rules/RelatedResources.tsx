/**
 * Where the rest of a question lives (docs/rules/canonical-map.md): the
 * glossary for what a term means, the game guides for house rules, and the
 * posts that argue the finer points. Links from lib/content/rules/copy.ts.
 */

import Link from "next/link";
import { rulesRelated as copy } from "@/lib/content";
import { pathType } from "./RulesEntry";
import styles from "./RelatedResources.module.css";

export function RelatedResources() {
  return (
    <section id="related" className={styles.section} aria-labelledby="related-heading">
      <h2 id="related-heading" className={styles.title}>
        {copy.title}
      </h2>
      <ul className={styles.grid}>
        {copy.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={styles.card}
              data-rules-related={item.href === "/glossary" ? "glossary" : pathType(item.href)}
              data-content-id={item.href}
            >
              <span className={styles.name}>{item.label}</span>
              <span className={styles.blurb}>{item.blurb}</span>
              <span className={styles.cta}>
                {item.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
