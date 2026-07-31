"use client";

/**
 * Contact form. Posts to /api/contact. Full state coverage: per-field
 * validation errors, submitting (disabled) state, a success confirmation that
 * replaces the form, and a top-level error message. Server re-validates.
 */

import { useState } from "react";
import { contactSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [topError, setTopError] = useState("");

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setStatus("submitting");
    setTopError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setStatus("error");
        setTopError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      track("contact_submit", { form: "contact" });
    } catch {
      setStatus("error");
      setTopError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.successCard} role="status" aria-live="polite">
        <div className={styles.successMark} aria-hidden="true">
          ✓
        </div>
        <h2 className={styles.successTitle}>Message sent</h2>
        <p className={styles.successBody}>
          Thanks for reaching out — we&rsquo;ll get back to you at the email you
          provided.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {topError ? (
        <p className={styles.topError} role="alert">
          {topError}
        </p>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          className={styles.input}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          disabled={status === "submitting"}
        />
        {errors.name ? (
          <span id="contact-name-error" className={styles.fieldError}>
            {errors.name}
          </span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          className={styles.input}
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          disabled={status === "submitting"}
        />
        {errors.email ? (
          <span id="contact-email-error" className={styles.fieldError}>
            {errors.email}
          </span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className={styles.textarea}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          disabled={status === "submitting"}
        />
        {errors.message ? (
          <span id="contact-message-error" className={styles.fieldError}>
            {errors.message}
          </span>
        ) : null}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
