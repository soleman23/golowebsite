/**
 * Final CTA: radial green background + lime glow, centered heading, store
 * buttons and fine print.
 */

import { StoreButtons } from "@/components/ui/StoreButtons";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  return (
    <section id="get" className={styles.section} aria-labelledby="cta-heading">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <h2 id="cta-heading" className={styles.title}>
          Stop doing math in the parking lot.
        </h2>
        <p className={styles.lead}>
          Download GoLo, set up your games before the first tee, and let the app
          keep the books. Your buddies&rsquo; excuses end here.
        </p>
        <StoreButtons size="lg" align="center" />
        <p className={styles.fine}>
          Free to download · No card to start · iPhone &amp; Android
        </p>
      </div>
    </section>
  );
}
