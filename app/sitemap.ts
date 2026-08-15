import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { gameDetailSlugsWithContent, publishedPosts } from "@/lib/content";

/**
 * Generates /sitemap.xml. Game detail pages are derived from the content keys,
 * so a new game appears here as soon as its copy lands — no edit needed.
 *
 * /terms is deliberately absent while siteConfig.termsPublished is false: it's
 * built but hasn't cleared legal review.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/games`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...gameDetailSlugsWithContent.map((slug) => ({
      url: `${siteConfig.url}/games/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
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
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
