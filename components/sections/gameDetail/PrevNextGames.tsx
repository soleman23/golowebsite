/**
 * Prev / next through the roster. A neighbour with its own detail page gets a
 * link to it; the rest point at their card on /games, so neither side ever
 * dead-ends while only Nassau is written.
 */

import Link from "next/link";
import type { GameDetail } from "@/lib/content";
import { findGame } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./PrevNextGames.module.css";

function hrefFor(slug: string) {
  const game = findGame(slug);
  if (!game) return "/games";
  return game.hasDetailPage ? `/games/${game.slug}` : `/games#${game.slug}`;
}

export function PrevNextGames({ game }: { game: GameDetail }) {
  const prev = game.prev ? findGame(game.prev) : undefined;
  const next = game.next ? findGame(game.next) : undefined;

  if (!prev && !next) return null;

  return (
    <nav className={styles.section} aria-label="More games">
      <div className={styles.inner}>
        {prev ? (
          <Link href={hrefFor(prev.slug)} className={styles.link}>
            <span className={styles.label}>
              <Icon name="arrowRight" size={13} className={styles.back} />
              PREVIOUS GAME
            </span>
            <span className={styles.name}>{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link href={hrefFor(next.slug)} className={`${styles.link} ${styles.next}`}>
            <span className={styles.label}>
              NEXT GAME
              <Icon name="arrowRight" size={13} />
            </span>
            <span className={styles.name}>{next.name}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
