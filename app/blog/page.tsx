import type { Metadata } from "next";
import {
  blogCountLine,
  featuredPost,
  publishedPosts,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { PageHero } from "@/components/ui/PageHero";
import { StatusPill } from "@/components/ui/StatusPill";
import { FeaturedPost } from "@/components/sections/blog/FeaturedPost";
import { PostGrid, BLOG_TOPIC_IDS } from "@/components/sections/blog/PostGrid";
import { NewsletterBand } from "@/components/sections/blog/NewsletterBand";
import { Elsewhere } from "@/components/sections/blog/Elsewhere";
import { FinalCTA } from "@/components/sections/FinalCTA";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Game rules written by people who play them, betting etiquette, trip structures, and honest notes from building GoLo.",
  alternates: { canonical: "/blog" },
};

/** Only published posts go in the feed — an unwritten card isn't a page. */
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${siteConfig.name} Blog`,
  url: `${siteConfig.url}/blog`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: publishedPosts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/blog/${post.slug}`,
      name: post.title,
    })),
  },
};

/**
 * The topic filter lives in the URL and is resolved here, on the server, so
 * every card ships in the HTML — same reasoning as /games.
 */
type BlogPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { topic } = await searchParams;
  const active = topic && BLOG_TOPIC_IDS.has(topic) ? topic : "all";

  return (
    <>
      <PageHero
        kicker="NOTES FROM THE CART PATH"
        title="How the bet actually works."
        lead="Format breakdowns, settling etiquette, and the arguments your group keeps having — written by people who keep score for money on a Saturday."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        meta={
          <>
            <StatusPill
              variant="testing"
              label="The app isn't live yet — these are the build notes"
              className={styles.heroPill}
            />
            <span className={styles.metaChip}>{blogCountLine}</span>
          </>
        }
      />

      {featuredPost ? <FeaturedPost post={featuredPost} /> : null}

      <PostGrid active={active} featuredSlug={featuredPost?.slug} />

      <NewsletterBand page="blog" />
      <Elsewhere />

      <FinalCTA
        layout="split"
        page="blog"
        kicker="TRACK IT. BET IT. SETTLE IT."
        title="Enough reading. Go settle something."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
    </>
  );
}
