/**
 * The five quick answers, with a link out to the full FAQ. The accordion is a
 * client leaf because it owns the open state and fires faq_open; the section
 * around it stays a server component.
 */

import Link from "next/link";
import { quickAnswers } from "@/lib/content";
import { TrackedAccordion } from "@/components/ui/TrackedAccordion";
import styles from "./QuickAnswers.module.css";

export function QuickAnswers() {
  return (
    <section className={styles.section} aria-labelledby="quick-answers-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="quick-answers-heading" className={styles.label}>
            QUICK ANSWERS
          </h2>
          <Link href="/faq" className={styles.fullFaq}>
            FULL FAQ →
          </Link>
        </div>

        <TrackedAccordion
          page="features"
          idPrefix="quick"
          maxPanelHeight={360}
          items={quickAnswers.map((a) => ({
            id: a.id,
            question: a.question,
            answer: a.answer,
          }))}
        />
      </div>
    </section>
  );
}
