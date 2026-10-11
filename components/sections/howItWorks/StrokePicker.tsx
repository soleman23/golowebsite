"use client";

/**
 * "Where the strokes land": pick a player and the 18-hole grid lights the
 * holes they get a stroke on — stroke index ≤ their strokes, and past 18 a
 * second stroke on stroke index ≤ strokes − 18, as the app allocates them.
 *
 * The toggle is a radio group — arrow keys move the choice, one tab stop. The
 * grid itself is decorative; its aria-label says the same thing in words.
 */

import { useRef, useState } from "react";
// Straight from the module, not the @/lib/content barrel: this is a client
// component, and the barrel would ship every page's copy to the browser.
import {
  strokeExample,
  type HiwPlayerName,
} from "@/lib/content/howItWorks";
import styles from "./StrokesExplainer.module.css";

const NAMES = strokeExample.players.map((p) => p.name);
const STROKES = Object.fromEntries(
  strokeExample.players.map((p) => [p.name, p.course]),
) as Record<HiwPlayerName, number>;

function listHoles(holes: number[]): string {
  if (holes.length === 18) return "every hole";
  if (holes.length === 1) return `hole ${holes[0]}`;
  return `holes ${holes.slice(0, -1).join(", ")} and ${holes[holes.length - 1]}`;
}

/** Strokes on a hole of stroke index `si` for a player getting `strokes`. */
function strokesOn(si: number, strokes: number): number {
  return Math.floor(strokes / 18) + (si <= strokes % 18 ? 1 : 0);
}

export function StrokePicker() {
  const [player, setPlayer] = useState<HiwPlayerName>(
    strokeExample.pickerDefault,
  );
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const strokes = STROKES[player];
  const cells = strokeExample.strokeIndex.map((si, k) => ({
    hole: k + 1,
    si,
    n: strokesOn(si, strokes),
  }));
  const holes = cells.filter((c) => c.n > 0).map((c) => c.hole);
  const doubles = cells.filter((c) => c.n > 1).map((c) => c.hole);
  const described =
    `${player} gets strokes on ${listHoles(holes)}` +
    (doubles.length ? `, and a second on ${listHoles(doubles)}.` : ".");

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
                {name} · {STROKES[name]}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={styles.grid}
        role="img"
        aria-label={described}
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
                data-stroke={c.n > 0 ? c.n : undefined}
              >
                <span className={styles.cellHole}>{c.hole}</span>
                <span className={styles.cellSi}>SI {c.si}</span>
                <span className={styles.cellDots}>
                  <span className={styles.cellDot} />
                  {c.n > 1 ? <span className={styles.cellDot} /> : null}
                </span>
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
