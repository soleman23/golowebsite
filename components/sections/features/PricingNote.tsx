/**
 * What it costs. Only rendered while siteConfig.appLive is false — "free while
 * we're in beta" stops being true the moment the app ships.
 */

import { pricing } from "@/lib/content";
import styles from "./PricingNote.module.css";

export function PricingNote() {
  return (
    <section className={styles.section} aria-labelledby="pricing-heading">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <h2 id="pricing-heading" className={styles.kicker}>
              {pricing.kicker}
            </h2>
            <div className={styles.valueRow}>
              <span className={styles.value}>{pricing.value}</span>
              <span className={styles.qualifier}>{pricing.qualifier}</span>
            </div>
            <p className={styles.body}>{pricing.body}</p>
          </div>

          <ul className={styles.items}>
            {pricing.items.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <span className={styles.itemText}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
