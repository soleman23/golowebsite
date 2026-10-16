#!/usr/bin/env node
/**
 * Turns the owner's private per-round testing log into the aggregated,
 * de-identified summary that SEO-16 commits as docs/research/testing-summary.md
 * (soleman23/golowebsite#74). SEO-17's article may quote only numbers this
 * prints.
 *
 *   node scripts/testing-summary.mjs ~/private/golo-testing-log.csv
 *
 * The log is private and stays outside the repo: it refuses a path inside it.
 * The output has counts only. No names, phone numbers, courses or group
 * labels are ever printed.
 *
 * Log columns (header row required, any order; docs/research/testing-claims.md
 * has the full spec):
 *   date          YYYY-MM-DD
 *   group         a private label ("G1", "G2"…), never a name
 *   group_size    players in the round
 *   own_team      y if anyone from GoLo played in the group, else n
 *   formats       games played, separated by ";" (e.g. "nassau;skins")
 *   app_version   e.g. 0.4.1
 *   finished      y if the round reached a complete card
 *   stopped_hole  hole where scoring stopped, blank if finished
 *   settled       app | memory | none
 *   wager_changed y if the group changed the bet mid-round
 *   course        optional; read for nothing, never printed
 *   notes         optional; read for nothing, never printed
 */

import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const REQUIRED = [
  "date",
  "group",
  "group_size",
  "own_team",
  "formats",
  "app_version",
  "finished",
  "stopped_hole",
  "settled",
  "wager_changed",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

const yes = (v) => /^(y|yes|true|1)$/i.test(v.trim());

function readLog(path) {
  const [header, ...rows] = parseCsv(readFileSync(path, "utf8").replace(/^﻿/, ""));
  const cols = header.map((h) => h.trim().toLowerCase());
  const missing = REQUIRED.filter((name) => !cols.includes(name));
  if (missing.length) throw new Error(`log is missing columns: ${missing.join(", ")}`);
  const problems = [];
  const rounds = rows.map((r, i) => {
    const get = (name) => (r[cols.indexOf(name)] ?? "").trim();
    const line = i + 2;
    const round = {
      date: get("date"),
      group: get("group"),
      size: Number(get("group_size")),
      ownTeam: yes(get("own_team")),
      formats: get("formats").toLowerCase().split(";").map((f) => f.trim()).filter(Boolean),
      version: get("app_version"),
      finished: yes(get("finished")),
      stoppedHole: get("stopped_hole") === "" ? null : Number(get("stopped_hole")),
      settled: get("settled").toLowerCase(),
      wagerChanged: yes(get("wager_changed")),
    };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(round.date)) problems.push(`line ${line}: date "${round.date}" isn't YYYY-MM-DD`);
    if (!round.group) problems.push(`line ${line}: no group label`);
    if (!Number.isInteger(round.size) || round.size < 1) problems.push(`line ${line}: group_size isn't a whole number`);
    if (!round.formats.length) problems.push(`line ${line}: no formats`);
    if (!["app", "memory", "none"].includes(round.settled)) problems.push(`line ${line}: settled must be app, memory or none`);
    if (round.finished && round.stoppedHole !== null) problems.push(`line ${line}: finished but has a stopped_hole`);
    if (!round.finished && !(round.stoppedHole >= 1 && round.stoppedHole <= 18)) problems.push(`line ${line}: unfinished round needs stopped_hole 1–18`);
    return round;
  });
  if (problems.length) throw new Error(`log has problems:\n  ${problems.join("\n  ")}`);
  return rounds;
}

function summarize(rounds) {
  const count = (pred) => rounds.filter(pred).length;
  const dates = rounds.map((r) => r.date).sort();
  const groups = new Set(rounds.map((r) => r.group));
  const ownGroups = new Set(rounds.filter((r) => r.ownTeam).map((r) => r.group));
  const formats = new Map();
  for (const r of rounds) for (const f of r.formats) formats.set(f, (formats.get(f) ?? 0) + 1);
  const versions = [...new Set(rounds.map((r) => r.version).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const unfinished = rounds.filter((r) => !r.finished);
  const byHole = new Map();
  for (const r of unfinished) byHole.set(r.stoppedHole, (byHole.get(r.stoppedHole) ?? 0) + 1);
  const sizes = rounds.map((r) => r.size).sort((a, b) => a - b);

  const out = [
    "# Testing summary",
    "",
    "Aggregated from the owner's private per-round log by `scripts/testing-summary.mjs`.",
    "No names, phone numbers, courses or group labels are kept here. The raw log",
    "stays outside this repository.",
    "",
    `Generated: ${new Date().toISOString().slice(0, 10)}.`,
    "",
    "## Rounds",
    "",
    "| Measure | Value |",
    "|---|---:|",
    `| Rounds logged | ${rounds.length} |`,
    `| First round | ${dates[0]} |`,
    `| Last round | ${dates[dates.length - 1]} |`,
    `| Distinct groups | ${groups.size} |`,
    `| Groups with someone from GoLo playing | ${ownGroups.size} |`,
    `| Group size, smallest – largest | ${sizes[0]} – ${sizes[sizes.length - 1]} |`,
    `| Distinct formats | ${formats.size} |`,
    `| App versions | ${versions.join(", ") || "not recorded"} |`,
    `| Finished with a complete card | ${count((r) => r.finished)} |`,
    `| Stopped before the turn (holes 1–9) | ${count((r) => !r.finished && r.stoppedHole <= 9)} |`,
    `| Stopped on holes 3–5 | ${count((r) => !r.finished && r.stoppedHole >= 3 && r.stoppedHole <= 5)} |`,
    `| Stopped on the back nine (holes 10–18) | ${count((r) => !r.finished && r.stoppedHole >= 10)} |`,
    `| Settled in the app | ${count((r) => r.settled === "app")} |`,
    `| Settled from memory | ${count((r) => r.settled === "memory")} |`,
    `| Not settled | ${count((r) => r.settled === "none")} |`,
    `| Changed the wager mid-round | ${count((r) => r.wagerChanged)} |`,
    "",
    "## Formats",
    "",
    "| Format | Rounds it was played in |",
    "|---|---:|",
    ...[...formats].sort((a, b) => b[1] - a[1]).map(([f, n]) => `| ${f} | ${n} |`),
    "",
    "## Where unfinished rounds stopped",
    "",
    "| Hole | Rounds |",
    "|---:|---:|",
    ...[...byHole].sort((a, b) => a[0] - b[0]).map(([h, n]) => `| ${h} | ${n} |`),
  ];
  return out.join("\n");
}

function main([path]) {
  if (!path) {
    console.error("usage: node scripts/testing-summary.mjs <private-log.csv>");
    process.exit(2);
  }
  const within = relative(repoRoot, resolve(path));
  if (!within.startsWith("..")) {
    console.error(`${path} is inside the repository. Keep the raw log outside it; the repo is public.`);
    process.exit(2);
  }
  try {
    console.log(summarize(readLog(path)));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));
