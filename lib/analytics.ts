/**
 * Thin wrapper over Google Analytics (gtag).
 *
 * Safe to call from anywhere: every call no-ops when gtag isn't on the page,
 * which covers dev builds (GA is production-only), ad blockers, and the brief
 * window before next/script finishes loading gtag.js. Nothing here should ever
 * throw or block a user action.
 *
 * NEVER pass personally identifiable information (names, emails, phone
 * numbers) as event params — it violates Google's terms and can get the
 * property purged. Send categorical values only. track() also masks
 * email- and number-shaped text in every string param (redactForAnalytics),
 * but that's a backstop, not permission.
 */

type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    __goloAnalyticsAllowed?: boolean;
  }
}

/**
 * Events this site sends. Keeping them in a union stops typo'd event names
 * from silently creating junk dimensions in GA.
 *
 * - generate_lead      a phone number was captured (GA4 recommended event)
 * - lead_form_error    a phone submission failed (validation or server)
 * - contact_submit     the contact form was sent successfully
 * - store_button_click an App Store / Google Play button was clicked
 * - faq_open           an FAQ / quick-answer disclosure was opened (not closed)
 * - game_filter        a chip on /games was selected
 * - blog_filter        a chip on /blog was selected
 * - newsletter_signup  a newsletter address was accepted
 * - newsletter_error   a newsletter signup failed (validation or server)
 * - share_click        a share control on a blog post, or a glossary term's
 *                      copy-link button (channel "copy", term_id), was clicked
 * - cta_click          a hero or closing CTA button was clicked
 *
 * The glossary (/glossary, #165). Params come from closed sets only: a
 * published term id, a category id, a bucket. Never the search text.
 * - glossary_search    a search settled (once per changed query, after typing
 *                      stops): category, result_bucket (0 / 1 / 2-5 / 6+),
 *                      match_type (exact / alias / partial / none)
 * - glossary_filter    the reader chose a category (chip, Clear): category
 * - glossary_term_open a term was opened: a search result, a related-term
 *                      link or a deep link, once per term per page load:
 *                      term_id, category
 * - glossary_cta_click a term's guide, post or product link was followed:
 *                      term_id, destination_type (guide / post / page)
 *
 * Sent by components/analytics/SessionTracking.tsx for every page:
 * - scroll_depth       the reader passed 25, 50, 75 or 90% of a page
 * - link_click         an internal link was clicked (nav, footer or body)
 * - contact_click      a mailto: or tel: link was clicked
 * - page_not_found     the 404 page was shown
 * - web_vitals         one page-speed reading: the three Core Web Vitals (LCP,
 *                      INP, CLS) or one of two supporting metrics (FCP, TTFB)
 * - exception          an uncaught script error, first 100 characters (GA4 recommended event)
 */
export type AnalyticsEvent =
  | "generate_lead"
  | "lead_form_error"
  | "contact_submit"
  | "store_button_click"
  | "faq_open"
  | "game_filter"
  | "blog_filter"
  | "newsletter_signup"
  | "newsletter_error"
  | "share_click"
  | "cta_click"
  | "glossary_search"
  | "glossary_filter"
  | "glossary_term_open"
  | "glossary_cta_click"
  | "scroll_depth"
  | "link_click"
  | "contact_click"
  | "page_not_found"
  | "web_vitals"
  | "exception";

/** GA4 drops, rather than cuts, event parameter values longer than this. */
export const GA_VALUE_MAX = 100;

const EMAIL = /[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}/gi;
/** Seven or more digits, allowing the separators a phone or card number uses. */
const LONG_NUMBER = /\+?\d(?:[\s().-]*\d){6,}/g;

/**
 * Whether a value looks like it carries personal data: anything with an @,
 * or a phone-, card- or account-length run of digits. Stricter than the
 * redaction below (any @, not only a full address), for URL values that are
 * dropped whole rather than masked.
 */
export function looksPersonal(value: string): boolean {
  return value.includes("@") || /\+?\d(?:[\s().-]*\d){6,}/.test(value);
}

/**
 * Last line of defence for free text (link labels, error messages, paths):
 * masks anything shaped like an email address or a phone, card or account
 * number, then cuts to GA4's length limit. Categorical values pass through
 * unchanged.
 */
export function redactForAnalytics(value: string): string {
  return value
    .replace(EMAIL, "[email]")
    .replace(LONG_NUMBER, "[number]")
    .slice(0, GA_VALUE_MAX);
}

export function track(
  event: AnalyticsEvent,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  if (window.__goloAnalyticsAllowed !== true) return;
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    safe[key] = typeof value === "string" ? redactForAnalytics(value) : value;
  }
  window.gtag?.("event", event, safe);
}
