/**
 * Server-only environment access. Import ONLY from server code
 * (route handlers, server components) — never from client components.
 *
 * We fail loud with a clear message when a required secret is missing, rather
 * than letting a Prisma query blow up with a cryptic error at runtime.
 */

import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Set it in your .env file (see .env.example) or in your host's env settings.`,
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const serverEnv = {
  // Required — Prisma needs this to connect.
  get databaseUrl() {
    return required("DATABASE_URL");
  },

  // SMS (optional). When Twilio creds are absent, the app runs in stub mode.
  smsProvider: optional("SMS_PROVIDER") ?? "twilio",
  twilioAccountSid: optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: optional("TWILIO_AUTH_TOKEN"),
  twilioFromNumber: optional("TWILIO_FROM_NUMBER"),
  smsMessageTemplate:
    optional("SMS_MESSAGE_TEMPLATE") ??
    "Here's your link to download GoLo: {url}",

  downloadUrl:
    process.env.NEXT_PUBLIC_DOWNLOAD_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.golo.golf/get",
};

/**
 * Assert the database is configured. Call at the start of request handlers that
 * touch the DB so a missing DATABASE_URL fails with a clear message instead of a
 * cryptic Prisma error. Kept out of module top-level so `next build` still
 * succeeds without secrets set.
 */
export function assertDatabaseConfigured(): void {
  // Reading the getter throws a descriptive error when unset.
  void serverEnv.databaseUrl;
}

/** True when real SMS can be sent; false means stub mode (validate + store only). */
export function isSmsConfigured(): boolean {
  return Boolean(
    serverEnv.twilioAccountSid &&
      serverEnv.twilioAuthToken &&
      serverEnv.twilioFromNumber,
  );
}
