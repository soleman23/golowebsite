import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import {
  gameDetailSlugsWithContent,
  legalDocs,
  publishedPosts,
} from "@/lib/content";

/**
 * Generates /sitemap.xml entirely from the content layer — publishing a post,
 * writing a game detail page or dating a legal document is the only edit
 * needed. Nothing here is a hand-written URL list.
 *
 * `lastModified` is honest where the data knows a real date (post dates, the
 * blog index's newest post, legal effective dates). Undated pages omit it
 * rather than implying that every rebuild changed their content.
 *
 * Legal drafts are built for review but remain absent until their individual
 * publication flags are enabled.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/features`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/how-it-works`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/games`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Keyed off the complete, typed detail-record map so every roster game is
    // guaranteed to have exactly one routable page.
    ...gameDetailSlugsWithContent.map((slug) => ({
      url: `${siteConfig.url}/games/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/blog`,
      // The index changes when a post is published, so the newest post's date
      // is the honest one. publishedPosts is newest-first.
      ...(publishedPosts[0]
        ? { lastModified: new Date(publishedPosts[0].date) }
        : {}),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Driven off the data, so publishing a post is a one-line change in
    // lib/content/blog.ts and never an edit here.
    ...publishedPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${siteConfig.url}/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/delete-account`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // Privacy is always listed. Each draft joins the moment its publication
    // flag clears legal review. Documents date themselves from `effectiveISO`,
    // so <lastmod> is stable across build-machine time zones.
    ...legalDocs
      .filter((doc) => doc.published)
      .map((doc) => ({
        url: `${siteConfig.url}/${doc.slug}`,
        lastModified: new Date(doc.effectiveISO),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
  ];
}
