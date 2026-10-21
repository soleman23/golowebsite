/**
 * Where a lead's visit started: the first path this tab loaded on the site,
 * and the outside host that sent it there. Stored on PhoneLead and
 * NewsletterLead rows so the lead table can say which pages bring people in —
 * GA can't, because it only sees visitors who opt in.
 *
 * Held in module memory only: no cookie, no sessionStorage. The cookie policy
 * inventories every browser-storage purpose, and this doesn't need one.
 * Client-side navigation keeps the module alive, so the value survives every
 * in-site link; a full reload starts a new landing, which is an acceptable
 * undercount.
 *
 * The path only, never the query string (it can carry anything), and the
 * referrer's host only, never its path. From the query string, only the four
 * utm_ tags are read:
 *
 * - `utm_source`, when it looks like a source name (a host or a short slug,
 *   nothing that looks personal): AI answer engines often strip the referrer
 *   but tag their links — ChatGPT search appends utm_source=chatgpt.com — so
 *   without it those visits read as direct.
 * - `utm_medium`, `utm_campaign` and `utm_content`, only as a combination
 *   from GoLo's own link dictionary for that source (lib/campaigns.ts), so
 *   sign-ups can be counted by campaign and placement (#120). Anything else
 *   isn't sent. The server applies both checks again (lib/validation.ts).
 */

import { campaignTags, sourceName, type CampaignTags } from "@/lib/campaigns";

export type LandingAttribution = {
  landingPath: string;
  /** Absent for direct visits, stripped referrers and in-site reloads. */
  referrerHost?: string;
  /** The landing URL's utm_source, if it's a plain source name. */
  landingSource?: string;
} & CampaignTags;

let landing: LandingAttribution | undefined;

/** golo.golf and www.golo.golf are the same site. */
function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

function externalReferrerHost(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (!host || bareHost(host) === bareHost(window.location.hostname)) {
      return undefined;
    }
    return host;
  } catch {
    return undefined;
  }
}

/** Records the landing once per page load. LandingCapture calls it on mount. */
export function captureLanding(): void {
  if (landing || typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search);
  const landingSource = sourceName(query.get("utm_source"));
  landing = {
    landingPath: window.location.pathname,
    referrerHost: externalReferrerHost(),
    landingSource,
    ...campaignTags(
      landingSource,
      query.get("utm_medium"),
      query.get("utm_campaign"),
      query.get("utm_content"),
    ),
  };
}

/** The landing to send with a lead form. */
export function landingAttribution(): LandingAttribution | undefined {
  captureLanding();
  return landing;
}
