import {
  capabilitiesWithStatus,
  findGameDetail,
  gameDetailSlugsWithContent,
  llmsCopy,
  navLinks,
  postDescription,
  publishedPosts,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /llms.txt — a plain-text map of the site in the llms.txt proposal's format
 * (llmstxt.org), for language-model tools that look for one.
 *
 * An experiment, and a cheap one (soleman23/golowebsite#82): no search engine
 * has said it reads this file or ranks anything by it, and it replaces
 * nothing — every page is still ordinary crawlable HTML, and the file asks not
 * to be indexed itself. It says nothing the site doesn't: the site
 * description, each page's own title and meta description, and the live
 * capabilities from lib/content/capabilities.ts with their limits — the same
 * registry the site's copy is checked against. All of it comes from the
 * content layer (the few words of its own are in lib/content/llms.ts), so it
 * can't drift from the pages. Keep it or delete it after 60 days of server
 * logs show whether anything requests it.
 */
export const dynamic = "force-static";

const absolute = (path: string) =>
  `${siteConfig.url}${path === "/" ? "" : path}`;

/**
 * Live capabilities, with their stated limits. "Runs in a browser" is left
 * out: the status line above the list says where the app runs, and stays
 * right at launch, which that entry's summary doesn't.
 */
const capabilityLines = capabilitiesWithStatus("live")
  .filter((c) => c.id !== "web-app")
  .map((c) =>
    [`- ${c.label}: ${c.summary}`, ...(c.limits ?? [])].join(" "),
  );

export function GET() {
  const lines = [
    `# ${siteConfig.brandName}`,
    "",
    `> ${siteConfig.description} ${llmsCopy.money} ${llmsCopy.status}`,
    "",
    llmsCopy.contact,
    "",
    llmsCopy.capabilitiesIntro,
    "",
    ...capabilityLines,
    "",
    `## ${llmsCopy.sections.pages}`,
    "",
    `- [Home](${absolute("/")})`,
    ...navLinks.map((link) => `- [${link.label}](${absolute(link.href)})`),
    "",
    `## ${llmsCopy.sections.guides}`,
    "",
    ...gameDetailSlugsWithContent.map((slug) => {
      const game = findGameDetail(slug)!;
      return `- [${game.seoTitle}](${absolute(`/games/${slug}`)}): ${game.metaDescription}`;
    }),
    "",
    `## ${llmsCopy.sections.articles}`,
    "",
    ...publishedPosts.map(
      (post) =>
        `- [${post.title}](${absolute(`/blog/${post.slug}`)}): ${postDescription(post)}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // The pages are what should rank, not this summary of them.
      "X-Robots-Tag": "noindex",
    },
  });
}
