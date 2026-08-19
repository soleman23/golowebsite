"use client";

/**
 * Filter chip row with optional counts. Plain buttons rather than a tablist —
 * the grid below isn't tab panel content, it's the same list filtered.
 *
 * Focus scrolls a chip into view, so the row is usable when it overflows
 * horizontally on narrow screens.
 *
 * Re-clicking the active chip is a no-op. Both callers push the filter into
 * the URL and fire an analytics event from onChange, so letting it through
 * would stack duplicate history entries under the back button and count one
 * filter selection several times.
 *
 * The active chip is marked aria-current, not aria-pressed. aria-pressed
 * describes a toggle, and these don't toggle: the set is single-select and
 * activating the active chip does nothing, so announcing it as a pressed
 * button promises an interaction that isn't there. "Current item in a set" is
 * what it actually is, and it matches the URL these chips write to. Full
 * radio semantics would say the same thing, but they'd also owe the reader
 * arrow-key navigation and a roving tabindex this row doesn't implement.
 */

import styles from "./ChipFilter.module.css";

export type ChipItem = { id: string; label: string; count?: number };

type ChipFilterProps = {
  items: ChipItem[];
  value: string;
  onChange: (id: string) => void;
  /** Names what's being filtered, for screen readers. */
  label: string;
  className?: string;
};

export function ChipFilter({
  items,
  value,
  onChange,
  label,
  className,
}: ChipFilterProps) {
  return (
    <div
      className={`${styles.row} ${className ?? ""}`}
      role="group"
      aria-label={label}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.chip} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? true : undefined}
            onClick={() => {
              if (!isActive) onChange(item.id);
            }}
            onFocus={(e) =>
              e.currentTarget.scrollIntoView({
                block: "nearest",
                inline: "nearest",
              })
            }
          >
            {item.label}
            {item.count === undefined ? null : (
              <span className={styles.count}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
