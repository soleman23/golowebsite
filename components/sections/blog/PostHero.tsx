/**
 * The post's photo hero. The photos are 21:9 with the subject on the right and
 * the left side dark, so wide heroes anchor the photo right and the scrim
 * darkens left-to-right under the copy. Phones crop to post.hero.position.
 *
 * No photo yet: the layout is identical, the photo layer just isn't rendered
 * and the bottom-weighted gradient stands on its own. Nothing collapses and
 * nothing 404s.
 */

import Image from "next/image";
import { blogCategoryLabel, type Post } from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate } from "./PostCard";
import styles from "./PostHero.module.css";

export function PostHero({ post }: { post: Post }) {
  return (
    <header
      className={post.hero ? `${styles.hero} ${styles.withPhoto}` : styles.hero}
    >
      {post.hero ? (
        <Image
          src={post.hero.src}
          alt={post.hero.alt}
          fill
          sizes="100vw"
          // The LCP element on this page.
          priority
          className={styles.photo}
          style={{ "--phone-position": post.hero.position } as React.CSSProperties}
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
