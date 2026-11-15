/**
 * Shared validation schemas. Used by both client forms (for inline feedback)
 * and server route handlers (as the source of truth — never trust the client).
 *
 * zod/mini, not the chained "zod" API: the forms ship this file to the
 * browser, and mini's tree-shakable functions keep /contact and the blog
 * pages about 17 kB lighter than full zod 4. Fields without a custom message
 * fail as "Invalid input" (mini loads no locale); every field a visitor
 * types into has its own message.
 */

import * as z from "zod/mini";
// The bare topic module, not contact.ts and not the @/lib/content barrel: this
// file rides along with the home page's phone-capture form, so anything it
// imports lands in the home bundle.
import { contactTopicIds } from "@/lib/content/contactTopics";
import { campaignTags, sourceName } from "@/lib/campaigns";

// Accepts common US-style phone formats: digits, spaces, dashes, parens, +.
// Requires 10–15 digits once stripped.
export const phoneSchema = z.string().check(
  z.trim(),
  z.minLength(1, "Enter a phone number."),
  z.refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "Enter a valid phone number."),
);

/**
 * Where the visit started (lib/attribution.ts). Set by the page, not typed by
 * the visitor, and never worth losing a lead over: a value that doesn't fit
 * is dropped instead of failing the submission.
 */
const attributionFields = {
  landingPath: z.catch(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(200),
        z.startsWith("/"),
        // A path only: a crafted request can't add a query string or fragment.
        z.refine((path) => !/[?#]/.test(path)),
      ),
    ),
    undefined,
  ),
  referrerHost: z.catch(
    z.optional(
      z.string().check(z.trim(), z.toLowerCase(), z.maxLength(253), z.regex(/^[a-z0-9.-]+$/)),
    ),
    undefined,
  ),
  /**
   * The landing URL's utm_source; the same rule lib/attribution.ts applies:
   * `^[a-z0-9._-]{1,64}$` after trim and lower-case, and nothing that looks
   * personal (no "@", no run of 7+ digits). A phone-shaped utm_source is
   * dropped here even though the address-bar scrub runs after the landing is
   * read.
   */
  landingSource: z.catch(
    z.pipe(
      z.unknown(),
      z.transform((value) => sourceName(value)),
    ),
    undefined,
  ),
  /**
   * The landing URL's utm_medium, utm_campaign and utm_content. Read here as
   * plain strings; withCampaignTags below keeps them only as a combination
   * from the link dictionary (lib/campaigns.ts).
   */
  landingMedium: z.optional(z.unknown()),
  landingCampaign: z.optional(z.unknown()),
  landingContent: z.optional(z.unknown()),
};

/**
 * Replaces the three raw campaign values with the dictionary's verdict: all
 * three as given (trimmed, lower-cased) when they form a combination defined
 * for the landing's source, otherwise all three null. Never fails the parse.
 */
function withCampaignTags<
  T extends {
    landingSource?: string;
    landingMedium?: unknown;
    landingCampaign?: unknown;
    landingContent?: unknown;
  },
>({ landingMedium, landingCampaign, landingContent, ...rest }: T) {
  return {
    ...(rest as Omit<T, "landingMedium" | "landingCampaign" | "landingContent">),
    ...campaignTags(rest.landingSource, landingMedium, landingCampaign, landingContent),
  };
}

export const textLinkSchema = z.pipe(
  z.object({
    phone: phoneSchema,
    /** Which placement the number came from. Not user input — the form sets it. */
    source: z.optional(z.string().check(z.trim(), z.maxLength(40))),
    ...attributionFields,
  }),
  z.transform(withCampaignTags),
);

export const contactSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(1, "We need something to call you."),
    z.maxLength(120, "That name is longer than 120 characters."),
  ),
  email: z.string().check(
    z.trim(),
    z.minLength(1, "We can’t write back without an email."),
    z.regex(z.regexes.email, "That email doesn’t look right — check it once more."),
    z.maxLength(200, "That email is longer than 200 characters."),
  ),
  message: z.string().check(
    z.trim(),
    z.minLength(12, "Give us a few more details — at least a sentence."),
    z.maxLength(4000, "That message is too long."),
  ),
  /**
   * Optional but preferred. The form makes you pick one; the API stays
   * forgiving so a submission without a topic still lands rather than 400ing,
   * while an id that isn't one of the six is rejected outright.
   */
  topic: z.optional(
    z.enum(contactTopicIds, { error: "Pick a topic so we know where to send this." }),
  ),
});

export const subscribeSchema = z.pipe(
  z.object({
    email: z.string().check(
      z.trim(),
      z.minLength(1, "Enter your email address."),
      z.regex(z.regexes.email, "That email doesn’t look right — check it once more."),
      z.maxLength(200, "That email is longer than 200 characters."),
      // Stored as the identity of a list member, so casing shouldn't be able to
      // create two rows for the same person.
      z.toLowerCase(),
    ),
    /** Which page the signup came from. Not user input — the form sets it. */
    source: z.optional(z.string().check(z.trim(), z.maxLength(40))),
    /**
     * Honeypot: a field the form hides from people, so any value came from a
     * bot. /api/subscribe checks it before this parse (lib/subscribeGuard.ts)
     * and never stores it.
     */
    hp_note: z.optional(z.string().check(z.maxLength(200))),
    ...attributionFields,
  }),
  z.transform(withCampaignTags),
);

export type ContactInput = z.infer<typeof contactSchema>;
export type TextLinkInput = z.infer<typeof textLinkSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
