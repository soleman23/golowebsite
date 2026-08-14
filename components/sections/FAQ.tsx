/**
 * Home FAQ: the short list, with a link out to the full /faq page. The
 * disclosure behavior lives in Accordion — item 0 open, multiple open allowed,
 * "+" rotating to "×" — so this stays a server component.
 */

import { faqs } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { SeeAllLink } from "@/components/ui/SeeAllLink";
import styles from "./FAQ.module.css";

const items: AccordionItem[] = faqs.map((faq, i) => ({
  id: String(i),
  question: faq.q,
  answer: faq.a,
}));

export function FAQ() {
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

        <Accordion items={items} idPrefix="faq" />

        <SeeAllLink href="/faq" align="center">
          Read the full FAQ →
        </SeeAllLink>
      </div>
    </section>
  );
}
