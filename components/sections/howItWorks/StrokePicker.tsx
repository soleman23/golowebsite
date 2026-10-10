"use client";

/**
 * "Where the strokes land": pick Jess, Sarah or Tom and the 18-hole grid
 * lights the holes they get a stroke on (stroke index ≤ their strokes).
 *
 * The toggle is a radio group — arrow keys move the choice, one tab stop. The
 * grid itself is decorative; its aria-label says the same thing in words.
 */

import { useRef, useState } from "react";
// Straight from the module, not the @/lib/content barrel: this is a client
// component, and the barrel would ship every page's copy to the browser.
import {
  strokeExample,
  type StrokePickerName,
} from "@/lib/content/howItWorks";
import styles from "./StrokesExplainer.module.css";

const NAMES = Object.keys(strokeExample.pickerStrokes) as StrokePickerName[];

function listHoles(holes: number[]): string {
  if (holes.length === 1) return `hole ${holes[0]}`;
  return `holes ${holes.slice(0, -1).join(", ")} and ${holes[holes.length - 1]}`;
}

export function StrokePicker() {
  const [player, setPlayer] = useState<StrokePickerName>(
    strokeExample.pickerDefault,
  );
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const strokes = strokeExample.pickerStrokes[player];
  const cells = strokeExample.strokeIndex.map((si, k) => ({
    hole: k + 1,
    si,
    on: si <= strokes,
  }));
  const holes = cells.filter((c) => c.on).map((c) => c.hole);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + NAMES.length) % NAMES.length;
    setPlayer(NAMES[next]);
    buttons.current[next]?.focus();
  };

  return (
    <div className={styles.card}>
      <div className={styles.pickerHead}>
        <p className={styles.label} id="stroke-picker-label">
          {strokeExample.pickerLabel}
        </p>
        <div
          className={styles.segments}
          role="radiogroup"
          aria-labelledby="stroke-picker-label"
        >
          {NAMES.map((name, i) => {
            const on = name === player;
            return (
              <button
                key={name}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                className={styles.segment}
                onClick={() => setPlayer(name)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {name} · {strokeExample.pickerStrokes[name]}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={styles.grid}
        role="img"
        aria-label={`${player} gets strokes on ${listHoles(holes)}.`}
      >
        {[
          { label: "OUT", row: cells.slice(0, 9) },
          { label: "IN", row: cells.slice(9) },
        ].map(({ label, row }) => (
          <div key={label} className={styles.gridRow} aria-hidden="true">
            <span className={styles.gridLabel}>{label}</span>
            {row.map((c) => (
              <div
                key={c.hole}
                className={styles.cell}
                data-stroke={c.on ? "" : undefined}
              >
                <span className={styles.cellHole}>{c.hole}</span>
                <span className={styles.cellSi}>SI {c.si}</span>
                <span className={styles.cellDot} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className={styles.note} aria-live="polite">
        {strokeExample.notes[player]}
      </p>
      <p className={styles.footnote}>{strokeExample.footnote}</p>
    </div>
  );
}
