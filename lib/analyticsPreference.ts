/**
 * The visitor's analytics choice, and turning the two providers on and off.
 *
 * Explicit opt-in: Google Analytics and Microsoft Clarity (session recordings
 * and heatmaps) load only after the visitor allows them, as one choice. With
 * no saved choice, a declined choice, or a Global Privacy Control signal,
 * neither script is requested and nothing is sent, cookieless pings included.
 */

export type AnalyticsChoice = "granted" | "denied";

/**
 * v2 covers GA4 and Clarity together. The older key ("golo.analytics.preference")
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

/**
 * Query parameters kept when analytics loads: the site's own filters and
 * every GA4 campaign parameter (utm_*, including utm_id and
 * utm_source_platform). Every other one is dropped.
 */
const KEPT_QUERY_PARAMS = new Set(["filter", "topic"]);
function isKeptQueryParam(key: string): boolean {
  return KEPT_QUERY_PARAMS.has(key) || key.startsWith("utm_");
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
 */
function migrateLegacyChoice(): void {
  if (
    readStorage(LEGACY_STORAGE_KEY) === "denied" &&
    readStorage(ANALYTICS_STORAGE_KEY) === null
  ) {
    writeStorage(ANALYTICS_STORAGE_KEY, "denied");
  }
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
export function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter(isAnalyticsCookie);

  const host = window.location.hostname;
  const parent = host.split(".").length > 1 ? `.${host.replace(/^www\./, "")}` : undefined;
  for (const name of names) {
    expireCookie(name);
    expireCookie(name, host);
    if (parent && parent !== host) expireCookie(name, parent);
  }
}

/**
 * Removes query parameters the site doesn't use from the address bar, so a
 * landing URL carrying something personal (an email, a token from another
 * site) never reaches GA's page_location or a Clarity recording. Runs before
 * either script loads. Lead attribution has already read the landing URL by
 * then (LandingCapture mounts first) and keeps only utm_source anyway.
 */
export function dropUnusedQueryParams(): void {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of [...url.searchParams.keys()]) {
    if (!isKeptQueryParam(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  // null state, not history.state: Next's patched replaceState skips its own
  // URL sync when handed its internal state, and the router would later put
  // the stripped parameters back.
  if (changed) window.history.replaceState(null, "", url);
}

/** The referring page without its query string or fragment, for GA's page_referrer. */
export function referrerWithoutQuery(): string {
  if (!document.referrer) return "";
  try {
    const ref = new URL(document.referrer);
    return `${ref.origin}${ref.pathname}`;
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
  // Mirror a decline for tabs still running the earlier build (see the key).
  if (choice === "denied") writeStorage(LEGACY_STORAGE_KEY, "denied");
  const allowed = choice === "granted" && !hasGlobalPrivacyControl();
  applyAnalyticsState(measurementId, allowed);
  window.dispatchEvent(
    new CustomEvent<AnalyticsChoice>(ANALYTICS_PREFERENCE_EVENT, {
      detail: choice,
    }),
  );
  return allowed;
}
