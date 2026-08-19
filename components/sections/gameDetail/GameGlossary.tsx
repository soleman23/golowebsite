/**
 * "Talk the talk" — a real definition list, so the term/definition pairing is
 * carried by the markup and not just the layout.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./GameGlossary.module.css";

export function GameGlossary({ game }: { game: GameDetail }) {
  return (
    <section className={styles.section} aria-labelledby="glossary-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.headings.glossary.kicker}
          title={game.headings.glossary.title}
          headingId="glossary-heading"
          maxWidth={720}
        />

        <dl className={styles.list}>
          {game.glossary.map((entry) => (
            <div key={entry.term} className={styles.entry}>
              <dt className={styles.term}>{entry.term}</dt>
              <dd className={styles.def}>{entry.def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
