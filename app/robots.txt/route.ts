import { siteConfig } from "@/lib/siteConfig";

/**
 * /robots.txt. Allows every crawler, declares how the content may be used
 * (Content-Signal, contentsignals.org) and points to the sitemap.
 *
 * A route handler rather than app/robots.ts: Next's robots metadata type has
 * no field for Content-Signal, and the line has to sit inside the
 * User-agent group to apply to it.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# Content signals (https://contentsignals.org/):",
    "# search: building a search index and linking to or quoting pages in results.",
    "# ai-input: using pages to answer a question in an AI answer, with a citation.",
    "# ai-train: training or fine-tuning AI models.",
    "",
    "User-agent: *",
    `Content-Signal: ${siteConfig.contentSignal}`,
    "Allow: /",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
