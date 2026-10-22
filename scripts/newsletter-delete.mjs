#!/usr/bin/env node
/**
 * A newsletter deletion request (Privacy Policy; owner decision A on
 * soleman23/golowebsite#121): deletes the address's sign-up record from the
 * website's database, then its contact in Hostinger Reach.
 *
 *   npm run newsletter:delete -- --confirm      (then type the address)
 *   printf '%s\n' "$ADDRESS" | npm run newsletter:delete -- --confirm
 *
 * The address is read from standard input, never from the command line, so
 * it stays out of shell history and process lists. Output is counts only.
 *
 * Order and safety:
 * - It holds the sign-up lock exclusively (lib/reachStore.ts DELETION_LOCK;
 *   each sign-up insert holds it shared), so a sign-up in flight can't land
 *   between the steps below.
 * - It takes the same database lock as the Reach retry job
 *   (scripts/reach-retry.mjs) on the direct connection (DIRECT_URL), waiting
 *   up to five minutes for a running job to finish, so a retry can't be
 *   halfway through adding the address while it's deleted.
 * - The website row goes first: with it gone, no queued retry and no
 *   backfill can ever send the address to Reach again.
 * - Then the Reach contact, if REACH_API_TOKEN and REACH_PROFILE_UUID are
 *   set (whether or not sync is switched on). Otherwise it says so, and the
 *   contact has to be deleted in Reach by hand (Audience → Contacts →
 *   the contact → Actions → Delete).
 *
 * Deleting the Reach contact also deletes Reach's record that the address
 * unsubscribed (verified 2026-10-21). If the person later signs up again on
 * purpose, they're a new sign-up and have to confirm through double opt-in.
 *
 * Not covered here, and a step of the same request (docs/seo-progress.md):
 * the team's sign-up notification email for the address, in the mailbox that
 * receives "[GoLo] Newsletter signup" messages.
 */

import "./register-ts.mjs";

const args = process.argv.slice(2);
if (!args.includes("--confirm")) {
  console.log("Refused: a deletion needs --confirm. Nothing was changed.");
  process.exit(2);
}
if (!process.env.DIRECT_URL) {
  console.log("Refused: DIRECT_URL (the direct database connection the lock needs) is missing. Nothing was changed.");
  process.exit(2);
}

async function readAddress() {
  if (process.stdin.isTTY) process.stdout.write("Address to delete: ");
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
    if (input.includes("\n")) break;
  }
  return input.split("\n")[0].trim();
}

const email = await readAddress();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.log("Refused: that isn't an email address. Nothing was changed.");
  process.exit(2);
}

const { createHttpReachClient } = await import("../lib/reach.ts");
const { deleteSubscriber } = await import("../lib/reachSync.ts");
const { prismaDeletionStore, DELETION_LOCK } = await import("../lib/reachStore.ts");
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL } } });

try {
  let locked = false;
  for (let waited = 0; waited < 300 && !locked; waited += 5) {
    const [lock] = await prisma.$queryRaw`SELECT pg_try_advisory_lock(121121) AS locked`;
    locked = Boolean(lock?.locked);
    if (!locked) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  if (!locked) {
    console.log("The Reach retry job held its lock for five minutes. Nothing was changed; try again.");
    process.exitCode = 1;
  } else {
    // Exclusive against sign-up inserts (they hold it shared): one already in
    // flight finishes first and is deleted with the rest; a later one waits
    // and is a new sign-up.
    await prisma.$queryRaw`SELECT pg_advisory_lock(${DELETION_LOCK})`;
    const token = process.env.REACH_API_TOKEN?.trim();
    const profileUuid = process.env.REACH_PROFILE_UUID?.trim();
    const client = token && profileUuid ? createHttpReachClient({ token, profileUuid }) : null;
    const result = await deleteSubscriber({ email, store: prismaDeletionStore(prisma), client });
    console.log(`Website sign-up rows deleted: ${result.websiteRowsDeleted}.`);
    if (result.reach === "not_configured") {
      console.log("Reach: no token configured here, so the Reach contact was NOT deleted. Delete it in Reach (Audience → Contacts → the contact → Actions → Delete).");
      process.exitCode = 1;
    } else if (!result.reach.ok) {
      console.log(`Reach: the contact was NOT deleted (${result.reach.error}). The website row is gone, so nothing will re-add it; delete the contact in Reach by hand or run this again.`);
      process.exitCode = 1;
    } else {
      console.log(`Reach contacts deleted: ${result.reach.deleted}.`);
    }
  }
} catch (err) {
  console.error("Deletion failed:", err?.code ?? err?.errorCode ?? err?.name ?? "error");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
