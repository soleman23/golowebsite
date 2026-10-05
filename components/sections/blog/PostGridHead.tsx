"use client";

/**
 * The heading and post count above the grid. Both follow the active topic, so
 * they read the same state the chips write.
 *
 * The count and the label both come from the chip data rather than being
 * recounted or looked up here — one source for "what this topic is called and
 * how many posts are under it", so the chip and the heading can't disagree.
 * It also keeps @/lib/content (every post body) out of this client bundle.
 */

import type { ChipItem } from "@/components/ui/ChipFilter";
import { useBlogFilter } from "./BlogFilterProvider";
import styles from "./PostGrid.module.css";

export function PostGridHead({ items }: { items: ChipItem[] }) {
  const { active } = useBlogFilter();
  const item = items.find((i) => i.id === active);
  const count = item?.count ?? 0;

  return (
    <div className={styles.head}>
      <h2 id="post-grid-heading" className={styles.heading}>
        {active === "all" || !item ? "Latest posts" : item.label}
      </h2>
      <span className={styles.count} aria-live="polite">
        {count} {count === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}
