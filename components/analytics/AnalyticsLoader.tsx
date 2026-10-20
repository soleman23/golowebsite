"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  applyAnalyticsState,
  dropUnusedQueryParams,
  grantClarity,
  isAnalyticsAllowedForVisit,
  referrerWithoutQuery,
  savedGrantOutlivesDecline,
} from "@/lib/analyticsPreference";
import { useReportWebVitals } from "next/web-vitals";
import {
  SessionTracking,
  reportWebVital,
} from "@/components/analytics/SessionTracking";

type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

let reloadScheduled = false;

/** Reloads the page the next time this tab is hidden (once). */
function reloadWhenHidden() {
  if (reloadScheduled) return;
  reloadScheduled = true;
  const onHide = () => {
    if (document.visibilityState !== "hidden") return;
    document.removeEventListener("visibilitychange", onHide);
    window.location.reload();
  };
  document.addEventListener("visibilitychange", onHide);
}

function configure(measurementId: string) {
  if (window.__goloAnalyticsConfigured) return;
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js only processes Arguments objects; an array from `...args` is
  // skipped, so nothing is ever sent (soleman23/golowebsite#99).
  window.gtag = window.gtag ?? function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  const referrer = referrerWithoutQuery();
  window.gtag("config", measurementId, {
    // No advertising features: no Google signals join, and every hit is
    // flagged non-personalized (npa=1). The property has no Ads links either.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // The referring page's path is useful; its query string can carry anything.
    ...(referrer ? { page_referrer: referrer } : {}),
  });
  window.__goloAnalyticsConfigured = true;
}

/**
 * Clarity's own queue stub, so calls made before its tag loads aren't lost,
 * then an explicit analytics-only grant. The grant is queued on the first
 * load too: Clarity needs a consent signal for full sessions from EEA, UK and
 * Swiss visits.
 */
function configureClarity() {
  if (!window.clarity) {
    // Clarity's tag drains `clarity.q`; like gtag, it expects Arguments objects.
    const q: unknown[] = [];
    window.clarity = Object.assign(
      function clarity() {
        // eslint-disable-next-line prefer-rest-params
        q.push(arguments);
      },
      { q },
    );
  }
  grantClarity();
}

export function AnalyticsLoader({
  enabled,
  measurementId,
  clarityProjectId,
}: {
  enabled: boolean;
  measurementId: string;
  /** Empty = no Clarity. */
  clarityProjectId: string;
}) {
  // False during SSR and the first client render: no script is requested
  // until the saved choice and GPC have been read in the browser.
  const [allowed, setAllowed] = useState(false);

  /**
   * Applies the current choice. `fromElsewhere` marks a change this tab
   * didn't make: another tab's choice (storage event), a page restored from
   * the back/forward cache, or the tab becoming visible again (a GPC change).
   */
  const reconcile = useCallback((fromElsewhere = false) => {
    if (!enabled) {
      applyAnalyticsState(measurementId, false);
      setAllowed(false);
      return;
    }

    const next = isAnalyticsAllowedForVisit();
    applyAnalyticsState(measurementId, next);
    // Withdrawn after the scripts loaded. The stop signals above take effect
    // at once, but Google documents ga-disable only for pages where it's set
    // before gtag runs, and Clarity documents no full stop. A fresh page
    // without the scripts is what guarantees collection has ended.
    if (!next && window.__goloAnalyticsConfigured) {
      setAllowed(false);
      // A decline that couldn't be saved, over a grant that couldn't be
      // removed: a reload would load analytics again, so keep the stop.
      if (savedGrantOutlivesDecline()) return;
      // Withdrawn in this tab: reload now. From elsewhere, this tab may hold a
      // half-typed form; collection has already stopped, so reload the next
      // time the tab is hidden instead of wiping it.
      if (!fromElsewhere || document.visibilityState === "hidden") {
        window.location.reload();
      } else {
        reloadWhenHidden();
      }
      return;
    }
    if (next) {
      dropUnusedQueryParams();
      configure(measurementId);
      if (clarityProjectId) configureClarity();
    }
    setAllowed(next);
  }, [enabled, measurementId, clarityProjectId]);

  useEffect(() => {
    reconcile();
    const onChoice = () => reconcile();
    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_STORAGE_KEY) reconcile(true);
    };
    // Storage events aren't replayed into a page restored from the
    // back/forward cache, and GPC can change while a tab sits in the background.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reconcile(true);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") reconcile(true);
    };
    window.addEventListener(ANALYTICS_PREFERENCE_EVENT, onChoice);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(ANALYTICS_PREFERENCE_EVENT, onChoice);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [reconcile]);

  // Here rather than in SessionTracking, which remounts each time analytics
  // is turned back on; see reportWebVital.
  useReportWebVitals(reportWebVital);

  if (!allowed) return null;

  return (
    <>
      <Script
        id="golo-google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => configure(measurementId)}
      />
      {clarityProjectId && (
        <Script
          id="golo-clarity"
          src={`https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`}
          strategy="afterInteractive"
        />
      )}
      <SessionTracking />
    </>
  );
}
