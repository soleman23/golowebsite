/**
 * The post's photo hero. The photos are 21:9 with the subject on the right and
 * the left side dark, so wide heroes anchor the photo right and the scrim
 * darkens left-to-right under the copy. Below 768px a post with a 4:5
 * `hero.mobile` frame swaps to it; one without crops the 21:9 photo to
 * post.hero.position.
 *
 * No photo yet: the layout is identical, the photo layer just isn't rendered
 * and the bottom-weighted gradient stands on its own. Nothing collapses and
 * nothing 404s.
 */

import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { blogCategoryLabel, type Post } from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate } from "./PostCard";
import styles from "./PostHero.module.css";

/* Matches the phone switch in PostHero.module.css. WIDE is the exact
   complement, so a fractional width (767.5px when zoomed) still gets a preload
   rather than falling between the two. */
const PHONE = "(max-width: 767px)";
const WIDE = "not all and (max-width: 767px)";

/**
 * The LCP element on this page, so it loads eagerly at high priority, and each
 * frame is preloaded under the media query its <source> uses — next/image's
 * own preload can't carry one. getImageProps keeps next/image's resizing and
 * format negotiation for both frames. Its fill styles are dropped: the CSS
 * positions the photo, and below 768px sizes the 4:5 frame to its own ratio.
 */
function HeroPhoto({ hero }: { hero: NonNullable<Post["hero"]> }) {
  const common = {
    alt: hero.alt,
    fill: true,
    sizes: "100vw",
    priority: true,
    fetchPriority: "high",
  } as const;
  const {
    props: { style: _wideFill, ...wide },
  } = getImageProps({ ...common, src: hero.src });
  const phone = hero.mobile
    ? getImageProps({ ...common, src: hero.mobile }).props
    : null;

  for (const [frame, media] of [
    [wide, phone ? WIDE : undefined],
    [phone, PHONE],
  ] as const) {
    if (!frame) continue;
    preload(frame.src, {
      as: "image",
      imageSrcSet: frame.srcSet,
      imageSizes: frame.sizes,
      fetchPriority: "high",
      media,
    });
  }

  return (
    <picture className={styles.picture}>
      {phone ? (
        <source media={PHONE} srcSet={phone.srcSet} sizes={phone.sizes} />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- art-directed
          <picture> from getImageProps; next/image can't switch frames */}
      <img
        {...wide}
        alt={hero.alt}
        className={styles.photo}
        style={
          // Only the 21:9 crop needs it: a 4:5 frame is never cropped.
          phone
            ? undefined
            : ({ "--phone-position": hero.position } as React.CSSProperties)
        }
      />
    </picture>
  );
}

export function PostHero({ post }: { post: Post }) {
  const classes = [
    styles.hero,
    post.hero ? styles.withPhoto : null,
    post.hero?.mobile ? styles.withPhoneFrame : null,
  ];
  return (
    <header className={classes.filter(Boolean).join(" ")}>
      {post.hero ? <HeroPhoto hero={post.hero} /> : null}
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
          {post.updated ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>
                Updated{" "}
                <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            </>
          ) : null}
        </p>
      </div>
    </header>
  );
}
