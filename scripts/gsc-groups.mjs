#!/usr/bin/env node
/**
 * Groups a Search Console performance export into the query and page groups
 * that the SEO-07 revalidation (soleman23/golowebsite#65) and every monthly
 * report (#68) use, so the groups are defined once, here.
 *
 * Input: the folder (or its Queries.csv / Pages.csv) from Search Console →
 * Performance → Search results → Export → Download CSV, unzipped. Keep exports
 * outside the repo; they're the owner's data, not the site's.
 *
 *   node scripts/gsc-groups.mjs <export-folder>
 *   node scripts/gsc-groups.mjs <export-folder> --baseline <older-export-folder>
 *
 * Prints Markdown tables to paste into docs/seo-progress.md or a report. It
 * reads only the files it's given and changes nothing.
 *
 * Caveats the tables can't show, so say them in the write-up:
 * - Search Console leaves anonymized queries out of the query table, so query
 *   groups add up to less than the property's totals. Quote the totals from
 *   the Performance chart, not from this sum.
 * - A group's position is the impression-weighted mean of its queries'
 *   average positions: a summary, not a number Search Console reports.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Query groups, first match wins, so order matters: "nassau press" is Nassau,
 * not Other games. Every query lands in exactly one group.
 */
export const QUERY_GROUPS = [
  {
    // GOLO is also a diet company, putters and a dice game. "golo board"
    // showed in the October 8 baseline; it's watched below, not branded.
    name: "Off-topic GOLO",
    test: (q) => /\bgo ?lo\b/.test(q) && /\b(diet|board|putters?|dice|pills?|release|recipes?)\b/.test(q),
  },
  { name: "Branded", test: (q) => /\bgo ?lo\b/.test(q) },
  { name: "Nassau", test: (q) => /\bnassau\b/.test(q) },
  {
    name: "Settle-up",
    test: (q) => /\b(settle|settling|who owes|who pays|pay ?up|split the (pot|bet|money|winnings)|venmo)\b/.test(q),
  },
  {
    name: "Handicap",
    test: (q) => /\b(handicap|slope|course rating|sandbag\w*|stroke index|net score)\b/.test(q),
  },
  { name: "Trips", test: (q) => /\b(trips?|bandon|scottsdale|buddies|ryder cup)\b/.test(q) },
  {
    name: "Other games",
    test: (q) =>
      /\b(skins?|wolf|bingo|bango|bongo|closest to (the )?pin|longest drive|best ball|best score|birdies?|junk|dots|greenies?|press|presses|pressing|side (games?|bets?)|golf (bets?|betting|games?|gambling|wagers?))\b/.test(q),
  },
  { name: "Unassigned", test: () => true },
];

/** Queries to report on their own, wherever they land. */
export const WATCHED_QUERIES = ["golo board", "mongolian reversal"];

export function queryGroup(query) {
  const q = query.toLowerCase().trim();
  return QUERY_GROUPS.find((group) => group.test(q)).name;
}

export function pageGroup(url) {
  const path = new URL(url).pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/games/")) return "Guides";
  if (path.startsWith("/blog/")) return "Posts";
  return "Core pages";
}

/* ---------------------------------------------------------------- CSV */

/** Parses a Search Console CSV: quoted fields, a header row, commas. */
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

/** Rows of { key, clicks, impressions, position } from Queries.csv or Pages.csv. */
function readExport(path) {
  const [header, ...rows] = parseCsv(readFileSync(path, "utf8").replace(/^﻿/, ""));
  const col = (name) => {
    const index = header.findIndex((h) => h.trim().toLowerCase() === name);
    if (index === -1) throw new Error(`${path}: no "${name}" column (got ${header.join(", ")})`);
    return index;
  };
  const clicks = col("clicks");
  const impressions = col("impressions");
  const position = col("position");
  return rows.map((r) => ({
    key: r[0],
    clicks: Number(r[clicks]),
    impressions: Number(r[impressions]),
    position: Number(r[position]),
  }));
}

function locate(arg, file) {
  if (statSync(arg).isDirectory()) {
    const path = join(arg, file);
    return existsSync(path) ? path : null;
  }
  return arg.endsWith(file) ? arg : null;
}

/* ------------------------------------------------------------ summary */

function summarize(rows, groupOf, order) {
  const groups = new Map(order.map((name) => [name, { clicks: 0, impressions: 0, weighted: 0, count: 0 }]));
  for (const row of rows) {
    const name = groupOf(row.key);
    if (!groups.has(name)) groups.set(name, { clicks: 0, impressions: 0, weighted: 0, count: 0 });
    const g = groups.get(name);
    g.clicks += row.clicks;
    g.impressions += row.impressions;
    g.weighted += row.position * row.impressions;
    g.count += 1;
  }
  return groups;
}

const pct = (clicks, impressions) =>
  impressions ? `${((clicks / impressions) * 100).toFixed(1)}%` : "–";
const pos = (g) => (g.impressions ? (g.weighted / g.impressions).toFixed(1) : "–");
const delta = (now, then) => {
  const d = now - then;
  return d === 0 ? "0" : d > 0 ? `+${d}` : `${d}`;
};

function groupTable(title, unit, current, baseline) {
  const lines = [`### ${title}`, ""];
  if (baseline) {
    lines.push(
      `| Group | ${unit} | Impressions | Δ | Clicks | Δ | CTR | Position | Baseline position |`,
      "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
    );
  } else {
    lines.push(`| Group | ${unit} | Impressions | Clicks | CTR | Position |`, "|---|---:|---:|---:|---:|---:|");
  }
  for (const [name, g] of current) {
    const b = baseline?.get(name) ?? { clicks: 0, impressions: 0, weighted: 0, count: 0 };
    lines.push(
      baseline
        ? `| ${name} | ${g.count} | ${g.impressions} | ${delta(g.impressions, b.impressions)} | ${g.clicks} | ${delta(g.clicks, b.clicks)} | ${pct(g.clicks, g.impressions)} | ${pos(g)} | ${pos(b)} |`
        : `| ${name} | ${g.count} | ${g.impressions} | ${g.clicks} | ${pct(g.clicks, g.impressions)} | ${pos(g)} |`,
    );
  }
  return lines.join("\n");
}

function rowTable(title, rows) {
  const lines = [`### ${title}`, "", "| Page | Impressions | Clicks | CTR | Position |", "|---|---:|---:|---:|---:|"];
  for (const r of [...rows].sort((a, b) => b.impressions - a.impressions)) {
    lines.push(`| ${new URL(r.key).pathname} | ${r.impressions} | ${r.clicks} | ${pct(r.clicks, r.impressions)} | ${r.position.toFixed(1)} |`);
  }
  return lines.join("\n");
}

function main(argv) {
  const args = [...argv];
  const b = args.indexOf("--baseline");
  const baselineArg = b === -1 ? null : args.splice(b, 2)[1];
  const [currentArg] = args;
  if (!currentArg) {
    console.error("usage: node scripts/gsc-groups.mjs <export-folder> [--baseline <export-folder>]");
    process.exit(2);
  }

  const out = [];
  const queryOrder = QUERY_GROUPS.map((g) => g.name);
  const queries = locate(currentArg, "Queries.csv");
  if (queries) {
    const rows = readExport(queries);
    const baseQueries = baselineArg && locate(baselineArg, "Queries.csv");
    const base = baseQueries ? summarize(readExport(baseQueries), queryGroup, queryOrder) : null;
    out.push(groupTable("Query groups", "Queries", summarize(rows, queryGroup, queryOrder), base));

    const watched = WATCHED_QUERIES.map((w) => {
      const hit = rows.find((r) => r.key.toLowerCase().trim() === w);
      return hit
        ? `| ${w} | ${hit.impressions} | ${hit.clicks} | ${hit.position.toFixed(1)} |`
        : `| ${w} | not in the export | – | – |`;
    });
    out.push(
      ["### Watched queries", "", "Find each one's landing page with a Query filter on the Pages tab.", "", "| Query | Impressions | Clicks | Position |", "|---|---:|---:|---:|", ...watched].join("\n"),
    );
  }

  const pages = locate(currentArg, "Pages.csv");
  if (pages) {
    const rows = readExport(pages);
    const pageOrder = ["Guides", "Posts", "Core pages"];
    const basePages = baselineArg && locate(baselineArg, "Pages.csv");
    const base = basePages ? summarize(readExport(basePages), pageGroup, pageOrder) : null;
    out.push(groupTable("Page groups", "Pages", summarize(rows, pageGroup, pageOrder), base));
    out.push(rowTable("Guides", rows.filter((r) => pageGroup(r.key) === "Guides")));
    out.push(rowTable("Posts", rows.filter((r) => pageGroup(r.key) === "Posts")));
  }

  if (!out.length) {
    console.error(`${currentArg}: no Queries.csv or Pages.csv found`);
    process.exit(2);
  }
  console.log(out.join("\n\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));
