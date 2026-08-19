import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./GameScoring.module.css";

export function GameScoring({ game }: { game: GameDetail }) {
  if (!game.scoring) return null;

  return (
    <section className={styles.section} aria-labelledby="scoring-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={game.scoring.kicker}
          title={game.scoring.title}
          lead={game.scoring.lead}
          headingId="scoring-heading"
          maxWidth={720}
        />

        <div className={styles.table} role="table" aria-label={`${game.name} scoring rules`}>
          {game.scoring.rows.map((row) => (
            <div className={styles.row} role="row" key={`${row.tag ?? "rule"}-${row.title}`}>
              {row.tag ? <span className={styles.tag}>{row.tag}</span> : null}
              <span className={styles.copy} role="cell">
                <strong>{row.title}</strong>
                <small>{row.detail}</small>
              </span>
              <strong
                className={`${styles.value} ${row.tone === "bad" ? styles.bad : row.tone === "neutral" ? styles.neutral : ""}`}
                role="cell"
              >
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
