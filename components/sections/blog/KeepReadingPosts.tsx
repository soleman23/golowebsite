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

/** The post's own picks first, then the same category, then the newest. */
function relatedTo(post: Post): Post[] {
  const others = publishedPosts.filter((p) => p.slug !== post.slug);
  const picked = (post.related ?? [])
    .map((slug) => others.find((p) => p.slug === slug))
    .filter((p): p is Post => Boolean(p));
  const rest = others.filter((p) => !picked.includes(p));
  const sameTopic = rest.filter((p) => p.category === post.category);
  const newest = rest.filter((p) => p.category !== post.category);
  return [...picked, ...sameTopic, ...newest].slice(0, 3);
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
