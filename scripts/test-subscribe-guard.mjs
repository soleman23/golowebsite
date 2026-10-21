#!/usr/bin/env node
/**
 * Newsletter abuse-guard checks (lib/subscribeGuard.ts). `npm run test:guard`
 * runs this, and CI runs it as its own step.
 *
 * Hermetic: the limiter runs on an injected clock, headers are plain objects,
 * and nothing starts a server, touches a database or sends mail.
 *
 * Exit 1 with one line per failed case.
 */

import assert from "node:assert/strict";

// subscribeGuard.ts imports nothing but node:crypto, so Node (>= 24) runs it
// as-is by stripping the types; no resolve hook needed.
const guard = await import(new URL("../lib/subscribeGuard.ts", import.meta.url).href);
const {
  GLOBAL_LIMIT,
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  PER_CLIENT_LIMIT,
  UNKNOWN_CLIENT,
  WINDOW_MS,
  clientAddress,
  clientKey,
  createRateLimiter,
  isAllowedOrigin,
  isHoneypotFilled,
  readBodyText,
} = guard;

const SITE = "https://www.golo.golf";
const PROD = { siteUrl: SITE, production: true };
const DEV = { siteUrl: SITE, production: false };
const SALT = new Uint8Array(32).fill(7);

/** A Headers stand-in: lower-cased names, null when absent. */
function headers(values) {
  const map = new Map(Object.entries(values).map(([k, v]) => [k.toLowerCase(), v]));
  return { get: (name) => map.get(name.toLowerCase()) ?? null };
}

/** A limiter on a clock the test moves by hand. */
function limiterAt(options = {}) {
  const clock = { t: 1_000_000 };
  const limiter = createRateLimiter({ now: () => clock.t, ...options });
  return { clock, limiter };
}

/** [name, check] — a check throws (via assert) when it fails. */
const cases = [
  [
    "per-client limit allows 5, refuses the 6th",
    () => {
      const { limiter } = limiterAt();
      for (let i = 0; i < PER_CLIENT_LIMIT; i += 1) assert.equal(limiter.hit("a").ok, true);
      const sixth = limiter.hit("a");
      assert.equal(sixth.ok, false);
      assert.equal(sixth.scope, "client");
    },
  ],
  [
    "a refused client doesn't hold up another",
    () => {
      const { limiter } = limiterAt();
      for (let i = 0; i <= PER_CLIENT_LIMIT; i += 1) limiter.hit("a");
      assert.equal(limiter.hit("b").ok, true);
    },
  ],
  [
    "Retry-After counts down to when the oldest request leaves the window",
    () => {
      const { clock, limiter } = limiterAt();
      for (let i = 0; i < PER_CLIENT_LIMIT; i += 1) limiter.hit("a");
      clock.t += 4 * 60 * 1000;
      assert.equal(limiter.hit("a").retryAfterSeconds, 6 * 60);
    },
  ],
  [
    "per-client limit resets once the window has passed",
    () => {
      const { clock, limiter } = limiterAt();
      for (let i = 0; i <= PER_CLIENT_LIMIT; i += 1) limiter.hit("a");
      clock.t += WINDOW_MS - 1;
      assert.equal(limiter.hit("a").ok, false);
      clock.t += 1;
      assert.equal(limiter.hit("a").ok, true);
    },
  ],
  [
    "sliding window: requests spread over time free up one at a time",
    () => {
      const { clock, limiter } = limiterAt();
      for (let i = 0; i < PER_CLIENT_LIMIT; i += 1) {
        limiter.hit("a");
        clock.t += 60 * 1000;
      }
      // 5 minutes in; the first request leaves the window at 10.
      clock.t += 5 * 60 * 1000 - 1;
      assert.equal(limiter.hit("a").ok, false);
      clock.t += 1;
      assert.equal(limiter.hit("a").ok, true);
      assert.equal(limiter.hit("a").ok, false);
    },
  ],
  [
    "global ceiling refuses request 61 across 61 different keys",
    () => {
      const { limiter } = limiterAt();
      for (let i = 0; i < GLOBAL_LIMIT; i += 1) assert.equal(limiter.hit(`k${i}`).ok, true);
      const over = limiter.hit("fresh");
      assert.equal(over.ok, false);
      assert.equal(over.scope, "global");
      assert.equal(over.retryAfterSeconds, WINDOW_MS / 1000);
    },
  ],
  [
    "global ceiling resets once the window has passed",
    () => {
      const { clock, limiter } = limiterAt();
      for (let i = 0; i < GLOBAL_LIMIT; i += 1) limiter.hit(`k${i}`);
      clock.t += WINDOW_MS;
      assert.equal(limiter.hit("fresh").ok, true);
    },
  ],
  [
    "expired keys are pruned",
    () => {
      const { clock, limiter } = limiterAt();
      limiter.hit("a");
      limiter.hit("b");
      clock.t += WINDOW_MS;
      limiter.hit("c");
      assert.deepEqual(limiter.trackedKeys(), ["c"]);
    },
  ],
  [
    "memory cap evicts the least recently seen key",
    () => {
      const { limiter } = limiterAt({ maxTrackedKeys: 3 });
      limiter.hit("a");
      limiter.hit("b");
      limiter.hit("c");
      limiter.hit("a"); // a is now the most recent
      limiter.hit("d");
      assert.deepEqual(limiter.trackedKeys(), ["c", "a", "d"]);
    },
  ],
  [
    "memory cap holds under a flood of keys",
    () => {
      const { limiter } = limiterAt({ maxTrackedKeys: 100, globalLimit: 1_000_000 });
      for (let i = 0; i < 5_000; i += 1) limiter.hit(`k${i}`);
      assert.equal(limiter.trackedKeys().length, 100);
      assert.equal(limiter.trackedKeys()[99], "k4999");
    },
  ],
  [
    "client key is a 16-character hash, and the limiter never holds the IP",
    () => {
      const { limiter } = limiterAt();
      const ip = "203.0.113.7";
      const key = clientKey(headers({ "X-Forwarded-For": ip }));
      assert.match(key, /^[A-Za-z0-9_-]{16}$/);
      limiter.hit(key);
      for (const stored of limiter.trackedKeys()) {
        assert.ok(!stored.includes(ip) && !stored.includes("203.0.113"), "raw IP stored");
      }
    },
  ],
  [
    "client key is stable per address and salt, and differs across both",
    () => {
      const a = clientKey(headers({ "x-forwarded-for": "203.0.113.7" }), SALT);
      assert.equal(clientKey(headers({ "x-forwarded-for": "203.0.113.7" }), SALT), a);
      assert.notEqual(clientKey(headers({ "x-forwarded-for": "203.0.113.8" }), SALT), a);
      assert.notEqual(clientKey(headers({ "x-forwarded-for": "203.0.113.7" }), new Uint8Array(32)), a);
    },
  ],
  [
    "X-Forwarded-For: the first entry is the client",
    () => {
      assert.equal(
        clientAddress(headers({ "x-forwarded-for": " 198.51.100.4 , 10.0.0.1, 10.0.0.2" })),
        "198.51.100.4",
      );
      assert.equal(
        clientKey(headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" }), SALT),
        clientKey(headers({ "x-forwarded-for": "198.51.100.4" }), SALT),
      );
    },
  ],
  [
    "X-Real-IP is the fallback, and keys the same as X-Forwarded-For",
    () => {
      assert.equal(clientAddress(headers({ "x-real-ip": "198.51.100.4" })), "198.51.100.4");
      assert.equal(clientAddress(headers({ "x-forwarded-for": " ", "x-real-ip": "198.51.100.4" })), "198.51.100.4");
      assert.equal(
        clientKey(headers({ "x-real-ip": "198.51.100.4" }), SALT),
        clientKey(headers({ "x-forwarded-for": "198.51.100.4" }), SALT),
      );
    },
  ],
  [
    "no address header gives the shared unknown key",
    () => {
      assert.equal(clientAddress(headers({})), null);
      assert.equal(clientKey(headers({})), UNKNOWN_CLIENT);
      assert.equal(clientKey(headers({ "x-forwarded-for": "", "x-real-ip": "" })), UNKNOWN_CLIENT);
    },
  ],
  [
    "origin: the site itself is allowed",
    () => assert.equal(isAllowedOrigin("https://www.golo.golf", PROD), true),
  ],
  [
    "origin: the apex twin of a www site is allowed",
    () => assert.equal(isAllowedOrigin("https://golo.golf", PROD), true),
  ],
  [
    "origin: the www twin of an apex site is allowed",
    () => assert.equal(isAllowedOrigin("https://www.golo.golf", { siteUrl: "https://golo.golf", production: true }), true),
  ],
  [
    "origin: localhost and 127.0.0.1 on any port are allowed outside production",
    () => {
      assert.equal(isAllowedOrigin("http://localhost:3000", DEV), true);
      assert.equal(isAllowedOrigin("http://127.0.0.1:4123", DEV), true);
    },
  ],
  [
    "origin: another site is refused",
    () => {
      assert.equal(isAllowedOrigin("https://evil.example", PROD), false);
      assert.equal(isAllowedOrigin("https://evil.example", DEV), false);
      assert.equal(isAllowedOrigin("https://golo.golf.evil.example", PROD), false);
      assert.equal(isAllowedOrigin("https://shop.golo.golf", PROD), false);
    },
  ],
  [
    "origin: http:// on the real host is refused",
    () => assert.equal(isAllowedOrigin("http://www.golo.golf", PROD), false),
  ],
  [
    "origin: localhost is refused in production",
    () => {
      assert.equal(isAllowedOrigin("http://localhost:3000", PROD), false);
      assert.equal(isAllowedOrigin("http://127.0.0.1:3000", PROD), false);
    },
  ],
  [
    "origin: \"null\" and garbage are refused",
    () => {
      assert.equal(isAllowedOrigin("null", DEV), false);
      assert.equal(isAllowedOrigin("not a url", DEV), false);
    },
  ],
  [
    "origin: a missing header is allowed",
    () => {
      assert.equal(isAllowedOrigin(null, PROD), true);
      assert.equal(isAllowedOrigin(headers({}).get("origin"), PROD), true);
    },
  ],
  [
    "honeypot: empty, blank or absent is a person",
    () => {
      assert.equal(HONEYPOT_FIELD, "website");
      assert.equal(isHoneypotFilled({ email: "a@example.com" }), false);
      assert.equal(isHoneypotFilled({ website: "" }), false);
      assert.equal(isHoneypotFilled({ website: "  " }), false);
      assert.equal(isHoneypotFilled({ website: null }), false);
      assert.equal(isHoneypotFilled(null), false);
      assert.equal(isHoneypotFilled("website"), false);
    },
  ],
  [
    "honeypot: any value is a bot",
    () => {
      assert.equal(isHoneypotFilled({ website: "https://spam.example" }), true);
      assert.equal(isHoneypotFilled({ website: "x" }), true);
      assert.equal(isHoneypotFilled({ website: 0 }), true);
      assert.equal(isHoneypotFilled({ website: ["x"] }), true);
    },
  ],
  [
    "body: a normal sign-up is read in full",
    async () => {
      const json = JSON.stringify({ email: "a@example.com", website: "" });
      assert.equal(await readBodyText(new Response(json).body), json);
    },
  ],
  [
    "body: exactly 4 KB is read, one byte more is refused",
    async () => {
      const at = "x".repeat(MAX_BODY_BYTES);
      assert.equal(await readBodyText(new Response(at).body), at);
      assert.equal(await readBodyText(new Response(at + "x").body), null);
    },
  ],
  [
    "body: a multi-chunk stream over the cap is refused",
    async () => {
      const chunk = new Uint8Array(1024).fill(120);
      const stream = new ReadableStream({
        pull(controller) {
          controller.enqueue(chunk);
        },
      });
      assert.equal(await readBodyText(stream), null);
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
  for (const line of failures) console.error(line);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`Subscribe guard: ${passed} cases passed.`);
