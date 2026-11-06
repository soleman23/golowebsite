#!/usr/bin/env node
/**
 * Backfill for Hostinger Reach (soleman23/golowebsite#121). DRY RUN by
 * default: counts the never-queued NewsletterLead rows that meet the consent
 * rule (source "blog" or "post", created since the newsletter band's consent
 * copy shipped, lib/reachSync.ts NEWSLETTER_CONSENT_SINCE) and prints counts
 * only. It never reads or prints an address.
 *
 *   npm run reach:backfill                     # dry run, counts only
 *   npm run reach:backfill -- --apply --confirm
 *
 * --apply refuses unless REACH_SYNC_ENABLED=true and --confirm is given. It
 * only queues rows (eligible → pending, the rest → skipped_ineligible); the
 * retry job sends them, each through Reach's double opt-in. Not to be run
 * under #121: only after the owner reviews the dry-run counts.
 */

import "./register-ts.mjs";

const { runBackfill } = await import("../lib/reachSync.ts");
const { PrismaClient } = await import("@prisma/client");
const { prismaBackfillStore } = await import("../lib/reachStore.ts");

const prisma = new PrismaClient();
try {
  const result = await runBackfill({
    store: prismaBackfillStore(prisma),
    args: process.argv.slice(2),
    env: process.env,
    print: (line) => console.log(line),
  });
  process.exitCode = result.exitCode;
} catch (err) {
  if (err?.code !== "P2022") throw err;
  console.log("The Reach columns aren't in this database yet: apply the SQL in docs/seo-progress.md first. Nothing was changed.");
  process.exitCode = 2;
} finally {
  await prisma.$disconnect();
}
