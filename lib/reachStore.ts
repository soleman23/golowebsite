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
      try {
        if (!syncEnabled) {
          const row = await prisma.newsletterLead.create({
            data: withoutReach,
            select: { id: true },
          });
          return { id: row.id, created: true, reachSyncStatus: null };
        }
        const row = await prisma.newsletterLead.create({
          data: { ...withoutReach, reachSyncStatus },
          select: { id: true, reachSyncStatus: true },
        });
        return { id: row.id, created: true, reachSyncStatus: row.reachSyncStatus };
      } catch (err) {
        if ((err as { code?: string })?.code !== "P2002") throw err;
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
    async listRetryable(maxAttempts, limit) {
      return prisma.newsletterLead.findMany({
        where: {
          reachSyncStatus: { in: RETRYABLE },
          reachSyncAttempts: { lt: maxAttempts },
        },
        // Oldest sign-up first, whatever its attempts: a backlog of fresh rows
        // can't push a row in its retries out of the scanned window forever.
        // Rows still in their backoff cost the job nothing.
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
