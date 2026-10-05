/**
 * The topic rail beside the post grid. Server component that renders every
 * card, every time — the filter is CSS keyed off <html data-filter>, same
 * mechanism as /games, so the HTML always holds the full feed.
 *
 * The rail is a sticky sidebar at wide and a scrolling chip row below 1100px —
 * ChipFilter's own CSS already handles the narrow case.
 */

import Link from "next/link";
import { blogFilters, blogTopicIds, postsByDate } from "@/lib/content";
import { BlogFilterProvider } from "./BlogFilterProvider";
import { BlogFilterChips } from "./BlogFilterChips";
import { PostGridHead } from "./PostGridHead";
import { PostCard } from "./PostCard";
import styles from "./PostGrid.module.css";

export function PostGrid({ featuredSlug }: { featuredSlug?: string }) {
  // The featured post leads the page, so it doesn't repeat in the grid below.
  const shown = postsByDate.filter((post) => post.slug !== featuredSlug);
  const chips = blogFilters(featuredSlug);

  return (
    <section className={styles.section} aria-labelledby="post-grid-heading">
      <BlogFilterProvider ids={blogTopicIds}>
        <div className={styles.grid}>
          <div className={styles.rail}>
            <p className={styles.railLabel}>TOPICS</p>
            <BlogFilterChips items={chips} className={styles.chips} />

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
            <PostGridHead items={chips} />

            <ul className={styles.cards}>
              {shown.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </ul>
          </div>
        </div>
      </BlogFilterProvider>
    </section>
  );
}
