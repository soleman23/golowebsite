#!/usr/bin/env node
/**
 * Retries newsletter sign-ups that haven't reached Hostinger Reach yet
 * (soleman23/golowebsite#121): pending and failed NewsletterLead rows, with
 * backoff, up to lib/reachSync.ts MAX_ATTEMPTS each. Suppression first: an
 * address Reach already has, unsubscribed included, is never added again.
 *
 *   npm run reach:retry
 *   npm run reach:retry -- --requeue-failed --confirm
 *
 * On Hostinger it runs from the hPanel Node.js cron, which executes
 *   node --env-file=<site>/hbuilds/config/.env <site>/hbuilds/current/nodejs/scripts/reach-retry.mjs
 * so it reads the same server environment as the site (DATABASE_URL and the
 * REACH_* variables) and nothing else. next.config.mjs copies this file,
 * register-ts.mjs and the Reach lib files into the standalone build for that
 * (scripts/check-standalone-cron.mjs checks they are enough).
 *
 * The switch is checked before anything else is loaded: unless
 * REACH_SYNC_ENABLED is exactly "true" it prints "Nothing done" and exits 0
 * without importing the Reach client, Prisma or the database. With the
 * switch on it also needs REACH_API_TOKEN and REACH_PROFILE_UUID
 * (lib/reach.ts), and exits 1 without them. It is the only code that sends
 * to Reach (sign-ups only queue), and holds a database lock while it runs. Prints counts and lead ids only,
 * never an address; an error prints its code and first line, not a stack.
 */

const args = process.argv.slice(2);
const requeue = args.includes("--requeue-failed");
const switchOn = process.env.REACH_SYNC_ENABLED === "true";

if (requeue && !(switchOn && args.includes("--confirm"))) {
  console.log("Refused: --requeue-failed needs REACH_SYNC_ENABLED=true and --confirm. Nothing was changed.");
  process.exit(2);
}

if (!switchOn) {
  console.log(`${new Date().toISOString()} Reach sync is off (REACH_SYNC_ENABLED is not "true"). Nothing done.`);
  process.exit(0);
}

await import("./register-ts.mjs");
const { getReachClient } = await import("../lib/reach.ts");
const { retryReachSync, requeueFailed } = await import("../lib/reachSync.ts");

const client = getReachClient(process.env);
if (!client) {
  // On but half-configured: fail the cron so it shows.
  console.log("Reach sync is on but its token or profile is missing. Nothing done.");
  process.exit(1);
}

const { PrismaClient } = await import("@prisma/client");
const { prismaLeadSyncStore } = await import("../lib/reachStore.ts");
const prisma = new PrismaClient();

try {
  // One sender at a time: the daily and 30-day limits are counted, then
  // claimed, so two overlapping runs could both pass the count. A session
  // lock (released when the connection closes) makes a second run a no-op.
  const [lock] = await prisma.$queryRaw`SELECT pg_try_advisory_lock(121121) AS locked`;
  if (!lock?.locked) {
    console.log(`${new Date().toISOString()} Another Reach run holds the lock. Nothing done.`);
    process.exit(0);
  }
  const store = prismaLeadSyncStore(prisma);
  if (requeue) {
    const result = await requeueFailed({ store, args, env: process.env, print: (line) => console.log(line) });
    if (result.exitCode !== 0) process.exitCode = result.exitCode;
  }
  if (!process.exitCode) {
    const summary = await retryReachSync({
      store,
      client,
      // Spaces Reach's API out: at most one lead (a lookup and a create, usually) every 2 s.
      paceMs: 2000,
      log: (message, fields) => console.error(message, JSON.stringify(fields ?? {})),
    });
    console.log(`${new Date().toISOString()} Reach retry:`, JSON.stringify(summary));
    // Only this run's failures fail the cron. Exhausted rows are reported in
    // the summary and the log, not on every run until someone requeues.
    process.exitCode = summary.failed > 0 ? 1 : 0;
  }
} catch (err) {
  // The code and the first line only: a Prisma error can echo the query.
  console.error("Reach retry failed:", err?.code ?? err?.errorCode ?? err?.name ?? "error", (String(err?.message ?? "").split("\n").find((line) => line.trim()) ?? "").trim().slice(0, 200));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
