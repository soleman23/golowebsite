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
    // key === null: another tab cleared site storage, choice included.
    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_STORAGE_KEY || event.key === null) reconcile();
    };
    // Missed storage events (back/forward cache) and GPC changes.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reconcile();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") reconcile();
    };
    reconcile();
    window.addEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(ANALYTICS_PREFERENCE_EVENT, reconcile);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
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

  // The focused button unmounts with the bar; hand focus to the next stop in
  // the tab order (the nav's first link) rather than dropping it on <body>.
  const choose = (choice: "granted" | "denied") => {
    const hadFocus = bar.current?.contains(document.activeElement) ?? false;
    setAnalyticsChoice(choice, measurementId);
    if (hadFocus) {
      document
        .querySelector<HTMLElement>("[data-site-nav] a[href]")
        ?.focus({ preventScroll: true });
    }
  };

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
            onClick={() => choose("granted")}
          >
            {copy.allow}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => choose("denied")}
          >
            {copy.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
