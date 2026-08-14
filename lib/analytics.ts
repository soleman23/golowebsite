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
 * property purged. Send categorical values only.
 */

type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
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
 */
export type AnalyticsEvent =
  | "generate_lead"
  | "lead_form_error"
  | "contact_submit"
  | "store_button_click";

export function track(
  event: AnalyticsEvent,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
