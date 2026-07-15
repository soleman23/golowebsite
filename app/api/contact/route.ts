/**
 * POST /api/contact
 * Validates and stores a contact message. Returns field-level errors on 400 so
 * the client can highlight the offending inputs.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
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

  try {
    assertDatabaseConfigured();
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json(
      { error: "We couldn't send that right now. Please try again." },
      { status: 500 },
    );
  }
}
