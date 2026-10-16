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
 *   node scripts/gsc-groups.mjs <export-folder> --sitemap <sitemap.xml file or URL>
 *
 * Prints Markdown tables to paste into docs/seo-progress.md or a report. It
 * changes nothing. The export leaves out pages with no impressions, so the
 * guide and post tables are built from the sitemap (the live one by default;
 * for a past period, pass a snapshot saved on its last day)
 * and list every guide and post, "not in the export" included.
 *
 * Caveats the tables can't show, so say them in the write-up:
 * - Search Console leaves anonymized queries out of the query table, so query
 *   groups add up to less than the property's totals. Quote the totals from
 *   the Performance chart, not from this sum.
 * - A group's position is the impression-weighted mean of its queries'
 *   average positions: a summary, not a number Search Console reports.
 * - The UI export stops at 1,000 rows. A file that hits the cap is missing
 *   rows beyond the anonymized ones, and the script says so. Past that size,
 *   pull the full table from the Search Console API or bulk export.
 */

/** Search Console's UI export limit, in rows. */
const EXPORT_ROW_CAP = 1000;

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Query groups, first match wins, so order matters: "nassau press" is Nassau,
 * not Other games. Every query lands in exactly one group.
 */
/**
 * Words that mark another GOLO, even with golf or app context: "golo golf
 * putter" is the putter brand, and "golo app diet" is the diet company.
 */
const OFF_TOPIC_TERMS =
  /\b(diet\w*|weight|loss|supplements?|meal|pills?|recipes?|metabolic|putters?|dice|board)\b/;

export const QUERY_GROUPS = [
  {
    // GOLO is also a diet company ("golo weight loss", "golo release"),
    // putters and a dice game, and their wording is open-ended. So a GOLO
    // query is branded only with golf or app context, or on its own; every
    // other GOLO query is off-topic. "golo board" showed in the October 8
    // baseline; it's watched below, not branded.
    name: "Branded",
    test: (q) =>
      /\bgo ?lo\b/.test(q) &&
      !OFF_TOPIC_TERMS.test(q) &&
      (/^(the )?go ?lo$/.test(q) ||
        /\b(golf\w*|app|apps|scor\w*|side games?|bets?|betting|wagers?|nassau|skins)\b/.test(q)),
  },
  { name: "Off-topic GOLO", test: (q) => /\bgo ?lo\b/.test(q) },
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
  if (rows.length >= EXPORT_ROW_CAP) {
    console.error(
      `warning: ${path} has ${rows.length} rows, Search Console's export cap. Rows past the cap are missing, so group totals are low. Use the API or bulk export.`,
    );
  }
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

const pathOf = (url) => new URL(url).pathname.replace(/\/$/, "") || "/";

/**
 * One row per roster page, exported metrics merged in. A roster page missing
 * from the export had no impressions in the window, which is itself a finding.
 */
function rowTable(title, rows, roster) {
  // A domain property can export one path under several URLs (www and apex,
  // http and https, a trailing slash). Sum them so no row's traffic is lost.
  const byPath = new Map();
  for (const r of rows) {
    const path = pathOf(r.key);
    const seen = byPath.get(path) ?? { clicks: 0, impressions: 0, weighted: 0 };
    seen.clicks += r.clicks;
    seen.impressions += r.impressions;
    seen.weighted += r.position * r.impressions;
    byPath.set(path, seen);
  }
  const paths = [...new Set([...roster.map(pathOf), ...byPath.keys()])];
  const lines = [`### ${title}`, "", "| Page | Impressions | Clicks | CTR | Position |", "|---|---:|---:|---:|---:|"];
  const ranked = paths.sort((a, b) => (byPath.get(b)?.impressions ?? -1) - (byPath.get(a)?.impressions ?? -1));
  for (const path of ranked) {
    const r = byPath.get(path);
    lines.push(
      r
        ? `| ${path} | ${r.impressions} | ${r.clicks} | ${pct(r.clicks, r.impressions)} | ${pos(r)} |`
        : `| ${path} | not in the export | – | – | – |`,
    );
  }
  return lines.join("\n");
}

/** Page URLs from a sitemap file or URL; empty (with a warning) if unreadable. */
async function readSitemap(source) {
  try {
    let xml;
    if (/^https?:\/\//.test(source)) {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      xml = await response.text();
    } else {
      xml = readFileSync(source, "utf8");
    }
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (!urls.length) throw new Error("no <loc> entries");
    return urls;
  } catch (error) {
    console.error(`warning: couldn't read the sitemap (${error.message}); guide and post tables show exported pages only`);
    return [];
  }
}

async function main(argv) {
  const args = [...argv];
  const b = args.indexOf("--baseline");
  const baselineArg = b === -1 ? null : args.splice(b, 2)[1];
  const s = args.indexOf("--sitemap");
  const sitemapArg = s === -1 ? "https://www.golo.golf/sitemap.xml" : args.splice(s, 2)[1];
  if (s === -1) {
    console.error(
      "note: listing guides and posts from the live sitemap. For a past period, pass --sitemap with a snapshot from the period's last day.",
    );
  }
  const [currentArg] = args;
  if (!currentArg) {
    console.error("usage: node scripts/gsc-groups.mjs <export-folder> [--baseline <export-folder>] [--sitemap <file-or-url>]");
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
    out.push(groupTable("Page groups", "URLs", summarize(rows, pageGroup, pageOrder), base));
    const roster = await readSitemap(sitemapArg);
    for (const group of ["Guides", "Posts"]) {
      out.push(
        rowTable(
          group,
          rows.filter((r) => pageGroup(r.key) === group),
          roster.filter((url) => pageGroup(url) === group),
        ),
      );
    }
  }

  if (!out.length) {
    console.error(`${currentArg}: no Queries.csv or Pages.csv found`);
    process.exit(2);
  }
  console.log(out.join("\n\n"));
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
