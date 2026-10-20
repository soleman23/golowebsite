import { looksPersonal } from "@/lib/analytics";

/**
 * The visitor's analytics choice, and turning the two providers on and off.
 *
 * Explicit opt-in: Google Analytics loads only after the visitor allows it.
 * With no saved choice, a declined choice, or a Global Privacy Control signal,
 * no script is requested and nothing is sent, cookieless pings included.
 * Microsoft Clarity used the same choice until October 20, 2026; it is off
 * (siteConfig.clarityProjectId is empty) and its code paths here are dormant.
 */

export type AnalyticsChoice = "granted" | "denied";

/**
 * v2 was introduced to cover GA4 and Clarity together (Clarity is now off). The older key ("golo.analytics.preference")
 * was saved before session recordings existed, so a grant under it doesn't
 * cover them and is asked again; a decline under it still holds.
 *
 * The older key is never deleted, and every decline is mirrored into it:
 * pages still open from the earlier, opt-out build read only that key and
 * treat a missing value as "allowed", so deleting it, or declining only under
 * v2, would switch analytics on in those tabs.
 */
export const ANALYTICS_STORAGE_KEY = "golo.analytics.consent.v2";
const LEGACY_STORAGE_KEY = "golo.analytics.preference";
export const ANALYTICS_PREFERENCE_EVENT = "golo:analytics-preference";

/** GA4's campaign parameters (manual tagging). */
const CAMPAIGN_PARAMS = new Set([
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
]);
/** The site's own parameters, only on the routes that read them. */
const ROUTE_PARAMS: Record<string, string[]> = {
  filter: ["/games"],
  topic: ["/blog", "/contact"],
};
/** A filter or topic id: lower-case slug. */
const SLUG = /^[a-z0-9-]{1,40}$/;

/**
 * Whether a query parameter survives when analytics loads: GA4 campaign
 * fields whose value carries nothing personal (no @, no long digit run,
 * 100 characters at most), and filter/topic slugs on their own routes.
 */
function isKeptQueryParam(key: string, value: string, pathname: string): boolean {
  if (CAMPAIGN_PARAMS.has(key)) {
    return value.length <= 100 && !looksPersonal(value);
  }
  return (ROUTE_PARAMS[key]?.includes(pathname) ?? false) && SLUG.test(value);
}

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }

  interface Window {
    __goloAnalyticsAllowed?: boolean;
    __goloAnalyticsConfigured?: boolean;
    [key: `ga-disable-${string}`]: boolean | undefined;
    /** Microsoft Clarity's command queue (session recordings, heatmaps). */
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[]; v?: string };
    __goloClarityStopped?: boolean;
  }
}

/**
 * A choice made while the browser refuses storage (blocked site data, some
 * private modes). It applies until the page is closed, then the question
 * comes back.
 */
let unsavedChoice: AnalyticsChoice | null = null;

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): boolean {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function hasGlobalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
}

/**
 * Carries a decline from the pre-Clarity key forward; ignores a grant, which
 * didn't cover session recordings. Leaves the older key in place (see above).
 * A grant here also writes "granted" to the older key, so a "denied" found
 * there next to a v2 grant was written later, by a tab on the earlier build,
 * and wins.
 */
function migrateLegacyChoice(): void {
  if (
    readStorage(LEGACY_STORAGE_KEY) === "denied" &&
    readStorage(ANALYTICS_STORAGE_KEY) !== "denied"
  ) {
    writeStorage(ANALYTICS_STORAGE_KEY, "denied");
  }
}

/**
 * Whether a storage event (from another tab) can change the choice. A
 * "denied" written to the older key by a tab still on the earlier build is a
 * decline here too, so it's copied to v2 before anyone re-reads the choice.
 * A null key means another tab cleared site storage.
 */
export function isConsentStorageEvent(event: StorageEvent): boolean {
  // Decided from what's stored now, not from event.newValue: a suspended tab
  // can deliver a stale "denied" after the visitor has already allowed again
  // (both keys "granted"), and acting on the event would undo that Allow.
  const legacyDenial =
    event.key === LEGACY_STORAGE_KEY && readStorage(LEGACY_STORAGE_KEY) === "denied";
  // A v2 change, a cleared storage or a legacy decline is newer than a choice
  // this page could only hold in memory, so the stored value wins from here
  // on. A legacy grant or removal isn't consent here, so it can't erase an
  // unsaved decline.
  if (event.key === ANALYTICS_STORAGE_KEY || event.key === null || legacyDenial) {
    unsavedChoice = null;
  }
  // Copies a current legacy decline to v2 (see migrateLegacyChoice).
  if (legacyDenial) migrateLegacyChoice();
  return (
    event.key === LEGACY_STORAGE_KEY ||
    event.key === ANALYTICS_STORAGE_KEY ||
    event.key === null
  );
}

/** Whether the last choice could only be held in memory (storage refused it). */
export function isChoiceUnsaved(): boolean {
  return unsavedChoice !== null;
}

/** The saved choice, or null when the visitor hasn't chosen yet. */
export function getAnalyticsChoice(): AnalyticsChoice | null {
  if (typeof window === "undefined") return null;
  if (unsavedChoice) return unsavedChoice;
  migrateLegacyChoice();
  const value = readStorage(ANALYTICS_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

/**
 * True when a reload would bring analytics back: a decline is held only in
 * memory and a saved grant couldn't be removed. AnalyticsLoader then keeps
 * the in-page stop instead of reloading.
 */
export function savedGrantOutlivesDecline(): boolean {
  return unsavedChoice === "denied" && readStorage(ANALYTICS_STORAGE_KEY) === "granted";
}

/** Only an explicit grant, and never while the browser sends GPC. */
export function isAnalyticsAllowedForVisit(): boolean {
  if (typeof window === "undefined") return false;
  return !hasGlobalPrivacyControl() && getAnalyticsChoice() === "granted";
}

function expireCookie(name: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domainPart}`;
}

/** First-party cookies set by Google Analytics (_ga, _ga_*) and Clarity (_clck, _clsk). */
function isAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name.startsWith("_ga_") || name === "_clck" || name === "_clsk";
}

/**
 * Expires the first-party analytics cookies this page can see. Cookies Clarity
 * sets on Microsoft's own domains are out of reach here; only the browser's
 * site-data controls can remove those.
 */
export function clearAnalyticsCookies(
  which: (name: string) => boolean = isAnalyticsCookie,
): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter(which);

  const host = window.location.hostname;
  const parent = host.split(".").length > 1 ? `.${host.replace(/^www\./, "")}` : undefined;
  for (const name of names) {
    expireCookie(name);
    expireCookie(name, host);
    if (parent && parent !== host) expireCookie(name, parent);
  }
}

/** Clarity's first-party cookies, left over from when the site used Clarity. */
export function clearClarityCookies(): void {
  clearAnalyticsCookies((name) => name === "_clck" || name === "_clsk");
}

/**
 * Removes query parameters the site doesn't use from the address bar, and
 * masks a path segment or drops a fragment that looks personal, so a landing
 * URL carrying something personal (an email, a token from another site)
 * never reaches GA's page_location or a Clarity recording. Runs on every
 * page load, whatever the choice, so the history entry itself is clean: a
 * visitor who allows analytics later and comes Back to it can't expose it.
 * Runs again before either script loads. Lead attribution has already read
 * the landing URL by then (LandingCapture mounts first) and keeps only
 * utm_source anyway; the contact topic and filters are read earlier too.
 */
export function dropUnusedQueryParams(): void {
  const url = new URL(window.location.href);
  let changed = false;
  for (const [key, value] of [...url.searchParams.entries()]) {
    if (!isKeptQueryParam(key, value, url.pathname)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  // No real route has an @ or a long digit run in its path, so a path
  // segment that looks personal can only be a 404; masking it keeps the 404.
  const segments = url.pathname.split("/");
  const masked = segments.map((segment) =>
    looksPersonal(safeDecode(segment)) ? "redacted" : segment,
  );
  if (masked.some((segment, i) => segment !== segments[i])) {
    url.pathname = masked.join("/");
    changed = true;
  }
  // Fragments are only in-page anchors here; drop one that looks personal.
  if (url.hash && looksPersonal(safeDecode(url.hash))) {
    url.hash = "";
    changed = true;
  }
  // null state, not history.state: Next's patched replaceState skips its own
  // URL sync when handed its internal state, and the router would later put
  // the stripped parameters back.
  if (changed) window.history.replaceState(null, "", url);
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * The referring page for GA's page_referrer: without its query string or
 * fragment, and cut back to its origin when the path itself looks personal
 * (an email or a long number in it).
 */
export function referrerWithoutQuery(): string {
  if (!document.referrer) return "";
  try {
    const ref = new URL(document.referrer);
    const path = safeDecode(ref.pathname);
    return looksPersonal(path) ? ref.origin : `${ref.origin}${ref.pathname}`;
  } catch {
    return "";
  }
}

export function applyAnalyticsState(
  measurementId: string,
  allowed: boolean,
): void {
  if (typeof window === "undefined") return;
  window.__goloAnalyticsAllowed = allowed;
  // Google's documented switch: once true, gtag.js sends nothing more for
  // this measurement ID on this page, enhanced measurement included.
  window[`ga-disable-${measurementId}`] = !allowed;
  if (!allowed) {
    stopClarity();
    clearAnalyticsCookies();
  }
}

/**
 * Analytics storage granted, ad storage denied. The legacy
 * `clarity("consent")` call would grant both. Denying ad storage is a signal
 * to Microsoft, not a guarantee about its use of the data; the privacy policy
 * describes what Microsoft's terms allow.
 */
export function grantClarity(): void {
  if (!window.clarity) return;
  // Stopped earlier on this page without a reload (a decline storage
  // couldn't save): start it again before granting.
  if (window.__goloClarityStopped) {
    window.clarity("start");
    window.__goloClarityStopped = false;
  }
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

/**
 * Best-effort stop for a Clarity already running on this page. Microsoft
 * documents no full stop: a denied `consentv2` keeps recording without
 * cookies, `consent, false` erases cookies, and `stop` exists in Clarity's
 * script but not in its docs. So AnalyticsLoader also reloads the page,
 * which is the one certain way to end both trackers.
 */
function stopClarity(): void {
  if (!window.clarity || window.__goloClarityStopped) return;
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
  window.clarity("consent", false);
  window.clarity("stop");
  window.__goloClarityStopped = true;
}

/**
 * Saves the choice (or holds it for this page if storage is blocked) and
 * applies it at once. AnalyticsLoader hears the event and, if either script
 * had loaded, reloads the page; see its reconcile.
 */
export function setAnalyticsChoice(
  choice: AnalyticsChoice,
  measurementId: string,
): boolean {
  migrateLegacyChoice();
  // Saved means the consent key itself reads back the new value. A separate
  // probe key can fail on a full quota while overwriting this one succeeds.
  writeStorage(ANALYTICS_STORAGE_KEY, choice);
  if (readStorage(ANALYTICS_STORAGE_KEY) === choice) {
    unsavedChoice = null;
  } else {
    unsavedChoice = choice;
    // An older saved grant must not outlive a decline that couldn't be saved.
    if (choice === "denied") writeStorage(ANALYTICS_STORAGE_KEY, null);
  }
  // Mirror the choice into the older key (see the key and migrateLegacyChoice).
  // "granted" there changes nothing for the earlier, opt-out build.
  writeStorage(LEGACY_STORAGE_KEY, choice);
  const allowed = choice === "granted" && !hasGlobalPrivacyControl();
  applyAnalyticsState(measurementId, allowed);
  window.dispatchEvent(
    new CustomEvent<AnalyticsChoice>(ANALYTICS_PREFERENCE_EVENT, {
      detail: choice,
    }),
  );
  return allowed;
}
