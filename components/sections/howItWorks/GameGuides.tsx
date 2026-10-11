/** Eight link cards, one per game guide, plus "All games →". */

import Link from "next/link";
import { gameGuideOrder, gameGuidesSection, rosterGame } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./GameGuides.module.css";

export function GameGuides() {
  return (
    <section className={styles.section} aria-labelledby="guides-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeader
            kicker={gameGuidesSection.kicker}
            title={gameGuidesSection.title}
            headingId="guides-heading"
          />
          <Link href="/games" className={styles.all}>
            {gameGuidesSection.allLabel}
          </Link>
        </div>
        <ul className={styles.grid}>
          {gameGuideOrder.map((slug) => rosterGame(slug)).map((game) => (
            <li key={game.slug}>
              <Link href={`/games/${game.slug}`} className={styles.card}>
                <span className={styles.name}>{game.name}</span>
                <span className={styles.line}>{game.rule}</span>
                <span className={styles.cta} aria-hidden="true">
                  {gameGuidesSection.cardCta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
