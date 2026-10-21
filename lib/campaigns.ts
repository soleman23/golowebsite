/**
 * The GoLo link dictionary: which utm_medium / utm_campaign / utm_content
 * values a lead may keep, per utm_source (soleman23/golowebsite#120; the
 * design is soleman23/golo marketing/social/MEASUREMENT.md §2).
 *
 * The three are kept only as one complete combination the dictionary defines
 * for the landing's source. Anything else — an unknown medium, an unlisted
 * campaign, a placement the source doesn't have, a value that was never ours
 * — leaves all three empty. Never a reason to reject a lead.
 *
 * Shared by lib/attribution.ts (so the browser sends only dictionary values)
 * and lib/validation.ts (the server's check, which is the one that counts).
 * Kept free of zod and React: it rides along with the lead forms.
 */

import { looksPersonal } from "@/lib/analytics";

/**
 * Campaign IDs, each marked by the kind of link that carries it. Add an ID in
 * the same change that first uses it in a link; until then it's stored as
 * null.
 */
export const campaigns = [
  { id: "golo_prelaunch_2026q4", kind: "social" },
] as const satisfies readonly { id: string; kind: "social" | "email" }[];

type CampaignKind = "social" | "email";

/** An Instagram story placement: story_ + two letters, two digits, _ + a letter. */
const STORY_CONTENT = /^story_[a-z]{2}[0-9]{2}_[a-z]$/;

type SourceRule = {
  medium: string;
  campaignKind: CampaignKind;
  content: (value: string) => boolean;
};

const oneOf =
  (...values: string[]) =>
  (value: string) =>
    values.includes(value);

/** Source → the medium, campaign kind and placements its links use. */
const sourceRules = new Map<string, SourceRule>([
  [
    "instagram",
    {
      medium: "organic_social",
      campaignKind: "social",
      content: (value) => value === "bio" || STORY_CONTENT.test(value),
    },
  ],
  ["tiktok", { medium: "organic_social", campaignKind: "social", content: oneOf("bio") }],
  ["youtube", { medium: "organic_social", campaignKind: "social", content: oneOf("channel") }],
  [
    "hostinger_reach",
    { medium: "email", campaignKind: "email", content: oneOf("header", "cta_button") },
  ],
]);

/** Lower-case letters, digits, dots, hyphens and underscores; up to 64. */
const SOURCE_NAME = /^[a-z0-9._-]{1,64}$/;

function normalize(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim().toLowerCase() : undefined;
}

/** A UUID, or any run of 16 or more hex characters: an identifier, not a source name. */
const IDENTIFIER = /[0-9a-f]{8}-[0-9a-f]{4}-|[0-9a-f]{16,}/;

/**
 * The landing's utm_source, if it's a plain source name: a host or a short
 * slug, with nothing that looks like personal data (no "@", no run of seven
 * or more digits) and nothing that looks like an identifier (a UUID or a long
 * hex run). Otherwise undefined.
 */
export function sourceName(value: unknown): string | undefined {
  const source = normalize(value);
  return source &&
    SOURCE_NAME.test(source) &&
    !looksPersonal(source) &&
    !IDENTIFIER.test(source)
    ? source
    : undefined;
}

export type CampaignTags = {
  landingMedium: string | null;
  landingCampaign: string | null;
  landingContent: string | null;
};

const NO_TAGS: CampaignTags = {
  landingMedium: null,
  landingCampaign: null,
  landingContent: null,
};

/**
 * Medium, campaign and content, trimmed and lower-cased, when together with
 * the source they form a combination the dictionary defines; otherwise all
 * three null. `source` should already have passed sourceName().
 */
export function campaignTags(
  source: unknown,
  medium: unknown,
  campaign: unknown,
  content: unknown,
): CampaignTags {
  const rule = sourceRules.get(normalize(source) ?? "");
  const m = normalize(medium);
  const c = normalize(campaign);
  const p = normalize(content);
  if (!rule || m !== rule.medium || !c || !p) return NO_TAGS;
  if (!campaigns.some((entry) => entry.id === c && entry.kind === rule.campaignKind)) {
    return NO_TAGS;
  }
  if (!rule.content(p)) return NO_TAGS;
  return { landingMedium: m, landingCampaign: c, landingContent: p };
}
