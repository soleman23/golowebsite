/**
 * "Nassau, answered" — the accordion, reporting opens against this game's page.
 */

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
          maxPanelHeight={320}
          items={game.faqs.map((f) => ({
            id: f.id,
            question: f.q,
            answer: f.a,
          }))}
        />
      </div>
    </section>
  );
}
