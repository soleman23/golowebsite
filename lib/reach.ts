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
 * - list:   GET  /api/reach/v1/profiles/{profileUuid}/contacts?search=&subscription_status=&per_page=
 *   Paginated (per_page default 25, max 100; `meta.total` counts all
 *   matches), and `search` is a search term, not an exact filter. We ask for
 *   100 and match the address exactly ourselves. If Reach reports more
 *   matches than it returned, or the pagination info is missing, the lookup
 *   counts as a failure, never as "not in Reach": an address on page two
 *   could be the unsubscribed one.
 * - create: POST /api/reach/v1/profiles/{profileUuid}/contacts {email}
 *   "If double opt-in is enabled, the contact will be created with a pending
 *   status and a confirmation email will be sent." Double opt-in is a profile
 *   setting the owner turns on in Reach; the staging check confirms it.
 *
 * Errors come back as short codes. Neither the token, the address, the URL
 * (which carries the address as `search`) nor a response body is logged or
 * put into an error.
 */

import "server-only";
import { isReachSyncFlagOn } from "./reachSync";
import type {
  ReachClient,
  ReachContactStatus,
  FindContactResult,
  CreateContactResult,
} from "./reachSync";

export const REACH_BASE_URL = "https://developers.hostinger.com";
const TIMEOUT_MS = 8000;

/** Suppression first: an unsubscribed match wins over any other. */
const STATUS_ORDER: ReachContactStatus[] = [
  "unsubscribed",
  "pending",
  "subscribed",
  "confirmed",
];

export type ReachConfig = { token: string; profileUuid: string };

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

/** `total` from a `meta` object, if it's a whole number. */
function totalOf(meta: unknown): number | null {
  const total = (meta as { total?: unknown } | null | undefined)?.total;
  return typeof total === "number" && Number.isInteger(total) && total >= 0 ? total : null;
}

/**
 * The contacts from a list response and its `meta.total` (at the top level
 * or beside a nested `data`). Null if either is missing: without the total
 * we can't know the page holds every match.
 */
function pageOf(body: unknown): { contacts: unknown[]; total: number } | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const outer = body as { data?: unknown; meta?: unknown };
  if (Array.isArray(outer.data)) {
    const total = totalOf(outer.meta);
    return total === null ? null : { contacts: outer.data, total };
  }
  if (outer.data && typeof outer.data === "object") {
    const inner = outer.data as { data?: unknown; meta?: unknown };
    const total = totalOf(inner.meta) ?? totalOf(outer.meta);
    if (Array.isArray(inner.data) && total !== null) return { contacts: inner.data, total };
  }
  return null;
}

function hasEmail(contacts: unknown[], email: string): boolean {
  return contacts.some((contact) => {
    const value = (contact as { email?: unknown } | null)?.email;
    return typeof value === "string" && value.trim().toLowerCase() === email;
  });
}

export function createHttpReachClient(
  config: ReachConfig,
  fetchImpl: typeof fetch = fetch,
): ReachClient {
  const contactsUrl = `${REACH_BASE_URL}/api/reach/v1/profiles/${encodeURIComponent(
    config.profileUuid,
  )}/contacts`;

  async function call(url: string, init: RequestInit): Promise<Response | string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetchImpl(url, {
        ...init,
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/json",
          ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (err) {
      return (err as { name?: string })?.name === "AbortError" ? "timeout" : "network";
    } finally {
      clearTimeout(timer);
    }
  }

  /** Whether Reach lists this exact address under one status. */
  async function listedAs(
    email: string,
    status: ReachContactStatus,
  ): Promise<boolean | string> {
    const params = new URLSearchParams({
      search: email,
      subscription_status: status,
      per_page: String(PER_PAGE),
    });
    const res = await call(`${contactsUrl}?${params}`, { method: "GET" });
    if (typeof res === "string") return res;
    if (!res.ok) return `http_${res.status}`;
    const page = pageOf(await res.json().catch(() => undefined));
    if (!page) return "bad_response";
    if (page.total > page.contacts.length) return "incomplete_page";
    return hasEmail(page.contacts, email);
  }

  return {
    async findContact(rawEmail): Promise<FindContactResult> {
      const email = rawEmail.trim().toLowerCase();
      const results = await Promise.all(STATUS_ORDER.map((s) => listedAs(email, s)));
      const error = results.find((r): r is string => typeof r === "string");
      if (error) return { ok: false, error };
      const index = results.findIndex((r) => r === true);
      return { ok: true, status: index === -1 ? null : STATUS_ORDER[index] };
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
