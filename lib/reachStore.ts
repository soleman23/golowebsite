/**
 * Prisma-backed stores for the newsletter sign-up and its Reach sync
 * (soleman23/golowebsite#121). The client is passed in, so the route uses the
 * app singleton (lib/db.ts) and the scripts make their own.
 */

import type { PrismaClient } from "@prisma/client";
import type {
  BackfillStore,
  DeletionStore,
  LeadSyncStore,
  ReachSyncStatus,
  SyncLead,
} from "./reachSync";
import type { NewLead, SubscribeStore } from "./subscribe";
import { backoffMs } from "./reachSync";

/**
 * The advisory lock a deletion request holds exclusively and each sign-up
 * insert holds shared (scripts/newsletter-delete.mjs). Distinct from the
 * retry job's lock (121121), so sign-ups never wait on a retry run.
 */
export const DELETION_LOCK = 121122;

const syncFields = {
  id: true,
  email: true,
  source: true,
  createdAt: true,
  reachSyncStatus: true,
  reachSyncAttempts: true,
  reachLastAttemptAt: true,
} as const;

const RETRYABLE: ReachSyncStatus[] = ["pending", "failed"];

/**
 * `syncEnabled` false (REACH_SYNC_ENABLED off) keeps every Reach column out
 * of the query: nothing is written to or read from them, so a deploy that
 * reaches a database without the #121 columns still saves sign-ups while the
 * switch is off. That relies on `reachSyncAttempts` having a database-side
 * default (`dbgenerated("0")` in schema.prisma): with a plain `@default(0)`
 * Prisma writes the column into every INSERT. (Add the columns first anyway;
 * docs/seo-progress.md.)
 */
export function prismaSubscribeStore(
  prisma: PrismaClient,
  beforeSave: () => void = () => {},
  { syncEnabled }: { syncEnabled: boolean } = { syncEnabled: false },
): SubscribeStore {
  return {
    async save(lead: NewLead) {
      beforeSave();
      const { reachSyncStatus, ...withoutReach } = lead;
      // A plain create, with the unique index deciding: whether this request
      // added the address is atomic, so two overlapping sign-ups for one
      // address can't both count as new. A repeat (P2002) leaves the original
      // createdAt, source, landing fields and Reach status alone, and makes
      // no Reach call, so it needs nothing back.
      //
      // The insert holds DELETION_LOCK shared, for its own transaction only
      // (safe through the pooler): a deletion request takes it exclusively,
      // so a sign-up in flight either lands before the deletion (and is
      // deleted with it) or waits until the deletion is done (and is then a
      // new, explicit sign-up that has to confirm again).
      try {
        if (!syncEnabled) {
          const row = await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock_shared(${DELETION_LOCK})`;
            return tx.newsletterLead.create({ data: withoutReach, select: { id: true } });
          });
          return { id: row.id, created: true, reachSyncStatus: null };
        }
        const row = await prisma.$transaction(async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock_shared(${DELETION_LOCK})`;
          return tx.newsletterLead.create({
            data: { ...withoutReach, reachSyncStatus },
            select: { id: true, reachSyncStatus: true },
          });
        });
        return { id: row.id, created: true, reachSyncStatus: row.reachSyncStatus };
      } catch (err) {
        if ((err as { code?: string })?.code !== "P2002") throw err;
        // An address saved while sync was off was never queued. A fresh,
        // explicit sign-up from the newsletter band queues it now (only if
        // never queued: a pending, failed, synced or skipped row is left as
        // it is). The visitor's answer is the same either way.
        if (syncEnabled && reachSyncStatus === "pending") {
          await prisma.newsletterLead.updateMany({
            where: { email: lead.email, reachSyncStatus: null },
            data: { reachSyncStatus: "pending" },
          });
        }
        return { id: "", created: false, reachSyncStatus: null };
      }
    },
  };
}

export function prismaLeadSyncStore(prisma: PrismaClient): LeadSyncStore {
  return {
    async get(id): Promise<SyncLead | null> {
      return prisma.newsletterLead.findUnique({ where: { id }, select: syncFields });
    },
    async claimAttempt(id, expectedAttempts, at) {
      const { count } = await prisma.newsletterLead.updateMany({
        where: {
          id,
          reachSyncAttempts: expectedAttempts,
          reachSyncStatus: { in: RETRYABLE },
        },
        data: { reachSyncAttempts: expectedAttempts + 1, reachLastAttemptAt: at },
      });
      return count === 1;
    },
    async setStatus(id, status) {
      await prisma.newsletterLead.update({
        where: { id },
        data: { reachSyncStatus: status },
      });
    },
    async listRetryable(maxAttempts, limit, now) {
      // Only rows that are due: never attempted, or past the backoff for
      // their attempt count. So rows still waiting can't fill the scanned
      // window and hide newer rows that are ready.
      const due = [
        { reachLastAttemptAt: null },
        ...Array.from({ length: maxAttempts }, (_, attempts) => ({
          reachSyncAttempts: attempts,
          reachLastAttemptAt: { lte: new Date(now.getTime() - backoffMs(attempts)) },
        })),
      ];
      return prisma.newsletterLead.findMany({
        where: {
          reachSyncStatus: { in: RETRYABLE },
          reachSyncAttempts: { lt: maxAttempts },
          OR: due,
        },
        // Oldest sign-up first, whatever its attempts: a backlog of fresh rows
        // can't push a row in its retries out of the scanned window forever.
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: limit,
        select: syncFields,
      });
    },
    async countExhausted(maxAttempts) {
      return prisma.newsletterLead.count({
        where: { reachSyncStatus: { in: RETRYABLE }, reachSyncAttempts: { gte: maxAttempts } },
      });
    },
    async requeueFailed(maxAttempts, quietBefore) {
      const { count } = await prisma.newsletterLead.updateMany({
        where: {
          reachSyncStatus: { in: RETRYABLE },
          reachSyncAttempts: { gte: maxAttempts },
          reachLastAttemptAt: { lt: quietBefore },
        },
        data: { reachSyncStatus: "pending", reachSyncAttempts: 0, reachLastAttemptAt: null },
      });
      return count;
    },
    async countSyncedSince(since) {
      return prisma.newsletterLead.count({
        where: { reachSyncStatus: "synced", reachLastAttemptAt: { gte: since } },
      });
    },
  };
}

export function prismaBackfillStore(prisma: PrismaClient): BackfillStore {
  return {
    // Never selects the address: the dry run has nothing to print by mistake.
    async listUnqueued() {
      return prisma.newsletterLead.findMany({
        where: { reachSyncStatus: null },
        select: { id: true, source: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });
    },
    async queue(ids, status) {
      if (ids.length === 0) return 0;
      const { count } = await prisma.newsletterLead.updateMany({
        where: { id: { in: ids }, reachSyncStatus: null },
        data: { reachSyncStatus: status },
      });
      return count;
    },
  };
}

export function prismaDeletionStore(prisma: PrismaClient): DeletionStore {
  return {
    async deleteByEmail(email) {
      const { count } = await prisma.newsletterLead.deleteMany({
        where: { email: { equals: email, mode: "insensitive" } },
      });
      return count;
    },
  };
}
