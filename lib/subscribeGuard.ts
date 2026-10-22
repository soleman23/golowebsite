/**
 * Abuse protection for POST /api/subscribe. Every new sign-up sends an
 * internal notification (Resend), and the Hostinger Reach sync planned in #124
 * will send a confirmation to the submitted address, against a plan of 1,000
 * recipients and 7,000 emails a month. Without a guard, anyone could script
 * the endpoint into mailing arbitrary addresses until the quota runs out.
 *
 * Four checks, all in-process, with no third-party script, cookie or CAPTCHA:
 *
 * - A body-size cap (MAX_BODY_BYTES). A real sign-up is a few hundred bytes.
 * - An Origin check. A browser posting from another site is refused; a request
 *   with no Origin (curl, a server) is let through to the rate limit.
 * - A rate limit per client, counting every request, and a global ceiling,
 *   counting only sign-ups that are about to be saved. Both over WINDOW_MS.
 * - A honeypot field the form hides from people (NewsletterBand.tsx).
 *
 * Assumptions:
 *
 * - The limits are per Node process. Hostinger runs the site as one process
 *   (as does ecosystem.config.js), so per process is the whole site. A second
 *   process would double both limits, and a restart clears them.
 * - The client is the LAST X-Forwarded-For entry: the one the nearest proxy
 *   appended, which a client can't choose. X-Real-IP isn't used: on the live
 *   host (2026-10-21) a client-sent X-Real-IP reached the app unchanged, as
 *   did a client-sent first X-Forwarded-For entry, and both let one machine
 *   dodge the per-client limit. Next sets X-Forwarded-For to the socket
 *   address when it's missing, so if no proxy appends one, every visitor
 *   shares the proxy's key; headerShape logs which IP headers arrive (names
 *   only) so the live host can show that.
 * - A spoofed header that does get through only rotates a key: each fake
 *   address gets its own 5, and the global ceiling caps what gets saved
 *   either way.
 * - The global ceiling is an off-switch. Junk (honeypot, invalid input)
 *   doesn't charge it, but a flood of valid-looking sign-ups closes it, and it
 *   stays closed for as long as the flood lasts. Real visitors then get the
 *   429 message; that's the trade for a bounded send count.
 *
 * Erasable TypeScript only, with no imports beyond node:crypto, so the
 * scripts/test-subscribe-*.mjs checks run it in plain Node by stripping types.
 */

import { createHmac, randomBytes } from "node:crypto";

/** The length of both rate-limit windows: 10 minutes. */
export const WINDOW_MS = 10 * 60 * 1000;

/**
 * Requests one client may make per window, valid or not. A person needs one,
 * maybe two.
 */
export const PER_CLIENT_LIMIT = 5;

/**
 * Sign-ups the whole process saves per window, across every client, so a
 * flood of rotated keys can't get past it. This bounds the rate, not the
 * month: hit continuously it still allows 8,640 a day, more than the Reach
 * plan's monthly quota.
 */
export const GLOBAL_LIMIT = 60;

/**
 * Most client keys held at once; the least recently seen is evicted first.
 * Expired keys are pruned on every request, so this only matters under a
 * flood of rotated keys, and bounds memory whatever the other numbers are.
 */
export const MAX_TRACKED_KEYS = 10_000;

/** Largest request body accepted, in bytes. */
export const MAX_BODY_BYTES = 4 * 1024;

/**
 * The form's hidden field. A person never sees it, so a value means a bot.
 * Deliberately meaningless, so no browser or password manager autofills it.
 */
export const HONEYPOT_FIELD = "hp_note";

/** The shared key for requests that carry no address header at all. */
export const UNKNOWN_CLIENT = "unknown";

/** How often headerShape lines are logged after the first: once an hour. */
export const SHAPE_LOG_INTERVAL_MS = 60 * 60 * 1000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; scope: "client" | "global"; retryAfterSeconds: number };

/** A charge that went through can be taken back once (see `charge`). */
export type ChargeResult =
  | { ok: true; release: () => void }
  | Exclude<RateLimitResult, { ok: true }>;

export type RateLimiterOptions = {
  windowMs?: number;
  perClientLimit?: number;
  globalLimit?: number;
  maxTrackedKeys?: number;
  /** Injectable clock for tests. */
  now?: () => number;
};

/**
 * Two sliding windows. `hit` runs on every request: it refuses a client that
 * has made perClientLimit requests in the last windowMs, or any client while
 * the global ceiling is full, and otherwise records the request against the
 * client. `charge` runs once a sign-up has passed validation: it checks the
 * global ceiling again and records against it. A refused request isn't
 * recorded, so the wait never grows.
 */
export function createRateLimiter({
  windowMs = WINDOW_MS,
  perClientLimit = PER_CLIENT_LIMIT,
  globalLimit = GLOBAL_LIMIT,
  maxTrackedKeys = MAX_TRACKED_KEYS,
  now = Date.now,
}: RateLimiterOptions = {}) {
  // Key → times of its requests in the window, oldest first. A key is
  // re-inserted on every recorded request, so the Map's order is the order of
  // each key's latest request: expired keys are always at the front.
  const clients = new Map<string, number[]>();
  const saves: number[] = [];

  function prune(cutoff: number) {
    while (saves.length > 0 && saves[0] <= cutoff) saves.shift();
    for (const [key, times] of clients) {
      if (times[times.length - 1] > cutoff) break;
      clients.delete(key);
    }
  }

  function retryAfter(oldest: number, at: number) {
    return Math.max(1, Math.ceil((oldest + windowMs - at) / 1000));
  }

  function globalFull(at: number): Exclude<RateLimitResult, { ok: true }> | null {
    return saves.length >= globalLimit
      ? { ok: false, scope: "global", retryAfterSeconds: retryAfter(saves[0], at) }
      : null;
  }

  return {
    /** Checks both limits for `key`; if both allow it, records it for `key`. */
    hit(key: string): RateLimitResult {
      const at = now();
      const cutoff = at - windowMs;
      prune(cutoff);

      const times = (clients.get(key) ?? []).filter((time) => time > cutoff);
      if (times.length >= perClientLimit) {
        return { ok: false, scope: "client", retryAfterSeconds: retryAfter(times[0], at) };
      }
      const full = globalFull(at);
      if (full) return full;

      times.push(at);
      clients.delete(key);
      if (clients.size >= maxTrackedKeys) {
        const oldest = clients.keys().next().value;
        if (oldest !== undefined) clients.delete(oldest);
      }
      clients.set(key, times);
      return { ok: true };
    },

    /**
     * Checks the global ceiling again (the body was read in between) and, if
     * it allows, records one sign-up against it. `release` takes that back,
     * for a sign-up that turned out not to save anything new (a repeat, or a
     * database error), so neither can close the ceiling.
     */
    charge(): ChargeResult {
      const at = now();
      prune(at - windowMs);
      const full = globalFull(at);
      if (full) return full;
      saves.push(at);
      let released = false;
      return {
        ok: true,
        release() {
          if (released) return;
          released = true;
          const index = saves.indexOf(at);
          if (index !== -1) saves.splice(index, 1);
        },
      };
    },

    /** The keys currently held, least recently seen first. For tests. */
    trackedKeys(): string[] {
      return [...clients.keys()];
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;

/** The part of `Headers` the guard reads, so tests can pass a plain object. */
export type HeaderReader = {
  get(name: string): string | null;
  /** Header names, when the reader has them (Headers does). */
  keys?(): Iterable<string>;
};

/**
 * The client's address as the nearest proxy reports it: the last
 * X-Forwarded-For entry (a proxy appends to the end, so entries before it
 * may be whatever the client sent), else null.
 */
export function clientAddress(headers: HeaderReader): string | null {
  const entries = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry !== "");
  return entries.at(-1) ?? null;
}

/** Header names that could carry a client address, for headerShape. */
const IP_HEADER_NAME = /(^|-)(ip|forwarded|client|real|connecting|cdn)(-|$)/i;

/**
 * Which address headers a request carried, and how many X-Forwarded-For
 * entries: names and counts only, never a value. Logged so the live host can
 * show which header holds the client.
 */
export function headerShape(headers: HeaderReader): string {
  const real = headers.get("x-real-ip")?.trim() ? "yes" : "no";
  const forwarded = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .filter((entry) => entry.trim() !== "").length;
  const names = headers.keys
    ? [...new Set([...headers.keys()].map((name) => name.toLowerCase()))]
        .filter((name) => IP_HEADER_NAME.test(name))
        .sort()
    : [];
  return `x-real-ip=${real} xff_entries=${forwarded} ip_headers=${names.join(",") || "none"}`;
}

/**
 * Returns true the first time it's called, then at most once per intervalMs.
 * The route logs headerShape when it does.
 */
export function createLogThrottle(
  intervalMs: number = SHAPE_LOG_INTERVAL_MS,
  now: () => number = Date.now,
) {
  let last: number | null = null;
  return (): boolean => {
    const at = now();
    if (last !== null && at - last < intervalMs) return false;
    last = at;
    return true;
  };
}

// Per-process and never stored or logged, so a key can't be turned back into
// an address by hashing candidate IPs, and keys from one run mean nothing in
// the next.
const PROCESS_SALT = randomBytes(32);

/**
 * The rate-limit key for a request: an HMAC of the client's address, cut to 16
 * characters. The limiter only ever holds these, never an address. Requests
 * without an address header share UNKNOWN_CLIENT.
 */
export function clientKey(headers: HeaderReader, salt: Uint8Array = PROCESS_SALT): string {
  const address = clientAddress(headers);
  if (!address) return UNKNOWN_CLIENT;
  return createHmac("sha256", salt)
    .update(address.slice(0, 64).toLowerCase())
    .digest("base64url")
    .slice(0, 16);
}

/**
 * The host the request was addressed to: the first X-Forwarded-Host value,
 * else Host. Lower-cased, port kept; null when neither is set.
 */
export function requestHost(headers: HeaderReader): string | null {
  const host =
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() || headers.get("host")?.trim();
  return host ? host.toLowerCase() : null;
}

export type OriginPolicy = {
  /** NEXT_PUBLIC_SITE_URL, via siteConfig.url. Inlined at build time. */
  siteUrl: string;
  /** NODE_ENV === "production". Outside production, localhost is allowed too. */
  production: boolean;
  /** requestHost() of the request being checked. */
  host: string | null;
};

/**
 * The site's origin plus its www/apex twin (www.golo.golf ↔ golo.golf). A
 * value without a scheme is read as https; one that still isn't an http(s)
 * URL gives none.
 */
export function siteOrigins(siteUrl: string): string[] {
  let site: URL | null = null;
  for (const candidate of [siteUrl.trim(), `https://${siteUrl.trim()}`]) {
    try {
      const url = new URL(candidate);
      // "www.golo.golf:443" parses with "www.golo.golf:" as its scheme.
      if (url.protocol === "https:" || url.protocol === "http:") {
        site = url;
        break;
      }
    } catch {
      // Try the next reading.
    }
  }
  if (!site || !site.hostname) return [];
  const twin = site.hostname.startsWith("www.")
    ? site.hostname.slice(4)
    : `www.${site.hostname}`;
  const port = site.port ? `:${site.port}` : "";
  return [site.origin, `${site.protocol}//${twin}${port}`];
}

/**
 * False when the request carries an Origin that isn't the site's: a browser
 * posting from some other page. Allowed:
 *
 * - no Origin at all, since non-browser clients don't send one and the rate
 *   limit covers them;
 * - an Origin whose host is the host the request was sent to, so PR previews
 *   and any proxy hostname work without a rebuild. A cross-site page can't
 *   forge this: its browser sets Origin to its own host, and a custom
 *   X-Forwarded-Host header would need a CORS preflight this route never
 *   answers. The scheme isn't compared, because behind a TLS-terminating
 *   proxy the app can't trust what it sees for it;
 * - the site URL and its www/apex twin;
 * - http://localhost and http://127.0.0.1 on any port, outside production.
 */
export function isAllowedOrigin(
  origin: string | null,
  { siteUrl, production, host }: OriginPolicy,
): boolean {
  if (origin === null) return true;
  let url: URL;
  try {
    // Also rejects the literal "null" a sandboxed frame sends.
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (host !== null && url.host === host) return true;
  if (siteOrigins(siteUrl).includes(url.origin)) return true;
  return (
    !production &&
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1")
  );
}

/**
 * True when the payload's honeypot field holds anything: a non-blank string,
 * or any other non-null value.
 */
export function isHoneypotFilled(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  const value = (payload as Record<string, unknown>)[HONEYPOT_FIELD];
  if (value === undefined || value === null) return false;
  return typeof value !== "string" || value.trim() !== "";
}

/**
 * Reads a request body as text, giving up as soon as it passes `maxBytes`.
 * Returns null when it's too large. Content-Length alone isn't enough: a
 * chunked request doesn't send one.
 */
export async function readBodyText(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number = MAX_BODY_BYTES,
): Promise<string | null> {
  if (!body) return "";
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
