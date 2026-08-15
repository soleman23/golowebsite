/**
 * "Keep reading" — up to three other published posts, using the same card as
 * /blog. Unwritten posts are skipped rather than padded out with coming-soon
 * cards: this is a "go read this next" rail, and there has to be a next.
 *
 * Renders nothing while this is the only published post. It comes back on its
 * own as soon as a second one ships.
 */

import Link from "next/link";
import { publishedPosts, type Post } from "@/lib/content";
import { PostCard } from "./PostCard";
import styles from "./KeepReadingPosts.module.css";

/** Same category first, then whatever else is newest. */
function relatedTo(post: Post): Post[] {
  const others = publishedPosts.filter((p) => p.slug !== post.slug);
  const sameTopic = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameTopic, ...rest].slice(0, 3);
}

export function KeepReadingPosts({ post }: { post: Post }) {
  const related = relatedTo(post);
  if (related.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="keep-reading-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="keep-reading-heading" className={styles.label}>
            KEEP READING
          </h2>
          <Link href="/blog" className={styles.all}>
            ALL POSTS →
          </Link>
        </div>

        <ul className={styles.grid}>
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
