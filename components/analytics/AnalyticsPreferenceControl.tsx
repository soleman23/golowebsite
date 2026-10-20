"use client";

/**
 * The persistent "Privacy choices" control on /privacy and /cookies (the
 * footer links here). Neither button is pressed until the visitor has chosen:
 * no preselection.
 */

import { useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  canSaveChoice,
  getAnalyticsChoice,
  hasGlobalPrivacyControl,
  setAnalyticsChoice,
  type AnalyticsChoice,
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
  const [saveable, setSaveable] = useState(true);
  const enabled =
    process.env.NODE_ENV === "production" && siteConfig.analyticsEnabled;

  useEffect(() => {
    const reconcile = () => {
      setChoice(getAnalyticsChoice());
      setGpc(hasGlobalPrivacyControl());
      setSaveable(canSaveChoice());
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
  }, []);

  const choose = (next: AnalyticsChoice) => {
    setAnalyticsChoice(next, measurementId);
    setChoice(next);
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
            {!saveable && choice ? ` ${copy.unsaved}` : ""}
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
