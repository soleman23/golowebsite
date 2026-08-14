/**
 * "How it works" — numbered glass cards with an oversized lime numeral.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./GameSteps.module.css";

export function GameSteps({ game }: { game: GameDetail }) {
  return (
    <section className={styles.section} aria-labelledby="how-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker="HOW IT WORKS"
          title={game.howTitle}
          lead={game.intro}
          headingId="how-heading"
          maxWidth={720}
        />

        <ol className={styles.grid}>
          {game.steps.map((step) => (
            <li key={step.n} className={styles.card}>
              <span className={styles.num} aria-hidden="true">
                {step.n}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
