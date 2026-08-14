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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
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

  const { phone } = parsed.data;

  try {
    assertDatabaseConfigured();
    const result = await sendDownloadLink(phone);

    await prisma.phoneLead.create({
      data: {
        phone,
        smsSent: result.sent,
        source: "hero",
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
