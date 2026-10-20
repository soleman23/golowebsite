"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  applyAnalyticsState,
  grantClarity,
  isAnalyticsAllowedForVisit,
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
  window.gtag("config", measurementId);
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
  // False during SSR and the first client render guarantees a denied visitor
  // never initiates a Google request before local storage and GPC are checked.
  const [allowed, setAllowed] = useState(false);

  const reconcile = useCallback(() => {
    if (!enabled) {
      applyAnalyticsState(measurementId, false);
      setAllowed(false);
      return;
    }

    const next = isAnalyticsAllowedForVisit();
    applyAnalyticsState(measurementId, next);
    if (next) {
      configure(measurementId);
      if (clarityProjectId) configureClarity();
    }
    setAllowed(next);
  }, [enabled, measurementId, clarityProjectId]);

  useEffect(() => {
    reconcile();
    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_STORAGE_KEY) reconcile();
    };
    window.addEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
      window.removeEventListener("storage", onStorage);
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
