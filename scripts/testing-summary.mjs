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
 *   group         a private label: G and a number ("G1", "G12"), never a
 *                 name; "g 1" and "G01" read as G1; blank allowed
 *   group_size    players in the round; blank allowed
 *   own_team      y/n: did anyone from GoLo play in the group; blank allowed
 *   formats       games played, ";"-separated, from FORMATS below; blank allowed.
 *                 A game not on the list is "other-1", "other-2"… so two
 *                 different unlisted games stay distinct; a bare "other"
 *                 makes the distinct-format count a minimum
 *   app_version   e.g. 0.4.1; blank allowed
 *   finished      y/n: did the round reach a complete card entered in GoLo.
 *                 A card finished on paper is n. Blank if the records can't
 *                 tell.
 *   holes         9 or 18: the round's length; blank allowed
 *   stopped_hole  how many holes had a score entered in GoLo, counted from
 *                 the group's first hole (so a 10th-tee start works), 0 if
 *                 none (stopped during setup): required if finished is n,
 *                 blank otherwise
 *   settled       app | memory | none; blank allowed
 *   wager_changed y/n: did the group change the bet mid-round; blank allowed
 *   stakes        y/n: was the group playing for money; blank allowed
 *   on_course     y/n: was it a round played on a course (not a demo or a
 *                 desk test); blank allowed. Rows marked n are left out of
 *                 every count and reported only as a number
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
  "holes",
  "stopped_hole",
  "settled",
  "wager_changed",
  "stakes",
  "on_course",
];

/** Largest group size the summary will print; anything bigger is an error. */
const MAX_GROUP_SIZE = 8;

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

// One or two digits per part, like GoLo's 0.6.2. A dotted phone number
// (555.123.4567) has longer groups and fails, so it can't reach the summary.
/**
 * Formats GoLo runs today, per lib/content/capabilities.ts (game-library,
 * overall-match-presses, and the scramble team handicap). The summary shows
 * which logged formats are in it, so the study can't imply GoLo runs the rest.
 */
const IN_GOLO = new Set([
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
  "scramble",
  // Teams playing best ball are in the app (lib/content/features.ts and the
  // real round on /how-it-works).
  "best-ball",
]);

const WHOLE_NUMBER = /^\d+$/;
// Leading zeros are dropped, so G01 and G1 are the same group; G0 isn't one.
const GROUP_LABEL = /^G0*([1-9]\d{0,2})$/;

const VERSION = /^\d{1,2}\.\d{1,2}(\.\d{1,2})?$/;
// Same rule for unlisted games: other-01 is other-1; other-0 isn't valid.
const NUMBERED_OTHER = /^other-0*([1-9]\d?)$/;

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
        // After a closing quote only a comma or a line end may follow;
        // "G1"x would otherwise read as G1x.
        const next = text[i + 1];
        if (next !== undefined && next !== "," && next !== "\n" && next !== "\r") {
          throw new Error(`log has text after a closing quote on line ${line}`);
        }
      } else {
        field += c;
      }
    } else if (c === '"' && field === "") {
      // Only a quote at the start of a field opens one. Mid-field it's a
      // literal character: an inch mark in "a 6" putt" mustn't swallow rows.
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
    const formats = [
      ...new Set(
        get("formats")
          .toLowerCase()
          .split(";")
          .map((f) => f.trim())
          .filter(Boolean)
          .map((f) => {
            const n = NUMBERED_OTHER.exec(f);
            return n ? `other-${n[1]}` : f;
          }),
      ),
    ];
    const size = get("group_size");
    const stop = get("stopped_hole");
    const rawGroup = get("group").toUpperCase().replace(/\s+/g, "");
    const groupMatch = GROUP_LABEL.exec(rawGroup);
    const group = groupMatch ? `G${groupMatch[1]}` : rawGroup;
    const holes = get("holes");
    const round = {
      date: get("date"),
      group: group || null,
      size: size === "" ? null : WHOLE_NUMBER.test(size) ? Number(size) : NaN,
      holes: holes === "" ? null : holes === "9" || holes === "18" ? Number(holes) : NaN,
      ownTeam: yesNo(get("own_team")),
      // A format counts once per round, however often a row repeats it.
      formats: formats.length ? formats : null,
      version: get("app_version") || null,
      finished: yesNo(get("finished")),
      stoppedHole: stop === "" ? null : WHOLE_NUMBER.test(stop) ? Number(stop) : NaN,
      settled: get("settled").toLowerCase() || null,
      wagerChanged: yesNo(get("wager_changed")),
      stakes: yesNo(get("stakes")),
      onCourse: yesNo(get("on_course")),
    };
    // Errors name the column, never the value: a stray comma shifts private
    // text into these columns, and error output tends to get pasted around.
    if (!isCalendarDate(round.date)) fail("date isn't a real YYYY-MM-DD date");
    if (Number.isNaN(round.holes)) fail("holes must be 9, 18 or blank");
    if (round.group !== null && !GROUP_LABEL.test(round.group)) fail("group must be G and a number (G1, G12) or blank");
    for (const [name, value] of [
      ["finished", round.finished],
      ["own_team", round.ownTeam],
      ["wager_changed", round.wagerChanged],
      ["stakes", round.stakes],
      ["on_course", round.onCourse],
    ]) {
      if (value === undefined) fail(`${name} must be y, n or blank`);
    }
    // Capped so a phone number pasted into this column can't be printed.
    if (round.size !== null && (!Number.isInteger(round.size) || round.size < 1 || round.size > MAX_GROUP_SIZE)) {
      fail(`group_size must be 1–${MAX_GROUP_SIZE} or blank`);
    }
    for (const f of round.formats ?? []) {
      if (!FORMATS.includes(f) && !NUMBERED_OTHER.test(f)) {
        fail(`formats has a value that isn't one of: ${FORMATS.join(", ")}, or other-1, other-2…`);
      }
    }
    if (round.version !== null && !VERSION.test(round.version)) fail("app_version isn't a version like 0.6 or 0.6.2");
    if (round.settled !== null && !["app", "memory", "none"].includes(round.settled)) fail("settled must be app, memory, none or blank");
    if (round.finished !== false && round.stoppedHole !== null) fail("stopped_hole is only for an unfinished round");
    const maxScored = (round.holes ?? 18) - 1;
    if (round.finished === false && !(Number.isInteger(round.stoppedHole) && round.stoppedHole >= 0 && round.stoppedHole <= maxScored)) {
      fail(`unfinished round needs stopped_hole 0–${maxScored} (holes scored in GoLo; 0 if none)`);
    }
    return round;
  });
  if (problems.length) throw new Error(`log has problems:\n  ${problems.join("\n  ")}`);
  if (!rounds.length) throw new Error("log has no rounds");
  return rounds;
}

function summarize(logged) {
  // Demo and desk-test rows aren't rounds of golf, so they count nowhere.
  const rounds = logged.filter((r) => r.onCourse !== false);
  if (!rounds.length) throw new Error("log has no rounds that weren't marked as demos (on_course n)");
  const count = (pred) => rounds.filter(pred).length;
  const seen = new Map();
  for (const r of rounds) if (r.group) seen.set(`${r.date}|${r.group}`, (seen.get(`${r.date}|${r.group}`) ?? 0) + 1);
  const repeated = [...seen.values()].filter((n) => n > 1).reduce((a, n) => a + n, 0);
  const dates = rounds.map((r) => r.date).sort();
  const groups = new Set(rounds.map((r) => r.group).filter(Boolean));
  const ownGroups = new Set(rounds.filter((r) => r.ownTeam === true && r.group).map((r) => r.group));
  const bareOther = rounds.some((r) => r.formats?.includes("other"));
  // A bare "other" can only duplicate a numbered one, never a listed game.
  const numberedOther = rounds.some((r) => r.formats?.some((f) => f.startsWith("other-")));
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
  const settledRow = (label, match) =>
    `| ${label} | ${["app", "memory", "none", null].map((s) => count((r) => match(r) && r.settled === s)).join(" | ")} |`;
  const golo = [...formats.keys()].filter((f) => IN_GOLO.has(f));
  const unscored = (r) => r.finished === false;

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
    `| Demo or desk-test rows left out | ${logged.length - rounds.length} |`,
    `| Rows sharing a date and group with another row | ${repeated} |`,
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
    // A bare "other" may be one of the numbered others, or several new games,
    // so the most that's certain is every other label counted once.
    `| Distinct formats | ${bareOther ? `at least ${numberedOther ? formats.size - 1 : formats.size} (a bare "other" was used; renumber it)` : formats.size} |`,
    `| Distinct formats GoLo runs today | ${golo.length} |`,
    `| Rounds with formats not known | ${count((r) => r.formats === null)} |`,
    `| App versions | ${versions.join(", ") || "not recorded"} |`,
    `| Rounds with app version not known | ${count((r) => r.version === null)} |`,
    `| Played for money | ${count((r) => r.stakes === true)} |`,
    `| Not played for money | ${count((r) => r.stakes === false)} |`,
    `| Stakes not known | ${count((r) => r.stakes === null)} |`,
    `| On a course | ${count((r) => r.onCourse === true)} |`,
    `| On a course not known | ${count((r) => r.onCourse === null)} |`,
    `| Finished with a complete card in GoLo | ${count((r) => r.finished === true)} |`,
    `| Unfinished in GoLo | ${count((r) => r.finished === false)} |`,
    `| Completion not known | ${count((r) => r.finished === null)} |`,
    `| 18-hole rounds | ${count((r) => r.holes === 18)} |`,
    `| Nine-hole rounds | ${count((r) => r.holes === 9)} |`,
    `| Round length not known | ${count((r) => r.holes === null)} |`,
    `| Stopped during setup (no hole scored) | ${count((r) => unscored(r) && r.stoppedHole === 0)} |`,
    `| Quit on the 3rd–5th hole played (2–4 holes scored) | ${count((r) => unscored(r) && r.stoppedHole >= 2 && r.stoppedHole <= 4)} |`,
    `| 18-hole rounds stopped before the turn (0–8 holes scored) | ${count((r) => unscored(r) && r.holes === 18 && r.stoppedHole <= 8)} |`,
    `| 18-hole rounds stopped on the back nine (9–17 holes scored) | ${count((r) => unscored(r) && r.holes === 18 && r.stoppedHole >= 9)} |`,
    `| Unfinished rounds of unknown length | ${count((r) => unscored(r) && r.holes === null)} |`,
    `| Changed the wager mid-round | ${count((r) => r.wagerChanged === true)} |`,
    `| Rounds where a wager change isn't known | ${count((r) => r.wagerChanged === null)} |`,
    "",
    "## How rounds were settled",
    "",
    "| | In the app | From memory | Not settled | Settlement not known |",
    "|---|---:|---:|---:|---:|",
    settledRow("Finished", (r) => r.finished === true),
    settledRow("Unfinished", (r) => r.finished === false),
    settledRow("Completion not known", (r) => r.finished === null),
    settledRow("All rounds", () => true),
    "",
    "## Formats",
    "",
    "| Format | Rounds it was played in | GoLo runs it today |",
    "|---|---:|---|",
    ...[...formats].sort((a, b) => b[1] - a[1]).map(([f, n]) => `| ${f} | ${n} | ${IN_GOLO.has(f) ? "yes" : "no"} |`),
    "",
    "## Where unfinished rounds stopped",
    "",
    "| Holes scored | Rounds |",
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

/** True when this file is the script node was asked to run, symlinks and spaces included. */
function isEntryPoint() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]));
  } catch {
    return false;
  }
}

if (isEntryPoint()) main(process.argv.slice(2));
