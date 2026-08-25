/**
 * "Play smart" — three tips. The cautionary one carries the rose warning mark
 * rather than a lime check, so the advice not to press reads as a warning at
 * a glance.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckIcon, WarnIcon } from "@/components/ui/Icon";
import styles from "./GameTips.module.css";

export function GameTips({ game }: { game: GameDetail }) {
  return (
    <section className={styles.section} aria-labelledby="tips-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.headings.tips.kicker}
          title={game.headings.tips.title}
          lead={game.headings.tips.lead}
          headingId="tips-heading"
          maxWidth={720}
        />

        <ul className={styles.grid}>
          {game.tips.map((tip) => (
            <li
              key={tip.title}
              className={`${styles.card} ${tip.tone === "bad" ? styles.cardWarn : ""}`}
            >
              <span className={styles.mark}>
                {tip.tone === "bad" ? <WarnIcon /> : <CheckIcon size={22} />}
              </span>
              <h3 className={styles.title}>{tip.title}</h3>
              <p className={styles.body}>{tip.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
