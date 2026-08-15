/**
 * The lead card: photo one side, copy the other. Same "whole card is the link"
 * rule as PostCard, and the same flat panel where the photo will go.
 */

import Link from "next/link";
import Image from "next/image";
import { blogCategoryLabel, type Post } from "@/lib/content";
import { formatDate } from "./PostCard";
import styles from "./FeaturedPost.module.css";

export function FeaturedPost({ post }: { post: Post }) {
  const body = (
    <>
      <span className={styles.photo}>
        {post.hero ? (
          <Image
            src={post.hero.src}
            alt={post.hero.alt}
            fill
            sizes="(min-width: 1100px) 560px, 92vw"
            // The featured photo is the largest thing above the fold here.
            priority
            className={styles.image}
          />
        ) : null}
        <span className={styles.category}>
          {blogCategoryLabel(post.category)}
        </span>
      </span>

      <span className={styles.copy}>
        <span className={styles.kicker}>FEATURED</span>
        <span className={styles.title}>{post.title}</span>
        <span className={styles.excerpt}>{post.excerpt}</span>
        <span className={styles.meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readMins} min read</span>
        </span>
        <span className={styles.cta}>READ THE POST →</span>
      </span>
    </>
  );

  return (
    <section className={styles.section} aria-label="Featured post">
      <div className={styles.inner}>
        {post.published ? (
          <Link href={`/blog/${post.slug}`} className={styles.card}>
            {body}
          </Link>
        ) : (
          <div className={styles.card}>{body}</div>
        )}
      </div>
    </section>
  );
}
