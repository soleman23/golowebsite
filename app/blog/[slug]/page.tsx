import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPost, publishedPosts, type Post } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { PostHero } from "@/components/sections/blog/PostHero";
import { ProseBlocks } from "@/components/ui/blog/ProseBlocks";
import { ShareRow } from "@/components/sections/blog/ShareRow";
import { KeepReadingPosts } from "@/components/sections/blog/KeepReadingPosts";
import { NewsletterBand } from "@/components/sections/blog/NewsletterBand";
import { FinalCTA } from "@/components/sections/FinalCTA";

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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  const description = post.dek ?? post.excerpt;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date,
      authors: ["GoLo Golf"],
      // The hero doubles as the OG image once there's a photo to point at.
      ...(post.hero ? { images: [{ url: post.hero.src }] } : {}),
    },
  };
}

function articleJsonLd(post: Post) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.dek ?? post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "GoLo Golf" },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
    ...(post.hero ? { image: `${siteConfig.url}${post.hero.src}` } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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
            label: "Get the app",
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post)),
        }}
      />
    </>
  );
}
