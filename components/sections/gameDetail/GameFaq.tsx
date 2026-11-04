/**
 * "Nassau, answered" — the accordion, reporting opens against this game's page.
 * An answer with a `link` gets it underneath, as on /faq.
 */

import Link from "next/link";
import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedAccordion } from "@/components/ui/TrackedAccordion";
import styles from "./GameFaq.module.css";

export function GameFaq({ game }: { game: GameDetail }) {
  return (
    <section className={styles.section} aria-labelledby="game-faq-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.headings.faq.kicker}
          title={game.headings.faq.title}
          headingId="game-faq-heading"
          className={styles.header}
        />

        <TrackedAccordion
          page={game.slug}
          idPrefix="game-faq"
          items={game.faqs.map((f) => ({
            id: f.id,
            question: f.q,
            answer: f.link ? (
              <>
                <p>{f.a}</p>
                <Link href={f.link.href} className={styles.link}>
                  {f.link.label}
                </Link>
              </>
            ) : (
              f.a
            ),
          }))}
        />
      </div>
    </section>
  );
}
