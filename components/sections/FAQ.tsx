"use client";

/**
 * FAQ accordion. Accessible disclosure pattern: each question is a <button>
 * with aria-expanded controlling its answer panel. Multiple items can be open;
 * item 0 starts open (per the design). The "+" rotates to "×" when open.
 */

import { useState } from "react";
import { faqs } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./FAQ.module.css";

export function FAQ() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  const toggle = (i: number) => setOpen((s) => ({ ...s, [i]: !s[i] }));

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker="QUESTIONS FROM THE 19TH HOLE"
          title="Good question."
          align="center"
          headingId="faq-heading"
          className={styles.header}
        />

        <div className={styles.list}>
          {faqs.map((faq, i) => {
            const isOpen = Boolean(open[i]);
            return (
              <div key={faq.q} className={styles.item}>
                <h3 className={styles.questionHeading}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className={styles.questionText}>{faq.q}</span>
                    <span
                      className={`${styles.plus} ${isOpen ? styles.plusOpen : ""}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={styles.panel}
                  style={{ maxHeight: isOpen ? 320 : 0 }}
                >
                  <p className={styles.answer}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
