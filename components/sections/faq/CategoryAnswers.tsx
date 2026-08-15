/**
 * The answer column: one block per category — number, label, blurb, then that
 * category's questions as a deep-linked accordion.
 *
 * Server component. Each accordion is its own client leaf, which keeps the
 * open state local to a category and means a hash change only wakes the
 * accordion that owns that id.
 */

import Link from "next/link";
import { faqCategories } from "@/lib/content";
import { CalloutCard } from "@/components/ui/CalloutCard";
import { TrackedAccordion } from "@/components/ui/TrackedAccordion";
import styles from "./CategoryAnswers.module.css";

export function CategoryAnswers() {
  return (
    <div className={styles.column}>
      {faqCategories.map((category, i) => (
        <section
          key={category.id}
          id={category.id}
          className={styles.category}
          aria-labelledby={`${category.id}-heading`}
        >
          <div className={styles.head}>
            <span className={styles.num} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 id={`${category.id}-heading`} className={styles.label}>
              {category.label}
            </h2>
          </div>
          <p className={styles.blurb}>{category.blurb}</p>

          <TrackedAccordion
            page="faq"
            idPrefix="faq"
            deepLink
            // Answers here run long, and some carry a callout and a link on
            // top. 720 clears the tallest of them at 320px without clipping.
            maxPanelHeight={720}
            defaultOpen={
              i === 0 && category.items[0] ? [category.items[0].id] : []
            }
            items={category.items.map((item) => ({
              id: item.id,
              question: item.q,
              answer: (
                <>
                  <p>{item.a}</p>
                  {item.note ? (
                    <CalloutCard
                      title={item.noteTag ?? "NOTE"}
                      className={styles.note}
                    >
                      {item.note}
                    </CalloutCard>
                  ) : null}
                  {item.link ? (
                    <Link href={item.link.href} className={styles.link}>
                      {item.link.label}
                    </Link>
                  ) : null}
                </>
              ),
            }))}
          />
        </section>
      ))}
    </div>
  );
}
