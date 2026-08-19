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
 * `lastModified` is honest where the data knows a real date (post dates, legal
 * effective dates) and falls back to build time only for pages whose content
 * has no date of its own.
 *
 * Legal drafts are built for review but remain absent until their individual
 * publication flags are enabled.
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
    // Keyed off the complete, typed detail-record map so every roster game is
    // guaranteed to have exactly one routable page.
    ...gameDetailSlugsWithContent.map((slug) => ({
      url: `${siteConfig.url}/games/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/blog`,
      lastModified: publishedPosts[0]
        ? new Date(publishedPosts[0].date)
        : now,
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
      url: `${siteConfig.url}/delete-account`,
      lastModified: now,
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
