/**
 * Games grid: eight game cards in an auto-fill grid, each linking to its guide.
 */

import Link from "next/link";
import { homeGames, homeGamesSection } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { SeeAllLink } from "@/components/ui/SeeAllLink";
import styles from "./GamesGrid.module.css";

export function GamesGrid() {
  return (
    <section id="games" className={styles.section} aria-labelledby="games-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={homeGamesSection.kicker}
          title={homeGamesSection.title}
          lead={homeGamesSection.lead}
          headingId="games-heading"
          maxWidth={720}
        />

        <ul className={styles.grid}>
          {homeGames.map((game) => (
            <li key={game.slug}>
              <Link href={`/games/${game.slug}`} className={styles.card}>
                <span className={styles.icon}>
                  <Icon name={game.icon} size={24} color="var(--accent)" />
                </span>
                <h3 className={styles.name}>{game.name}</h3>
                <p className={styles.desc}>{game.desc}</p>
              </Link>
            </li>
          ))}
        </ul>

        <SeeAllLink href="/games">{homeGamesSection.seeAll}</SeeAllLink>
      </div>
    </section>
  );
}
