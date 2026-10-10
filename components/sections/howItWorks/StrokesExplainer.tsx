/**
 * #strokes — the course-handicap formula worked for the foursome, and the
 * picker showing where each player's strokes land. Server shell; only
 * StrokePicker is client.
 */

import { hiwPlayerColor, strokeExample } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StrokePicker } from "./StrokePicker";
import styles from "./StrokesExplainer.module.css";

export function StrokesExplainer() {
  return (
    <section
      id="strokes"
      className={styles.section}
      aria-labelledby="strokes-heading"
    >
      <div className={styles.inner}>
        <SectionHeader
          kicker={strokeExample.kicker}
          title={strokeExample.title}
          lead={strokeExample.lead}
          headingId="strokes-heading"
          className={styles.header}
        />

        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.formulaCard}`}>
            <div className={styles.formulaHead}>
              <p className={styles.label}>{strokeExample.formulaLabel}</p>
              <p className={styles.formula}>{strokeExample.formula}</p>
              <p className={styles.course}>{strokeExample.course}</p>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">PLAYER</th>
                  <th scope="col">INDEX</th>
                  <th scope="col">COURSE</th>
                  <th scope="col">STROKES</th>
                </tr>
              </thead>
              <tbody>
                {strokeExample.players.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">
                      <span className={styles.player}>
                        <span
                          className={styles.avatar}
                          style={{
                            background: `var(--avatar-${hiwPlayerColor[p.name]})`,
                          }}
                          aria-hidden="true"
                        >
                          {p.name[0]}
                        </span>
                        {p.name}
                        {p.guest ? (
                          <span className={styles.guest}> · guest</span>
                        ) : null}
                      </span>
                    </th>
                    <td className={styles.index}>{p.index}</td>
                    <td className={styles.courseHcp}>{p.course}</td>
                    <td>
                      {p.strokes === null ? (
                        <span className={styles.lowMan}>LOW MAN</span>
                      ) : (
                        <span className={styles.strokes}>{p.strokes}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.allowances}>
              {strokeExample.allowances.map((a, i) => (
                <span
                  key={a}
                  className={`${styles.chip} ${i === 0 ? styles.chipOn : ""}`}
                >
                  {a}
                </span>
              ))}
              <span className={styles.allowanceNote}>
                {strokeExample.allowanceNote}
              </span>
            </div>
          </div>

          <StrokePicker />
        </div>
      </div>
    </section>
  );
}
