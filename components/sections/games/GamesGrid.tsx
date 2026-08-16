/**
 * The filterable game roster. A server component that renders every card,
 * every time — the filter is applied by CSS keyed off <html data-filter>, so
 * the HTML a crawler sees is always the complete roster.
 */

import { games, gameFilters, type GameTag } from "@/lib/content";
import { GameCard } from "./GameCard";
import { GameFilterChips } from "./GameFilterChips";
import styles from "./GamesGrid.module.css";

function countFor(id: string): number {
  return id === "all"
    ? games.length
    : games.filter((game) => game.tags.includes(id as GameTag)).length;
}

export function GamesGrid() {
  const chips = gameFilters.map((f) => ({
    id: f.id,
    label: f.label,
    count: countFor(f.id),
  }));

  return (
    <section className={styles.section} aria-labelledby="games-grid-heading">
      <div className={styles.inner}>
        <h2 id="games-grid-heading" className="sr-only">
          Every game GoLo scores
        </h2>

        <div className={styles.controls}>
          <GameFilterChips items={chips} />
        </div>

        <ul className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </ul>
      </div>
    </section>
  );
}
