/**
 * Prisma-backed stores for the newsletter sign-up and its Reach sync
 * (soleman23/golowebsite#121). The client is passed in, so the route uses the
 * app singleton (lib/db.ts) and the scripts make their own.
 */

import type { PrismaClient } from "@prisma/client";
import type {
  BackfillStore,
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

export function prismaSubscribeStore(
  prisma: PrismaClient,
  beforeSave: () => void = () => {},
): SubscribeStore {
  return {
    async save(lead: NewLead) {
      beforeSave();
      const existing = await prisma.newsletterLead.findUnique({
        where: { email: lead.email },
        select: { id: true },
      });
      // Upsert rather than create: the unique index makes a racing second
      // sign-up a no-op instead of a 500, and `update: {}` leaves the original
      // createdAt, source, landing fields and Reach status alone.
      const row = await prisma.newsletterLead.upsert({
        where: { email: lead.email },
        update: {},
        create: lead,
        select: { id: true, reachSyncStatus: true },
      });
      return { id: row.id, created: !existing, reachSyncStatus: row.reachSyncStatus };
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
        orderBy: [{ reachSyncAttempts: "asc" }, { createdAt: "asc" }],
        take: limit,
        select: syncFields,
      });
    },
    async countExhausted(maxAttempts) {
      return prisma.newsletterLead.count({
        where: { reachSyncStatus: "failed", reachSyncAttempts: { gte: maxAttempts } },
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
