/**
 * Games grid: eight game cards in an auto-fill grid.
 */

import { homeGames } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { SeeAllLink } from "@/components/ui/SeeAllLink";
import styles from "./GamesGrid.module.css";

export function GamesGrid() {
  return (
    <section id="games" className={styles.section} aria-labelledby="games-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker="EVERY GAME YOU ACTUALLY PLAY"
          title="Stack as many games as your group can argue about."
          lead="Run them all in a single round. GoLo scores each one independently, then nets the whole stack into one number per player."
          headingId="games-heading"
          maxWidth={720}
        />

        <ul className={styles.grid}>
          {homeGames.map((game) => (
            <li key={game.name} className={styles.card}>
              <span className={styles.icon}>
                <Icon name={game.icon} size={24} color="var(--accent)" />
              </span>
              <h3 className={styles.name}>{game.name}</h3>
              <p className={styles.desc}>{game.desc}</p>
            </li>
          ))}
        </ul>

        <SeeAllLink href="/games">Browse all 8 games →</SeeAllLink>
      </div>
    </section>
  );
}
