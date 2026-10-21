/**
 * POST /api/subscribe
 * Adds an email to the newsletter list. Mirrors /api/contact: zod-validated,
 * field-level errors on 400, notification failures logged rather than surfaced.
 *
 * A repeat signup is an upsert that returns the same success as a new one.
 * Answering "you're already on the list" would turn this endpoint into a
 * membership oracle for any address someone cares to type in.
 *
 * Before any of that, lib/subscribeGuard.ts: a 4 KB body cap, an Origin
 * check, a rate limit and a honeypot. Every request that gets past the Origin
 * and size checks counts against its client's limit, dropped ones included;
 * only a sign-up that passes validation counts against the global ceiling.
 * Blocks are logged as a reason code only, never the address, IP or key.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subscribeSchema } from "@/lib/validation";
import { assertDatabaseConfigured } from "@/lib/env";
import { sendNewsletterNotification } from "@/lib/email";
import { siteConfig } from "@/lib/siteConfig";
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

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const {
    email,
    source = "blog",
    landingPath,
    referrerHost,
    landingSource,
    landingMedium,
    landingCampaign,
    landingContent,
    // Not `hp_note`: the honeypot is never stored, and the create below names
    // its columns one by one rather than spreading parsed.data.
  } = parsed.data;

  // Only a sign-up that saves a new address counts against the global
  // ceiling (a repeat or a failed save gives its slot back below), so junk
  // can't close it for everybody.
  const charged = limiter.charge();
  if (!charged.ok) return tooMany(charged);

  let alreadyOnList = false;

  try {
    assertDatabaseConfigured();
    // Upsert rather than create: the unique index makes a second signup a
    // no-op instead of a 500, and `update: {}` leaves the original createdAt,
    // source and landing alone.
    const existing = await prisma.newsletterLead.findUnique({
      where: { email },
      select: { id: true },
    });
    alreadyOnList = Boolean(existing);
    await prisma.newsletterLead.upsert({
      where: { email },
      update: {},
      create: {
        email,
        source,
        landingPath,
        referrerHost,
        landingSource,
        landingMedium,
        landingCampaign,
        landingContent,
      },
    });
  } catch (err) {
    // Nothing was saved, so it doesn't count against the global ceiling.
    charged.release();
    // The error code only: a Prisma error can echo the query, address included.
    console.error("[subscribe] failed to save lead:", (err as { code?: string })?.code ?? "unknown");
    return NextResponse.json(
      { error: "We couldn't sign you up right now. Please try again." },
      { status: 500 },
    );
  }

  // A repeat saved nothing new: give its global slot back.
  if (alreadyOnList) charged.release();

  // Only announce genuinely new signups — a repeat shouldn't page anybody.
  if (!alreadyOnList) {
    try {
      await sendNewsletterNotification(email, source);
    } catch (err) {
      console.error("[subscribe] saved, but notification email failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
