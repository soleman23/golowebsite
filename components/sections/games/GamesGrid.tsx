/**
 * The filterable game roster. A server component: every card is in the HTML
 * whether or not JavaScript runs, which is the point of this page.
 */

import { games, gameFilters, type GameTag } from "@/lib/content";
import { GameCard } from "./GameCard";
import { GameFilterChips } from "./GameFilterChips";
import styles from "./GamesGrid.module.css";

export const GAME_FILTER_IDS = new Set<string>(gameFilters.map((f) => f.id));

export function GamesGrid({ active }: { active: string }) {
  const shown =
    active === "all"
      ? games
      : games.filter((game) => game.tags.includes(active as GameTag));

  const chips = gameFilters.map((f) => ({
    id: f.id,
    label: f.label,
    count:
      f.id === "all"
        ? games.length
        : games.filter((g) => g.tags.includes(f.id as GameTag)).length,
  }));

  const resultLabel =
    active === "all"
      ? `All ${shown.length} games`
      : `${shown.length} ${shown.length === 1 ? "game" : "games"}`;

  return (
    <section className={styles.section} aria-labelledby="games-grid-heading">
      <div className={styles.inner}>
        <h2 id="games-grid-heading" className="sr-only">
          Every game GoLo scores
        </h2>

        <div className={styles.controls}>
          <GameFilterChips items={chips} value={active} />
          <span className={styles.result} aria-live="polite">
            {resultLabel}
          </span>
        </div>

        {shown.length === 0 ? (
          <p className={styles.empty}>No games match that filter.</p>
        ) : (
          <ul className={styles.grid}>
            {shown.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
