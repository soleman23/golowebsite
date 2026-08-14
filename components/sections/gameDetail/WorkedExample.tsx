/**
 * The page's centrepiece: a bet-by-bet ledger beside the finished match on a
 * phone. The ledger lines and the net total come from the same data, so the
 * numbers can't drift out of agreement.
 */

import type { GameDetail } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NassauPhone } from "@/components/mockups/NassauPhone";
import styles from "./WorkedExample.module.css";

export function WorkedExample({ game }: { game: GameDetail }) {
  const { example } = game;

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
                  className={`${styles.bet} ${bet.tone === "good" ? styles.betGood : ""}`}
                >
                  <span
                    className={`${styles.tag} ${bet.tone === "good" ? styles.tagGood : styles.tagBad}`}
                  >
                    {bet.tag}
                  </span>
                  <span className={styles.betBody}>
                    <span className={styles.betTitle}>{bet.title}</span>
                    <span className={styles.betDetail}>{bet.detail}</span>
                  </span>
                  <span
                    className={`${styles.betValue} ${bet.tone === "good" ? styles.valueGood : styles.valueBad}`}
                  >
                    {bet.value}
                  </span>
                </li>
              ))}
            </ol>

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
            <NassauPhone
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
