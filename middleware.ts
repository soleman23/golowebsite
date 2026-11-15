import { NextResponse, type NextRequest } from "next/server";

/**
 * Content negotiation for the home page: a request whose Accept header
 * prefers text/markdown over text/html gets /index.md, the page as Markdown,
 * at the same URL. Browsers never send text/markdown, so they get the HTML.
 * The Markdown answer carries Vary: Accept. The prerendered HTML can't:
 * Next 15 replaces any Vary on it with its own (rsc, router headers), from
 * next.config.mjs or from here. Nothing in front of the site caches HTML
 * today (Hostinger's LiteSpeed passes it through), so that only matters if a
 * CDN is ever added; then key its cache on Accept for "/".
 *
 * Only "/" runs this (the matcher below). Every other path is untouched.
 */

/** The q-value Accept gives a media type, 0 if it doesn't list it. Wildcards don't count. */
function quality(accept: string, type: string): number {
  let best = 0;
  for (const part of accept.split(",")) {
    const [range, ...params] = part.trim().toLowerCase().split(";");
    if (range.trim() !== type) continue;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const value = q ? Number.parseFloat(q.slice(2)) : 1;
    if (Number.isFinite(value)) best = Math.max(best, value);
  }
  return best;
}

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  const markdown = quality(accept, "text/markdown");
  if (markdown > 0 && markdown >= quality(accept, "text/html")) {
    return NextResponse.rewrite(new URL("/index.md", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };
