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
 * The summary is public, so nothing free-form reaches it: it prints counts,
 * dates, formats from a fixed list and version numbers that match x.y or
 * x.y.z. Group labels, courses and notes are never printed.
 *
 * Log columns (header row required, any order, no duplicates;
 * docs/research/testing-claims.md has the full spec). Blank means unknown
 * wherever it's allowed, and unknowns are counted, never guessed:
 *   date          YYYY-MM-DD (required)
 *   group         a private label ("G1", "G2"…), never a name; blank allowed
 *   group_size    players in the round; blank allowed
 *   own_team      y/n: did anyone from GoLo play in the group; blank allowed
 *   formats       games played, ";"-separated, from FORMATS below; blank allowed.
 *                 A game not on the list is "other-1", "other-2"… so two
 *                 different unlisted games stay distinct; a bare "other"
 *                 makes the distinct-format count a minimum
 *   app_version   e.g. 0.4.1; blank allowed
 *   finished      y/n: did the round reach a complete card (required)
 *   stopped_hole  hole where scoring stopped: required if finished is n,
 *                 blank if y
 *   settled       app | memory | none (required)
 *   wager_changed y/n: did the group change the bet mid-round; blank allowed
 *   stakes        y/n: was the group playing for money; blank allowed
 *   course        optional; read for nothing, never printed
 *   notes         optional; read for nothing, never printed
 */

import { readFileSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
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
  "stakes",
];

/**
 * The only format names the public summary can show. A cell outside this list
 * is an error, not a new row, so a name typed into the wrong column can't leak.
 */
const FORMATS = [
  "nassau",
  "skins",
  "wolf",
  "bingo-bango-bongo",
  "best-score",
  "closest-to-pin",
  "longest-drive",
  "birdies",
  "junk",
  "overall-match",
  "best-ball",
  "scramble",
  "match-play",
  "stroke-play",
  "quota",
  "other",
];

const VERSION = /^\d+\.\d+(\.\d+)?$/;
const NUMBERED_OTHER = /^other-\d{1,2}$/;

/** Records with the physical line each one starts on, blank lines dropped. */
function parseCsv(text) {
  const records = [];
  let row = [];
  let field = "";
  let quoted = false;
  let line = 1;
  let start = 1;
  const end = () => {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) records.push({ line: start, cells: row });
    row = [];
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "\n" || (c === "\r" && text[i + 1] !== "\n")) line++;
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
      if (c === "\r" && text[i + 1] === "\n") {
        i++;
        line++;
      }
      end();
      start = line;
    } else {
      field += c;
    }
  }
  if (quoted) throw new Error(`log has a quoted field opened on line ${start} that never closes`);
  if (field || row.length) end();
  return records;
}

/** true, false, or null for a blank (unknown); anything else is undefined. */
function yesNo(value) {
  const v = value.trim().toLowerCase();
  if (v === "") return null;
  if (["y", "yes", "true", "1"].includes(v)) return true;
  if (["n", "no", "false", "0"].includes(v)) return false;
  return undefined;
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function readLog(path) {
  const [header, ...records] = parseCsv(readFileSync(path, "utf8").replace(/^﻿/, ""));
  if (!header) throw new Error("log is empty");
  const cols = header.cells.map((h) => h.trim().toLowerCase());
  const duplicates = [...new Set(cols.filter((c, i) => c && cols.indexOf(c) !== i))];
  if (duplicates.length) throw new Error(`log has duplicate columns: ${duplicates.join(", ")}`);
  const missing = REQUIRED.filter((name) => !cols.includes(name));
  if (missing.length) throw new Error(`log is missing columns: ${missing.join(", ")}`);

  const problems = [];
  const rounds = records.map(({ line, cells }) => {
    const get = (name) => (cells[cols.indexOf(name)] ?? "").trim();
    const fail = (message) => problems.push(`line ${line}: ${message}`);
    // A missing or extra comma shifts every later value into the wrong column.
    if (cells.length !== cols.length) fail(`has ${cells.length} fields, the header has ${cols.length}`);
    const formats = [...new Set(get("formats").toLowerCase().split(";").map((f) => f.trim()).filter(Boolean))];
    const size = get("group_size");
    const round = {
      date: get("date"),
      group: get("group") || null,
      size: size === "" ? null : Number(size),
      ownTeam: yesNo(get("own_team")),
      // A format counts once per round, however often a row repeats it.
      formats: formats.length ? formats : null,
      version: get("app_version") || null,
      finished: yesNo(get("finished")),
      stoppedHole: get("stopped_hole") === "" ? null : Number(get("stopped_hole")),
      settled: get("settled").toLowerCase(),
      wagerChanged: yesNo(get("wager_changed")),
      stakes: yesNo(get("stakes")),
    };
    if (!isCalendarDate(round.date)) fail(`date "${round.date}" isn't a real YYYY-MM-DD date`);
    if (round.finished === undefined || round.finished === null) fail("finished must be y or n");
    for (const [name, value] of [["own_team", round.ownTeam], ["wager_changed", round.wagerChanged], ["stakes", round.stakes]]) {
      if (value === undefined) fail(`${name} must be y, n or blank`);
    }
    if (round.size !== null && (!Number.isInteger(round.size) || round.size < 1)) fail("group_size must be a whole number or blank");
    for (const f of round.formats ?? []) {
      if (!FORMATS.includes(f) && !NUMBERED_OTHER.test(f)) {
        fail(`format "${f}" isn't one of: ${FORMATS.join(", ")}, or other-1, other-2…`);
      }
    }
    if (round.version !== null && !VERSION.test(round.version)) fail(`app_version "${round.version}" isn't x.y or x.y.z`);
    if (!["app", "memory", "none"].includes(round.settled)) fail("settled must be app, memory or none");
    if (round.finished === true && round.stoppedHole !== null) fail("finished but has a stopped_hole");
    if (round.finished === false && !(Number.isInteger(round.stoppedHole) && round.stoppedHole >= 1 && round.stoppedHole <= 18)) {
      fail("unfinished round needs stopped_hole 1–18");
    }
    return round;
  });
  if (problems.length) throw new Error(`log has problems:\n  ${problems.join("\n  ")}`);
  if (!rounds.length) throw new Error("log has no rounds");
  return rounds;
}

function summarize(rounds) {
  const count = (pred) => rounds.filter(pred).length;
  const dates = rounds.map((r) => r.date).sort();
  const groups = new Set(rounds.map((r) => r.group).filter(Boolean));
  const ownGroups = new Set(rounds.filter((r) => r.ownTeam === true && r.group).map((r) => r.group));
  const bareOther = rounds.some((r) => r.formats?.includes("other"));
  const isSaturday = (date) => new Date(`${date}T00:00:00Z`).getUTCDay() === 6;
  const formats = new Map();
  for (const r of rounds) for (const f of r.formats ?? []) formats.set(f, (formats.get(f) ?? 0) + 1);
  const versions = [...new Set(rounds.map((r) => r.version).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const unfinished = rounds.filter((r) => r.finished === false);
  const byHole = new Map();
  for (const r of unfinished) byHole.set(r.stoppedHole, (byHole.get(r.stoppedHole) ?? 0) + 1);
  const sizes = rounds.map((r) => r.size).filter((s) => s !== null).sort((a, b) => a - b);
  const settledRow = (label, finished) =>
    `| ${label} | ${["app", "memory", "none"].map((s) => count((r) => r.finished === finished && r.settled === s)).join(" | ")} |`;

  const out = [
    "# Testing summary",
    "",
    "Aggregated from the owner's private per-round log by `scripts/testing-summary.mjs`.",
    "No names, phone numbers, courses or group labels are kept here. The raw log",
    "stays outside this repository. \"Not known\" rows count blanks in the log.",
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
    `| Rounds on a Saturday | ${count((r) => isSaturday(r.date))} |`,
    `| Distinct groups | ${groups.size} |`,
    `| Rounds with no group label | ${count((r) => r.group === null)} |`,
    `| Rounds with someone from GoLo playing | ${count((r) => r.ownTeam === true)} |`,
    `| Groups with someone from GoLo playing (labelled groups) | ${ownGroups.size} |`,
    `| Rounds where that isn't known | ${count((r) => r.ownTeam === null)} |`,
    `| Group size, smallest – largest | ${sizes.length ? `${sizes[0]} – ${sizes[sizes.length - 1]}` : "not known"} |`,
    `| Rounds with group size not known | ${count((r) => r.size === null)} |`,
    `| Distinct formats | ${bareOther ? `at least ${formats.size} (a bare "other" can hide several)` : formats.size} |`,
    `| Rounds with formats not known | ${count((r) => r.formats === null)} |`,
    `| App versions | ${versions.join(", ") || "not recorded"} |`,
    `| Rounds with app version not known | ${count((r) => r.version === null)} |`,
    `| Played for money | ${count((r) => r.stakes === true)} |`,
    `| Not played for money | ${count((r) => r.stakes === false)} |`,
    `| Stakes not known | ${count((r) => r.stakes === null)} |`,
    `| Finished with a complete card | ${count((r) => r.finished === true)} |`,
    `| Stopped before the turn (holes 1–9) | ${count((r) => r.finished === false && r.stoppedHole <= 9)} |`,
    `| Stopped on holes 3–5 | ${count((r) => r.finished === false && r.stoppedHole >= 3 && r.stoppedHole <= 5)} |`,
    `| Stopped on the back nine (holes 10–18) | ${count((r) => r.finished === false && r.stoppedHole >= 10)} |`,
    `| Changed the wager mid-round | ${count((r) => r.wagerChanged === true)} |`,
    `| Rounds where a wager change isn't known | ${count((r) => r.wagerChanged === null)} |`,
    "",
    "## How rounds were settled",
    "",
    "| | In the app | From memory | Not settled |",
    "|---|---:|---:|---:|",
    settledRow("Finished", true),
    settledRow("Unfinished", false),
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
  // Compare real paths, so a symlink outside the repo can't point back in.
  let real;
  try {
    real = realpathSync(resolve(path));
  } catch {
    console.error(`${path}: no such file`);
    process.exit(2);
  }
  const within = relative(realpathSync(repoRoot), real);
  const outside = within === ".." || within.startsWith(`..${sep}`) || isAbsolute(within);
  if (!outside) {
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
