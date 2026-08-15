/**
 * Transactional email via Resend's REST API (no SDK dependency — a single
 * fetch, mirroring lib/sms.ts). When RESEND_API_KEY is absent the function
 * short-circuits into "stub" mode so contact submissions still work in
 * development and before an email account exists.
 */

import "server-only";
import { serverEnv, isEmailConfigured } from "./env";
import { contactTopicLabel } from "./content/contactTopics";
import type { ContactInput } from "./validation";

export type EmailResult = { sent: boolean; stub: boolean };

/** Plain-text body. Kept simple and readable in any mail client. */
function buildBody(msg: ContactInput, topic: string): string {
  return [
    "New message from the GoLo website contact form.",
    "",
    `Topic: ${topic}`,
    `Name:  ${msg.name}`,
    `Email: ${msg.email}`,
    "",
    "Message:",
    msg.message,
    "",
    "—",
    "Reply directly to this email to respond to the sender.",
  ].join("\n");
}

/**
 * Emails a contact-form submission to the team inbox.
 * Returns { sent, stub }. Throws only on an unexpected provider error — the
 * caller is responsible for not failing the user's request over it.
 */
export async function sendContactNotification(
  msg: ContactInput,
): Promise<EmailResult> {
  // Topic leads the subject so the inbox sorts itself: "[GoLo] Course data —
  // Mike Donnelly". Falls back to "General" for a post with no topic, which the
  // schema still allows.
  const topic = contactTopicLabel(msg.topic) ?? "General";
  const subject = `[GoLo] ${topic} — ${msg.name}`;

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(
        `[email:stub] would notify ${serverEnv.contactNotifyTo}: "${subject}"`,
      );
    }
    return { sent: false, stub: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serverEnv.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: serverEnv.contactFromEmail,
      to: [serverEnv.contactNotifyTo],
      // So you can hit Reply and answer the person directly.
      reply_to: msg.email,
      subject,
      text: buildBody(msg, topic),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${detail}`);
  }

  return { sent: true, stub: false };
}

/**
 * Tells the team a newsletter signup came in. Same stub-mode contract as the
 * contact notification: absent RESEND_API_KEY means the lead is still stored,
 * just not announced.
 *
 * No reply_to here — this isn't a message someone is waiting on an answer to.
 */
export async function sendNewsletterNotification(
  email: string,
  source: string,
): Promise<EmailResult> {
  const subject = `[GoLo] Newsletter signup — ${source}`;
  const text = [
    "Someone joined the GoLo list.",
    "",
    `Email:  ${email}`,
    `Source: ${source}`,
  ].join("\n");

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(
        `[email:stub] would notify ${serverEnv.contactNotifyTo}: "${subject}"`,
      );
    }
    return { sent: false, stub: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serverEnv.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: serverEnv.contactFromEmail,
      to: [serverEnv.contactNotifyTo],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${detail}`);
  }

  return { sent: true, stub: false };
}
