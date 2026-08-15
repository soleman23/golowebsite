"use client";

/**
 * "On this page" — the numbered section index. Sticky rail at wide, a
 * scrolling chip row below 1100px.
 *
 * Client-side only for the scroll-spy; the links are plain anchors, so the
 * rail still navigates with JS off. Same IntersectionObserver approach as the
 * FAQ category rail, with the band pushed lower to clear both sticky bars.
 */

import { useEffect, useState } from "react";
import styles from "./TocRail.module.css";

export type TocItem = { id: string; num: string; title: string };

export function TocRail({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  // Joined rather than passing `items` into the dep array: it's a fresh array
  // on every render of the server parent.
  const idKey = items.map((i) => i.id).join("|");

  useEffect(() => {
    const ids = idKey.split("|");
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Last in document order: the section you're arriving at. When nothing
        // overlaps the band the previous choice stands rather than flickering.
        const last = [...ids].reverse().find((id) => visible.has(id));
        if (last) setActiveId(last);
      },
      // Below the main nav (70px) and the legal sub-nav (~52px), so a heading
      // only counts as "current" once it's actually clear of both.
      { rootMargin: "-150px 0px -64% 0px" },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [idKey]);

  return (
    <nav className={styles.rail} aria-label="On this page">
      <p className={styles.label}>ON THIS PAGE</p>
      <ol className={styles.list}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.row} ${active ? styles.active : ""}`}
                aria-current={active ? "true" : undefined}
              >
                <span className={styles.num} aria-hidden="true">
                  {item.num}
                </span>
                <span className={styles.title}>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
