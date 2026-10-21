/**
 * POST /api/subscribe
 * Adds an email to the newsletter list. Mirrors /api/contact: zod-validated,
 * field-level errors on 400, notification failures logged rather than surfaced.
 * The logic is lib/subscribe.ts; this wires in Prisma, Resend and Reach.
 *
 * A repeat signup is an upsert that returns the same success as a new one.
 * Answering "you're already on the list" would turn this endpoint into a
 * membership oracle for any address someone cares to type in.
 *
 * Hostinger Reach (#121): off unless REACH_SYNC_ENABLED=true (lib/reach.ts).
 * When on, a new sign-up from the newsletter band is queued and sent to Reach
 * after the response, so the visitor never waits on Reach or sees it fail.
 */

import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { assertDatabaseConfigured } from "@/lib/env";
import { sendNewsletterNotification } from "@/lib/email";
import { getReachClient } from "@/lib/reach";
import { prismaLeadSyncStore, prismaSubscribeStore } from "@/lib/reachStore";
import { handleSubscribe } from "@/lib/subscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const client = getReachClient();
  const { status, body } = await handleSubscribe(payload, {
    store: prismaSubscribeStore(prisma, assertDatabaseConfigured, {
      syncEnabled: client !== null,
    }),
    notify: sendNewsletterNotification,
    reach: client ? { client, syncStore: prismaLeadSyncStore(prisma) } : null,
    schedule: (task) => after(task),
  });

  return NextResponse.json(body, { status });
}
