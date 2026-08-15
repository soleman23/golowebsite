/**
 * The topic rail beside the post grid. Server component: every card is in the
 * HTML whichever topic is selected, and the chips are the only client leaf.
 *
 * The rail is a sticky sidebar at wide and a scrolling chip row below 1100px —
 * ChipFilter's own CSS already handles the narrow case.
 */

import Link from "next/link";
import {
  blogFilters,
  blogTopicIds,
  blogCategoryLabel,
  postsByDate,
  type Post,
} from "@/lib/content";
import { BlogFilterChips } from "./BlogFilterChips";
import { PostCard } from "./PostCard";
import styles from "./PostGrid.module.css";

export const BLOG_TOPIC_IDS = new Set<string>(blogTopicIds);

/** The featured post leads the page, so it doesn't repeat in the grid below. */
function gridPosts(active: string, exclude?: string): Post[] {
  return postsByDate.filter(
    (post) =>
      post.slug !== exclude && (active === "all" || post.category === active),
  );
}

type PostGridProps = {
  active: string;
  featuredSlug?: string;
};

export function PostGrid({ active, featuredSlug }: PostGridProps) {
  const shown = gridPosts(active, featuredSlug);
  const activeLabel =
    active === "all" ? "Latest posts" : blogCategoryLabel(active);

  return (
    <section className={styles.section} aria-labelledby="post-grid-heading">
      <div className={styles.grid}>
        <div className={styles.rail}>
          <p className={styles.railLabel}>TOPICS</p>
          <BlogFilterChips
            items={blogFilters(featuredSlug)}
            value={active}
            className={styles.chips}
          />

          <div className={styles.pitch}>
            <p className={styles.pitchTitle}>Want a format covered?</p>
            <p className={styles.pitchBody}>
              Tell us the game your group argues about.
            </p>
            <Link href="/contact?topic=idea" className={styles.pitchLink}>
              SEND IT OVER →
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.head}>
            <h2 id="post-grid-heading" className={styles.heading}>
              {activeLabel}
            </h2>
            <span className={styles.count} aria-live="polite">
              {shown.length} {shown.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {shown.length === 0 ? (
            <p className={styles.empty}>Nothing under that topic yet.</p>
          ) : (
            <ul className={styles.cards}>
              {shown.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
