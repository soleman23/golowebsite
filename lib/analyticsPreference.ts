export type AnalyticsPreference = "granted" | "denied";

export const ANALYTICS_STORAGE_KEY = "golo.analytics.preference";
export const ANALYTICS_PREFERENCE_EVENT = "golo:analytics-preference";

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }

  interface Window {
    __goloAnalyticsAllowed?: boolean;
    __goloAnalyticsConfigured?: boolean;
    [key: `ga-disable-${string}`]: boolean | undefined;
    /** Microsoft Clarity's command queue (session recordings, heatmaps). */
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    __goloClarityStopped?: boolean;
  }
}

export function hasGlobalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
}

export function getAnalyticsPreference(): AnalyticsPreference | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

/**
 * Opt-out: analytics is on unless the visitor turned it off here or the
 * browser sends Global Privacy Control.
 */
export function isAnalyticsAllowedForVisit(): boolean {
  if (typeof window === "undefined") return false;
  return !hasGlobalPrivacyControl() && getAnalyticsPreference() !== "denied";
}

function expireCookie(name: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domainPart}`;
}

/** First-party cookies set by Google Analytics (_ga, _ga_*) and Clarity (_clck, _clsk). */
function isAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name.startsWith("_ga_") || name === "_clck" || name === "_clsk";
}

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

export function applyAnalyticsState(
  measurementId: string,
  allowed: boolean,
): void {
  if (typeof window === "undefined") return;
  window.__goloAnalyticsAllowed = allowed;
  window[`ga-disable-${measurementId}`] = !allowed;
  if (!allowed) {
    revokeClarity();
    clearAnalyticsCookies();
  }
}

/**
 * Analytics storage only. Ad storage stays denied: a granted ad_Storage lets
 * Microsoft share Clarity data with Microsoft Ads, which the privacy policy
 * rules out. The legacy `clarity("consent")` call would grant both.
 */
export function grantClarity(): void {
  if (!window.clarity) return;
  if (window.__goloClarityStopped) {
    window.clarity("start");
    window.__goloClarityStopped = false;
  }
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

/**
 * Denies both storage types, erases Clarity's cookies, and stops it: without
 * the stop, a denied Clarity keeps recording this page in no-cookie mode.
 */
function revokeClarity(): void {
  if (!window.clarity || window.__goloClarityStopped) return;
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
  window.clarity("consent", false);
  window.clarity("stop");
  window.__goloClarityStopped = true;
}

export function setAnalyticsPreference(
  preference: AnalyticsPreference,
  measurementId: string,
): boolean {
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, preference);
  const allowed = preference === "granted" && !hasGlobalPrivacyControl();
  applyAnalyticsState(measurementId, allowed);
  window.dispatchEvent(
    new CustomEvent<AnalyticsPreference>(ANALYTICS_PREFERENCE_EVENT, {
      detail: preference,
    }),
  );
  return allowed;
}
