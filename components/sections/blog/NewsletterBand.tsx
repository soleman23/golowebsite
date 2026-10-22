"use client";

/**
 * Newsletter signup. Posts to /api/subscribe, which is a mirror of
 * /api/contact — same stub-mode contract, same field-error shape.
 *
 * An address already on the list comes back as a plain success, because the
 * route deliberately won't say otherwise. Nothing here should ever tell a
 * visitor whether some address is a member.
 *
 * The hidden "hp_note" input is a honeypot (lib/subscribeGuard.ts): kept out
 * of sight, the tab order and the accessibility tree, so only a bot fills it,
 * and the route quietly drops any submission that does.
 */

import { useId, useRef, useState } from "react";
import { subscribeSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import { landingAttribution } from "@/lib/attribution";
import styles from "./NewsletterBand.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterBand({ page = "blog" }: { page?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // Set from the response: true while the Reach sync is on, when a sign-up
  // only counts once its confirmation email is clicked.
  const [confirmByEmail, setConfirmByEmail] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = subscribeSchema.safeParse({
      email,
      source: page,
      hp_note: honeypotRef.current?.value ?? "",
      ...landingAttribution(),
    });
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
        confirmByEmail?: boolean;
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

      setConfirmByEmail(data.confirmByEmail === true);
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

        {/* Masked in Clarity recordings: the form, its errors and the confirmation. */}
        <div className={styles.formCol} data-clarity-mask="true">
          {status === "success" ? (
            <p className={styles.done} role="status" aria-live="polite">
              <span className={styles.doneMark} aria-hidden="true">
                ✓
              </span>
              {confirmByEmail
                ? "Almost there. Check your inbox: we\u2019ll send you a link to confirm, and you\u2019re on the list once you click it."
                : "You\u2019re on the list. We\u2019ll email when the next one\u2019s up."}
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

              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor={`${uid}-hp`}>Leave this field empty</label>
                {/* A meaningless name plus the 1Password and LastPass opt-outs,
                    so no autofill puts a real visitor's details in here. */}
                <input
                  id={`${uid}-hp`}
                  ref={honeypotRef}
                  type="text"
                  name="hp_note"
                  tabIndex={-1}
                  autoComplete="off"
                  data-1p-ignore
                  data-lpignore="true"
                  defaultValue=""
                />
              </div>

              {/* Always in the flow, so an error doesn't shove the fine print. */}
              <p className={styles.error} id={`${uid}-error`} role="alert">
                {error}
              </p>
            </form>
          )}

          <p className={styles.fine}>
            No spam, no selling your address. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
