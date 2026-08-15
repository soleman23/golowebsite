"use client";

/**
 * The category index beside the answers. Sticky sidebar at wide, a scrollable
 * chip row above the answers below 1100px.
 *
 * Client-side only for the scroll-spy: an IntersectionObserver watches a slab
 * near the top of the viewport and marks whichever category heading most
 * recently crossed it. The links themselves are plain anchors, so the rail
 * still navigates with JS off.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CategoryRail.module.css";

export type RailCategory = {
  id: string;
  short: string;
  label: string;
  count: number;
};

export function CategoryRail({ categories }: { categories: RailCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  // Same reasoning as Accordion's idKey: `categories` is a fresh array on each
  // render of the server parent, so key the effect off the ids themselves.
  const idKey = categories.map((c) => c.id).join("|");

  useEffect(() => {
    const ids = idKey.split("|");
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    // A slab from just under the sticky nav down to a third of the viewport.
    // Sections are tall, so usually one or two overlap it at a time.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Last in document order: the one you're arriving at, not leaving.
        // When nothing overlaps (top of page, bottom of the last answer) the
        // previous choice stands rather than flickering off.
        const last = [...ids].reverse().find((id) => visible.has(id));
        if (last) setActiveId(last);
      },
      { rootMargin: "-100px 0px -66% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [idKey]);

  return (
    <nav className={styles.rail} aria-label="FAQ categories">
      <p className={styles.title}>CATEGORIES</p>

      <ul className={styles.list}>
        {categories.map((category, i) => {
          const active = category.id === activeId;
          return (
            <li key={category.id}>
              <a
                href={`#${category.id}`}
                className={`${styles.row} ${active ? styles.active : ""}`}
                aria-current={active ? "true" : undefined}
              >
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.label}>{category.label}</span>
                <span className={styles.short} aria-hidden="true">
                  {category.short}
                </span>
                <span className={styles.count}>
                  {category.count}
                  <span className="sr-only"> questions</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Wide only — below 1100px the "Talk to a human" band is a screen away
          instead of a scroll away, so the card would just be noise. */}
      <div className={styles.stuck}>
        <p className={styles.stuckTitle}>Still stuck?</p>
        <Link href="/contact" className={styles.stuckLink}>
          TALK TO A HUMAN →
        </Link>
      </div>
    </nav>
  );
}
