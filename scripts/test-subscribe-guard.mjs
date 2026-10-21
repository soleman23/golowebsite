#!/usr/bin/env node
/**
 * Newsletter abuse-guard checks (lib/subscribeGuard.ts). `npm run test:guard`
 * runs this and scripts/test-subscribe-route.mjs, and CI runs them as their
 * own step.
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
  SHAPE_LOG_INTERVAL_MS,
  UNKNOWN_CLIENT,
  WINDOW_MS,
  clientAddress,
  clientKey,
  createLogThrottle,
  createRateLimiter,
  headerShape,
  isAllowedOrigin,
  isHoneypotFilled,
  readBodyText,
  requestHost,
  siteOrigins,
} = guard;

const SITE = "https://www.golo.golf";
const PROD = { siteUrl: SITE, production: true, host: "www.golo.golf" };
const DEV = { siteUrl: SITE, production: false, host: "localhost:3000" };
const SALT = new Uint8Array(32).fill(7);

/** A Headers stand-in: lower-cased names, null when absent. */
function headers(values) {
  const map = new Map(Object.entries(values).map(([k, v]) => [k.toLowerCase(), v]));
  return { get: (name) => map.get(name.toLowerCase()) ?? null, keys: () => map.keys() };
}

/** A limiter on a clock the test moves by hand. */
function limiterAt(options = {}) {
  const clock = { t: 1_000_000 };
  const limiter = createRateLimiter({ now: () => clock.t, ...options });
  return { clock, limiter };
}

/** Fills the global ceiling. */
function fillGlobal(limiter) {
  for (let i = 0; i < GLOBAL_LIMIT; i += 1) assert.equal(limiter.charge().ok, true);
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
    "Retry-After is 1, not 0, a millisecond before the window frees up",
    () => {
      const { clock, limiter } = limiterAt();
      for (let i = 0; i < PER_CLIENT_LIMIT; i += 1) limiter.hit("a");
      clock.t += WINDOW_MS - 1;
      assert.equal(limiter.hit("a").retryAfterSeconds, 1);
      fillGlobal(limiter);
      assert.equal(limiter.charge().retryAfterSeconds, WINDOW_MS / 1000);
      clock.t += WINDOW_MS - 1;
      assert.equal(limiter.charge().retryAfterSeconds, 1);
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
    "hit doesn't charge the global ceiling: 1,000 clients get through",
    () => {
      const { limiter } = limiterAt();
      for (let i = 0; i < 1_000; i += 1) assert.equal(limiter.hit(`k${i}`).ok, true);
      assert.equal(limiter.charge().ok, true);
    },
  ],
  [
    "global ceiling: charge 61 is refused",
    () => {
      const { limiter } = limiterAt();
      fillGlobal(limiter);
      const over = limiter.charge();
      assert.equal(over.ok, false);
      assert.equal(over.scope, "global");
      assert.equal(over.retryAfterSeconds, WINDOW_MS / 1000);
    },
  ],
  [
    "global ceiling full: hit refuses a fresh client without recording it",
    () => {
      const { clock, limiter } = limiterAt();
      fillGlobal(limiter);
      const over = limiter.hit("fresh");
      assert.equal(over.ok, false);
      assert.equal(over.scope, "global");
      assert.deepEqual(limiter.trackedKeys(), []);
      clock.t += WINDOW_MS;
      assert.equal(limiter.hit("fresh").ok, true);
    },
  ],
  [
    "global ceiling resets once the window has passed",
    () => {
      const { clock, limiter } = limiterAt();
      fillGlobal(limiter);
      clock.t += WINDOW_MS;
      assert.equal(limiter.charge().ok, true);
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
      const { limiter } = limiterAt({ maxTrackedKeys: 100 });
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
    "client key ignores IPv6 letter case",
    () => {
      assert.equal(
        clientKey(headers({ "x-forwarded-for": "2001:DB8::AB" }), SALT),
        clientKey(headers({ "x-forwarded-for": "2001:db8::ab" }), SALT),
      );
    },
  ],
  [
    "X-Real-IP is ignored: a client can set it (seen on the live host)",
    () => {
      const spoofed = headers({ "x-real-ip": "198.51.100.4", "x-forwarded-for": "10.0.0.1, 192.0.2.9" });
      assert.equal(clientAddress(spoofed), "192.0.2.9");
      assert.equal(clientAddress(headers({ "x-real-ip": "198.51.100.4" })), null);
    },
  ],
  [
    "the last X-Forwarded-For entry is the client: earlier ones may be the client's own",
    () => {
      assert.equal(clientAddress(headers({ "x-forwarded-for": " 198.51.100.4 , 10.0.0.1, 192.0.2.9 " })), "192.0.2.9");
      assert.equal(clientAddress(headers({ "x-forwarded-for": "192.0.2.9," })), "192.0.2.9");
      // Rotating a fake first entry doesn't rotate the key.
      assert.equal(
        clientKey(headers({ "x-forwarded-for": "203.0.113.1, 192.0.2.9" }), SALT),
        clientKey(headers({ "x-forwarded-for": "203.0.113.2, 192.0.2.9" }), SALT),
      );
    },
  ],
  [
    "no address header gives the shared unknown key",
    () => {
      assert.equal(clientAddress(headers({})), null);
      assert.equal(clientKey(headers({})), UNKNOWN_CLIENT);
      assert.equal(clientKey(headers({ "x-forwarded-for": " , ", "x-real-ip": "203.0.113.7" })), UNKNOWN_CLIENT);
    },
  ],
  [
    "header shape names which headers came, never their values",
    () => {
      const shape = headerShape(
        headers({
          "x-real-ip": "203.0.113.7",
          "x-forwarded-for": "203.0.113.7, 10.0.0.1",
          "CF-Connecting-IP": "203.0.113.7",
          "true-client-ip": "203.0.113.7",
          accept: "*/*",
          "content-type": "application/json",
        }),
      );
      assert.equal(shape, "x-real-ip=yes xff_entries=2 ip_headers=cf-connecting-ip,true-client-ip,x-forwarded-for,x-real-ip");
      assert.ok(!shape.includes("203.0.113"), "a value leaked into the shape");
      assert.equal(headerShape(headers({})), "x-real-ip=no xff_entries=0 ip_headers=none");
      assert.equal(headerShape({ get: () => "10.0.0.1" }), "x-real-ip=yes xff_entries=1 ip_headers=none");
    },
  ],
  [
    "header shape is logged on the first request, then at most hourly",
    () => {
      const clock = { t: 0 };
      const due = createLogThrottle(SHAPE_LOG_INTERVAL_MS, () => clock.t);
      assert.equal(due(), true);
      assert.equal(due(), false);
      clock.t += SHAPE_LOG_INTERVAL_MS - 1;
      assert.equal(due(), false);
      clock.t += 1;
      assert.equal(due(), true);
      assert.equal(due(), false);
    },
  ],
  [
    "request host: X-Forwarded-Host first value, else Host, lower-cased",
    () => {
      assert.equal(requestHost(headers({ "x-forwarded-host": "Preview.Example, proxy.internal", host: "proxy.internal" })), "preview.example");
      assert.equal(requestHost(headers({ host: "localhost:3000" })), "localhost:3000");
      assert.equal(requestHost(headers({})), null);
    },
  ],
  [
    "site origins: the URL and its www/apex twin, with or without a scheme",
    () => {
      assert.deepEqual(siteOrigins("https://www.golo.golf"), ["https://www.golo.golf", "https://golo.golf"]);
      assert.deepEqual(siteOrigins("golo.golf"), ["https://golo.golf", "https://www.golo.golf"]);
      assert.deepEqual(siteOrigins("www.golo.golf:8443"), ["https://www.golo.golf:8443", "https://golo.golf:8443"]);
      assert.deepEqual(siteOrigins(""), []);
    },
  ],
  [
    "origin: the site itself and its apex twin are allowed",
    () => {
      assert.equal(isAllowedOrigin("https://www.golo.golf", PROD), true);
      assert.equal(isAllowedOrigin("https://golo.golf", { ...PROD, host: null }), true);
    },
  ],
  [
    "origin: the www twin of an apex site is allowed",
    () => assert.equal(isAllowedOrigin("https://www.golo.golf", { siteUrl: "https://golo.golf", production: true, host: null }), true),
  ],
  [
    "origin: a scheme-less site URL still works",
    () => assert.equal(isAllowedOrigin("https://www.golo.golf", { siteUrl: "www.golo.golf", production: true, host: null }), true),
  ],
  [
    "origin: the request's own host is allowed (PR preview)",
    () => {
      const preview = { ...PROD, host: "golowebsite-pr-126.example.app" };
      assert.equal(isAllowedOrigin("https://golowebsite-pr-126.example.app", preview), true);
      assert.equal(isAllowedOrigin("https://other-pr.example.app", preview), false);
    },
  ],
  [
    "origin: localhost and 127.0.0.1 on any port are allowed outside production",
    () => {
      assert.equal(isAllowedOrigin("http://localhost:3000", { ...DEV, host: null }), true);
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
    "origin: localhost is refused in production unless it's the request's host",
    () => {
      assert.equal(isAllowedOrigin("http://localhost:3000", PROD), false);
      assert.equal(isAllowedOrigin("http://127.0.0.1:3000", PROD), false);
      assert.equal(isAllowedOrigin("http://localhost:3000", { ...PROD, host: "localhost:3000" }), true);
    },
  ],
  [
    "origin: \"null\", non-http schemes and garbage are refused",
    () => {
      assert.equal(isAllowedOrigin("null", DEV), false);
      assert.equal(isAllowedOrigin("not a url", DEV), false);
      assert.equal(isAllowedOrigin("chrome-extension://www.golo.golf", PROD), false);
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
      assert.equal(HONEYPOT_FIELD, "hp_note");
      assert.equal(isHoneypotFilled({ email: "a@example.com" }), false);
      assert.equal(isHoneypotFilled({ hp_note: "" }), false);
      assert.equal(isHoneypotFilled({ hp_note: "  " }), false);
      assert.equal(isHoneypotFilled({ hp_note: null }), false);
      assert.equal(isHoneypotFilled(null), false);
      assert.equal(isHoneypotFilled("hp_note"), false);
    },
  ],
  [
    "honeypot: any value is a bot",
    () => {
      assert.equal(isHoneypotFilled({ hp_note: "https://spam.example" }), true);
      assert.equal(isHoneypotFilled({ hp_note: "x" }), true);
      assert.equal(isHoneypotFilled({ hp_note: 0 }), true);
      assert.equal(isHoneypotFilled({ hp_note: ["x"] }), true);
    },
  ],
  [
    "body: a normal sign-up is read in full",
    async () => {
      const json = JSON.stringify({ email: "a@example.com", hp_note: "" });
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
    "body: an endless stream is cancelled once it passes the cap",
    async () => {
      const chunk = new Uint8Array(1024).fill(120);
      let pulls = 0;
      let cancelled = false;
      const stream = new ReadableStream(
        {
          pull(controller) {
            pulls += 1;
            controller.enqueue(chunk);
          },
          cancel() {
            cancelled = true;
          },
        },
        { highWaterMark: 0 },
      );
      assert.equal(await readBodyText(stream), null);
      assert.equal(cancelled, true);
      assert.ok(pulls <= MAX_BODY_BYTES / 1024 + 2, `read ${pulls} chunks`);
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
