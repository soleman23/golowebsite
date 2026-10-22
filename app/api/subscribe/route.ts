/**
 * POST /api/subscribe
 * Adds an email to the newsletter list. Mirrors /api/contact: zod-validated,
 * field-level errors on 400, notification failures logged rather than surfaced.
 * The sign-up itself is lib/subscribe.ts; this wires in the guard, Prisma,
 * Resend and Reach.
 *
 * A repeat signup returns the same success as a new one (the unique index
 * turns its create into a no-op).
 * Answering "you're already on the list" would turn this endpoint into a
 * membership oracle for any address someone cares to type in.
 *
 * Before any of that, lib/subscribeGuard.ts: a 4 KB body cap, an Origin
 * check, a rate limit and a honeypot. Every request that gets past the Origin
 * and size checks counts against its client's limit, dropped ones included;
 * only a sign-up that passes validation counts against the global ceiling.
 * Blocks are logged as a reason code only, never the address, IP or key.
 *
 * Hostinger Reach (#121): off unless REACH_SYNC_ENABLED=true (lib/reach.ts).
 * When on, a new sign-up from the newsletter band is queued, and the
 * scheduled retry job (every 15 minutes) sends it to Reach, so the visitor
 * never waits on Reach or sees it fail.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertDatabaseConfigured } from "@/lib/env";
import { sendNewsletterNotification } from "@/lib/email";
import { getReachClient } from "@/lib/reach";
import { prismaSubscribeStore } from "@/lib/reachStore";
import { siteConfig } from "@/lib/siteConfig";
import { handleSubscribe } from "@/lib/subscribe";
import {
  MAX_BODY_BYTES,
  clientKey,
  createLogThrottle,
  createRateLimiter,
  headerShape,
  isAllowedOrigin,
  isHoneypotFilled,
  readBodyText,
  requestHost,
  type RateLimitResult,
} from "@/lib/subscribeGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Module scope, so they live as long as the process (see subscribeGuard.ts).
const limiter = createRateLimiter();
const shapeLogDue = createLogThrottle();
const production = process.env.NODE_ENV === "production";

function tooLarge() {
  console.warn("[subscribe] blocked: too_large");
  return NextResponse.json({ error: "Request too large." }, { status: 413 });
}

function tooMany(limit: Exclude<RateLimitResult, { ok: true }>) {
  console.warn(`[subscribe] blocked: rate_limit_${limit.scope}`);
  return NextResponse.json(
    { error: "Too many sign-up attempts. Please try again in a few minutes." },
    { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
  );
}

export async function POST(request: Request) {
  // Which header carries the client on the live host: the shape only, on the
  // first request after a start and then at most hourly.
  if (shapeLogDue()) {
    console.info(`[subscribe] client-ip headers: ${headerShape(request.headers)}`);
  }

  const originAllowed = isAllowedOrigin(request.headers.get("origin"), {
    siteUrl: siteConfig.url,
    production,
    host: requestHost(request.headers),
  });
  if (!originAllowed) {
    console.warn("[subscribe] blocked: origin");
    return NextResponse.json(
      { error: "This sign-up form only works on golo.golf." },
      { status: 403 },
    );
  }

  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return tooLarge();
  }

  // Also refuses everyone while the global ceiling is full, before the body
  // is read, so a flood still gets a cheap 429.
  const limit = limiter.hit(clientKey(request.headers));
  if (!limit.ok) return tooMany(limit);

  const body = await readBodyText(request.body);
  if (body === null) return tooLarge();

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Checked before validation, so a bot gets the same success whatever else
  // it sent: no field errors, nothing saved, nobody notified.
  if (isHoneypotFilled(payload)) {
    console.warn("[subscribe] dropped: honeypot");
    return NextResponse.json({ ok: true });
  }

  const client = getReachClient();
  const { status, body: result, headers } = await handleSubscribe(payload, {
    store: prismaSubscribeStore(prisma, assertDatabaseConfigured, {
      syncEnabled: client !== null,
    }),
    notify: sendNewsletterNotification,
    // Sign-ups only queue; the scheduled retry job is the one sender.
    reach: client,
    // Only a sign-up that saves a new address counts against the global
    // ceiling (handleSubscribe gives a repeat's or a failed save's slot
    // back), so junk can't close it for everybody.
    admit: () => {
      const charged = limiter.charge();
      if (!charged.ok) console.warn(`[subscribe] blocked: rate_limit_${charged.scope}`);
      return charged;
    },
  });

  return NextResponse.json(result, { status, headers });
}
