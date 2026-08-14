/**
 * GET /api/health — liveness probe for uptime monitors and Hostinger health
 * checks. Intentionally dependency-free (no DB call) so it stays fast and
 * returns 200 even if downstream services are down; that keeps it a true
 * "is the process up?" check. Add a separate readiness endpoint if you later
 * want to gate traffic on the database being reachable.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
