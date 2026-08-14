/**
 * Quotes from the groups actually testing the app. Gated on the same
 * showTestimonials flag as the home page, so the two can't disagree about
 * whether named quotes are cleared to show.
 */

import { betaQuotes } from "@/lib/content";
import styles from "./BetaQuotes.module.css";

export function BetaQuotes() {
  return (
    <section className={styles.section} aria-labelledby="beta-quotes-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="beta-quotes-heading" className={styles.label}>
            FROM THE GROUPS TESTING IT
          </h2>
          <span className={styles.sub}>
            40+ rounds, real money, no free hats
          </span>
        </div>

        <ul className={styles.grid}>
          {betaQuotes.map((quote) => (
            <li key={quote.name} className={styles.card}>
              <p className={styles.quote}>{quote.text}</p>
              <div className={styles.person}>
                <span
                  className={styles.avatar}
                  style={{ background: quote.color }}
                  aria-hidden="true"
                >
                  {quote.initial}
                </span>
                <span className={styles.personBody}>
                  <span className={styles.name}>{quote.name}</span>
                  <span className={styles.meta}>{quote.meta}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
