#!/usr/bin/env node
/**
 * Newsletter → Hostinger Reach sync checks (soleman23/golowebsite#121).
 * `npm run test:reach` runs this, and CI runs it as its own step.
 *
 * Hermetic: the sign-up handler (lib/subscribe.ts) and the sync rules
 * (lib/reachSync.ts) run against an in-memory lead table and a stub Reach
 * client (lib/reachStub.ts). The live HTTP client (lib/reach.ts) is checked
 * only through a fake fetch. Global fetch throws, so a stray network call
 * fails the run. No server, no database, no network.
 *
 * Exit 1 with one line per failed case.
 */

import "./register-ts.mjs";

globalThis.fetch = async () => {
  throw new Error("network call in a hermetic test");
};

const { handleSubscribe } = await import("../lib/subscribe.ts");
const { syncLead, retryReachSync, runBackfill, requeueFailed, backoffMs, MAX_ATTEMPTS, NEWSLETTER_CONSENT_SINCE } =
  await import("../lib/reachSync.ts");
const { createStubReachClient } = await import("../lib/reachStub.ts");
const { getReachClient, createHttpReachClient, REACH_BASE_URL } = await import("../lib/reach.ts");

const T0 = new Date("2026-11-02T12:00:00Z");
const HOUR = 60 * 60 * 1000;
const at = (ms) => new Date(T0.getTime() + ms);

/** The NewsletterLead table, as the Prisma stores in lib/reachStore.ts treat it. */
function memoryDb() {
  const rows = new Map();
  let seq = 0;
  const byEmail = (email) => [...rows.values()].find((r) => r.email === email);
  const db = {
    rows,
    byEmail,
    insert(fields) {
      const row = {
        id: `lead_${++seq}`,
        source: "blog",
        createdAt: T0,
        reachSyncStatus: null,
        reachSyncAttempts: 0,
        reachLastAttemptAt: null,
        ...fields,
      };
      rows.set(row.id, row);
      return row;
    },
    subscribeStore: {
      async save(lead) {
        const existing = byEmail(lead.email);
        if (existing) return { id: existing.id, created: false, reachSyncStatus: existing.reachSyncStatus };
        const row = db.insert({ ...lead, reachSyncStatus: lead.reachSyncStatus ?? null });
        return { id: row.id, created: true, reachSyncStatus: row.reachSyncStatus };
      },
    },
    syncStore: {
      async get(id) {
        const row = rows.get(id);
        return row ? { ...row } : null;
      },
      async claimAttempt(id, expected, when) {
        const row = rows.get(id);
        if (!row || row.reachSyncAttempts !== expected) return false;
        if (!["pending", "failed"].includes(row.reachSyncStatus)) return false;
        row.reachSyncAttempts = expected + 1;
        row.reachLastAttemptAt = when;
        return true;
      },
      async setStatus(id, status) {
        rows.get(id).reachSyncStatus = status;
      },
      async listRetryable(max, limit) {
        return [...rows.values()]
          .filter((r) => ["pending", "failed"].includes(r.reachSyncStatus) && r.reachSyncAttempts < max)
          .sort((a, b) => a.reachSyncAttempts - b.reachSyncAttempts)
          .slice(0, limit)
          .map((r) => ({ ...r }));
      },
      async countExhausted(max) {
        return [...rows.values()].filter((r) => r.reachSyncStatus === "failed" && r.reachSyncAttempts >= max).length;
      },
      async requeueFailed() {
        let n = 0;
        for (const row of rows.values()) {
          if (row.reachSyncStatus !== "failed") continue;
          Object.assign(row, { reachSyncStatus: "pending", reachSyncAttempts: 0, reachLastAttemptAt: null });
          n += 1;
        }
        return n;
      },
    },
    backfillStore: {
      writes: 0,
      async listUnqueued() {
        return [...rows.values()]
          .filter((r) => r.reachSyncStatus === null)
          .map(({ id, source, createdAt }) => ({ id, source, createdAt }));
      },
      async queue(ids, status) {
        db.backfillStore.writes += 1;
        let n = 0;
        for (const id of ids) {
          const row = rows.get(id);
          if (row && row.reachSyncStatus === null) {
            row.reachSyncStatus = status;
            n += 1;
          }
        }
        return n;
      },
    },
  };
  return db;
}

/** Every log line, so the run can check none carries an address. */
const logLines = [];
const log = (message, fields) => logLines.push(`${message} ${JSON.stringify(fields ?? {})}`);

/** A sign-up harness: scheduled tasks are held until flush(), like `after`. */
function harness({ enabled = true, stub = createStubReachClient() } = {}) {
  const db = memoryDb();
  const tasks = [];
  const notified = [];
  const deps = {
    store: db.subscribeStore,
    notify: async (email, source) => notified.push(source),
    reach: enabled ? { client: stub, syncStore: db.syncStore } : null,
    schedule: (task) => tasks.push(task),
    log,
  };
  return {
    db,
    stub,
    tasks,
    notified,
    signUp: (email, source = "blog") => handleSubscribe({ email, source, landingPath: "/blog" }, deps),
    flush: async () => {
      while (tasks.length) await tasks.shift()();
    },
    retry: (now) => retryReachSync({ store: db.syncStore, client: stub, log, now: () => now }),
  };
}

const failures = [];
let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
  }
}
function expect(cond, message) {
  if (!cond) throw new Error(message);
}

await test("new sign-up: 200 before Reach is called, then one create call", async () => {
  const h = harness();
  const res = await h.signUp("new@example.test");
  expect(res.status === 200 && res.body.ok === true, `status ${res.status}`);
  expect(h.stub.calls.length === 0, "Reach was called before the response");
  expect(h.tasks.length === 1, `${h.tasks.length} tasks scheduled`);
  expect(h.db.byEmail("new@example.test").reachSyncStatus === "pending", "row not pending");
  await h.flush();
  expect(h.stub.creates() === 1, `${h.stub.creates()} create calls`);
  const ops = h.stub.calls.map((c) => c.op).join(",");
  expect(ops === "find,create", `calls ${ops}; expected find before create`);
  const row = h.db.byEmail("new@example.test");
  expect(row.reachSyncStatus === "synced" && row.reachSyncAttempts === 1, `row ${row.reachSyncStatus}/${row.reachSyncAttempts}`);
  expect(h.notified.length === 1, "team not notified once");
});

await test("repeat sign-up of a pending address: no second create call", async () => {
  const h = harness();
  await h.signUp("again@example.test");
  const res = await h.signUp("again@example.test");
  expect(res.status === 200, `repeat status ${res.status}`);
  expect(h.tasks.length === 1, `${h.tasks.length} tasks scheduled for two sign-ups`);
  await h.flush();
  expect(h.stub.creates() === 1, `${h.stub.creates()} create calls`);
  expect(h.notified.length === 1, "repeat notified the team");
});

await test("repeat sign-up of a synced address: no Reach call at all", async () => {
  const h = harness();
  await h.signUp("synced@example.test");
  await h.flush();
  const before = h.stub.calls.length;
  const res = await h.signUp("synced@example.test");
  await h.flush();
  expect(res.status === 200, `status ${res.status}`);
  expect(h.stub.calls.length === before, "repeat sign-up called Reach");
  await h.retry(at(48 * HOUR));
  expect(h.stub.calls.length === before, "retry called Reach for a synced row");
});

await test("Reach 5xx: visitor gets 200, row saved as failed, retry later succeeds", async () => {
  const h = harness();
  h.stub.failCreate("http_503");
  const res = await h.signUp("flaky@example.test");
  expect(res.status === 200, `status ${res.status}`);
  await h.flush();
  const row = h.db.byEmail("flaky@example.test");
  expect(row && row.reachSyncStatus === "failed", `row ${row?.reachSyncStatus}`);
  // A repeat sign-up of a failed address leaves it to the retry job.
  const creates = h.stub.creates();
  await h.signUp("flaky@example.test");
  await h.flush();
  expect(h.stub.creates() === creates, "repeat sign-up of a failed row called create");
  // Too soon: backoff holds the retry.
  const early = await h.retry(new Date(row.reachLastAttemptAt.getTime() + 60 * 1000));
  expect(early.backoff === 1 && h.stub.creates() === creates, "retry ignored backoff");
  const later = await h.retry(new Date(row.reachLastAttemptAt.getTime() + HOUR));
  expect(later.created === 1, `retry summary ${JSON.stringify(later)}`);
  expect(h.db.byEmail("flaky@example.test").reachSyncStatus === "synced", "not synced after retry");
});

await test("Reach timeout (client throws): row failed, visitor 200, retry succeeds", async () => {
  const h = harness();
  h.stub.failFind("throw");
  const res = await h.signUp("timeout@example.test");
  await h.flush();
  expect(res.status === 200, `status ${res.status}`);
  expect(h.db.byEmail("timeout@example.test").reachSyncStatus === "failed", "not failed");
  expect(h.stub.creates() === 0, "created despite a failed lookup");
  const s = await h.retry(at(2 * HOUR));
  expect(s.created === 1, `retry summary ${JSON.stringify(s)}`);
});

await test("unsubscribed in Reach: never re-added by sign-up, repeat or retry", async () => {
  const h = harness({ stub: createStubReachClient({ "gone@example.test": "unsubscribed" }) });
  await h.signUp("gone@example.test");
  await h.flush();
  expect(h.stub.creates() === 0, "created an unsubscribed address");
  expect(h.db.byEmail("gone@example.test").reachSyncStatus === "synced", "not marked synced");
  await h.signUp("gone@example.test");
  await h.flush();
  await h.retry(at(48 * HOUR));
  expect(h.stub.creates() === 0, "re-added by repeat or retry");
});

await test("failed row that Reach now shows unsubscribed: retry doesn't re-add it", async () => {
  const h = harness();
  h.stub.failCreate("http_500");
  await h.signUp("later-gone@example.test");
  await h.flush();
  h.stub.contacts.set("later-gone@example.test", "unsubscribed");
  const s = await h.retry(at(2 * HOUR));
  expect(s.suppressed === 1, `retry summary ${JSON.stringify(s)}`);
  // The first, failed create is the only one.
  expect(h.stub.creates() === 1, `${h.stub.creates()} create calls`);
  expect(h.db.byEmail("later-gone@example.test").reachSyncStatus === "synced", "not marked synced");
});

await test("already pending/subscribed/confirmed in Reach: no create", async () => {
  for (const status of ["pending", "subscribed", "confirmed"]) {
    const email = `${status}@example.test`;
    const h = harness({ stub: createStubReachClient({ [email]: status }) });
    await h.signUp(email);
    await h.flush();
    expect(h.stub.creates() === 0, `created a ${status} address`);
    expect(h.db.byEmail(email).reachSyncStatus === "synced", `${status}: not marked synced`);
  }
});

await test("ineligible source never reaches the client", async () => {
  const h = harness();
  for (const source of ["contact", "hero", "final_cta_home", "app"]) {
    const res = await h.signUp(`${source}@example.test`, source);
    expect(res.status === 200, `${source}: status ${res.status}`);
    expect(h.db.byEmail(`${source}@example.test`).reachSyncStatus === "skipped_ineligible", `${source}: not skipped`);
  }
  expect(h.tasks.length === 0, "an ineligible sign-up was scheduled");
  // Even a row forced into the queue is refused before any Reach call.
  const forced = h.db.insert({ email: "forced@example.test", source: "contact", reachSyncStatus: "pending" });
  const outcome = await syncLead(forced.id, { store: h.db.syncStore, client: h.stub, log });
  expect(outcome === "ineligible", `outcome ${outcome}`);
  await h.retry(at(HOUR));
  expect(h.stub.calls.length === 0, `${h.stub.calls.length} Reach calls`);
  expect(h.db.rows.get(forced.id).reachSyncStatus === "skipped_ineligible", "forced row not skipped");
});

await test("sync disabled: rows not queued, no Reach calls at all", async () => {
  const h = harness({ enabled: false });
  const res = await h.signUp("off@example.test");
  expect(res.status === 200, `status ${res.status}`);
  expect(h.tasks.length === 0, "work scheduled while off");
  expect(h.db.byEmail("off@example.test").reachSyncStatus === null, "row queued while off");
  // Retry has nothing to pick up: the row was never queued.
  await h.retry(at(HOUR));
  expect(h.stub.calls.length === 0, `${h.stub.calls.length} Reach calls`);
});

await test("REACH_SYNC_ENABLED gate: only the exact string \"true\" with token and profile", async () => {
  const full = { REACH_API_TOKEN: "test-token", REACH_PROFILE_UUID: "profile-1" };
  const quiet = console.error;
  console.error = () => {};
  try {
    for (const flag of [undefined, "", "false", "1", "TRUE", "yes", " true"]) {
      expect(getReachClient({ ...full, REACH_SYNC_ENABLED: flag }) === null, `flag ${JSON.stringify(flag)} turned it on`);
    }
    expect(getReachClient({ REACH_SYNC_ENABLED: "true", REACH_PROFILE_UUID: "p" }) === null, "on without a token");
    expect(getReachClient({ REACH_SYNC_ENABLED: "true", REACH_API_TOKEN: "t" }) === null, "on without a profile");
    expect(getReachClient({ REACH_SYNC_ENABLED: "true", NEXT_PUBLIC_REACH_API_TOKEN: "t", REACH_PROFILE_UUID: "p" }) === null, "read a NEXT_PUBLIC_ token");
    expect(getReachClient({ ...full, REACH_SYNC_ENABLED: "true" }) !== null, "fully configured stayed off");
  } finally {
    console.error = quiet;
  }
});

await test("concurrent attempts on one lead: one create", async () => {
  const h = harness();
  const row = h.db.insert({ email: "race@example.test", reachSyncStatus: "pending" });
  const deps = { store: h.db.syncStore, client: h.stub, log };
  const outcomes = await Promise.all([syncLead(row.id, deps), syncLead(row.id, deps)]);
  expect(h.stub.creates() === 1, `${h.stub.creates()} creates; outcomes ${outcomes}`);
});

await test(`gives up after ${MAX_ATTEMPTS} attempts and logs without the address`, async () => {
  const h = harness();
  h.stub.failCreate("http_500", 99);
  await h.signUp("down@example.test");
  await h.flush();
  for (let i = 1; i <= MAX_ATTEMPTS + 3; i += 1) await h.retry(at(i * 24 * HOUR));
  const row = h.db.byEmail("down@example.test");
  expect(row.reachSyncAttempts === MAX_ATTEMPTS, `${row.reachSyncAttempts} attempts`);
  expect(h.stub.creates() === MAX_ATTEMPTS, `${h.stub.creates()} creates`);
  const s = await h.retry(at(30 * 24 * HOUR));
  expect(s.exhausted === 1 && s.checked === 0, `summary ${JSON.stringify(s)}`);
  expect(logLines.some((l) => l.includes("gave up")), "no give-up log line");
});

await test("backfill dry run: counts only, no addresses, no writes", async () => {
  const db = memoryDb();
  const before = new Date(NEWSLETTER_CONSENT_SINCE.getTime() - 1000);
  db.insert({ email: "old-a@example.test", source: "blog", createdAt: at(-30 * 24 * HOUR) });
  db.insert({ email: "old-b@example.test", source: "post", createdAt: at(-20 * 24 * HOUR) });
  db.insert({ email: "old-c@example.test", source: "contact", createdAt: at(-10 * 24 * HOUR) });
  db.insert({ email: "old-d@example.test", source: "blog", createdAt: before });
  db.insert({ email: "queued@example.test", source: "blog", reachSyncStatus: "synced" });
  const out = [];
  const result = await runBackfill({ store: db.backfillStore, args: [], env: {}, print: (l) => out.push(l) });
  const text = out.join("\n");
  expect(result.mode === "dry-run" && result.exitCode === 0, `mode ${result.mode}`);
  expect(/Never-queued newsletter rows: 4\b/.test(text), "total count wrong");
  expect(/Eligible[^\n]*: 2\b/.test(text), "eligible count wrong");
  expect(/other source: 1\b/.test(text), "wrong-source count wrong");
  expect(/before the consent copy: 1\b/.test(text), "before-consent count wrong");
  expect(!text.includes("@"), "printed an address");
  expect(!/lead_\d/.test(text), "printed a row id");
  expect(db.backfillStore.writes === 0, "dry run wrote to the table");
  // Even with the flag on, without --apply it's a dry run.
  await runBackfill({ store: db.backfillStore, args: ["--confirm"], env: { REACH_SYNC_ENABLED: "true" }, print: () => {} });
  expect(db.backfillStore.writes === 0, "--confirm alone wrote to the table");
});

await test("backfill --apply refuses without REACH_SYNC_ENABLED=true and --confirm", async () => {
  const db = memoryDb();
  db.insert({ email: "x@example.test" });
  for (const [args, env] of [
    [["--apply"], {}],
    [["--apply", "--confirm"], {}],
    [["--apply", "--confirm"], { REACH_SYNC_ENABLED: "false" }],
    [["--apply"], { REACH_SYNC_ENABLED: "true" }],
  ]) {
    const out = [];
    const result = await runBackfill({ store: db.backfillStore, args, env, print: (l) => out.push(l) });
    expect(result.mode === "refused" && result.exitCode !== 0, `${args} ${JSON.stringify(env)}: ${result.mode}`);
    expect(out.join("").startsWith("Refused"), "no refusal message");
  }
  expect(db.backfillStore.writes === 0, "a refused run wrote to the table");
});

await test("HTTP client (fake fetch): endpoints, bearer token, suppression parsing", async () => {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({ url: String(url), init });
    const u = new URL(String(url));
    if (init.method === "POST") return new Response("{}", { status: 200 });
    const status = u.searchParams.get("subscription_status");
    const body = status === "unsubscribed"
      ? { data: [{ email: "Gone@Example.test" }], meta: { total: 1 } }
      : { data: [], meta: { total: 0 } };
    return new Response(JSON.stringify(body), { status: 200 });
  };
  const client = createHttpReachClient({ token: "tok-123", profileUuid: "prof-1" }, fakeFetch);
  const found = await client.findContact("gone@example.test");
  expect(found.ok && found.status === "unsubscribed", `find ${JSON.stringify(found)}`);
  expect(requests.length === 4, `${requests.length} list calls`);
  for (const r of requests) {
    expect(r.url.startsWith(`${REACH_BASE_URL}/api/reach/v1/profiles/prof-1/contacts?`), `url ${r.url}`);
    expect(new URL(r.url).searchParams.get("per_page") === "100", `per_page in ${r.url}`);
    expect(r.init.headers.Authorization === "Bearer tok-123", "no bearer token");
  }
  const created = await client.createContact("new@example.test");
  const post = requests.at(-1);
  expect(created.ok && post.init.method === "POST", "create not a POST");
  expect(post.url === `${REACH_BASE_URL}/api/reach/v1/profiles/prof-1/contacts`, `create url ${post.url}`);
  expect(post.init.body === JSON.stringify({ email: "new@example.test" }), `create body ${post.init.body}`);

  const failing = createHttpReachClient({ token: "tok-123", profileUuid: "prof-1" }, async () =>
    new Response("new@example.test is invalid", { status: 422 }),
  );
  const err = await failing.createContact("new@example.test");
  expect(!err.ok && err.error === "http_422", `error ${JSON.stringify(err)}`);
  const odd = createHttpReachClient({ token: "t", profileUuid: "p" }, async () => new Response("{\"x\":1}", { status: 200 }));
  const unknown = await odd.findContact("a@example.test");
  expect(!unknown.ok && unknown.error === "bad_response", "unparseable list treated as absent");
});

/** A fake Reach list endpoint: `pages[status]` is the response body, or a number for an HTTP error. */
function fakeList(pages) {
  return createHttpReachClient({ token: "t", profileUuid: "p" }, async (url) => {
    const status = new URL(String(url)).searchParams.get("subscription_status");
    const page = pages[status] ?? { data: [], meta: { total: 0 } };
    return typeof page === "number"
      ? new Response("{}", { status: page })
      : new Response(JSON.stringify(page), { status: 200 });
  });
}

await test("HTTP lookup: one status lookup failing is a failure, not absent", async () => {
  for (const broken of [500, { data: [] }, { nope: true }, "garbage"]) {
    const page = broken === "garbage" ? { data: "x", meta: { total: 0 } } : broken;
    for (const status of ["unsubscribed", "pending", "subscribed", "confirmed"]) {
      const result = await fakeList({ [status]: page }).findContact("gone@example.test");
      expect(!result.ok, `${status} → ${JSON.stringify(broken)} read as ${JSON.stringify(result)}`);
    }
  }
});

await test("HTTP lookup: a near-miss address doesn't match", async () => {
  const result = await fakeList({
    unsubscribed: {
      data: [{ email: "xgone@example.test" }, { email: "gone@example.testx" }, { email: "gone+1@example.test" }],
      meta: { total: 3 },
    },
  }).findContact("gone@example.test");
  expect(result.ok && result.status === null, `near-miss read as ${JSON.stringify(result)}`);
  const exact = await fakeList({
    unsubscribed: { data: [{ email: "xgone@example.test" }, { email: " GONE@example.test " }], meta: { total: 2 } },
  }).findContact("gone@example.test");
  expect(exact.ok && exact.status === "unsubscribed", `trimmed, case-insensitive match missed: ${JSON.stringify(exact)}`);
});

await test("HTTP lookup: more matches than returned (or no total) is a failure", async () => {
  const hundred = Array.from({ length: 100 }, (_, i) => ({ email: `gone${i}@example.test` }));
  const more = await fakeList({ unsubscribed: { data: hundred, meta: { total: 101 } } }).findContact("gone@example.test");
  expect(!more.ok && more.error === "incomplete_page", `total > rows read as ${JSON.stringify(more)}`);
  const noTotal = await fakeList({ pending: { data: [] } }).findContact("gone@example.test");
  expect(!noTotal.ok, `missing meta.total read as ${JSON.stringify(noTotal)}`);
  const nested = await fakeList({ confirmed: { data: { data: [{ email: "gone@example.test" }], meta: { total: 1 } } } }).findContact("gone@example.test");
  expect(nested.ok && nested.status === "confirmed", `nested envelope: ${JSON.stringify(nested)}`);
});

await test("retry window covers at least 24 hours", async () => {
  let total = 0;
  for (let n = 1; n < MAX_ATTEMPTS; n += 1) total += backoffMs(n);
  expect(total >= 24 * HOUR, `${(total / HOUR).toFixed(1)} h from first to last attempt`);
  expect(backoffMs(MAX_ATTEMPTS - 1) === 6 * HOUR, "the 6 h cap is never reached");
});

await test("--requeue-failed: refused without the switch and --confirm, then re-sends after an outage", async () => {
  const h = harness();
  h.stub.failCreate("http_503", 999);
  await h.signUp("outage@example.test");
  await h.flush();
  for (let i = 1; i <= MAX_ATTEMPTS + 2; i += 1) await h.retry(at(i * 24 * HOUR));
  const row = h.db.byEmail("outage@example.test");
  expect(row.reachSyncStatus === "failed" && row.reachSyncAttempts === MAX_ATTEMPTS, "not exhausted");
  for (const [args, env] of [
    [["--requeue-failed"], { REACH_SYNC_ENABLED: "true" }],
    [["--requeue-failed", "--confirm"], {}],
    [["--requeue-failed", "--confirm"], { REACH_SYNC_ENABLED: "TRUE" }],
  ]) {
    const r = await requeueFailed({ store: h.db.syncStore, args, env, print: () => {} });
    expect(r.mode === "refused" && r.exitCode !== 0, `${args} ${JSON.stringify(env)}: ${r.mode}`);
  }
  expect(h.db.byEmail("outage@example.test").reachSyncStatus === "failed", "a refused requeue changed the row");
  h.stub.failCreate("none", 0);
  const ok = await requeueFailed({
    store: h.db.syncStore,
    args: ["--requeue-failed", "--confirm"],
    env: { REACH_SYNC_ENABLED: "true" },
    print: () => {},
  });
  expect(ok.mode === "requeued" && ok.count === 1, `requeue ${JSON.stringify(ok)}`);
  const s = await h.retry(at(40 * 24 * HOUR));
  expect(s.created === 1, `retry after requeue ${JSON.stringify(s)}`);
  // Suppression still wins after a requeue.
  const h2 = harness();
  h2.stub.failCreate("http_503", 999);
  await h2.signUp("requeue-gone@example.test");
  await h2.flush();
  h2.stub.contacts.set("requeue-gone@example.test", "unsubscribed");
  await requeueFailed({ store: h2.db.syncStore, args: ["--confirm"], env: { REACH_SYNC_ENABLED: "true" }, print: () => {} });
  const creates = h2.stub.creates();
  await h2.retry(at(HOUR));
  expect(h2.stub.creates() === creates, "requeue re-added an unsubscribed address");
});

await test("no log line carries an address or the token", async () => {
  const leaked = logLines.filter((l) => l.includes("@") || l.includes("tok-123"));
  expect(leaked.length === 0, `leaked: ${leaked[0]}`);
  expect(logLines.length > 0, "nothing was logged, so nothing was checked");
});

if (failures.length) {
  for (const line of failures) console.error(line);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`Reach sync: ${passed} cases passed (stub client, in-memory leads, no network).`);
