"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  applyAnalyticsState,
  isAnalyticsAllowedForVisit,
} from "@/lib/analyticsPreference";

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

export function AnalyticsLoader({
  enabled,
  measurementId,
}: {
  enabled: boolean;
  measurementId: string;
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
    if (next) configure(measurementId);
    setAllowed(next);
  }, [enabled, measurementId]);

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

  if (!allowed) return null;

  return (
    <Script
      id="golo-google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onLoad={() => configure(measurementId)}
    />
  );
}
