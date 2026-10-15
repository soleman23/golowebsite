/**
 * One post in the grid. The whole card is a single link — no nested buttons or
 * secondary links, so it's one tab stop and one target. Only published posts
 * reach it: drafts aren't listed anywhere (see lib/content/blog.ts).
 */

import Link from "next/link";
import Image from "next/image";
import { blogCategoryLabel, type Post } from "@/lib/content";
import styles from "./PostCard.module.css";

/** Matches the grid's column widths so next/image picks a sane candidate. */
const CARD_SIZES = "(min-width: 1100px) 340px, (min-width: 761px) 45vw, 92vw";

export function PostCard({ post }: { post: Post }) {
  const body = (
    <>
      <span className={styles.photo}>
        {post.hero ? (
          <Image
            src={post.hero.src}
            alt={post.hero.alt}
            fill
            sizes={CARD_SIZES}
            className={styles.image}
            style={{ objectPosition: post.hero.position }}
          />
        ) : null}
        <span className={styles.category}>
          {blogCategoryLabel(post.category)}
        </span>
      </span>

      <span className={styles.copy}>
        <span className={styles.title}>{post.title}</span>
        <span className={styles.excerpt}>{post.excerpt}</span>
        <span className={styles.foot}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readMins} min read</span>
        </span>
      </span>
    </>
  );

  return (
    // data-topic is what the /blog filter matches on — see PostGrid.module.css.
    <li className={styles.item} data-topic={post.category}>
      <Link href={`/blog/${post.slug}`} className={styles.card}>
        {body}
      </Link>
    </li>
  );
}

/** "28 July 2026" — unambiguous either side of the Atlantic. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
