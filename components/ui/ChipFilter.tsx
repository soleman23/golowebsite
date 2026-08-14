"use client";

/**
 * Filter chip row with optional counts. Plain buttons with aria-pressed rather
 * than a tablist — the grid below isn't tab panel content, it's the same list
 * filtered.
 *
 * Focus scrolls a chip into view, so the row is usable when it overflows
 * horizontally on narrow screens.
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
            aria-pressed={isActive}
            onClick={() => onChange(item.id)}
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
