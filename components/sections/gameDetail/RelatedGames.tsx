/**
 * "Stack it with" — three related games, using the same card as /games so the
 * roster is described identically wherever it appears.
 */

import type { GameDetail } from "@/lib/content";
import { findGame } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GameCard } from "@/components/sections/games/GameCard";
import styles from "./RelatedGames.module.css";

export function RelatedGames({ game }: { game: GameDetail }) {
  const related = game.related
    .map((slug) => findGame(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  if (related.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="related-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.headings.related.kicker}
          title={game.headings.related.title}
          lead={game.headings.related.lead}
          headingId="related-heading"
          maxWidth={720}
        />

        <ul className={styles.grid}>
          {related.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </ul>
      </div>
    </section>
  );
}
