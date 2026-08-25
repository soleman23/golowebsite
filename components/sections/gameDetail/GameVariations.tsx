/**
 * "Presses & variations" — four cards covering the ways the bet escalates.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import styles from "./GameVariations.module.css";

export function GameVariations({ game }: { game: GameDetail }) {
  return (
    <section className={styles.section} aria-labelledby="variations-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.headings.variations.kicker}
          title={game.headings.variations.title}
          lead={game.headings.variations.lead}
          headingId="variations-heading"
          maxWidth={720}
        />

        <ul className={styles.grid}>
          {game.variations.map((v) => (
            <li key={v.title} className={styles.card}>
              <span className={styles.iconTile}>
                <Icon name={v.icon} size={24} color="var(--accent)" />
              </span>
              <h3 className={styles.title}>{v.title}</h3>
              <p className={styles.body}>{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
