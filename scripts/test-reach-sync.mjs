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
const { syncLead, retryReachSync, runBackfill, requeueFailed, backoffMs, MAX_ATTEMPTS, NEWSLETTER_CONSENT_SINCE, DAILY_ADD_LIMIT, MONTHLY_ADD_LIMIT, deleteSubscriber, reachOnlyFromEnv } =
  await import("../lib/reachSync.ts");
const { createStubReachClient } = await import("../lib/reachStub.ts");
const { getReachClient, createHttpReachClient, REACH_BASE_URL, MAX_PAGES } = await import("../lib/reach.ts");
const { prismaSubscribeStore, prismaLeadSyncStore, prismaDeletionStore } = await import("../lib/reachStore.ts");
const { readFileSync } = await import("node:fs");

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
        if (existing) {
          // As the Prisma store: a fresh eligible sign-up queues a never-queued row.
          if (lead.reachSyncStatus === "pending" && existing.reachSyncStatus === null) existing.reachSyncStatus = "pending";
          return { id: "", created: false, reachSyncStatus: null };
        }
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
      async listRetryable(max, limit, now) {
        return [...rows.values()]
          .filter((r) => ["pending", "failed"].includes(r.reachSyncStatus) && r.reachSyncAttempts < max)
          .filter((r) => !r.reachLastAttemptAt || now - r.reachLastAttemptAt >= backoffMs(r.reachSyncAttempts))
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(0, limit)
          .map((r) => ({ ...r }));
      },
      async countExhausted(max) {
        return [...rows.values()].filter((r) => ["pending", "failed"].includes(r.reachSyncStatus) && r.reachSyncAttempts >= max).length;
      },
      async requeueFailed(max, quietBefore) {
        let n = 0;
        for (const row of rows.values()) {
          if (!["pending", "failed"].includes(row.reachSyncStatus) || row.reachSyncAttempts < max) continue;
          if (!row.reachLastAttemptAt || row.reachLastAttemptAt >= quietBefore) continue;
          Object.assign(row, { reachSyncStatus: "pending", reachSyncAttempts: 0, reachLastAttemptAt: null });
          n += 1;
        }
        return n;
      },
      async countSyncedSince(since) {
        return [...rows.values()].filter((r) => r.reachSyncStatus === "synced" && r.reachLastAttemptAt >= since).length;
      },
    },
    deletionStore: {
      async deleteByEmail(email) {
        let n = 0;
        for (const [id, row] of rows) {
          if (row.email.toLowerCase() === email.toLowerCase()) {
            rows.delete(id);
            n += 1;
          }
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

/**
 * A sign-up harness. Sign-ups only queue; flush() is the scheduled retry job
 * running once (the only sender), at T0.
 */
function harness({ enabled = true, stub = createStubReachClient() } = {}) {
  const db = memoryDb();
  const notified = [];
  const deps = {
    store: db.subscribeStore,
    notify: async (email, source) => notified.push(source),
    reach: enabled ? { client: stub } : null,
    log,
  };
  return {
    db,
    stub,
    notified,
    signUp: (email, source = "blog") => handleSubscribe({ email, source, landingPath: "/blog" }, deps),
    flush: async () => {
      if (enabled) await retryReachSync({ store: db.syncStore, client: stub, log, now: () => T0 });
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
  expect(h.db.byEmail("new@example.test").reachSyncStatus === "pending", "row not pending");
  await h.flush();
  expect(h.stub.creates() === 1, `${h.stub.creates()} create calls`);
  const ops = h.stub.calls.map((c) => c.op).join(",");
  expect(ops === "find,create", `calls ${ops}; expected find before create`);
  const row = h.db.byEmail("new@example.test");
  expect(row.reachSyncStatus === "synced" && row.reachSyncAttempts === 1, `row ${row.reachSyncStatus}/${row.reachSyncAttempts}`);
  expect(h.notified.length === 1, "team not notified once");
});

await test("the response says a confirmation email is coming the same way for new and repeat sign-ups", async () => {
  const h = harness();
  const first = await h.signUp("same@example.test");
  const again = await h.signUp("same@example.test");
  expect(first.body.confirmByEmail === true && again.body.confirmByEmail === true, "new and repeat answered differently");
  const other = await h.signUp("contact@example.test", "contact");
  expect(other.body.confirmByEmail === false, "an ineligible source was told to expect a confirmation");
  const off = harness({ enabled: false });
  expect((await off.signUp("off@example.test")).body.confirmByEmail === false, "sync off still promised an email");
});

await test("REACH_SYNC_ONLY: only listed addresses are queued; others are saved as with sync off", async () => {
  const only = reachOnlyFromEnv({ REACH_SYNC_ONLY: " Tester@Example.test , " });
  expect(only.size === 1 && only.has("tester@example.test"), JSON.stringify([...only]));
  expect(reachOnlyFromEnv({}) === null, "unset should mean no list");
  // Set but empty or garbled fails closed: matches no one.
  expect(reachOnlyFromEnv({ REACH_SYNC_ONLY: " , " }).size === 0 && reachOnlyFromEnv({ REACH_SYNC_ONLY: "" }).size === 0, "an empty list must match no one");
  const h = harness();
  const deps = { store: h.db.subscribeStore, notify: async () => {}, reach: { client: h.stub }, reachOnly: only, log };
  const visitor = await handleSubscribe({ email: "visitor@example.test", source: "blog" }, deps);
  const tester = await handleSubscribe({ email: "tester@example.test", source: "blog" }, deps);
  expect(visitor.body.confirmByEmail === false && tester.body.confirmByEmail === true, "answers");
  expect(h.db.byEmail("visitor@example.test").reachSyncStatus === null, "a visitor was queued during the controlled test");
  expect(h.db.byEmail("tester@example.test").reachSyncStatus === "pending", "the test address wasn't queued");
  await h.flush();
  expect(h.stub.creates() === 1 && h.stub.calls.every((c) => c.email === "tester@example.test"), "Reach saw a visitor");
  // A visitor row queued some other way (a backfill run elsewhere) is never sent while the list is set.
  h.db.insert({ email: "queued-elsewhere@example.test", reachSyncStatus: "pending" });
  const run = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(HOUR), only, log });
  expect(run.not_queued === 1 && h.stub.calls.every((c) => c.email === "tester@example.test"), `retry with list ${JSON.stringify(run)}`);
  const none = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(2 * HOUR), only: new Set(), log });
  expect(none.created === 0 && h.stub.calls.every((c) => c.email === "tester@example.test"), "an empty list sent someone");
  // Backfill can't be applied while a controlled test runs.
  const out = [];
  const refused = await runBackfill({ store: h.db.backfillStore, args: ["--apply", "--confirm"], env: { REACH_SYNC_ENABLED: "true", REACH_SYNC_ONLY: "tester@example.test" }, print: (l) => out.push(l) });
  expect(refused.mode === "refused" && /REACH_SYNC_ONLY/.test(out.join()), out.join());
});

await test("repeat sign-up of a pending address: no second create call", async () => {
  const h = harness();
  await h.signUp("again@example.test");
  const res = await h.signUp("again@example.test");
  expect(res.status === 200, `repeat status ${res.status}`);
  const queued = [...h.db.rows.values()].filter((r) => r.reachSyncStatus === "pending").length;
  expect(queued === 1, `${queued} rows queued for two sign-ups`);
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
  // Too soon: backoff holds the retry (the row isn't even listed yet).
  const early = await h.retry(new Date(row.reachLastAttemptAt.getTime() + 60 * 1000));
  expect(early.checked === 0 && h.stub.creates() === creates, "retry ignored backoff");
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
  await h.flush();
  expect(h.stub.calls.length === 0, "an ineligible sign-up reached the client");
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
  await h.flush();
  expect(h.stub.calls.length === 0, "Reach called while off");
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

/** A Reach list body: one page of rows, with Reach's pagination meta. */
const listPage = (rows, total = rows.length, page = 1, perPage = 100) => ({
  data: rows,
  meta: { current_page: page, per_page: perPage, total },
});
const row = (email, subscription_status = "subscribed") => ({ email, subscription_status });

await test("HTTP client (fake fetch): endpoints, bearer token, one unfiltered search", async () => {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({ url: String(url), init });
    if (init.method === "POST") return new Response("{}", { status: 200 });
    return new Response(JSON.stringify(listPage([row("Gone@Example.test", "unsubscribed")])), { status: 200 });
  };
  const client = createHttpReachClient({ token: "tok-123", profileUuid: "prof-1" }, fakeFetch);
  const found = await client.findContact("gone@example.test");
  expect(found.ok && found.status === "unsubscribed", `find ${JSON.stringify(found)}`);
  expect(requests.length === 1, `${requests.length} list calls`);
  const params = new URL(requests[0].url).searchParams;
  expect(requests[0].url.startsWith(`${REACH_BASE_URL}/api/reach/v1/profiles/prof-1/contacts?`), `url ${requests[0].url}`);
  expect(params.get("per_page") === "100" && params.get("page") === "1", `paging in ${requests[0].url}`);
  expect(params.get("search") === "gone@example.test", "search term");
  expect(!params.has("subscription_status"), "a status filter would hide other statuses");
  expect(requests[0].init.headers.Authorization === "Bearer tok-123", "no bearer token");
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

/**
 * A fake Reach list endpoint over `rows`, paged as Reach pages them. `serve`
 * can override one page: a number is an HTTP error, an object the body.
 */
function fakeReach(rows, { perPage, serve = {}, cap } = {}) {
  const calls = [];
  const client = createHttpReachClient({ token: "t", profileUuid: "p", perPage }, async (url) => {
    const params = new URL(String(url)).searchParams;
    const page = Number(params.get("page"));
    const size = cap ?? Number(params.get("per_page"));
    calls.push(page);
    const override = serve[page];
    if (typeof override === "number") return new Response("{}", { status: override });
    const body = override ?? listPage(rows.slice((page - 1) * size, page * size), rows.length, page, size);
    return new Response(JSON.stringify(body), { status: 200 });
  });
  return { client, calls };
}
const fillers = (n, prefix = "gone") => Array.from({ length: n }, (_, i) => row(`${prefix}${i}@example.test`));

await test("HTTP client: a response whose body stalls times out instead of hanging", async () => {
  const stalled = createHttpReachClient({ token: "t", profileUuid: "p" }, async (url, init) => {
    // Headers arrive at once; the body never finishes unless aborted.
    const body = new ReadableStream({
      start(controller) {
        init.signal.addEventListener("abort", () => controller.error(Object.assign(new Error("aborted"), { name: "AbortError" })));
      },
    });
    return new Response(body, { status: 200 });
  });
  const started = Date.now();
  const result = await stalled.findContact("gone@example.test");
  expect(!result.ok && result.error === "timeout", `stalled body read as ${JSON.stringify(result)}`);
  expect(Date.now() - started < 9000, "took longer than the timeout");
});

await test("HTTP lookup: an exact match past the first page is found", async () => {
  const rows = [...fillers(150), row("gone@example.test", "unsubscribed")];
  const { client, calls } = fakeReach(rows);
  const result = await client.findContact("gone@example.test");
  expect(result.ok && result.status === "unsubscribed", `page-2 match read as ${JSON.stringify(result)}`);
  expect(calls.join() === "1,2", `pages fetched ${calls}`);
  // Reach serving fewer per page than asked (15 of 100): page by its meta.
  const capped = fakeReach([...fillers(18), row("gone@example.test", "pending")], { cap: 15 });
  const r2 = await capped.client.findContact("gone@example.test");
  expect(r2.ok && r2.status === "pending", `capped page size read as ${JSON.stringify(r2)}`);
  expect(capped.calls.join() === "1,2", `capped pages fetched ${capped.calls}`);
});

await test("HTTP lookup: a failed or incomplete page is a failure, not absent", async () => {
  const rows = [...fillers(120), row("gone@example.test", "unsubscribed")];
  for (const [page, broken] of [[1, 500], [2, 500], [2, { data: [] }], [2, { nope: true }], [2, { data: "x", meta: { total: 121, current_page: 2 } }]]) {
    const result = await fakeReach(rows, { serve: { [page]: broken } }).client.findContact("gone@example.test");
    expect(!result.ok, `page ${page} → ${JSON.stringify(broken)} read as ${JSON.stringify(result)}`);
  }
  const short = await fakeReach(rows, { serve: { 2: listPage([], 121, 2) } }).client.findContact("gone@example.test");
  expect(!short.ok && short.error === "incomplete_page", `short last page read as ${JSON.stringify(short)}`);
  const shortFirst = await fakeReach(rows, { serve: { 1: listPage(fillers(15), 121, 1, 100) } }).client.findContact("gone@example.test");
  expect(!shortFirst.ok && shortFirst.error === "incomplete_page", `15 rows of a 100-row page read as ${JSON.stringify(shortFirst)}`);
  const wrong = await fakeReach(rows, { serve: { 2: listPage(rows.slice(0, 21), 121, 1) } }).client.findContact("gone@example.test");
  expect(!wrong.ok && wrong.error === "wrong_page", `page 1 served as page 2 read as ${JSON.stringify(wrong)}`);
  const moved = await fakeReach(rows, { serve: { 2: listPage(rows.slice(100), 122, 2) } }).client.findContact("gone@example.test");
  expect(!moved.ok && moved.error === "list_changed", `total changed mid-walk read as ${JSON.stringify(moved)}`);
  const noTotal = await fakeReach(rows, { serve: { 1: { data: [], meta: { current_page: 1 } } } }).client.findContact("gone@example.test");
  expect(!noTotal.ok, `missing meta.total read as ${JSON.stringify(noTotal)}`);
  const huge = fakeReach(fillers(100 * MAX_PAGES + 1));
  const tooMany = await huge.client.findContact("gone@example.test");
  expect(!tooMany.ok && tooMany.error === "too_many_matches" && huge.calls.length === 1, `>${MAX_PAGES} pages read as ${JSON.stringify(tooMany)}`);
});

await test("HTTP lookup: a near-miss address doesn't match; exact is trimmed and case-insensitive", async () => {
  const near = [row("xgone@example.test", "unsubscribed"), row("gone@example.testx", "unsubscribed"), row("gone+1@example.test", "unsubscribed")];
  const result = await fakeReach(near).client.findContact("gone@example.test");
  expect(result.ok && result.status === null, `near-miss read as ${JSON.stringify(result)}`);
  const exact = await fakeReach([...near, row(" GONE@example.test ", "unsubscribed")]).client.findContact("gone@example.test");
  expect(exact.ok && exact.status === "unsubscribed", `trimmed, case-insensitive match missed: ${JSON.stringify(exact)}`);
});

await test("HTTP lookup: unsubscribed wins; an unknown or missing status is ambiguous", async () => {
  for (const order of [["pending", "unsubscribed"], ["unsubscribed", "confirmed"]]) {
    const r = await fakeReach(order.map((st) => row("gone@example.test", st))).client.findContact("gone@example.test");
    expect(r.ok && r.status === "unsubscribed", `${order} read as ${JSON.stringify(r)}`);
  }
  for (const odd of ["bounced", "", undefined, 3]) {
    const r = await fakeReach([{ email: "gone@example.test", subscription_status: odd }]).client.findContact("gone@example.test");
    expect(!r.ok && r.error === "ambiguous_status", `status ${JSON.stringify(odd)} read as ${JSON.stringify(r)}`);
  }
  const nested = createHttpReachClient({ token: "t", profileUuid: "p" }, async () =>
    new Response(JSON.stringify({ data: { data: [row("gone@example.test", "confirmed")], meta: { total: 1, current_page: 1 } } }), { status: 200 }),
  );
  const n = await nested.findContact("gone@example.test");
  expect(n.ok && n.status === "confirmed", `nested envelope: ${JSON.stringify(n)}`);
});

await test("a failed lookup blocks the add (sync level)", async () => {
  const db = memoryDb();
  const lead = db.insert({ email: "blocked@example.test", reachSyncStatus: "pending" });
  let creates = 0;
  const client = {
    async findContact() { return { ok: false, error: "ambiguous_status" }; },
    async createContact() { creates += 1; return { ok: true }; },
  };
  const outcome = await syncLead(lead.id, { store: db.syncStore, client, log });
  expect(outcome === "failed" && creates === 0, `${outcome}, ${creates} creates`);
});

await test("retry window covers at least 24 hours", async () => {
  let total = 0;
  for (let n = 1; n < MAX_ATTEMPTS; n += 1) total += backoffMs(n);
  expect(total >= 24 * HOUR, `${(total / HOUR).toFixed(1)} h from first to last attempt`);
  expect(backoffMs(MAX_ATTEMPTS - 1) === 6 * HOUR, "the last wait isn't the 6 h cap");
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
    now: () => at(39 * 24 * HOUR),
  });
  expect(ok.mode === "requeued" && ok.count === 1, `requeue ${JSON.stringify(ok)}`);
  const s = await h.retry(at(40 * 24 * HOUR));
  expect(s.created === 1, `retry after requeue ${JSON.stringify(s)}`);
  // Suppression still wins after a requeue.
  const h2 = harness();
  h2.stub.failCreate("http_503", 999);
  await h2.signUp("requeue-gone@example.test");
  await h2.flush();
  for (let i = 1; i <= MAX_ATTEMPTS + 2; i += 1) await h2.retry(at(i * 24 * HOUR));
  h2.stub.contacts.set("requeue-gone@example.test", "unsubscribed");
  const r2 = await requeueFailed({ store: h2.db.syncStore, args: ["--confirm"], env: { REACH_SYNC_ENABLED: "true" }, print: () => {}, now: () => at(40 * 24 * HOUR) });
  expect(r2.count === 1, `requeue count ${r2.count}`);
  const creates = h2.stub.creates();
  await h2.retry(at(41 * 24 * HOUR));
  expect(h2.stub.creates() === creates, "requeue re-added an unsubscribed address");
});

await test("--requeue-failed leaves rows still being retried, or attempted in the last 30 minutes", async () => {
  const db = memoryDb();
  const env = { REACH_SYNC_ENABLED: "true" };
  const now = at(10 * 24 * HOUR);
  db.insert({ email: "a@example.test", reachSyncStatus: "failed", reachSyncAttempts: 3, reachLastAttemptAt: at(0) });
  db.insert({ email: "b@example.test", reachSyncStatus: "failed", reachSyncAttempts: MAX_ATTEMPTS, reachLastAttemptAt: new Date(now.getTime() - 5 * 60 * 1000) });
  const stuck = db.insert({ email: "c@example.test", reachSyncStatus: "pending", reachSyncAttempts: MAX_ATTEMPTS, reachLastAttemptAt: at(0) });
  expect((await db.syncStore.countExhausted(MAX_ATTEMPTS)) === 2, "a pending row with every attempt used isn't counted");
  const r = await requeueFailed({ store: db.syncStore, args: ["--confirm"], env, print: () => {}, now: () => now });
  expect(r.count === 1 && db.rows.get(stuck.id).reachSyncAttempts === 0, `requeued ${r.count}`);
  expect(db.byEmail("a@example.test").reachSyncAttempts === 3, "a row still in its retries was reset");
  expect(db.byEmail("b@example.test").reachSyncAttempts === MAX_ATTEMPTS, "a row attempted 5 minutes ago was reset");
});

await test("requeue during an in-flight last attempt: one create", async () => {
  const db = memoryDb();
  const lead = db.insert({ email: "flight@example.test", reachSyncStatus: "failed", reachSyncAttempts: MAX_ATTEMPTS - 1, reachLastAttemptAt: at(0) });
  let release;
  const gate = new Promise((r) => { release = r; });
  let creates = 0;
  const client = {
    async findContact() { await gate; return { ok: true, status: null }; },
    async createContact() { creates += 1; return { ok: true }; },
  };
  const now = () => at(7 * HOUR);
  const first = syncLead(lead.id, { store: db.syncStore, client, now });
  await new Promise((r) => setTimeout(r, 0));
  await requeueFailed({ store: db.syncStore, args: ["--confirm"], env: { REACH_SYNC_ENABLED: "true" }, print: () => {}, now });
  const second = retryReachSync({ store: db.syncStore, client, now });
  release();
  await Promise.all([first, second]);
  expect(creates === 1, `${creates} creates`);
});

await test(`daily limit: no more than the limit added in 24 h; the rest wait with their attempts intact`, async () => {
  const h = harness();
  for (const n of [1, 2, 3]) h.db.insert({ email: `day${n}@example.test`, reachSyncStatus: "pending" });
  const s = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(0), dailyLimit: 2, log });
  expect(s.created === 2 && s.deferred === 1 && s.stoppedEarly, `summary ${JSON.stringify(s)}`);
  const waiting = h.db.byEmail("day3@example.test");
  expect(waiting.reachSyncStatus === "pending" && waiting.reachSyncAttempts === 0, "a deferred row lost an attempt");
  const later = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(25 * HOUR), dailyLimit: 2, log });
  expect(later.created === 1, `next day ${JSON.stringify(later)}`);
});

await test("30-day limit: deferred once the month's adds are used, even under the daily limit", async () => {
  const h = harness();
  for (const n of [1, 2, 3]) h.db.insert({ email: `month${n}@example.test`, reachSyncStatus: "pending" });
  const s1 = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(0), dailyLimit: 10, monthlyLimit: 2, log });
  expect(s1.created === 2 && s1.deferred === 1, `month ${JSON.stringify(s1)}`);
  const s2 = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(10 * 24 * HOUR), dailyLimit: 10, monthlyLimit: 2, log });
  expect(s2.created === 0 && s2.deferred === 1, `still within 30 days ${JSON.stringify(s2)}`);
  const s3 = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(31 * 24 * HOUR), dailyLimit: 10, monthlyLimit: 2, log });
  expect(s3.created === 1, `after 30 days ${JSON.stringify(s3)}`);
  expect(DAILY_ADD_LIMIT * 30 <= 1000 && MONTHLY_ADD_LIMIT <= 1000, "the caps allow more than the plan's 1,000 a month");
});

await test("rows still in their backoff don't fill the scan and hide due rows", async () => {
  const h = harness();
  for (let n = 0; n < 5; n += 1) h.db.insert({ email: `waiting${n}@example.test`, createdAt: at(-HOUR), reachSyncStatus: "failed", reachSyncAttempts: 3, reachLastAttemptAt: at(0) });
  h.db.insert({ email: "fresh@example.test", reachSyncStatus: "pending" });
  const s = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(60 * 1000), scan: 3, log });
  expect(s.created === 1 && s.backoff === 0, `summary ${JSON.stringify(s)}`);
});

await test("an address saved while sync was off is queued by a fresh sign-up after it's on", async () => {
  const off = harness({ enabled: false });
  await off.signUp("early@example.test");
  const on = harness();
  on.db.rows = off.db.rows;
  const row = [...off.db.rows.values()][0];
  on.db.insert(row);
  const res = await on.signUp("early@example.test");
  expect(res.status === 200 && res.body.confirmByEmail === true, "answer differs");
  expect(on.db.byEmail("early@example.test").reachSyncStatus === "pending", `status ${on.db.byEmail("early@example.test").reachSyncStatus}`);
  await on.flush();
  expect(on.stub.creates() === 1, `${on.stub.creates()} creates`);
});

await test("a retry run paces Reach calls, not skipped rows", async () => {
  const h = harness();
  for (let n = 0; n < 3; n += 1) h.db.insert({ email: `pace${n}@example.test`, reachSyncStatus: "pending" });
  h.db.insert({ email: "waiting@example.test", reachSyncStatus: "failed", reachSyncAttempts: 1, reachLastAttemptAt: at(0) });
  const pauses = [];
  const s = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(60 * 1000), paceMs: 2000, sleep: async (ms) => { pauses.push(ms); }, log });
  // The row still in its backoff isn't listed, so it costs nothing at all.
  expect(s.created === 3 && s.checked === 3, `summary ${JSON.stringify(s)}`);
  expect(pauses.join() === "2000,2000,2000", `pauses ${pauses}`);
});

await test("a retry run stops after its per-run limit and time budget", async () => {
  const h = harness();
  for (let n = 0; n < 5; n += 1) h.db.insert({ email: `run${n}@example.test`, reachSyncStatus: "pending" });
  const s = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at(0), limit: 2, log });
  expect(s.created === 2 && s.stoppedEarly, `limit ${JSON.stringify(s)}`);
  let t = 0;
  const s2 = await retryReachSync({ store: h.db.syncStore, client: h.stub, now: () => at((t += 2) * 60 * 1000), budgetMs: 5 * 60 * 1000, log });
  expect(s2.created === 1 && s2.stoppedEarly, `budget ${JSON.stringify(s2)}`);
});

await test("a sign-up without a source is stored as \"unspecified\" and never queued", async () => {
  const h = harness();
  const res = await handleSubscribe({ email: "nosource@example.test" }, {
    store: h.db.subscribeStore, notify: async () => {}, log,
    reach: { client: h.stub },
  });
  await h.flush();
  const saved = h.db.byEmail("nosource@example.test");
  expect(res.status === 200 && saved.source === "unspecified", `source ${saved.source}`);
  expect(saved.reachSyncStatus === "skipped_ineligible" && h.stub.calls.length === 0, `status ${saved.reachSyncStatus}`);
});

await test("switch off: the Prisma store writes and selects no Reach column", async () => {
  const calls = [];
  const existing = new Set();
  const fakePrisma = {
    newsletterLead: {
      async create(args) {
        calls.push(["create", args]);
        if (existing.has(args.data.email)) throw Object.assign(new Error("unique"), { code: "P2002" });
        existing.add(args.data.email);
        return { id: "lead_x", reachSyncStatus: args.data.reachSyncStatus ?? null };
      },
      async updateMany(args) {
        calls.push(["updateMany", args]);
        return { count: 1 };
      },
    },
    async $executeRaw(strings, ...values) {
      calls.push(["lock", strings.join("?"), values]);
      return 1;
    },
    async $transaction(fn) {
      return fn(fakePrisma);
    },
  };
  const lead = { email: "off@example.test", source: "blog", landingPath: "/blog", reachSyncStatus: undefined };
  const off = await prismaSubscribeStore(fakePrisma, () => {}, { syncEnabled: false }).save(lead);
  const touched = JSON.stringify(calls);
  expect(!/reach/i.test(touched), `switch-off query mentions a Reach column: ${touched}`);
  expect(off.created && off.reachSyncStatus === null, "switch-off result carried a Reach status");
  const repeat = await prismaSubscribeStore(fakePrisma, () => {}, { syncEnabled: false }).save(lead);
  expect(!repeat.created, "a unique violation (P2002) wasn't read as a repeat");
  calls.length = 0;
  await prismaSubscribeStore(fakePrisma, () => {}, { syncEnabled: true }).save({ ...lead, email: "on@example.test", reachSyncStatus: "pending" });
  const create = calls.find(([k]) => k === "create")[1];
  expect(create.data.reachSyncStatus === "pending" && create.select.reachSyncStatus, "switch-on doesn't queue the row");
  const lock = calls.find(([k]) => k === "lock");
  expect(lock && /pg_advisory_xact_lock_shared/.test(lock[1]) && lock[2][0] === 121122, `insert lock ${JSON.stringify(lock)}`);
  // A fresh eligible sign-up of an address saved while sync was off queues it, and only if never queued.
  calls.length = 0;
  existing.add("old@example.test");
  await prismaSubscribeStore(fakePrisma, () => {}, { syncEnabled: true }).save({ ...lead, email: "old@example.test", reachSyncStatus: "pending" });
  const queue = calls.find(([k]) => k === "updateMany");
  expect(queue && queue[1].where.reachSyncStatus === null && queue[1].data.reachSyncStatus === "pending", `requeue of never-queued ${JSON.stringify(queue)}`);
  expect(queue[1].where.source.in.join() === "blog,post", "a never-queued row from another source would be queued");
  // An ineligible repeat never queues anything.
  calls.length = 0;
  await prismaSubscribeStore(fakePrisma, () => {}, { syncEnabled: true }).save({ ...lead, email: "old@example.test", source: "contact", reachSyncStatus: "skipped_ineligible" });
  expect(!calls.some(([k]) => k === "updateMany"), "an ineligible repeat queued a row");
  // With a plain @default(0) Prisma writes reachSyncAttempts into every
  // INSERT, which breaks sign-ups on a database without the column.
  const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
  expect(/reachSyncAttempts\s+Int\s+@default\(dbgenerated\("0"\)\)/.test(schema), "reachSyncAttempts must default in the database");
});

await test("Prisma sync store: claim, requeue, exhausted and synced-since queries", async () => {
  const calls = [];
  const record = (op) => async (args) => { calls.push([op, args]); return op === "updateMany" ? { count: 1 } : op === "count" ? 0 : []; };
  const fakePrisma = { newsletterLead: { updateMany: record("updateMany"), count: record("count"), findMany: record("findMany"), findUnique: record("findUnique"), update: record("update") } };
  const store = prismaLeadSyncStore(fakePrisma);
  const when = at(0);
  const last = () => calls.at(-1)[1];
  await store.claimAttempt("lead_1", 3, when);
  expect(last().where.reachSyncAttempts === 3 && last().where.reachSyncStatus.in.join() === "pending,failed", `claim where ${JSON.stringify(last().where)}`);
  expect(last().data.reachSyncAttempts === 4 && last().data.reachLastAttemptAt === when, "claim data");
  const quiet = at(-HOUR);
  await store.requeueFailed(MAX_ATTEMPTS, quiet);
  const rq = last();
  expect(rq.where.reachSyncAttempts.gte === MAX_ATTEMPTS && rq.where.reachLastAttemptAt.lt === quiet, `requeue where ${JSON.stringify(rq.where)}`);
  expect(rq.where.reachSyncStatus.in.join() === "pending,failed", "requeue must cover pending and failed");
  await store.countExhausted(MAX_ATTEMPTS);
  expect(last().where.reachSyncStatus.in.join() === "pending,failed" && last().where.reachSyncAttempts.gte === MAX_ATTEMPTS, "exhausted where");
  await store.countSyncedSince(when);
  expect(last().where.reachSyncStatus === "synced" && last().where.reachLastAttemptAt.gte === when, "synced-since where");
  await store.listRetryable(MAX_ATTEMPTS, 7, at(10 * HOUR));
  expect(last().where.reachSyncAttempts.lt === MAX_ATTEMPTS && last().take === 7, "retryable where/take");
  const due = last().where.OR;
  expect(due[0].reachLastAttemptAt === null && due.length === MAX_ATTEMPTS + 1, `due filter ${JSON.stringify(due).slice(0, 120)}`);
  expect(due[2].reachSyncAttempts === 1 && due[2].reachLastAttemptAt.lte.getTime() === at(10 * HOUR).getTime() - backoffMs(1), "due cut-off for 1 attempt");
  // Oldest first, not fewest attempts first: a backlog of fresh rows must not
  // starve rows in their retries.
  expect(JSON.stringify(last().orderBy[0]) === '{"createdAt":"asc"}', `retryable order ${JSON.stringify(last().orderBy)}`);
});

await test("deletion request: website row and Reach contact go, unsubscribed mark included", async () => {
  const h = harness();
  await h.signUp("leaving@example.test");
  await h.flush();
  h.stub.contacts.set("leaving@example.test", "unsubscribed");
  const result = await deleteSubscriber({ email: " Leaving@Example.test ", store: h.db.deletionStore, client: h.stub });
  expect(result.websiteRowsDeleted === 1, `rows ${result.websiteRowsDeleted}`);
  expect(result.reach.ok && result.reach.deleted === 1, `reach ${JSON.stringify(result.reach)}`);
  expect(!h.db.byEmail("leaving@example.test") && !h.stub.contacts.has("leaving@example.test"), "something was left behind");
  // Without a configured client the row still goes and the caller is told.
  const h2 = harness();
  await h2.signUp("manual@example.test");
  const manual = await deleteSubscriber({ email: "manual@example.test", store: h2.db.deletionStore, client: null });
  expect(manual.websiteRowsDeleted === 1 && manual.reach === "not_configured", JSON.stringify(manual));
});

await test("stale queued work can't recreate a deleted contact", async () => {
  const h = harness();
  h.stub.failCreate("http_503", 3);
  await h.signUp("stale@example.test");
  await h.flush();
  const row = h.db.byEmail("stale@example.test");
  expect(row.reachSyncStatus === "failed", `row ${row.reachSyncStatus}`);
  await deleteSubscriber({ email: "stale@example.test", store: h.db.deletionStore, client: h.stub });
  const creates = h.stub.creates();
  const s = await h.retry(at(30 * 24 * HOUR));
  const back = await runBackfill({ store: h.db.backfillStore, args: [], env: {}, print: () => {} });
  expect(h.stub.creates() === creates && s.checked === 0, `retry after deletion ${JSON.stringify(s)}`);
  expect(back.plan.total === 0, "backfill still sees the deleted row");
  // A row deleted between listing and creating (no lock) is caught too.
  const h2 = harness();
  const lead = h2.db.insert({ email: "race-delete@example.test", reachSyncStatus: "pending" });
  const client = {
    async findContact() { h2.db.rows.delete(lead.id); return { ok: true, status: null }; },
    async createContact() { throw new Error("must not create"); },
    async deleteContact() { return { ok: true, deleted: 0 }; },
  };
  const outcome = await syncLead(lead.id, { store: h2.db.syncStore, client, log });
  expect(outcome === "not_found", `outcome ${outcome}`);
});

await test("deletion: website rows go first and case-insensitively; a match without a uuid deletes nothing", async () => {
  const order = [];
  const store = { async deleteByEmail(email) { order.push(`rows:${email}`); return 1; } };
  const client = { async deleteContact() { order.push("reach"); return { ok: true, deleted: 1 }; } };
  await deleteSubscriber({ email: " Mixed@Example.TEST ", store, client, afterRowsDeleted: async () => order.push("unlock") });
  expect(order.join() === "rows:mixed@example.test,unlock,reach", `order ${order}`);
  const calls = [];
  const fakePrisma = { newsletterLead: { async deleteMany(args) { calls.push(args); return { count: 2 }; } } };
  expect((await prismaDeletionStore(fakePrisma).deleteByEmail("mixed@example.test")) === 2, "count");
  expect(calls[0].where.email.mode === "insensitive" && calls[0].where.email.equals === "mixed@example.test", `delete where ${JSON.stringify(calls[0])}`);
  const noUuid = createHttpReachClient({ token: "t", profileUuid: "p" }, async (url, init) => {
    if (init.method === "DELETE") throw new Error("must not delete");
    return new Response(JSON.stringify(listPage([{ email: "gone@example.test", subscription_status: "unsubscribed" }])), { status: 200 });
  });
  const r = await noUuid.deleteContact("gone@example.test");
  expect(!r.ok && r.error === "missing_uuid", JSON.stringify(r));
});

await test("scripts never read a void lock function through $queryRaw", async () => {
  // pg_advisory_lock and the xact variants return void, which $queryRaw can't
  // deserialize (P2010): use pg_try_advisory_lock / pg_advisory_unlock (boolean)
  // or $executeRaw.
  for (const file of ["reach-retry.mjs", "newsletter-delete.mjs"]) {
    const text = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    const bad = text.match(/\$queryRaw`[^`]*pg_advisory_(xact_)?lock(_shared)?\(/);
    expect(!bad, `${file}: ${bad?.[0]}`);
  }
});

await test("HTTP deleteContact: finds the uuid on any page, DELETEs it; an incomplete lookup deletes nothing", async () => {
  const deletes = [];
  const rows = [...fillers(150), { uuid: "u-gone", email: "Gone@example.test", subscription_status: "unsubscribed" }];
  const client = createHttpReachClient({ token: "t", profileUuid: "prof-1" }, async (url, init) => {
    const u = new URL(String(url));
    if (init.method === "DELETE") { deletes.push(u.pathname); return new Response(JSON.stringify({ message: "Request accepted" }), { status: 200 }); }
    const page = Number(u.searchParams.get("page"));
    return new Response(JSON.stringify(listPage(rows.slice((page - 1) * 100, page * 100), rows.length, page)), { status: 200 });
  });
  const r = await client.deleteContact("gone@example.test");
  expect(r.ok && r.deleted === 1, JSON.stringify(r));
  expect(deletes.join() === "/api/reach/v1/profiles/prof-1/contacts/u-gone", `deleted ${deletes}`);
  const broken = fakeReach(rows, { serve: { 2: 500 } });
  const r2 = await broken.client.deleteContact("gone@example.test");
  expect(!r2.ok, `incomplete lookup read as ${JSON.stringify(r2)}`);
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
