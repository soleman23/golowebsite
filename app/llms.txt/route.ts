import {
  capabilitiesWithStatus,
  gameDetailSlugsWithContent,
  findGameDetail,
  navLinks,
  publishedPosts,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /llms.txt — a plain-text map of the site in the llms.txt proposal's format
 * (llmstxt.org), for language-model tools that look for one.
 *
 * An experiment, and a cheap one (soleman23/golowebsite#82): no search engine
 * has said it reads this file or ranks anything by it, and it replaces
 * nothing — every page is still ordinary crawlable HTML. It says nothing the
 * site doesn't: the site description, each page's own title and meta
 * description, and the approved one-line summaries of the live capabilities
 * in lib/content/capabilities.ts, the same registry the site's copy is checked
 * against. All of it is generated from the content layer, so it can't drift
 * from the pages. Keep it or delete it after 60 days of server
 * logs show whether anything requests it.
 */
export const dynamic = "force-static";

const absolute = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

export function GET() {
  const status = siteConfig.appLive
    ? "GoLo is available on iPhone and Android."
    : "GoLo is in private testing; it runs in a phone browser and isn't publicly available yet.";

  const lines = [
    `# ${siteConfig.brandName}`,
    "",
    `> ${siteConfig.description} It never holds, moves or processes money. ${status}`,
    "",
    `${siteConfig.legalName} · ${siteConfig.address.city}, ${siteConfig.address.region} · ${siteConfig.supportEmail}`,
    "",
    "## What the app does today",
    "",
    ...capabilitiesWithStatus("live").map((c) => `- ${c.label}: ${c.summary}`),
    "",
    "## Pages",
    "",
    `- [Home](${absolute("/")})`,
    ...navLinks.map((link) => `- [${link.label}](${absolute(link.href)})`),
    "",
    "## Game guides",
    "",
    ...gameDetailSlugsWithContent.map((slug) => {
      const game = findGameDetail(slug)!;
      return `- [${game.seoTitle}](${absolute(`/games/${slug}`)}): ${game.metaDescription}`;
    }),
    "",
    "## Articles",
    "",
    ...publishedPosts.map(
      (post) =>
        `- [${post.title}](${absolute(`/blog/${post.slug}`)}): ${post.metaDescription ?? post.dek ?? post.excerpt}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
