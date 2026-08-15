"use client";

/**
 * "text me the link" capture. Posts the phone number to /api/text-link.
 * Handles idle / submitting / success / error states. On success it shows the
 * lime confirmation for ~3.2s (per the design), then resets to idle.
 *
 * `id` exists because this renders twice on the home page while the app is
 * pre-launch — once in the hero, once in the closing band. Two copies sharing
 * one element id would break both the label association and aria-describedby,
 * so each instance names itself.
 */

import { useEffect, useRef, useState } from "react";
import { phoneSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import styles from "./TextMeLink.module.css";

type Status = "idle" | "submitting" | "success" | "error";

type TextMeLinkProps = {
  /** Unique per instance on a page. */
  id?: string;
  /** Label above the field. Reads "or text me the link:" beside store buttons. */
  prompt?: string;
  /** Names the placement in the generate_lead param. */
  placement?: string;
  align?: "start" | "center";
};

export function TextMeLink({
  id = "hero-phone",
  prompt = "or text me the link:",
  placement = "hero",
  align = "start",
}: TextMeLinkProps = {}) {
  const statusId = `${id}-status`;
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
      track("lead_form_error", {
        form: "text_me_link",
        stage: "validation",
        placement,
      });
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
        track("lead_form_error", {
          form: "text_me_link",
          stage: "server",
          placement,
        });
        return;
      }

      setStatus("success");
      setMessage("Link sent — check your messages");
      track("generate_lead", { method: "text_me_link", placement });
      setPhone("");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3200);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
      track("lead_form_error", {
        form: "text_me_link",
        stage: "network",
        placement,
      });
    }
  }

  return (
    <form
      className={`${styles.wrap} ${align === "center" ? styles.center : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor={id} className={styles.prompt}>
        {prompt}
      </label>
      <div className={styles.field}>
        <input
          id={id}
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
          aria-describedby={statusId}
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
        id={statusId}
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
