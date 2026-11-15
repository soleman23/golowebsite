/**
 * POST /api/text-link
 * Validates a phone number, records the lead, and (when SMS is configured)
 * texts the download link. Runs in "stub" mode when Twilio creds are absent:
 * still validates and stores, returns success, but sends no real text.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { textLinkSchema } from "@/lib/validation";
import { sendDownloadLink } from "@/lib/sms";
import { assertDatabaseConfigured } from "@/lib/env";
// The same 4 kB cap /api/subscribe uses: both carry one short field plus the
// same attribution fields, a few hundred bytes in practice.
import { MAX_BODY_BYTES, readBodyText } from "@/lib/subscribeGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tooLarge() {
  console.warn("[text-link] blocked: too_large");
  return NextResponse.json({ error: "Request too large." }, { status: 413 });
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return tooLarge();
  }
  // Counted as it streams in and cancelled past the limit, so a chunked
  // request (no Content-Length) is never buffered whole either.
  const body = await readBodyText(request.body);
  if (body === null) return tooLarge();

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = textLinkSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid phone number." },
      { status: 400 },
    );
  }

  const {
    phone,
    source = "hero",
    landingPath,
    referrerHost,
    landingSource,
    landingMedium,
    landingCampaign,
    landingContent,
  } = parsed.data;

  try {
    assertDatabaseConfigured();
    const result = await sendDownloadLink(phone);

    await prisma.phoneLead.create({
      data: {
        phone,
        smsSent: result.sent,
        source,
        landingPath,
        referrerHost,
        landingSource,
        landingMedium,
        landingCampaign,
        landingContent,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    });

    return NextResponse.json({ ok: true, stub: result.stub });
  } catch (err) {
    // Log server-side; never leak provider/DB internals to the client.
    console.error("[text-link] failed:", err);
    return NextResponse.json(
      { error: "We couldn't send that right now. Please try again." },
      { status: 500 },
    );
  }
}
