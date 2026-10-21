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
 * --requeue-failed puts every "failed" row (including ones that used all
 * MAX_ATTEMPTS, about 28.6 hours of retries) back to pending with no
 * attempts, then runs the retry. For after an outage longer than that. It
 * refuses unless REACH_SYNC_ENABLED=true and --confirm is given; each row is
 * still looked up in Reach first, so an unsubscribed address stays out.
 *
 * Does nothing unless REACH_SYNC_ENABLED=true, REACH_API_TOKEN and
 * REACH_PROFILE_UUID are set (lib/reach.ts). Meant for a cron on the server
 * once the owner has turned sync on (docs/seo-progress.md, #121). Prints
 * counts and lead ids only, never an address.
 */

import "./register-ts.mjs";

const { getReachClient } = await import("../lib/reach.ts");
const { retryReachSync, requeueFailed } = await import("../lib/reachSync.ts");

const args = process.argv.slice(2);
const requeue = args.includes("--requeue-failed");
if (requeue && !(process.env.REACH_SYNC_ENABLED === "true" && args.includes("--confirm"))) {
  console.log("Refused: --requeue-failed needs REACH_SYNC_ENABLED=true and --confirm. Nothing was changed.");
  process.exit(2);
}

const client = getReachClient(process.env);
if (!client) {
  console.log("Reach sync is off (REACH_SYNC_ENABLED is not \"true\", or its token or profile is missing). Nothing done.");
  process.exit(0);
}

const { PrismaClient } = await import("@prisma/client");
const { prismaLeadSyncStore } = await import("../lib/reachStore.ts");
const prisma = new PrismaClient();

try {
  const store = prismaLeadSyncStore(prisma);
  if (requeue) {
    const result = await requeueFailed({ store, args, env: process.env, print: (line) => console.log(line) });
    if (result.exitCode !== 0) process.exit(result.exitCode);
  }
  const summary = await retryReachSync({
    store,
    client,
    log: (message, fields) => console.error(message, JSON.stringify(fields ?? {})),
  });
  console.log("Reach retry:", JSON.stringify(summary));
  process.exitCode = summary.failed > 0 || summary.exhausted > 0 ? 1 : 0;
} finally {
  await prisma.$disconnect();
}
