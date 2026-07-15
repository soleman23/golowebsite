"use client";

/**
 * "or text me the link" hero control. Posts the phone number to /api/text-link.
 * Handles idle / submitting / success / error states. On success it shows the
 * lime confirmation for ~3.2s (per the design), then resets to idle.
 */

import { useEffect, useRef, useState } from "react";
import { phoneSchema } from "@/lib/validation";
import styles from "./TextMeLink.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function TextMeLink() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    // Client-side check first for instant feedback; server re-validates.
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid phone number.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/text-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Link sent — check your messages");
      setPhone("");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3200);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit} noValidate>
      <label htmlFor="hero-phone" className={styles.prompt}>
        or text me the link:
      </label>
      <div className={styles.field}>
        <input
          id="hero-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 012-3456"
          className={styles.input}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage("");
            }
          }}
          aria-invalid={status === "error"}
          aria-describedby="hero-phone-status"
          disabled={status === "submitting"}
        />
        <button
          type="submit"
          className={styles.send}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
      </div>

      <span
        id="hero-phone-status"
        role="status"
        aria-live="polite"
        className={`${styles.status} ${
          status === "success"
            ? styles.success
            : status === "error"
              ? styles.error
              : ""
        }`}
      >
        {message}
      </span>
    </form>
  );
}
