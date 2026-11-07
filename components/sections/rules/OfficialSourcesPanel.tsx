/**
 * The official documents behind every answer (docs/rules/ux.md § 8): the
 * R&A's Rules, Definitions, clarifications and Model Local Rules, the USGA's
 * hub and clarifications, and the Rules of Handicapping, labelled as the
 * separate rulebook it is. Then the Local Rules caveat, the independent-site
 * disclaimer and the route for reporting a mistake (#245).
 */

import Link from "next/link";
import { rulesOfficialSources as copy, rulesOnSite } from "@/lib/content";
import styles from "./OfficialSourcesPanel.module.css";

export function OfficialSourcesPanel() {
  return (
    <section
      id="official-sources"
      className={styles.section}
      aria-labelledby="official-sources-heading"
    >
      <h2 id="official-sources-heading" className={styles.title}>
        {copy.title}
      </h2>
      <p className={styles.intro}>{copy.intro}</p>

      <ul className={styles.list}>
        {copy.items.map((item) => (
          <li key={item.href} className={styles.item}>
            <a href={item.href} className={styles.link} data-rules-official={item.document}>
              {rulesOnSite(item.label, item.site)}
            </a>
            <span className={styles.note}>{item.note}</span>
          </li>
        ))}
      </ul>

      <p className={styles.caveat}>{copy.localRules}</p>
      <p className={styles.caveat}>{copy.independent}</p>
      <p className={styles.report}>
        {copy.report.lead}{" "}
        <Link href={copy.report.href} className={styles.link}>
          {copy.report.label}
        </Link>
      </p>
    </section>
  );
}
