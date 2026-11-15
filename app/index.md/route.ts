import {
  faqs,
  features,
  heroHeading,
  homeGames,
  homeGamesSection,
  llmsCopy,
  pricing,
  steps,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

/**
 * /index.md: the home page as Markdown, for agents. middleware.ts serves it
 * at "/" too when a request's Accept prefers text/markdown, and the home page
 * advertises it with a Link header and a <link rel="alternate">.
 *
 * Built from the same content records as the page, section by section, so it
 * says what the page says and nothing more. Not indexed: the HTML page is
 * the one that should rank, and the canonical Link says so.
 */
export const dynamic = "force-static";

const absolute = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

/** The few inline tags the home copy uses, as Markdown; anything else dropped. */
function htmlToMarkdown(html: string): string {
  return html
    .replace(/<\/?strong>/g, "**")
    .replace(/<\/?em>/g, "_")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function downloadLines(): string[] {
  return [
    `- Android: ${siteConfig.googlePlayUrl}`,
    siteConfig.iosLive
      ? `- iPhone: ${siteConfig.appStoreUrl}`
      : `- iPhone: coming to the App Store. Until then, use the web app in Safari: ${siteConfig.webAppUrl}`,
    `- Web: ${siteConfig.webAppUrl}`,
  ];
}

export function GET() {
  const lines = [
    `# ${heroHeading.text} ${heroHeading.accent}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.brandName}. ${siteConfig.tagline}`,
    "",
    `**${pricing.kicker.charAt(0)}${pricing.kicker.slice(1).toLowerCase()}:** ${pricing.value}. ${pricing.body} (${absolute("/features#pricing")})`,
    "",
    ...features.flatMap((f) => [
      `## ${f.title}`,
      "",
      htmlToMarkdown(f.bodyHtml),
      "",
      ...f.checklist.map((c) => `- **${c.lead}:** ${c.rest}`),
      "",
    ]),
    `## ${homeGamesSection.title}`,
    "",
    homeGamesSection.lead,
    "",
    ...homeGames.map((g) => `- [${g.name}](${absolute(`/games/${g.slug}`)}): ${g.desc}`),
    "",
    `[All games](${absolute("/games")})`,
    "",
    "## How it works",
    "",
    ...steps.map((s) => `${s.n}. **${s.title}.** ${s.body}`),
    "",
    "## Get GoLo",
    "",
    ...downloadLines(),
    "",
    "## Questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    `[The full FAQ](${absolute("/faq")})`,
    "",
    "## Contact",
    "",
    llmsCopy.contact,
    "",
    `More for agents: ${absolute("/llms.txt")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      Link: `<${absolute("/")}>; rel="canonical"`,
      Vary: "Accept",
    },
  });
}
