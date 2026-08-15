/**
 * The closing "we answer these ourselves" card. The support address is a real
 * mailto pulled from siteConfig, not a second copy of the string.
 */

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./TalkToHuman.module.css";

export function TalkToHuman() {
  return (
    <section className={styles.section} aria-labelledby="talk-heading">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.kicker}>STILL GOT A QUESTION</p>
            <h2 id="talk-heading" className={styles.title}>
              We answer these ourselves.
            </h2>
            <p className={styles.lead}>
              No ticket queue, no bot. Tell us the round, the game, and what
              looked wrong — we usually come back the same day.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/contact" className={`${styles.button} ${styles.primary}`}>
              Talk to a human
            </Link>
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className={`${styles.button} ${styles.ghost}`}
            >
              {siteConfig.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
