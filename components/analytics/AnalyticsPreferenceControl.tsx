"use client";

import { useEffect, useState } from "react";
import {
  getAnalyticsPreference,
  hasGlobalPrivacyControl,
  setAnalyticsPreference,
  type AnalyticsPreference,
} from "@/lib/analyticsPreference";
import styles from "./AnalyticsPreferenceControl.module.css";

export function AnalyticsPreferenceControl({
  measurementId,
}: {
  measurementId: string;
}) {
  const [preference, setPreference] = useState<AnalyticsPreference | null>(null);
  const [gpc, setGpc] = useState(false);

  useEffect(() => {
    setPreference(getAnalyticsPreference());
    setGpc(hasGlobalPrivacyControl());
  }, []);

  const choose = (next: AnalyticsPreference) => {
    setAnalyticsPreference(next, measurementId);
    setPreference(next);
  };

  const status = gpc
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
            className={`${styles.button} ${preference === "granted" && !gpc ? styles.active : ""}`}
            aria-pressed={preference === "granted" && !gpc}
            disabled={gpc}
            onClick={() => choose("granted")}
          >
            Allow analytics
          </button>
          <button
            type="button"
            className={`${styles.button} ${preference !== "granted" || gpc ? styles.active : ""}`}
            aria-pressed={preference !== "granted" || gpc}
            onClick={() => choose("denied")}
          >
            Keep analytics off
          </button>
        </div>
      </div>
    </section>
  );
}
