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
 *   each sign-up insert holds it shared) while the website rows are deleted,
 *   so a sign-up in flight can't land between the read and the delete.
 * - It takes the same database lock as the Reach retry job
 *   (scripts/reach-retry.mjs) on the direct connection (DIRECT_URL, one
 *   pinned connection), waiting up to five minutes for a running job to
 *   finish, so a retry can't be halfway through adding the address while it's
 *   deleted. Both locks are taken by polling, never a blocking wait.
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
// One connection for the whole run: session locks belong to a connection, so
// every lock and query has to share it.
const directUrl = new URL(process.env.DIRECT_URL);
directUrl.searchParams.set("connection_limit", "1");
const prisma = new PrismaClient({ datasources: { db: { url: directUrl.toString() } } });

/** Try-lock polling: true once held, false after `seconds`. Never blocks a waiting queue. */
async function acquire(key, seconds) {
  for (let waited = 0; ; waited += 1) {
    const [row] = await prisma.$queryRaw`SELECT pg_try_advisory_lock(${key}) AS locked`;
    if (row?.locked) return true;
    if (waited >= seconds) return false;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

try {
  if (!(await acquire(121121, 300))) {
    console.log("The Reach retry job held its lock for five minutes. Nothing was changed; try again.");
    process.exitCode = 1;
  } else if (!(await acquire(DELETION_LOCK, 30))) {
    // Sign-ups hold it only for their own short insert.
    console.log("Sign-ups held the deletion lock for 30 seconds. Nothing was changed; try again.");
    process.exitCode = 1;
  } else {
    const token = process.env.REACH_API_TOKEN?.trim();
    const profileUuid = process.env.REACH_PROFILE_UUID?.trim();
    const client = token && profileUuid ? createHttpReachClient({ token, profileUuid }) : null;
    // Exclusive against sign-up inserts (they hold it shared) only while the
    // website rows are deleted: one in flight lands first and is deleted with
    // them. Released before the slower Reach calls, so sign-ups never wait on
    // Reach; one that lands after is a new, explicit sign-up, and the retry
    // job can't send it before this run lets go of the retry lock.
    const result = await deleteSubscriber({
      email,
      store: prismaDeletionStore(prisma),
      client,
      afterRowsDeleted: async () => {
        await prisma.$queryRaw`SELECT pg_advisory_unlock(${DELETION_LOCK}) AS released`;
      },
    });
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
