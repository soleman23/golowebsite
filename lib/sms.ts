/**
 * SMS provider abstraction. Currently wired for Twilio via its REST API (no
 * SDK dependency needed — a single fetch). When credentials are absent the
 * function short-circuits into "stub" mode so the flow works end-to-end in
 * development and before a Twilio account exists.
 */

import "server-only";
import { serverEnv, isSmsConfigured } from "./env";

export type SmsResult = { sent: boolean; stub: boolean };

/**
 * Sends the download link to a phone number.
 * Returns { sent, stub }. Throws only on an unexpected provider error.
 */
export async function sendDownloadLink(phone: string): Promise<SmsResult> {
  const body = serverEnv.smsMessageTemplate.replace(
    "{url}",
    serverEnv.downloadUrl,
  );

  if (!isSmsConfigured()) {
    // Stub mode: no real text sent. The lead is still recorded by the caller.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(`[sms:stub] would text ${phone}: "${body}"`);
    }
    return { sent: false, stub: true };
  }

  const accountSid = serverEnv.twilioAccountSid!;
  const authToken = serverEnv.twilioAuthToken!;
  const from = serverEnv.twilioFromNumber!;

  const params = new URLSearchParams({ To: phone, From: from, Body: body });
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Twilio send failed (${res.status}): ${detail}`);
  }

  return { sent: true, stub: false };
}
