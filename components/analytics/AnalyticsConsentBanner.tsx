"use client";

/**
 * The first-visit analytics prompt. Shown only when analytics is enabled for
 * the site, the visitor hasn't chosen, and the browser doesn't send Global
 * Privacy Control (GPC already answers the question: both tools stay off).
 *
 * Non-modal: the page stays usable behind it, nothing is preselected, and
 * Allow and Decline carry equal weight. Rendered nothing during SSR and the
 * first client render, so it never flashes for someone who already chose.
 * The page gets bottom padding the height of the bar, so the footer is never
 * stuck underneath it.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  getAnalyticsChoice,
  hasGlobalPrivacyControl,
  setAnalyticsChoice,
} from "@/lib/analyticsPreference";
// Straight from the module, not the barrel: this is a client component.
import {
  analyticsConsentBanner as copy,
  analyticsDisclosureHref,
} from "@/lib/content/analyticsConsent";
import styles from "./AnalyticsConsentBanner.module.css";

const HEIGHT_VAR = "--consent-banner-height";

export function AnalyticsConsentBanner({
  enabled,
  measurementId,
}: {
  enabled: boolean;
  measurementId: string;
}) {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const reconcile = () => {
      setOpen(getAnalyticsChoice() === null && !hasGlobalPrivacyControl());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_STORAGE_KEY) reconcile();
    };
    reconcile();
    window.addEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
      window.removeEventListener("storage", onStorage);
    };
  }, [enabled]);

  // Reserve the bar's height at the bottom of the page while it's open.
  useEffect(() => {
    const root = document.documentElement;
    if (!open || !bar.current) {
      root.style.removeProperty(HEIGHT_VAR);
      return;
    }
    const node = bar.current;
    const sync = () => root.style.setProperty(HEIGHT_VAR, `${node.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_VAR);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={bar}
      className={styles.bar}
      role="region"
      aria-label={copy.label}
    >
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <p className={styles.title}>{copy.title}</p>
          <p className={styles.body}>
            {copy.body}{" "}
            <Link href={analyticsDisclosureHref} className={styles.link}>
              {copy.details}
            </Link>
          </p>
          <p className={styles.later}>{copy.later}</p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setAnalyticsChoice("granted", measurementId)}
          >
            {copy.allow}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => setAnalyticsChoice("denied", measurementId)}
          >
            {copy.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
