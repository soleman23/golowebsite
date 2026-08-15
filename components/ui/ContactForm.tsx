"use client";

/**
 * Contact form. Posts to /api/contact — the pipeline behind it (Prisma +
 * Resend, stub mode when RESEND_API_KEY is absent) is unchanged; this is the
 * redesigned surface plus the topic field.
 *
 * Topic is controlled from outside so the route cards above the form can
 * preselect it. Everything else is local state: per-field errors, a submitting
 * lock, a success card that replaces the form, and a top-level error.
 *
 * The server re-validates with the same schema — the client copy is only here
 * so people get told before a round trip.
 */

import { useId, useRef, useState } from "react";
import { contactSchema } from "@/lib/validation";
import {
  contactTopics,
  type ContactTopicId,
} from "@/lib/content/contactTopics";
import { siteConfig } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";
type FieldKey = "name" | "email" | "message" | "topic";
type FieldErrors = Partial<Record<FieldKey, string>>;

type ContactFormProps = {
  topic: ContactTopicId | "";
  onTopicChange: (topic: ContactTopicId) => void;
};

export function ContactForm({ topic, onTopicChange }: ContactFormProps) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [topError, setTopError] = useState("");

  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const topicRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const fieldId = (key: string) => `${uid}-${key}`;
  const errorId = (key: string) => `${uid}-${key}-error`;

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function pickTopic(id: ContactTopicId) {
    onTopicChange(id);
    if (errors.topic) setErrors((e) => ({ ...e, topic: undefined }));
  }

  /**
   * Roving-tabindex arrow keys, so the six tiles behave like the radio group
   * they're marked up as: one tab stop, arrows move and select.
   */
  function onTopicKeyDown(e: React.KeyboardEvent, index: number) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const last = contactTopics.length - 1;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;

    const target = contactTopics[next];
    if (!target) return;
    pickTopic(target.id);
    topicRefs.current[target.id]?.focus();
  }

  /** Moves focus to the first field with an error, in visual order. */
  function focusFirstError(next: FieldErrors) {
    if (next.topic) {
      topicRefs.current[topic || contactTopics[0].id]?.focus();
      return;
    }
    if (next.name) return nameRef.current?.focus();
    if (next.email) return emailRef.current?.focus();
    if (next.message) return messageRef.current?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const payload = { ...values, topic: topic || undefined };
    const parsed = contactSchema.safeParse(payload);

    // The schema treats topic as optional (see lib/validation.ts) because the
    // API stays forgiving. The form doesn't: it's the whole point of the
    // picker, so require it here.
    const next: FieldErrors = {};
    if (!topic) next.topic = "Pick a topic so we know where to send this.";
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey;
        if (key && !next[key]) next[key] = issue.message;
      }
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      focusFirstError(next);
      return;
    }
    if (!parsed.success) return;

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
      // Topic only — never the name, email or message body.
      track("contact_submit", { form: "contact", topic });
    } catch {
      setStatus("error");
      setTopError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.card}>
        <div className={styles.successCard} role="status" aria-live="polite">
          <div className={styles.successMark} aria-hidden="true">
            ✓
          </div>
          <h2 className={styles.successTitle}>Message sent.</h2>
          <p className={styles.successBody}>
            It landed in the inbox we actually read. We&rsquo;ll write back to{" "}
            <strong className={styles.successEmail}>{values.email}</strong> —
            usually the same day.
          </p>
        </div>
      </div>
    );
  }

  const messageLength = values.message.trim().length;
  const submitting = status === "submitting";

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <p className={styles.kicker}>SEND IT OVER</p>
      <h2 className={styles.title}>What&rsquo;s going on?</h2>
      <p className={styles.lead}>
        Pick a topic so it lands with the right person, then tell us the whole
        story. Screenshots help — attach them to a reply once we write back.
      </p>

      {topError ? (
        <p className={styles.topError} role="alert">
          {topError}
        </p>
      ) : null}

      {/* --- topic --- */}
      <div className={styles.group}>
        <p className={styles.groupLabel} id={fieldId("topic-label")}>
          WHAT&rsquo;S IT ABOUT
        </p>
        <div
          role="radiogroup"
          aria-labelledby={fieldId("topic-label")}
          aria-describedby={errors.topic ? errorId("topic") : undefined}
          className={styles.topicGrid}
        >
          {contactTopics.map((t, i) => {
            const selected = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={selected}
                // One tab stop for the group: the selected tile, or the first
                // when nothing is picked yet.
                tabIndex={selected || (!topic && i === 0) ? 0 : -1}
                ref={(el) => {
                  topicRefs.current[t.id] = el;
                }}
                className={`${styles.topic} ${selected ? styles.topicOn : ""} ${
                  errors.topic ? styles.topicInvalid : ""
                }`}
                onClick={() => pickTopic(t.id)}
                onKeyDown={(e) => onTopicKeyDown(e, i)}
                disabled={submitting}
              >
                <span className={styles.topicLabel}>{t.label}</span>
                <span className={styles.topicHint}>{t.hint}</span>
              </button>
            );
          })}
        </div>
        <p className={styles.errorLine} id={errorId("topic")} role="alert">
          {errors.topic ?? ""}
        </p>
      </div>

      {/* --- name + email --- */}
      <div className={styles.pair}>
        <div className={styles.group}>
          <label className={styles.groupLabel} htmlFor={fieldId("name")}>
            YOUR NAME
          </label>
          <div
            className={`${styles.field} ${errors.name ? styles.fieldInvalid : ""}`}
          >
            <input
              id={fieldId("name")}
              ref={nameRef}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Mike Donnelly"
              className={styles.input}
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId("name") : undefined}
              disabled={submitting}
            />
          </div>
          <p className={styles.errorLine} id={errorId("name")} role="alert">
            {errors.name ?? ""}
          </p>
        </div>

        <div className={styles.group}>
          <label className={styles.groupLabel} htmlFor={fieldId("email")}>
            EMAIL
          </label>
          <div
            className={`${styles.field} ${errors.email ? styles.fieldInvalid : ""}`}
          >
            <input
              id={fieldId("email")}
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={styles.input}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId("email") : undefined}
              disabled={submitting}
            />
          </div>
          <p className={styles.errorLine} id={errorId("email")} role="alert">
            {errors.email ?? ""}
          </p>
        </div>
      </div>

      {/* --- message --- */}
      <div className={styles.group}>
        <div className={styles.messageHead}>
          <label className={styles.groupLabel} htmlFor={fieldId("message")}>
            MESSAGE
          </label>
          <span className={styles.count} aria-hidden="true">
            {messageLength ? `${messageLength} characters` : ""}
          </span>
        </div>
        <div
          className={`${styles.field} ${styles.fieldArea} ${
            errors.message ? styles.fieldInvalid : ""
          }`}
        >
          <textarea
            id={fieldId("message")}
            ref={messageRef}
            name="message"
            rows={6}
            placeholder="Third hole, four players, the skins math went sideways after a press…"
            className={styles.textarea}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? errorId("message") : undefined}
            disabled={submitting}
          />
        </div>
        <p className={styles.errorLine} id={errorId("message")} role="alert">
          {errors.message ?? ""}
        </p>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>
        <span className={styles.reassure}>
          Goes straight to {siteConfig.supportEmail}. We read every one and
          write back.
        </span>
      </div>
    </form>
  );
}
