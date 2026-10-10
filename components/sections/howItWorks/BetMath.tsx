/**
 * #math — the foursome's round settled: Nassau and skins per player, netted,
 * then boiled down to two payments. Every number comes from betExample and
 * nets to zero.
 */

import { betExample, hiwPlayerColor, type HiwPlayerName } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./BetMath.module.css";

function Avatar({ name, size }: { name: HiwPlayerName; size: "sm" | "md" }) {
  return (
    <span
      className={`${styles.avatar} ${size === "md" ? styles.avatarMd : ""}`}
      style={{ background: `var(--avatar-${hiwPlayerColor[name]})` }}
      aria-hidden="true"
    >
      {name[0]}
    </span>
  );
}

/** "+$10" → positive, "−$12" (real minus) → negative. */
function tone(amount: string): string {
  return amount.startsWith("−") ? styles.negative : styles.positive;
}

export function BetMath() {
  return (
    <section id="math" className={styles.section} aria-labelledby="math-heading">
      <div className={`${styles.bg} golo-bd-course`} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <SectionHeader
          kicker={betExample.kicker}
          title={betExample.title}
          lead={betExample.lead}
          headingId="math-heading"
          className={styles.header}
        />

        <div className={styles.cards}>
          <div className={styles.results}>
            <ul className={styles.chips} aria-label="Results">
              {betExample.results.map((r) => (
                <li
                  key={r.label}
                  className={`${styles.chip} ${r.highlight ? styles.chipOn : ""}`}
                >
                  {r.label}
                </li>
              ))}
            </ul>

            <table className={styles.table}>
              <caption className="sr-only">
                Winnings by player, before settling up
              </caption>
              <thead>
                <tr>
                  <th scope="col">PLAYER</th>
                  <th scope="col">NASSAU</th>
                  <th scope="col">SKINS</th>
                  <th scope="col">NET</th>
                </tr>
              </thead>
              <tbody>
                {betExample.rows.map((row) => (
                  <tr key={row.name}>
                    <th scope="row">
                      <span className={styles.player}>
                        <Avatar name={row.name} size="sm" />
                        <span className={styles.playerText}>
                          <span className={styles.playerName}>{row.name}</span>
                          <span className={styles.playerSkins}>
                            {row.skinsWon} {row.skinsWon === 1 ? "skin" : "skins"}
                          </span>
                        </span>
                      </span>
                    </th>
                    <td className={tone(row.nassau)}>{row.nassau}</td>
                    <td className={tone(row.skins)}>{row.skins}</td>
                    <td className={`${styles.net} ${tone(row.net)}`}>{row.net}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={styles.explain}>
              <strong>Nassau:</strong> {betExample.noteNassau}{" "}
              <strong>Skins:</strong> {betExample.noteSkins}
            </p>
          </div>

          <div className={styles.settle}>
            <p className={styles.settleKicker}>{betExample.settleKicker}</p>
            <p className={styles.settleHead}>
              <span className={styles.settleCount}>{betExample.settleCount}</span>
              <span className={styles.settleCaption}>
                {betExample.settleCaption}
              </span>
            </p>
            <ul className={styles.payments}>
              {betExample.payments.map((p) => (
                <li key={p.from + p.to} className={styles.payment}>
                  <Avatar name={p.from} size="md" />
                  <span className={styles.payName}>{p.from}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                  <span className="sr-only">pays</span>
                  <Avatar name={p.to} size="md" />
                  <span className={`${styles.payName} ${styles.payTo}`}>
                    {p.to}
                  </span>
                  <span className={styles.payAmount}>{p.amount}</span>
                </li>
              ))}
            </ul>
            <p className={styles.settleBody}>{betExample.settleBody}</p>
            <p className={styles.settleFooter}>{betExample.settleFooter}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
