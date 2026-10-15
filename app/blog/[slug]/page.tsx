import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  appCtaLabel,
  findPost,
  postLastModified,
  publishedPosts,
  type Post,
} from "@/lib/content";
import { defaultOgImage, siteConfig } from "@/lib/siteConfig";
import { socialDefaults } from "@/lib/pageMetadata";
import {
  organizationRef,
  organizationSummary,
  websiteNode,
  websiteRef,
} from "@/lib/schema";
import { PostHero } from "@/components/sections/blog/PostHero";
import { ProseBlocks } from "@/components/ui/blog/ProseBlocks";
import { ShareRow } from "@/components/sections/blog/ShareRow";
import { KeepReadingPosts } from "@/components/sections/blog/KeepReadingPosts";
import { NewsletterBand } from "@/components/sections/blog/NewsletterBand";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";

/**
 * The post template. Every post renders through here from its `blocks` — a new
 * post is a data edit in lib/content/blog.ts, never a new page file.
 */

type Params = { params: Promise<{ slug: string }> };

/**
 * Only written posts get a route. An unpublished slug has no page to build and
 * 404s if typed — findPost won't resolve it either.
 */
export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

/** One description for the meta tag, the share card and the Article node. */
function postDescription(post: Post): string {
  return post.metaDescription ?? post.dek ?? post.excerpt;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  const description = postDescription(post);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      ...socialDefaults.openGraph,
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description,
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [siteConfig.brandName],
      // The hero's 1200x630 cut when it has one, else the hero itself; with no
      // photo, the site-wide card. twitter:image inherits whichever this is.
      images: post.hero
        ? [
            post.hero.og
              ? { url: post.hero.og, width: 1200, height: 630, alt: post.hero.alt }
              : { url: post.hero.src, alt: post.hero.alt },
          ]
        : [defaultOgImage],
    },
  };
}

/**
 * The article, its page, and the company and site it belongs to, as one graph.
 * Publisher and author are the Organization by @id (lib/schema.ts) — the same
 * GoLo Golf the home page describes — until posts carry a named author.
 *
 * Images: the 1200x630 share cut first, then the 21:9 hero, so a consumer that
 * wants a conventional ratio finds one.
 */
function articleJsonLd(post: Post) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const images = post.hero
    ? [post.hero.og, post.hero.src]
        .filter((src): src is string => Boolean(src))
        .map((src) => `${siteConfig.url}${src}`)
    : [];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: postDescription(post),
        datePublished: post.date,
        dateModified: postLastModified(post),
        author: organizationRef,
        publisher: organizationRef,
        ...(images.length ? { image: images } : {}),
        inLanguage: "en",
        isPartOf: websiteRef,
        mainEntityOfPage: { "@id": url },
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: post.title,
        isPartOf: websiteRef,
      },
      organizationSummary(),
      websiteNode(),
    ],
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <>
      <PostHero post={post} />

      <article>
        <ProseBlocks blocks={post.body} />
      </article>

      <ShareRow slug={post.slug} title={post.title} />
      <KeepReadingPosts post={post} />
      <NewsletterBand page="post" />

      <FinalCTA
        layout="split"
        page="post"
        kicker="TRACK IT. BET IT. SETTLE IT."
        title="Stop doing this math in the parking lot."
        buttons={[
          {
            label: appCtaLabel,
            href: "/#get",
            cta: "get_app",
            variant: "primary",
          },
          {
            label: "Browse the games",
            href: "/games",
            cta: "browse_games",
            variant: "ghost",
          },
        ]}
      />

      <JsonLd data={articleJsonLd(post)} />
    </>
  );
}
