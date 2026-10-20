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

  // Opt-out: on unless this browser chose "denied" or sends GPC.
  const on = enabled && preference !== "denied" && !gpc;

  const status = !enabled
    ? "Analytics is currently disabled on this site. A saved preference cannot turn it on."
    : gpc
    ? "Global Privacy Control is on. It keeps analytics off for this visit, whatever is saved here."
    : on
      ? "Analytics is on in this browser. You can turn it off here at any time."
      : "Analytics is off in this browser.";

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
            className={`${styles.button} ${on ? styles.active : ""}`}
            aria-pressed={on}
            disabled={!enabled || gpc}
            onClick={() => choose("granted")}
          >
            Turn analytics on
          </button>
          <button
            type="button"
            className={`${styles.button} ${!on ? styles.active : ""}`}
            aria-pressed={!on}
            onClick={() => choose("denied")}
          >
            Turn analytics off
          </button>
        </div>
      </div>
    </section>
  );
}
