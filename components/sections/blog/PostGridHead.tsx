"use client";

/**
 * The heading and post count above the grid. Both follow the active topic, so
 * they read the same state the chips write.
 *
 * The count comes from the chip data rather than being recounted here — one
 * source for "how many posts are under this topic", so the number beside the
 * chip and the number above the grid can't disagree.
 */

import { blogCategoryLabel } from "@/lib/content";
import type { ChipItem } from "@/components/ui/ChipFilter";
import { useBlogFilter } from "./BlogFilterProvider";
import styles from "./PostGrid.module.css";

export function PostGridHead({ items }: { items: ChipItem[] }) {
  const { active } = useBlogFilter();
  const count = items.find((i) => i.id === active)?.count ?? 0;

  return (
    <div className={styles.head}>
      <h2 id="post-grid-heading" className={styles.heading}>
        {active === "all" ? "Latest posts" : blogCategoryLabel(active)}
      </h2>
      <span className={styles.count} aria-live="polite">
        {count} {count === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}
