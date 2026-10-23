#!/usr/bin/env node
/**
 * After `next build`: runs the hPanel cron's script from the standalone
 * output the way the server does (plain node, no npm, the trimmed
 * node_modules), so a runtime import missing from next.config.mjs
 * outputFileTracingIncludes fails here rather than in the production cron.
 *
 * Two runs, both with an empty environment apart from what's set here:
 * - switch off: must print "Nothing done" and exit 0;
 * - switch on (only once lib/reach.ts is in the build) with a dummy token and
 *   an unreachable database: every import must resolve, so the run has to get
 *   as far as the database and fail there, not on a missing module.
 *
 *   npm run build && npm run check:cron
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const root = new URL("../.next/standalone/", import.meta.url);
const script = new URL("scripts/reach-retry.mjs", root).pathname;
const failures = [];

function run(env) {
  const r = spawnSync(process.execPath, [script], {
    cwd: "/",
    env: { PATH: process.env.PATH, ...env },
    encoding: "utf8",
    timeout: 60_000,
  });
  return { status: r.status, out: `${r.stdout}\n${r.stderr}` };
}

if (!existsSync(script)) {
  failures.push("scripts/reach-retry.mjs isn't in .next/standalone: run `npm run build` first, or check outputFileTracingIncludes");
} else {
  const off = run({});
  if (off.status !== 0 || !off.out.includes("Nothing done")) {
    failures.push(`switch off: exit ${off.status}, expected "Nothing done" and 0`);
  }
  if (existsSync(new URL("lib/reach.ts", root))) {
    const on = run({
      REACH_SYNC_ENABLED: "true",
      REACH_API_TOKEN: "dummy",
      REACH_PROFILE_UUID: "dummy",
      DATABASE_URL: "postgresql://check:check@127.0.0.1:1/check",
      DIRECT_URL: "postgresql://check:check@127.0.0.1:1/check",
    });
    if (/ERR_MODULE_NOT_FOUND|Cannot find (module|package)/.test(on.out)) {
      failures.push(`switch on: a module is missing from the standalone build:\n${on.out.slice(0, 600)}`);
    } else if (on.status !== 1 || !/PrismaClientInitializationError|P1001|Can't reach database|127\.0\.0\.1:1/.test(on.out)) {
      failures.push(`switch on: expected a database failure (exit 1), got exit ${on.status}:\n${on.out.slice(0, 600)}`);
    }
  }
}

if (failures.length) {
  for (const f of failures) console.error(f);
  process.exit(1);
}
console.log("Standalone cron: scripts/reach-retry.mjs runs from the build (switch off: Nothing done).");
