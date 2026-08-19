/**
 * The page's centrepiece: a bet-by-bet ledger beside the finished match on a
 * phone. The ledger lines and the net total come from the same data, so the
 * numbers can't drift out of agreement.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GameExamplePhone } from "@/components/mockups/GameExamplePhone";
import styles from "./WorkedExample.module.css";

export function WorkedExample({ game }: { game: GameDetail }) {
  const { example } = game;
  const toneClass = (tone: "good" | "bad" | "neutral") => {
    if (tone === "good") return styles.betGood;
    if (tone === "bad") return styles.betBad;
    return styles.betNeutral;
  };

  return (
    <section className={styles.section} aria-labelledby="example-heading">
      <div className={styles.inner}>
        <SectionHeader
          kicker={example.kicker}
          title={example.title}
          lead={example.lead}
          headingId="example-heading"
          maxWidth={720}
        />

        <div className={styles.layout}>
          <div className={styles.ledger}>
            <ol className={styles.bets}>
              {example.bets.map((bet) => (
                <li
                  key={bet.tag}
                  className={`${styles.bet} ${toneClass(bet.tone)}`}
                >
                  <span
                    className={`${styles.tag} ${bet.tone === "good" ? styles.tagGood : bet.tone === "bad" ? styles.tagBad : styles.tagNeutral}`}
                  >
                    <span>{bet.tag}</span>
                    {bet.tagSub ? <small>{bet.tagSub}</small> : null}
                  </span>
                  <span className={styles.betBody}>
                    <span className={styles.betTitle}>{bet.title}</span>
                    <span className={styles.betDetail}>{bet.detail}</span>
                  </span>
                  <span
                    className={`${styles.betValue} ${bet.tone === "good" ? styles.valueGood : bet.tone === "bad" ? styles.valueBad : styles.valueNeutral}`}
                  >
                    {bet.value}
                  </span>
                </li>
              ))}
            </ol>

            {example.standings ? (
              <div className={styles.standings} aria-label="Final standings">
                {example.standings.map((standing) => (
                  <div key={standing.name} className={styles.standing}>
                    <span>
                      <strong>{standing.name}</strong>
                      <small>{standing.note}</small>
                    </span>
                    <strong className={standing.tone === "good" ? styles.valueGood : standing.tone === "bad" ? styles.valueBad : styles.valueNeutral}>
                      {standing.value}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={styles.net}>
              <span className={styles.netGlow} aria-hidden="true" />
              <div className={styles.netCopy}>
                <div className={styles.netLabel}>{example.net.label}</div>
                <div className={styles.netSub}>{example.net.sub}</div>
              </div>
              <span className={styles.netValue}>{example.net.value}</span>
            </div>
          </div>

          <div className={styles.visual}>
            <GameExamplePhone
              phone={example.phone}
              gameName={game.name}
              label={example.phone.label}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
