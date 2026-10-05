import type { Metadata } from "next";
import {
  blogCountLine,
  blogTopicIds,
  featuredPost,
  publishedPosts,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { PageHero } from "@/components/ui/PageHero";
import { StatusPill } from "@/components/ui/StatusPill";
import { FilterBoot } from "@/components/ui/FilterBoot";
import { FeaturedPost } from "@/components/sections/blog/FeaturedPost";
import { PostGrid } from "@/components/sections/blog/PostGrid";
import { NewsletterBand } from "@/components/sections/blog/NewsletterBand";
import { Elsewhere } from "@/components/sections/blog/Elsewhere";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";
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
 * Static, and deliberately so. Reading `searchParams` here would make the
 * route dynamic, and Next 15 streams metadata on dynamic routes — the title
 * and description end up in the body instead of <head>. See FilterBoot.
 *
 * Every post ships in the HTML on every request now, which is strictly better
 * for a crawler than serving whatever subset the query string asked for.
 */
export default function BlogPage() {
  return (
    <>
      <FilterBoot param="topic" ids={blogTopicIds} />

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

      <PostGrid featuredSlug={featuredPost?.slug} />

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

      <JsonLd data={blogJsonLd} />
    </>
  );
}
