/**
 * The newsletter sign-up, behind /api/subscribe. Kept apart from the route,
 * with its storage, notification, Reach sync and scheduling passed in, so
 * scripts/test-reach-sync.mjs runs the same code against an in-memory store
 * and a stub Reach client.
 *
 * A repeat sign-up returns the same success as a new one. Answering "you're
 * already on the list" would turn the endpoint into a membership oracle.
 */

import { subscribeSchema } from "@/lib/validation";
import { isEligibleSource, syncLead } from "@/lib/reachSync";
import type {
  LeadSyncStore,
  ReachClient,
  ReachSyncStatus,
  SyncLog,
} from "@/lib/reachSync";

export type NewLead = {
  email: string;
  source: string;
  landingPath?: string;
  referrerHost?: string;
  landingSource?: string;
  landingMedium?: string | null;
  landingCampaign?: string | null;
  landingContent?: string | null;
  /** Null (left unset) while Reach sync is off: the row was never queued. */
  reachSyncStatus?: ReachSyncStatus;
};

export interface SubscribeStore {
  /**
   * Saves a new sign-up, or leaves an existing row exactly as it was (source,
   * landing fields and Reach status included). Says which happened, decided
   * atomically: of two overlapping saves for one address, one is `created`.
   */
  save(lead: NewLead): Promise<{ id: string; created: boolean; reachSyncStatus: string | null }>;
}

export type SubscribeDeps = {
  store: SubscribeStore;
  notify: (email: string, source: string) => Promise<unknown>;
  /** Null while REACH_SYNC_ENABLED is off: no row is queued and nothing calls Reach. */
  reach: { client: ReachClient; syncStore: LeadSyncStore } | null;
  /** Runs work after the response is sent (next/server `after` in the route). */
  schedule: (task: () => Promise<void>) => void;
  /**
   * The global ceiling (lib/subscribeGuard.ts `charge`), asked once the
   * sign-up is valid. Its slot is given back if the save fails or the address
   * was already on the list. Absent in tests that don't exercise it.
   */
  admit?: () =>
    | { ok: true; release: () => void }
    | { ok: false; retryAfterSeconds: number };
  log?: SyncLog;
};

export type SubscribeResult = {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
};

export async function handleSubscribe(
  payload: unknown,
  deps: SubscribeDeps,
): Promise<SubscribeResult> {
  const log: SyncLog = deps.log ?? ((message, fields) => console.error(message, fields ?? ""));

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: 400,
      body: { error: "Please fix the highlighted fields.", fieldErrors },
    };
  }

  // A request without a source didn't come from the newsletter band, which
  // always sends one. Stored as "unspecified", which is never eligible for
  // Reach (lib/reachSync.ts NEWSLETTER_SOURCES).
  // `hp_note` is the honeypot (the route drops filled ones first); it's never
  // stored, so it stays out of the spread into the insert.
  const { email, source = "unspecified", hp_note: _honeypot, ...landing } = parsed.data;
  void _honeypot;

  const admitted = deps.admit ? deps.admit() : { ok: true as const, release: () => {} };
  if (!admitted.ok) {
    return {
      status: 429,
      body: { error: "Too many sign-up attempts. Please try again in a few minutes." },
      headers: { "Retry-After": String(admitted.retryAfterSeconds) },
    };
  }

  let saved: Awaited<ReturnType<SubscribeStore["save"]>>;
  try {
    saved = await deps.store.save({
      email,
      source,
      ...landing,
      // Queued for Reach only while sync is on, and only from the newsletter
      // band. Anything else is recorded as never to be sent.
      reachSyncStatus: deps.reach
        ? isEligibleSource(source)
          ? "pending"
          : "skipped_ineligible"
        : undefined,
    });
  } catch (err) {
    // Nothing was saved, so it doesn't count against the global ceiling.
    admitted.release();
    // The error code only: a Prisma error can echo the query, address included.
    console.error("[subscribe] failed to save lead:", (err as { code?: string })?.code ?? "unknown");
    return {
      status: 500,
      body: { error: "We couldn't sign you up right now. Please try again." },
    };
  }

  // A repeat saved nothing new: give its global slot back.
  if (!saved.created) admitted.release();

  // Only announce genuinely new sign-ups; a repeat shouldn't page anybody.
  if (saved.created) {
    try {
      await deps.notify(email, source);
    } catch (err) {
      console.error("[subscribe] saved, but notification email failed:", err);
    }
  }

  // Reach after the response, never in its way. Only a row this request
  // created and queued: a repeat sign-up of a pending, synced or failed
  // address makes no Reach call (the retry job owns failed rows), so it can't
  // trigger a second confirmation email.
  const reach = deps.reach;
  if (reach && saved.created && saved.reachSyncStatus === "pending") {
    const leadId = saved.id;
    deps.schedule(async () => {
      try {
        await syncLead(leadId, { store: reach.syncStore, client: reach.client, log });
      } catch {
        // A store error mid-sync: the row stays pending or failed for the retry job.
        log("[reach] sync after sign-up hit a storage error; left for retry", { leadId });
      }
    });
  }

  return { status: 200, body: { ok: true } };
}
