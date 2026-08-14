/**
 * The filterable game roster. A server component: every card is in the HTML
 * whether or not JavaScript runs, which is the point of this page.
 *
 * Only Nassau has a detail page today, so only its card is a link. The rest
 * carry their whole explanation on the card — a "How to play" that went
 * nowhere would be worse than none.
 */

import Link from "next/link";
import { games, gameFilters, type GameTag } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
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
            {shown.map((game) => {
              const body = (
                <>
                  <span className={styles.glow} aria-hidden="true" />

                  <div className={styles.cardTop}>
                    <span className={styles.iconTile}>
                      <Icon name={game.icon} size={26} color="var(--accent)" />
                    </span>
                    {game.popular ? (
                      <span className={styles.badge}>MOST PLAYED</span>
                    ) : null}
                  </div>

                  <h3 className={styles.name}>{game.name}</h3>
                  <p className={styles.desc}>{game.desc}</p>

                  <div className={styles.how}>
                    <span className={styles.howLabel}>HOW</span>
                    <span className={styles.howText}>{game.how}</span>
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.metaPill}>{game.players}</span>
                    <span className={styles.metaPill}>{game.format}</span>
                    {game.hasDetailPage ? (
                      <span className={styles.play}>
                        How to play
                        <Icon name="arrowRight" size={14} />
                      </span>
                    ) : null}
                  </div>
                </>
              );

              return (
                <li key={game.slug} id={game.slug} className={styles.cell}>
                  {game.hasDetailPage ? (
                    <Link
                      href={`/games/${game.slug}`}
                      className={`${styles.card} ${styles.cardLink} ${game.popular ? styles.cardPopular : ""}`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <article
                      className={`${styles.card} ${game.popular ? styles.cardPopular : ""}`}
                    >
                      {body}
                    </article>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
