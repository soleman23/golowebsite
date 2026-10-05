"use client";

/**
 * The heading and post count above the grid.
 *
 * Every topic's heading and count is rendered, and PostGrid.module.css shows
 * the one matching <html data-filter> — so they're right on a deep link
 * before hydration, not just after. Only the default variant is visible
 * without CSS; the rest are `hidden`, so a crawler or reader view that skips
 * the stylesheet reads one heading ("Latest posts"), not eight run together.
 *
 * Labels and counts come from the chip data, so the chip and the heading
 * can't disagree. Reading them from props also keeps @/lib/content (every
 * post body) out of this client bundle.
 *
 * The count isn't a live region; FilterStatus announces changes the reader
 * makes, and not the initial read of the URL.
 */

import { useMemo } from "react";
import type { ChipItem } from "@/components/ui/ChipFilter";
import { FilterStatus } from "@/components/ui/FilterStatus";
import { useBlogFilter } from "./BlogFilterProvider";
import styles from "./PostGrid.module.css";

function headingFor(item: ChipItem): string {
  return item.id === "all" ? "Latest posts" : item.label;
}

function countFor(item: ChipItem): string {
  const count = item.count ?? 0;
  return `${count} ${count === 1 ? "post" : "posts"}`;
}

export function PostGridHead({ items }: { items: ChipItem[] }) {
  const { active } = useBlogFilter();
  const messages = useMemo(
    () =>
      Object.fromEntries(
        items.map((i) => [i.id, `${headingFor(i)}: ${countFor(i)}`]),
      ),
    [items],
  );

  return (
    <div className={styles.head}>
      <h2 id="post-grid-heading" className={styles.heading}>
        {items.map((item) => (
          <span key={item.id} data-for={item.id} hidden={item.id !== "all"}>
            {headingFor(item)}
          </span>
        ))}
      </h2>
      <span className={styles.count}>
        {items.map((item) => (
          <span key={item.id} data-for={item.id} hidden={item.id !== "all"}>
            {countFor(item)}
          </span>
        ))}
      </span>
      <FilterStatus active={active} messages={messages} />
    </div>
  );
}
