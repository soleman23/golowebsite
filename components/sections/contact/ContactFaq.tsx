/**
 * "Six things we answer every week" — the questions that arrive by email, put
 * in front of the reader before they write a seventh one.
 *
 * No FAQPage JSON-LD here on purpose: /faq carries the site's FAQ schema and
 * two competing FAQPage blocks would just split the signal.
 */

import Link from "next/link";
import { contactFaqs } from "@/lib/content";
import { TrackedAccordion } from "@/components/ui/TrackedAccordion";
import styles from "./ContactFaq.module.css";

export function ContactFaq() {
  return (
    <section className={styles.section} aria-labelledby="contact-faq-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.headCopy}>
            <p className={styles.kicker}>BEFORE YOU WRITE</p>
            <h2 id="contact-faq-heading" className={styles.title}>
              Six things we answer every week
            </h2>
          </div>
          <Link href="/faq" className={styles.fullFaq}>
            Full FAQ
          </Link>
        </div>

        <TrackedAccordion
          page="contact"
          idPrefix="contact-faq"
          maxPanelHeight={280}
          defaultOpen={[]}
          items={contactFaqs.map((item) => ({
            id: item.id,
            question: item.q,
            answer: item.a,
          }))}
        />
      </div>
    </section>
  );
}
