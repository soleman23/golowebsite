/**
 * Testimonials: three quote cards.
 */

import { quotes } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker="THE GROUP CHAT AGREES"
          title="Built for the people who keep score."
          headingId="testimonials-heading"
          maxWidth={720}
          className={styles.header}
        />

        <ul className={styles.grid}>
          {quotes.map((quote) => (
            <li key={quote.name} className={styles.card}>
              <div className={styles.mark} aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className={styles.quote}>{quote.text}</blockquote>
              <div className={styles.person}>
                <span
                  className={styles.avatar}
                  style={{ background: quote.color }}
                  aria-hidden="true"
                >
                  {quote.initial}
                </span>
                <div>
                  <div className={styles.name}>{quote.name}</div>
                  <div className={styles.role}>{quote.role}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
