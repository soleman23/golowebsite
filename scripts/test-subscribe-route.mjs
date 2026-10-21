#!/usr/bin/env node
/**
 * Wiring checks for POST /api/subscribe: the real route handler
 * (app/api/subscribe/route.ts) with the real guard, schema and next/server,
 * and a fake database and mailer. `npm run test:guard` runs this after
 * scripts/test-subscribe-guard.mjs, and CI runs both as one step.
 *
 * Hermetic: @/lib/db, @/lib/email and @/lib/env are swapped for in-memory
 * stand-ins, so nothing touches a database or sends mail. The route's limiter
 * runs on the real clock and lives for the whole run, so every case uses its
 * own client address and the cases that fill the global ceiling run last.
 *
 * Exit 1 with one line per failed case.
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("..", import.meta.url);

/** What the route did, as seen by the stand-ins. */
const world = {
  leads: new Map(),
  creates: [],
  notifications: [],
  logs: [],
  /** The next N saves throw, as a database outage would. */
  failSaves: 0,
};
globalThis.__subscribeRouteTest = world;

const stub = (source) => `data:text/javascript,${encodeURIComponent(source)}`;
const STUBS = {
  "@/lib/db": stub(`
    const world = globalThis.__subscribeRouteTest;
    export const prisma = {
      newsletterLead: {
        async create({ data }) {
          if (world.failSaves > 0) {
            world.failSaves -= 1;
            throw Object.assign(new Error("Invalid invocation: email = " + data.email), { code: "P1001" });
          }
          // Yield first, so overlapping requests interleave as they would
          // against a real database; the unique index still decides.
          await new Promise((resolve) => setTimeout(resolve, 0));
          if (world.leads.has(data.email)) {
            throw Object.assign(new Error("Unique constraint failed on email = " + data.email), { code: "P2002" });
          }
          world.leads.set(data.email, "lead_" + world.leads.size);
          world.creates.push(data);
          return { id: world.leads.get(data.email) };
        },
      },
    };
  `),
  "@/lib/email": stub(`
    export async function sendNewsletterNotification(email, source) {
      globalThis.__subscribeRouteTest.notifications.push({ email, source });
      return { sent: false, stub: true };
    }
  `),
  "@/lib/env": stub(`export function assertDatabaseConfigured() {}`),
};

/**
 * Stand-ins first; then the "@/" alias and extensionless "./sibling" imports
 * to the .ts file, as scripts/test-attribution.mjs does; and next/server to
 * its .js entry, which plain Node needs (next has no exports map).
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (STUBS[specifier]) return { url: STUBS[specifier], shortCircuit: true };
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    const base = specifier.startsWith("@/")
      ? new URL(specifier.slice(2), rootUrl)
      : specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)
        ? new URL(specifier, context.parentURL)
        : null;
    if (base) {
      for (const ext of [".ts", "/index.ts"]) {
        const url = new URL(base.href + ext);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

// As the live site is built: production, canonical www host.
process.env.NODE_ENV = "production";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.golo.golf";

for (const level of ["info", "warn", "error"]) {
  console[level] = (...args) => world.logs.push(args.map(String).join(" "));
}

const { POST } = await import(new URL("../app/api/subscribe/route.ts", import.meta.url).href);
const { GLOBAL_LIMIT, MAX_BODY_BYTES, PER_CLIENT_LIMIT } = await import(
  new URL("../lib/subscribeGuard.ts", import.meta.url).href
);

let lastAddress = 0;
const usedAddresses = [];
const usedEmails = [];

/** A fresh client address per call unless one is given. */
function nextAddress() {
  lastAddress += 1;
  const address = `198.51.${Math.floor(lastAddress / 250)}.${(lastAddress % 250) + 1}`;
  usedAddresses.push(address);
  return address;
}

function nextEmail() {
  const email = `guard-test-${usedEmails.length + 1}@example.com`;
  usedEmails.push(email);
  return email;
}

/**
 * A POST as the browser form sends it: same-origin, from www.golo.golf through
 * a proxy that sets X-Real-IP.
 */
function post({
  address = nextAddress(),
  host = "www.golo.golf",
  origin = `https://${host}`,
  body,
  json = { email: nextEmail(), source: "blog", hp_note: "" },
  headers = {},
} = {}) {
  const all = { "content-type": "application/json", host, "x-real-ip": address, ...headers };
  if (origin !== null) all.origin = origin;
  return POST(
    new Request(`https://${host}/api/subscribe`, {
      method: "POST",
      headers: all,
      body: body ?? JSON.stringify(json),
      duplex: "half",
    }),
  );
}

/** Saves and notifications a check caused. */
async function effects(run) {
  const creates = world.creates.length;
  const notifications = world.notifications.length;
  const res = await run();
  return {
    res,
    text: await res.text(),
    saved: world.creates.length - creates,
    notified: world.notifications.length - notifications,
  };
}

/** A stream with no Content-Length, `size` bytes of spaces in 1 KB chunks. */
function streamOf(size) {
  let left = size;
  return new ReadableStream({
    pull(controller) {
      if (left <= 0) return controller.close();
      const n = Math.min(1024, left);
      left -= n;
      controller.enqueue(new Uint8Array(n).fill(32));
    },
  });
}

/** [name, check] — run in order; the global-ceiling cases come last. */
const cases = [
  [
    "valid sign-up: 200, one save, one notification, honeypot not stored",
    async () => {
      const { res, text, saved, notified } = await effects(() => post());
      assert.equal(res.status, 200);
      assert.equal(text, '{"ok":true}');
      assert.equal(saved, 1);
      assert.equal(notified, 1);
      const create = world.creates.at(-1);
      assert.equal(create.email, usedEmails.at(-1));
      assert.ok(!("hp_note" in create), "hp_note reached the insert");
    },
  ],
  [
    "repeat sign-up: 200, no second save or notification",
    async () => {
      const email = nextEmail();
      await post({ json: { email, hp_note: "" } });
      const { res, saved, notified } = await effects(() => post({ json: { email, hp_note: "" } }));
      assert.equal(res.status, 200);
      assert.equal(saved, 0);
      assert.equal(notified, 0);
    },
  ],
  [
    "honeypot filled (300 characters, bad email): the same 200, nothing saved or sent",
    async () => {
      const { res, text, saved, notified } = await effects(() =>
        post({ json: { email: "not-an-email", hp_note: "x".repeat(300) } }),
      );
      assert.equal(res.status, 200);
      assert.equal(text, '{"ok":true}');
      assert.equal(saved, 0);
      assert.equal(notified, 0);
      assert.ok(world.logs.at(-1) === "[subscribe] dropped: honeypot");
    },
  ],
  [
    "foreign Origin: 403 with the friendly message, nothing saved",
    async () => {
      const { res, text, saved } = await effects(() => post({ origin: "https://evil.example" }));
      assert.equal(res.status, 403);
      assert.deepEqual(JSON.parse(text), { error: "This sign-up form only works on golo.golf." });
      assert.equal(saved, 0);
    },
  ],
  [
    "same-host Origin on a preview host is allowed",
    async () => {
      const host = "golowebsite-pr-126.example.app";
      const { res, saved } = await effects(() => post({ host }));
      assert.equal(res.status, 200);
      assert.equal(saved, 1);
    },
  ],
  [
    "preview host behind a proxy: X-Forwarded-Host is the request's host",
    async () => {
      const { res } = await effects(() =>
        post({
          host: "internal.hcdn",
          origin: "https://golowebsite-pr-126.example.app",
          headers: { "x-forwarded-host": "golowebsite-pr-126.example.app" },
        }),
      );
      assert.equal(res.status, 200);
    },
  ],
  [
    "apex Origin on the www host is allowed",
    async () => assert.equal((await post({ origin: "https://golo.golf" })).status, 200),
  ],
  [
    "no Origin (curl) is allowed",
    async () => assert.equal((await post({ origin: null })).status, 200),
  ],
  [
    "6th request from one client: 429 with Retry-After",
    async () => {
      const address = nextAddress();
      for (let i = 0; i < PER_CLIENT_LIMIT; i += 1) {
        assert.equal((await post({ address, json: { email: "x@example.com", hp_note: "bot" } })).status, 200);
      }
      const { res, text, saved } = await effects(() => post({ address }));
      assert.equal(res.status, 429);
      assert.equal(JSON.parse(text).error, "Too many sign-up attempts. Please try again in a few minutes.");
      const retryAfter = Number(res.headers.get("retry-after"));
      assert.ok(retryAfter >= 1 && retryAfter <= 600, `Retry-After ${retryAfter}`);
      assert.equal(saved, 0);
    },
  ],
  [
    "a limited client doesn't hold up the next one",
    async () => assert.equal((await post()).status, 200),
  ],
  [
    "body over 4 KB, streamed without Content-Length: 413",
    async () => {
      const { res, saved } = await effects(() => post({ body: streamOf(MAX_BODY_BYTES + 1) }));
      assert.equal(res.status, 413);
      assert.equal(saved, 0);
    },
  ],
  [
    "body over 4 KB with a Content-Length: 413",
    async () => {
      const big = JSON.stringify({ email: nextEmail(), pad: "x".repeat(MAX_BODY_BYTES) });
      // Request doesn't set Content-Length for a string body, so set it, or
      // this would only exercise the streamed cap.
      const res = await post({ body: big, headers: { "content-length": String(Buffer.byteLength(big)) } });
      assert.equal(res.status, 413);
    },
  ],
  [
    "invalid JSON: 400",
    async () => {
      const { res, text } = await effects(() => post({ body: "{not json" }));
      assert.equal(res.status, 400);
      assert.deepEqual(JSON.parse(text), { error: "Invalid request body." });
    },
  ],
  [
    "invalid email: 400 with the email field error only",
    async () => {
      const { res, text } = await effects(() => post({ json: { email: "nope", hp_note: "" } }));
      assert.equal(res.status, 400);
      assert.deepEqual(Object.keys(JSON.parse(text).fieldErrors), ["email"]);
    },
  ],
  [
    "honeypot and invalid requests don't charge the global ceiling",
    async () => {
      for (let i = 0; i < GLOBAL_LIMIT; i += 1) {
        assert.equal((await post({ json: { email: nextEmail(), hp_note: "bot" } })).status, 200);
        assert.equal((await post({ body: "{not json" })).status, 400);
        assert.equal((await post({ json: { email: "nope" } })).status, 400);
      }
      assert.equal((await post()).status, 200);
    },
  ],
  [
    "overlapping sign-ups for one new address: one lead, one notification",
    async () => {
      const email = nextEmail();
      const notifiedBefore = world.notifications.length;
      const results = await Promise.all([1, 2, 3].map(() => post({ json: { email, source: "blog", hp_note: "" } })));
      assert.deepEqual(results.map((r) => r.status), [200, 200, 200]);
      assert.equal(world.creates.filter((c) => c.email === email).length, 1);
      assert.equal(world.notifications.length - notifiedBefore, 1);
    },
  ],
  [
    "a failed save gives its global slot back, and logs no address",
    async () => {
      const before = world.creates.length;
      world.failSaves = GLOBAL_LIMIT + 5;
      for (let i = 0; i < GLOBAL_LIMIT + 5; i += 1) {
        assert.equal((await post()).status, 500);
      }
      assert.equal(world.failSaves, 0);
      assert.equal(world.creates.length, before);
      assert.equal(world.logs.at(-1), "[subscribe] failed to save lead: P1001");
      assert.equal((await post()).status, 200);
    },
  ],
  [
    "global ceiling: sign-up 61 in the window gets 429, and then everyone does",
    async () => {
      // The sign-ups earlier cases saved count too, so this fills sooner.
      let res;
      for (let i = 0; i <= GLOBAL_LIMIT; i += 1) {
        res = await post();
        if (res.status !== 200) break;
      }
      assert.equal(res.status, 429);
      assert.ok(Number(res.headers.get("retry-after")) >= 1);
      assert.equal(world.logs.at(-1), "[subscribe] blocked: rate_limit_global");
      const before = world.creates.length;
      const honeypot = await post({ json: { email: nextEmail(), hp_note: "bot" } });
      assert.equal(honeypot.status, 429);
      assert.equal(world.creates.length, before);
    },
  ],
  [
    "exactly GLOBAL_LIMIT sign-ups were charged across the run",
    () => {
      // One charge per new lead; none for the repeat sign-up or the failed
      // saves (both give their slot back), honeypots or invalid requests.
      assert.equal(world.creates.length, GLOBAL_LIMIT);
    },
  ],
  [
    "the client-ip header shape was logged once in the whole run, without values",
    () => {
      const shapes = world.logs.filter((line) => line.includes("client-ip headers"));
      assert.deepEqual(shapes, ["[subscribe] client-ip headers: x-real-ip=yes xff_entries=0"]);
    },
  ],
  [
    "no log line carries an address, an email or a key",
    () => {
      for (const line of world.logs) {
        for (const value of [...usedAddresses, ...usedEmails, "@"]) {
          assert.ok(!line.includes(value), `log line contains ${value}: ${line}`);
        }
      }
    },
  ],
];

const failures = [];
let passed = 0;

for (const [index, [name, check]] of cases.entries()) {
  try {
    await check();
    passed += 1;
  } catch (err) {
    failures.push(`${index + 1}. ${name}: ${err.message.split("\n")[0]}`);
  }
}

if (failures.length) {
  for (const line of failures) process.stderr.write(`${line}\n`);
  process.stderr.write(`\n${failures.length} failed, ${passed} passed.\n`);
  process.exit(1);
}
process.stdout.write(`Subscribe route: ${passed} cases passed.\n`);
