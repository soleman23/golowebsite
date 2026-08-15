"use client";

/**
 * Newsletter signup. Posts to /api/subscribe, which is a mirror of
 * /api/contact — same stub-mode contract, same field-error shape.
 *
 * An address already on the list comes back as a plain success, because the
 * route deliberately won't say otherwise. Nothing here should ever tell a
 * visitor whether some address is a member.
 */

import { useId, useRef, useState } from "react";
import { subscribeSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import styles from "./NewsletterBand.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterBand({ page = "blog" }: { page?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = subscribeSchema.safeParse({ email, source: page });
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Enter your email address.";
      setError(message);
      setStatus("error");
      inputRef.current?.focus();
      // Invalid addresses never leave the browser.
      track("newsletter_error", { reason: "validation" });
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: { email?: string };
      };

      if (!res.ok) {
        setStatus("error");
        setError(
          data.fieldErrors?.email ??
            data.error ??
            "Something went wrong. Please try again.",
        );
        inputRef.current?.focus();
        track("newsletter_error", { reason: "server" });
        return;
      }

      setStatus("success");
      track("newsletter_signup", { page });
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      inputRef.current?.focus();
      track("newsletter_error", { reason: "server" });
    }
  }

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>GET IT BEFORE THE GROUP CHAT DOES</p>
          <h2 id="newsletter-heading" className={styles.title}>
            New format breakdowns, plus first crack at the app.
          </h2>
          <p className={styles.lead}>
            One email when something worth reading goes up. No drip sequence, no
            “re-engagement” campaign, and we don’t sell the list.
          </p>
        </div>

        <div className={styles.formCol}>
          {status === "success" ? (
            <p className={styles.done} role="status" aria-live="polite">
              <span className={styles.doneMark} aria-hidden="true">
                ✓
              </span>
              You&rsquo;re on the list. We&rsquo;ll email when the next one&rsquo;s up.
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor={`${uid}-email`}>
                Email address
              </label>
              <div className={styles.row}>
                <div
                  className={`${styles.field} ${error ? styles.fieldInvalid : ""}`}
                >
                  <input
                    id={`${uid}-email`}
                    ref={inputRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={styles.input}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) {
                        setError("");
                        setStatus("idle");
                      }
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${uid}-error` : undefined}
                    disabled={status === "submitting"}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Joining…" : "Join the list"}
                </button>
              </div>

              {/* Always in the flow, so an error doesn't shove the fine print. */}
              <p className={styles.error} id={`${uid}-error`} role="alert">
                {error}
              </p>
            </form>
          )}

          <p className={styles.fine}>
            No spam, no selling your address. Unsubscribe from any email.
          </p>
        </div>
      </div>
    </section>
  );
}
