/**
 * POST /api/subscribe
 * Adds an email to the newsletter list. Mirrors /api/contact: zod-validated,
 * field-level errors on 400, notification failures logged rather than surfaced.
 *
 * A repeat signup is an upsert that returns the same success as a new one.
 * Answering "you're already on the list" would turn this endpoint into a
 * membership oracle for any address someone cares to type in.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subscribeSchema } from "@/lib/validation";
import { assertDatabaseConfigured } from "@/lib/env";
import { sendNewsletterNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
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

  const { email, source = "blog" } = parsed.data;
  let alreadyOnList = false;

  try {
    assertDatabaseConfigured();
    // Upsert rather than create: the unique index makes a second signup a
    // no-op instead of a 500, and `update: {}` leaves the original createdAt
    // and source alone.
    const existing = await prisma.newsletterLead.findUnique({
      where: { email },
      select: { id: true },
    });
    alreadyOnList = Boolean(existing);
    await prisma.newsletterLead.upsert({
      where: { email },
      update: {},
      create: { email, source },
    });
  } catch (err) {
    console.error("[subscribe] failed to save lead:", err);
    return NextResponse.json(
      { error: "We couldn't sign you up right now. Please try again." },
      { status: 500 },
    );
  }

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
