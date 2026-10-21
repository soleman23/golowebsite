/**
 * Newsletter sign-ups to Hostinger Reach (soleman23/golowebsite#121): the
 * rules, with no I/O of its own. The Reach client and the lead store are
 * passed in, so the route, the retry and backfill scripts and the tests
 * (scripts/test-reach-sync.mjs, against a stub client and an in-memory store)
 * all run exactly this code.
 *
 * Owner decisions (soleman23/golo#791):
 * - Only explicit newsletter sign-ups: NewsletterLead rows from the blog's
 *   newsletter band (source "blog" or "post"). Never contact-form senders,
 *   PhoneLead rows or app accounts; those never reach this module.
 * - Reach is the unsubscribe authority. Before adding an address we ask Reach
 *   about it, and an address Reach already knows (unsubscribed, pending,
 *   subscribed or confirmed) is never added again, by a retry or a repeat
 *   sign-up.
 * - A saved sign-up is never lost to a Reach failure: it stays "failed" and
 *   the retry job tries again with backoff, up to MAX_ATTEMPTS.
 * - We never copy Reach's subscriber state. reachSyncStatus says only what
 *   this site has done: pending | synced | failed | skipped_ineligible, or
 *   null for a row that was never queued.
 *
 * Plain TypeScript with erasable types only, so Node runs it as-is in the
 * scripts. Logs never carry an email address or the token: lead ids and short
 * error codes only.
 */

/** Reach's subscription statuses, as its list endpoint filters them. */
export type ReachContactStatus =
  | "unsubscribed"
  | "pending"
  | "subscribed"
  | "confirmed";

export type FindContactResult =
  | { ok: true; status: ReachContactStatus | null }
  | { ok: false; error: string };

export type CreateContactResult = { ok: true } | { ok: false; error: string };

/**
 * What the sync needs from Reach. `error` is a short code ("http_500",
 * "timeout", "bad_response"), never a response body, which could echo the
 * address back.
 */
export interface ReachClient {
  findContact(email: string): Promise<FindContactResult>;
  createContact(email: string): Promise<CreateContactResult>;
}

export const REACH_SYNC_STATUSES = [
  "pending",
  "synced",
  "failed",
  "skipped_ineligible",
] as const;
export type ReachSyncStatus = (typeof REACH_SYNC_STATUSES)[number];

/** The newsletter band's two placements (components/sections/blog/NewsletterBand.tsx). */
export const NEWSLETTER_SOURCES = ["blog", "post"] as const;

/**
 * When the newsletter band's consent copy first existed: the committer date
 * of 3004c51 ("feat(blog): /blog index + newsletter signup per handoff prompt
 * 06", 2026-08-15 15:17:54 -07:00), which added the band, /api/subscribe and
 * NewsletterLead together. The band's promise ("One email when something
 * worth reading goes up. No drip sequence, no 're-engagement' campaign, and
 * we don't sell the list." / "No spam, no selling your address. Unsubscribe
 * from any email.") is unchanged in every later revision (703a236, d036669).
 * The "post" placement arrived at the same timestamp (e7b0c05).
 */
export const NEWSLETTER_CONSENT_SINCE = new Date("2026-08-15T22:17:54Z");

export const MAX_ATTEMPTS = 6;
const BACKOFF_BASE_MS = 5 * 60 * 1000;
const BACKOFF_CAP_MS = 6 * 60 * 60 * 1000;

/** Wait before attempt n+1 after n attempts: 5 min, 10, 20, 40, 80, … capped at 6 h. */
export function backoffMs(attempts: number): number {
  if (attempts <= 0) return 0;
  return Math.min(BACKOFF_BASE_MS * 2 ** (attempts - 1), BACKOFF_CAP_MS);
}

/** True only for the newsletter band's placements. */
export function isEligibleSource(source: string | null | undefined): boolean {
  return (NEWSLETTER_SOURCES as readonly string[]).includes(source ?? "");
}

/**
 * The sync flag. Only the exact string "true" turns it on; unset, empty,
 * "1", "TRUE" or anything else leaves it off. Server env only, never
 * NEXT_PUBLIC_.
 */
export function isReachSyncFlagOn(
  env: Record<string, string | undefined>,
): boolean {
  return env.REACH_SYNC_ENABLED === "true";
}

/** The fields the sync reads. */
export type SyncLead = {
  id: string;
  email: string;
  source: string;
  createdAt: Date;
  reachSyncStatus: string | null;
  reachSyncAttempts: number;
  reachLastAttemptAt: Date | null;
};

export interface LeadSyncStore {
  get(id: string): Promise<SyncLead | null>;
  /**
   * Takes the next attempt: when the row is still pending or failed with
   * exactly `expectedAttempts` attempts, sets attempts to expectedAttempts + 1
   * and the last attempt to `at`, atomically. False if anyone else got there
   * first, so two runs never call Reach for the same attempt.
   */
  claimAttempt(id: string, expectedAttempts: number, at: Date): Promise<boolean>;
  setStatus(id: string, status: ReachSyncStatus): Promise<void>;
  /** Pending or failed rows with fewer than maxAttempts attempts, fewest first. */
  listRetryable(maxAttempts: number, limit: number): Promise<SyncLead[]>;
  /** Failed rows that have used every attempt. */
  countExhausted(maxAttempts: number): Promise<number>;
}

export type SyncLog = (message: string, fields?: Record<string, unknown>) => void;

export type SyncOutcome =
  | "not_found"
  | "ineligible"
  | "not_queued"
  | "exhausted"
  | "backoff"
  | "claimed_elsewhere"
  | "already_present"
  | "suppressed"
  | "created"
  | "failed";

export type SyncDeps = {
  store: LeadSyncStore;
  client: ReachClient;
  now?: () => Date;
  log?: SyncLog;
  maxAttempts?: number;
};

const silent: SyncLog = () => {};

/**
 * One attempt for one lead. Suppression first: Reach is asked about the
 * address before anything is added, and an address it already has is never
 * created again. Never throws for a Reach failure; the row records it.
 */
export async function syncLead(id: string, deps: SyncDeps): Promise<SyncOutcome> {
  const { store, client } = deps;
  const now = deps.now ?? (() => new Date());
  const log = deps.log ?? silent;
  const maxAttempts = deps.maxAttempts ?? MAX_ATTEMPTS;

  const lead = await store.get(id);
  if (!lead) return "not_found";

  if (!isEligibleSource(lead.source)) {
    if (lead.reachSyncStatus !== "skipped_ineligible") {
      await store.setStatus(id, "skipped_ineligible");
    }
    return "ineligible";
  }
  if (lead.reachSyncStatus !== "pending" && lead.reachSyncStatus !== "failed") {
    return "not_queued";
  }
  if (lead.reachSyncAttempts >= maxAttempts) return "exhausted";

  const at = now();
  if (
    lead.reachLastAttemptAt &&
    at.getTime() - lead.reachLastAttemptAt.getTime() < backoffMs(lead.reachSyncAttempts)
  ) {
    return "backoff";
  }

  if (!(await store.claimAttempt(id, lead.reachSyncAttempts, at))) {
    return "claimed_elsewhere";
  }
  const attempt = lead.reachSyncAttempts + 1;

  const fail = async (error: string): Promise<SyncOutcome> => {
    await store.setStatus(id, "failed");
    if (attempt >= maxAttempts) {
      log("[reach] sync gave up after the last attempt", { leadId: id, attempt, error });
    } else {
      log("[reach] sync attempt failed, will retry", { leadId: id, attempt, error });
    }
    return "failed";
  };

  let found: FindContactResult;
  try {
    found = await client.findContact(lead.email);
  } catch {
    found = { ok: false, error: "find_threw" };
  }
  if (!found.ok) return fail(`find:${found.error}`);

  if (found.status === "unsubscribed") {
    // Reach is the authority. Nothing to do, now or on any later run.
    await store.setStatus(id, "synced");
    log("[reach] address is unsubscribed in Reach; not re-added", { leadId: id });
    return "suppressed";
  }
  if (found.status) {
    // Already pending, subscribed or confirmed: a second create could send a
    // second confirmation email.
    await store.setStatus(id, "synced");
    return "already_present";
  }

  let created: CreateContactResult;
  try {
    created = await client.createContact(lead.email);
  } catch {
    created = { ok: false, error: "create_threw" };
  }
  if (!created.ok) return fail(`create:${created.error}`);

  await store.setStatus(id, "synced");
  return "created";
}

export type RetrySummary = Record<SyncOutcome, number> & {
  checked: number;
  exhausted: number;
};

/**
 * The retry job: every pending or failed lead that's due, oldest attempt
 * count first. The caller decides whether sync is enabled; this only runs
 * the rules. Logs a count of leads that have used every attempt, without
 * addresses.
 */
export async function retryReachSync(
  deps: SyncDeps & { limit?: number },
): Promise<RetrySummary> {
  const maxAttempts = deps.maxAttempts ?? MAX_ATTEMPTS;
  const log = deps.log ?? silent;
  const summary: RetrySummary = {
    checked: 0,
    exhausted: 0,
    not_found: 0,
    ineligible: 0,
    not_queued: 0,
    backoff: 0,
    claimed_elsewhere: 0,
    already_present: 0,
    suppressed: 0,
    created: 0,
    failed: 0,
  };

  const leads = await deps.store.listRetryable(maxAttempts, deps.limit ?? 100);
  for (const lead of leads) {
    summary.checked += 1;
    const outcome = await syncLead(lead.id, { ...deps, maxAttempts });
    summary[outcome] += 1;
  }

  summary.exhausted = await deps.store.countExhausted(maxAttempts);
  if (summary.exhausted > 0) {
    log("[reach] leads that used every sync attempt; check Reach and the logs", {
      count: summary.exhausted,
    });
  }
  return summary;
}

/** A lead that was never queued, as the backfill reads it. No address. */
export type BackfillRow = { id: string; source: string; createdAt: Date };

export type BackfillPlan = {
  total: number;
  eligible: string[];
  wrongSource: string[];
  beforeConsentCopy: string[];
};

/**
 * Which never-queued rows meet #121's consent rule: from the newsletter band
 * (source "blog" or "post"), created once the band's consent copy existed.
 */
export function planBackfill(
  rows: BackfillRow[],
  since: Date = NEWSLETTER_CONSENT_SINCE,
): BackfillPlan {
  const plan: BackfillPlan = {
    total: rows.length,
    eligible: [],
    wrongSource: [],
    beforeConsentCopy: [],
  };
  for (const row of rows) {
    if (!isEligibleSource(row.source)) plan.wrongSource.push(row.id);
    else if (row.createdAt.getTime() < since.getTime()) plan.beforeConsentCopy.push(row.id);
    else plan.eligible.push(row.id);
  }
  return plan;
}

export interface BackfillStore {
  /** Rows whose reachSyncStatus is null. Never selects the address. */
  listUnqueued(): Promise<BackfillRow[]>;
  /** Sets the status on rows that are still unqueued. */
  queue(ids: string[], status: ReachSyncStatus): Promise<number>;
}

export type BackfillResult = {
  mode: "dry-run" | "applied" | "refused";
  plan?: BackfillPlan;
  exitCode: number;
};

/**
 * Backfill. Dry run by default, and it prints counts only. `--apply` queues
 * the eligible rows as "pending" (the retry job then sends each through
 * Reach's double opt-in) and marks the rest "skipped_ineligible"; it refuses
 * unless REACH_SYNC_ENABLED=true and `--confirm` is also given. Running it is
 * outside #121: only after the owner has reviewed the dry-run counts.
 */
export async function runBackfill(opts: {
  store: BackfillStore;
  args: string[];
  env: Record<string, string | undefined>;
  print: (line: string) => void;
  since?: Date;
}): Promise<BackfillResult> {
  const { store, args, env, print } = opts;
  const apply = args.includes("--apply");

  if (apply && !(isReachSyncFlagOn(env) && args.includes("--confirm"))) {
    print(
      "Refused: --apply needs REACH_SYNC_ENABLED=true and --confirm. Nothing was changed.",
    );
    return { mode: "refused", exitCode: 2 };
  }

  const since = opts.since ?? NEWSLETTER_CONSENT_SINCE;
  const plan = planBackfill(await store.listUnqueued(), since);

  print(apply ? "Reach backfill" : "Reach backfill (dry run: nothing is changed or sent)");
  print(`Consent copy since: ${since.toISOString()}`);
  print(`Never-queued newsletter rows: ${plan.total}`);
  print(`Eligible (source blog/post, created since the consent copy): ${plan.eligible.length}`);
  print(`Not eligible, other source: ${plan.wrongSource.length}`);
  print(`Not eligible, created before the consent copy: ${plan.beforeConsentCopy.length}`);

  if (!apply) return { mode: "dry-run", plan, exitCode: 0 };

  const queued = await store.queue(plan.eligible, "pending");
  const skipped = await store.queue(
    [...plan.wrongSource, ...plan.beforeConsentCopy],
    "skipped_ineligible",
  );
  print(`Queued as pending: ${queued}. Marked skipped_ineligible: ${skipped}.`);
  print("The retry job (scripts/reach-retry.mjs) sends the pending rows.");
  return { mode: "applied", plan, exitCode: 0 };
}
