/**
 * /features block 6: where a 24-handicap's strokes land — an 18-cell grid by
 * stroke index, with a second stroke on the six hardest holes. Decorative.
 */

import { strokeCells } from "@/lib/mockData";
import styles from "./mockups.module.css";

export function StrokeGrid() {
  return (
    <div
      className={styles.glassCard}
      role="img"
      aria-label="Stroke allocation for Tom: a 22.0 index becomes 24 strokes at the White tees — one stroke on every hole and a second on the six hardest by stroke index."
    >
      <div className={styles.glassCardInner} aria-hidden="true">
        <div className={styles.rowBetween}>
          <span className={styles.cardKicker}>STROKES · TOM</span>
          <span className={styles.cardMeta}>22.0 index → 24 strokes</span>
        </div>

        <div className={styles.strokeHead}>
          <span className={styles.strokeBig}>24</span>
          <span className={styles.strokeCaption}>
            strokes at White tees
            <br />
            slope 128 · 100% allowance
          </span>
        </div>

        <div>
          <div className={styles.strokeLabel}>
            WHERE THEY LAND (BY STROKE INDEX)
          </div>
          <div className={styles.strokeGrid}>
            {strokeCells.map((cell) => (
              <div
                key={cell.hole}
                className={`${styles.strokeCell} ${cell.two ? styles.strokeCellTwo : ""}`}
              >
                <div className={styles.strokeCellHole}>{cell.hole}</div>
                <div className={styles.strokeCellMarks}>
                  {cell.two ? "••" : "•"}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.strokeLegend}>
            <span className={styles.strokeLegendItem}>
              <span className={styles.strokeSwatch} />
              one stroke
            </span>
            <span className={styles.strokeLegendItem}>
              <span
                className={`${styles.strokeSwatch} ${styles.strokeSwatchTwo}`}
              />
              two strokes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
