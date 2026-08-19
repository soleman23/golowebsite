/**
 * Previous / next navigation through the typed game roster.
 */

import Link from "next/link";
import type { GameDetail } from "@/lib/content";
import { findGame } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./PrevNextGames.module.css";

export function PrevNextGames({ game }: { game: GameDetail }) {
  const prev = game.prev ? findGame(game.prev) : undefined;
  const next = game.next ? findGame(game.next) : undefined;

  if (!prev && !next) return null;

  return (
    <nav className={styles.section} aria-label="More games">
      <div className={styles.inner}>
        {prev ? (
          <Link href={`/games/${prev.slug}`} className={styles.link}>
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
          <Link href={`/games/${next.slug}`} className={`${styles.link} ${styles.next}`}>
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
