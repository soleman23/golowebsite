/**
 * Hostinger Reach public-API client (soleman23/golowebsite#121). Server only.
 *
 * OFF unless the server env has REACH_SYNC_ENABLED=true, plus REACH_API_TOKEN
 * and REACH_PROFILE_UUID. With the flag unset (the default everywhere) or any
 * of the three missing, getReachClient() returns null and nothing calls Reach.
 * The owner turns it on only after confirming the Reach workspace, plan and
 * limits (soleman23/golo#791). None of these is ever NEXT_PUBLIC_.
 *
 * Endpoints (developers.hostinger.com OpenAPI, read 2026-10-21):
 * - list:   GET  /api/reach/v1/profiles/{profileUuid}/contacts?search=&per_page=&page=
 *   Paginated (per_page default 25, max 100; `meta` carries current_page and
 *   total), and `search` is a search term, not an exact filter. We search
 *   without a status filter, walk every page up to MAX_PAGES and match the
 *   address exactly ourselves, then read each match's subscription_status.
 *   Anything we can't read completely (a failed page, missing pagination
 *   info, a page that isn't the one asked for, more pages than MAX_PAGES, or
 *   a match whose status isn't one we know) is a failure, never "not in
 *   Reach": the unreadable part could hold the unsubscribed contact.
 * - create: POST /api/reach/v1/profiles/{profileUuid}/contacts {email}
 *   "If double opt-in is enabled, the contact will be created with a pending
 *   status and a confirmation email will be sent." Double opt-in is a profile
 *   setting the owner turns on in Reach; the staging check confirms it.
 * - reactivation guard (golo#791): the same list filtered by
 *   subscription_status (confirmed, then subscribed), every page, and
 *   PATCH /api/reach/v1/profiles/{profileUuid}/contacts/{contactUuid}
 *   {subscription_status: "unsubscribed"}. Live 2026-10-23: the PATCH sends
 *   no email, and the contact drops out of campaign audiences.
 *
 * Errors come back as short codes. Neither the token, the address, the URL
 * (which carries the address as `search`) nor a response body is logged or
 * put into an error.
 */

import "server-only";
import { isReachSyncFlagOn, isReactivated } from "./reachSync";
import type {
  ReachClient,
  ReachContactStatus,
  FindContactResult,
  CreateContactResult,
  DeleteContactResult,
  ActiveContact,
  ListActiveResult,
  UnsubscribeResult,
} from "./reachSync";

export const REACH_BASE_URL = "https://developers.hostinger.com";
const TIMEOUT_MS = 8000;

const KNOWN_STATUSES: readonly ReachContactStatus[] = [
  "unsubscribed",
  "pending",
  "subscribed",
  "confirmed",
];

export type ReachConfig = {
  token: string;
  profileUuid: string;
  /** Page size for lookups; 100 (Reach's maximum) unless a test sets it. */
  perPage?: number;
};

type Env = Record<string, string | undefined>;

/**
 * The config when sync is on and complete; null otherwise. Flag on with a
 * missing token or profile logs which variable is missing (names only) and
 * stays off.
 */
export function reachConfigFromEnv(env: Env = process.env): ReachConfig | null {
  if (!isReachSyncFlagOn(env)) return null;
  const token = env.REACH_API_TOKEN?.trim();
  const profileUuid = env.REACH_PROFILE_UUID?.trim();
  if (!token || !profileUuid) {
    console.error(
      "[reach] REACH_SYNC_ENABLED=true but",
      !token ? "REACH_API_TOKEN" : "REACH_PROFILE_UUID",
      "is missing; sync stays off.",
    );
    return null;
  }
  return { token, profileUuid };
}

/** The live client, or null while sync is off. */
export function getReachClient(env: Env = process.env): ReachClient | null {
  const config = reachConfigFromEnv(env);
  return config ? createHttpReachClient(config) : null;
}

const PER_PAGE = 100;
/** At 100 a page, 1,000 matches. A search term matching more is a failure. */
export const MAX_PAGES = 10;
/** The guard's walk, per status: 5,000 contacts at 100 a page. More is a failure, so it shows. */
export const ACTIVE_MAX_PAGES = 50;
const ACTIVE_STATUSES = ["confirmed", "subscribed"] as const;

/** A whole number >= min from a `meta` field, or null. */
function wholeOf(meta: unknown, key: string, min: number): number | null {
  const value = (meta as Record<string, unknown> | null | undefined)?.[key];
  return typeof value === "number" && Number.isInteger(value) && value >= min ? value : null;
}

/**
 * The contacts on one list page, with its `meta` (at the top level or beside
 * a nested `data`). Null without a readable total and current page: without
 * them we can't know we've seen every match.
 */
function pageOf(
  body: unknown,
): { contacts: unknown[]; total: number; currentPage: number; perPage: number | null } | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const outer = body as { data?: unknown; meta?: unknown };
  let contacts: unknown;
  let meta: unknown = outer.meta;
  if (Array.isArray(outer.data)) {
    contacts = outer.data;
  } else if (outer.data && typeof outer.data === "object") {
    const inner = outer.data as { data?: unknown; meta?: unknown };
    contacts = inner.data;
    meta = inner.meta ?? outer.meta;
  }
  const total = wholeOf(meta, "total", 0);
  const currentPage = wholeOf(meta, "current_page", 1);
  if (!Array.isArray(contacts) || total === null || currentPage === null) return null;
  return { contacts, total, currentPage, perPage: wholeOf(meta, "per_page", 1) };
}

type Match = { status: unknown; uuid: unknown };

/** The rows whose email is exactly this address (trimmed, case-insensitive). */
function matchesOf(contacts: unknown[], email: string): Match[] {
  const matches: Match[] = [];
  for (const contact of contacts) {
    const row = contact as { email?: unknown; subscription_status?: unknown; uuid?: unknown } | null;
    if (typeof row?.email === "string" && row.email.trim().toLowerCase() === email) {
      matches.push({ status: row.subscription_status, uuid: row.uuid });
    }
  }
  return matches;
}

/**
 * What the matches say. Unsubscribed wins over anything else; a match whose
 * status isn't one we know makes the lookup ambiguous, which is a failure.
 */
function statusOf(matches: Match[]): FindContactResult {
  if (matches.length === 0) return { ok: true, status: null };
  const statuses = matches.map((m) =>
    typeof m.status === "string" ? m.status.trim().toLowerCase() : "",
  );
  if (statuses.includes("unsubscribed")) return { ok: true, status: "unsubscribed" };
  const known = statuses.filter((s): s is ReachContactStatus =>
    (KNOWN_STATUSES as readonly string[]).includes(s),
  );
  if (known.length !== statuses.length) return { ok: false, error: "ambiguous_status" };
  return { ok: true, status: known[0] };
}

export function createHttpReachClient(
  config: ReachConfig,
  fetchImpl: typeof fetch = fetch,
): ReachClient {
  const contactsUrl = `${REACH_BASE_URL}/api/reach/v1/profiles/${encodeURIComponent(
    config.profileUuid,
  )}/contacts`;

  /**
   * One request, with the timeout covering the whole exchange: the body is
   * read before the timer is cleared, so a response whose body stalls can't
   * hold up the retry job (and its lock). The body is parsed JSON, or
   * undefined when it isn't JSON.
   */
  async function call(
    url: string,
    init: RequestInit,
  ): Promise<{ ok: boolean; status: number; body: unknown } | string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetchImpl(url, {
        ...init,
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/json",
          ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
        signal: controller.signal,
        cache: "no-store",
      });
      const text = await res.text();
      let body: unknown;
      try {
        body = JSON.parse(text);
      } catch {
        body = undefined;
      }
      return { ok: res.ok, status: res.status, body };
    } catch (err) {
      return (err as { name?: string })?.name === "AbortError" ? "timeout" : "network";
    } finally {
      clearTimeout(timer);
    }
  }

  /** Every contact whose email is exactly this address, or why the walk failed. */
  async function lookup(email: string): Promise<{ ok: true; matches: Match[] } | { ok: false; error: string }> {
    const asked = config.perPage ?? PER_PAGE;
    const matches: Match[] = [];
    let pages = 1;
    let perPage = asked;
    let total = 0;
    for (let page = 1; page <= pages; page += 1) {
      const params = new URLSearchParams({
        search: email,
        per_page: String(asked),
        page: String(page),
      });
      const res = await call(`${contactsUrl}?${params}`, { method: "GET" });
      if (typeof res === "string") return { ok: false, error: res };
      if (!res.ok) return { ok: false, error: `http_${res.status}` };
      const body = pageOf(res.body);
      if (!body) return { ok: false, error: "bad_response" };
      if (body.currentPage !== page) return { ok: false, error: "wrong_page" };
      if (page === 1) {
        // Reach may serve fewer per page than asked; page by what it says.
        perPage = body.perPage ?? asked;
        total = body.total;
        pages = Math.max(1, Math.ceil(total / perPage));
        if (pages > MAX_PAGES) return { ok: false, error: "too_many_matches" };
      } else if (body.total !== total || (body.perPage ?? perPage) !== perPage) {
        // The list changed under us; a match could have moved across pages.
        return { ok: false, error: "list_changed" };
      }
      // Every page but the last must be full, and the last must bring the
      // count to the total. A short read means we didn't see every match.
      const expected = page < pages ? perPage : total - perPage * (pages - 1);
      if (body.contacts.length < expected) return { ok: false, error: "incomplete_page" };
      matches.push(...matchesOf(body.contacts, email));
    }
    return { ok: true, matches };
  }

  return {
    async findContact(rawEmail): Promise<FindContactResult> {
      const found = await lookup(rawEmail.trim().toLowerCase());
      return found.ok ? statusOf(found.matches) : found;
    },

    /**
     * Deletes every contact with exactly this address (a deletion request,
     * docs/seo-progress.md). The lookup must be complete first: a failed walk
     * deletes nothing and is reported. Deleting also removes Reach's
     * unsubscribed mark for the address.
     */
    async deleteContact(rawEmail): Promise<DeleteContactResult> {
      const found = await lookup(rawEmail.trim().toLowerCase());
      if (!found.ok) return found;
      if (found.matches.some((match) => typeof match.uuid !== "string" || match.uuid === "")) {
        return { ok: false, error: "missing_uuid" };
      }
      let deleted = 0;
      for (const match of found.matches) {
        const res = await call(`${contactsUrl}/${encodeURIComponent(match.uuid as string)}`, { method: "DELETE" });
        if (typeof res === "string") return { ok: false, error: res };
        if (!res.ok) return { ok: false, error: `http_${res.status}` };
        deleted += 1;
      }
      return { ok: true, deleted };
    },

    /**
     * Every confirmed or subscribed contact, for the reactivation guard. Each
     * status is walked to the last page the latest meta reports, paged by the
     * size Reach states on page 1 (as lookup does). A failed page, a page
     * before the last that is short (we'd miss contacts on every run), a
     * reactivated row without a uuid, or more than ACTIVE_MAX_PAGES pages is a
     * failure. Any other row without a uuid or email is skipped: the guard
     * would never act on it.
     */
    async listActiveContacts(): Promise<ListActiveResult> {
      const asked = config.perPage ?? PER_PAGE;
      const contacts: ActiveContact[] = [];
      for (const status of ACTIVE_STATUSES) {
        let pages = 1;
        let perPage = asked;
        for (let page = 1; page <= pages; page += 1) {
          const params = new URLSearchParams({
            subscription_status: status,
            per_page: String(asked),
            page: String(page),
          });
          const res = await call(`${contactsUrl}?${params}`, { method: "GET" });
          if (typeof res === "string") return { ok: false, error: res };
          if (!res.ok) return { ok: false, error: `http_${res.status}` };
          const body = pageOf(res.body);
          if (!body) return { ok: false, error: "bad_response" };
          if (body.currentPage !== page) return { ok: false, error: "wrong_page" };
          if (page === 1) perPage = body.perPage ?? asked;
          pages = Math.max(1, Math.ceil(body.total / perPage));
          if (pages > ACTIVE_MAX_PAGES) return { ok: false, error: "too_many_contacts" };
          if (page < pages && body.contacts.length < perPage) return { ok: false, error: "incomplete_page" };
          for (const contact of body.contacts) {
            const row = contact as { uuid?: unknown; email?: unknown; subscription_status?: unknown; unsubscribed_at?: unknown } | null;
            const parsed = {
              uuid: typeof row?.uuid === "string" ? row.uuid : "",
              email: typeof row?.email === "string" ? row.email : "",
              status: typeof row?.subscription_status === "string" ? row.subscription_status : "",
              unsubscribedAt: row?.unsubscribed_at ?? null,
            };
            if (parsed.uuid === "" || parsed.email === "") {
              if (parsed.uuid === "" && isReactivated(parsed)) return { ok: false, error: "bad_row" };
              continue;
            }
            contacts.push(parsed);
          }
        }
      }
      return { ok: true, contacts };
    },

    /**
     * PATCHes one contact to unsubscribed. A 2xx whose body names another
     * status is a failure.
     */
    async unsubscribeContact(uuid): Promise<UnsubscribeResult> {
      const res = await call(`${contactsUrl}/${encodeURIComponent(uuid)}`, {
        method: "PATCH",
        body: JSON.stringify({ subscription_status: "unsubscribed" }),
      });
      if (typeof res === "string") return { ok: false, error: res };
      if (!res.ok) return { ok: false, error: `http_${res.status}` };
      const outer = res.body as { subscription_status?: unknown; data?: { subscription_status?: unknown } } | undefined;
      const status = outer?.subscription_status ?? outer?.data?.subscription_status;
      if (status !== undefined && status !== "unsubscribed") return { ok: false, error: "not_unsubscribed" };
      return { ok: true };
    },

    async createContact(rawEmail): Promise<CreateContactResult> {
      const email = rawEmail.trim().toLowerCase();
      const res = await call(contactsUrl, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (typeof res === "string") return { ok: false, error: res };
      if (!res.ok) return { ok: false, error: `http_${res.status}` };
      return { ok: true };
    },
  };
}
