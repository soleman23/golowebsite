/**
 * POST /api/contact
 * Validates and stores a contact message. Returns field-level errors on 400 so
 * the client can highlight the offending inputs.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { assertDatabaseConfigured } from "@/lib/env";
import { sendContactNotification } from "@/lib/email";
import { readBodyText } from "@/lib/subscribeGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Largest request body accepted, in bytes. The schema allows a 4,000-character
 * message plus name and email. Even if every character were multi-byte or a
 * JSON-escaped control character, that's about 25 kB, so this never turns
 * away a message the form would accept.
 */
const MAX_BODY_BYTES = 32 * 1024;

function tooLarge() {
  console.warn("[contact] blocked: too_large");
  return NextResponse.json({ error: "Request too large." }, { status: 413 });
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return tooLarge();
  }
  // Counted as it streams in and cancelled past the limit, so a chunked
  // request (no Content-Length) is never buffered whole either.
  const body = await readBodyText(request.body, MAX_BODY_BYTES);
  if (body === null) return tooLarge();

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
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

  const { name, email, message, topic } = parsed.data;

  try {
    assertDatabaseConfigured();
    // Explicit null rather than undefined so a topic-less submission stores a
    // real NULL instead of relying on the column default.
    await prisma.contactMessage.create({
      data: { name, email, message, topic: topic ?? null },
    });
  } catch (err) {
    console.error("[contact] failed to save message:", err);
    return NextResponse.json(
      { error: "We couldn't send that right now. Please try again." },
      { status: 500 },
    );
  }

  // The message is saved — that's what matters for the user. A notification
  // failure here shouldn't turn into a failed submission from their point of
  // view; log it and let them know it went through.
  try {
    await sendContactNotification(parsed.data);
  } catch (err) {
    console.error("[contact] saved, but notification email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
