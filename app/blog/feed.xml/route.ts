import { blogCategoryLabel, blogHero, publishedPosts } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /blog/feed.xml — RSS 2.0 for feed readers and anyone who'd rather not sign
 * up for the newsletter. Built from publishedPosts like the index and the
 * sitemap, so publishing a post is still the one edit; drafts never appear.
 *
 * Static: rebuilt with the site, served as a file. Each item carries the
 * card's excerpt rather than the full post, so the reader comes to the page
 * for the tables, the steps and the worked examples.
 */
export const dynamic = "force-static";

const FEED_PATH = "/blog/feed.xml";

function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, which RSS requires: "Tue, 28 Jul 2026 00:00:00 GMT". */
function rssDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}

export function GET() {
  const blogUrl = `${siteConfig.url}/blog`;
  const items = publishedPosts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;
      return [
        "    <item>",
        `      <title>${xml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <category>${xml(blogCategoryLabel(post.category))}</category>`,
        `      <description>${xml(post.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(`${siteConfig.brandName} Blog`)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${xml(blogHero.lead)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${siteConfig.url}${FEED_PATH}" rel="self" type="application/rss+xml"/>`,
    ...(publishedPosts[0]
      ? [`    <lastBuildDate>${rssDate(publishedPosts[0].date)}</lastBuildDate>`]
      : []),
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
