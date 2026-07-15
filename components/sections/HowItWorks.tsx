/**
 * How it works: full-bleed sunset backdrop + heavy scrim, three numbered step
 * cards.
 */

import { steps } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  return (
    <section id="how" className={styles.section} aria-labelledby="how-heading">
      <div
        className={styles.bg}
        style={{ backgroundImage: "url('/images/sunset.png')" }}
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <SectionHeader
          kicker="DEAD SIMPLE"
          title="From first tee to settled up in three steps."
          headingId="how-heading"
          maxWidth={720}
          className={styles.header}
        />

        <ol className={styles.grid}>
          {steps.map((step) => (
            <li key={step.n} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.num}>{step.n}</span>
                <span className={styles.icon}>
                  <Icon name={step.icon} size={20} color="var(--accent)" />
                </span>
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
