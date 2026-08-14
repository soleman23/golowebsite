/**
 * One game card. Shared by the /games grid and the "stack it with" row on a
 * game detail page, so the two can't drift apart.
 *
 * Only games with a detail page become links; the rest carry their whole
 * explanation on the card, so there's nowhere for a link to go.
 */

import Link from "next/link";
import type { Game } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./GameCard.module.css";

export function GameCard({ game }: { game: Game }) {
  const body = (
    <>
      <span className={styles.glow} aria-hidden="true" />

      <div className={styles.cardTop}>
        <span className={styles.iconTile}>
          <Icon name={game.icon} size={26} color="var(--accent)" />
        </span>
        {game.popular ? <span className={styles.badge}>MOST PLAYED</span> : null}
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
    <li id={game.slug} className={styles.cell}>
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
}
