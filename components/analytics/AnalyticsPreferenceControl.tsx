"use client";

/**
 * The persistent "Privacy choices" control on /privacy and /cookies (the
 * footer links here). Neither button is pressed until the visitor has chosen:
 * no preselection.
 */

import { useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  getAnalyticsChoice,
  hasGlobalPrivacyControl,
  isChoiceUnsaved,
  setAnalyticsChoice,
  type AnalyticsChoice,
  isConsentStorageEvent,
} from "@/lib/analyticsPreference";
// Straight from the module, not the barrel: this is a client component.
import { analyticsChoiceControl as copy } from "@/lib/content/analyticsConsent";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./AnalyticsPreferenceControl.module.css";

export function AnalyticsPreferenceControl({
  measurementId,
}: {
  measurementId: string;
}) {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [gpc, setGpc] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const enabled =
    process.env.NODE_ENV === "production" && siteConfig.analyticsEnabled;

  useEffect(() => {
    const reconcile = () => {
      setChoice(getAnalyticsChoice());
      setGpc(hasGlobalPrivacyControl());
      setUnsaved(isChoiceUnsaved());
    };
    // Includes a cleared storage and a decline from a tab on the earlier build.
    const onStorage = (event: StorageEvent) => {
      if (isConsentStorageEvent(event)) reconcile();
    };
    // Storage events aren't replayed into a page restored from the
    // back/forward cache, and GPC can change while a tab is in the background.
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
  }, []);

  const choose = (next: AnalyticsChoice) => {
    setAnalyticsChoice(next, measurementId);
    setChoice(next);
    setUnsaved(isChoiceUnsaved());
  };

  const status = !enabled
    ? copy.status.siteOff
    : gpc
      ? copy.status.gpc
      : choice === "granted"
        ? copy.status.granted
        : choice === "denied"
          ? copy.status.denied
          : copy.status.none;

  return (
    <section
      id="analytics-choices"
      className={styles.section}
      aria-labelledby="analytics-choice-heading"
    >
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>{copy.kicker}</p>
          <h2 id="analytics-choice-heading">{copy.title}</h2>
          <p className={styles.copy} role="status">
            {status}
            {unsaved && choice ? ` ${copy.unsaved}` : ""}
          </p>
          {choice === "granted" && !gpc ? (
            <p className={styles.note}>{copy.withdrawNote}</p>
          ) : null}
        </div>
        <div className={styles.actions} role="group" aria-label={copy.groupLabel}>
          <button
            type="button"
            className={`${styles.button} ${choice === "granted" && !gpc ? styles.active : ""}`}
            aria-pressed={choice === "granted" && !gpc}
            disabled={gpc}
            onClick={() => choose("granted")}
          >
            {copy.allow}
          </button>
          <button
            type="button"
            className={`${styles.button} ${choice === "denied" ? styles.active : ""}`}
            aria-pressed={choice === "denied"}
            onClick={() => choose("denied")}
          >
            {copy.decline}
          </button>
        </div>
      </div>
    </section>
  );
}
