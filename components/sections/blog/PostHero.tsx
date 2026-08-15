/**
 * The post's photo hero. The scrim is bottom-weighted so the headline sits on
 * the darkest part of the picture.
 *
 * No photo yet: the layout is identical, the photo layer just isn't rendered
 * and the gradient stands on its own. Nothing collapses and nothing 404s.
 */

import Image from "next/image";
import { blogCategoryLabel, type Post } from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate } from "./PostCard";
import styles from "./PostHero.module.css";

export function PostHero({ post }: { post: Post }) {
  return (
    <header className={styles.hero}>
      {post.hero ? (
        <Image
          src={post.hero.src}
          alt={post.hero.alt}
          fill
          sizes="100vw"
          // The LCP element on this page.
          priority
          className={styles.photo}
        />
      ) : null}
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <Breadcrumbs
          className={styles.crumbs}
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.crumb ?? post.title },
          ]}
        />

        <div className={styles.tags}>
          <span className={styles.category}>
            {blogCategoryLabel(post.category)}
          </span>
          <span className={styles.read}>{post.readMins} MIN READ</span>
        </div>

        <h1 className={styles.title}>{post.title}</h1>
        {post.dek ? <p className={styles.dek}>{post.dek}</p> : null}

        <p className={styles.byline}>
          {post.author ? <span>{post.author}</span> : null}
          {post.author ? <span aria-hidden="true"> · </span> : null}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
      </div>
    </header>
  );
}
