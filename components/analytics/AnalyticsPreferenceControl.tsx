"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCE_EVENT,
  ANALYTICS_STORAGE_KEY,
  getAnalyticsPreference,
  hasGlobalPrivacyControl,
  setAnalyticsPreference,
  type AnalyticsPreference,
} from "@/lib/analyticsPreference";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./AnalyticsPreferenceControl.module.css";

export function AnalyticsPreferenceControl({
  measurementId,
}: {
  measurementId: string;
}) {
  const [preference, setPreference] = useState<AnalyticsPreference | null>(null);
  const [gpc, setGpc] = useState(false);
  const enabled =
    process.env.NODE_ENV === "production" && siteConfig.analyticsEnabled;

  useEffect(() => {
    const reconcile = () => {
      setPreference(getAnalyticsPreference());
      setGpc(hasGlobalPrivacyControl());
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

  const choose = (next: AnalyticsPreference) => {
    setAnalyticsPreference(next, measurementId);
    setPreference(next);
  };

  const status = !enabled
    ? "Analytics is currently disabled on this site. A saved preference cannot turn it on."
    : gpc
    ? "Global Privacy Control is on. It overrides saved consent and keeps analytics off for this visit."
    : preference === "denied"
      ? "Analytics is off in this browser."
      : preference === "granted"
        ? "Analytics is on in this browser."
        : "Analytics is off until you allow it.";

  return (
    <section
      id="analytics-choices"
      className={styles.section}
      aria-labelledby="analytics-choice-heading"
    >
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>COOKIE PREFERENCE</p>
          <h2 id="analytics-choice-heading">Choose whether analytics loads.</h2>
          <p className={styles.copy}>{status}</p>
        </div>
        <div className={styles.actions} role="group" aria-label="Analytics preference">
          <button
            type="button"
            className={`${styles.button} ${enabled && preference === "granted" && !gpc ? styles.active : ""}`}
            aria-pressed={enabled && preference === "granted" && !gpc}
            disabled={!enabled || gpc}
            onClick={() => choose("granted")}
          >
            Allow analytics
          </button>
          <button
            type="button"
            className={`${styles.button} ${!enabled || preference !== "granted" || gpc ? styles.active : ""}`}
            aria-pressed={!enabled || preference !== "granted" || gpc}
            onClick={() => choose("denied")}
          >
            Keep analytics off
          </button>
        </div>
      </div>
    </section>
  );
}
