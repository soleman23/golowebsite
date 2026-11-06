#!/usr/bin/env node
/**
 * Copy distance for the Rules Center (#245): flags any run of eight or more
 * consecutive words a record shares with the official text. A review-time
 * tool for the `product` stage (docs/rules/editorial-review.md), not CI: it
 * needs the official text, which stays in a git-ignored cache on this
 * machine and is never committed.
 *
 *   npm run check:rules-copy                    fetch the cache if it's missing
 *   npm run check:rules-copy -- --refresh       fetch it again, keeping the old copy
 *   npm run check:rules-copy -- --text "<copy>" check a sentence before it's in a record
 *
 * The cache (.cache/rules-official/) holds the own text of the 25 rules, the
 * Definitions, the Model Local Rules and any other R&A page a record cites,
 * one item per line, Interpretations included (scripts/rules-sources.mjs).
 * manifest.json gives each file's sha256, the same hash source-hashes.json
 * accepts for a rule or the Definitions. --refresh moves the old copy to
 * previous/, so a reported text change can be diffed
 * (docs/rules/maintenance.md § When the source check fails).
 *
 * Every copy field of every record is checked, whatever its status: ids,
 * sources, dates and the review log aren't copy. Words are compared
 * lowercased, without accents, apostrophes or punctuation.
 *
 * One line per shared run, naming the record, the field and the page, and
 * exit 1 if any.
 */

import "./register-ts.mjs";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  COPY_RUN,
  definitions,
  fetchPages,
  hashText,
  officialRuns,
  ruleText,
  sharedRuns,
  visibleText,
} from "./rules-sources.mjs";

const CACHE_DIR = fileURLToPath(new URL("../.cache/rules-official/", import.meta.url));
const MANIFEST = `${CACHE_DIR}manifest.json`;
const PREVIOUS_DIR = `${CACHE_DIR}previous/`;
/** Fields that aren't copy. */
const NOT_COPY = new Set([
  "id", "slug", "number", "primaryRule", "sources", "status", "edition",
  "reviewedBy", "reviewLog", "reviewedOn", "publishedOn", "updatedOn",
  "relatedGlossaryIds", "relatedContentPaths",
]);

const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const textAt = args.indexOf("--text");
if (textAt !== -1 && !args[textAt + 1]) {
  console.error("--text needs the copy to check");
  process.exit(2);
}

const rules = await import(new URL("../lib/content/rules/index.ts", import.meta.url).href);
const records = [
  ...rules.ruleOverviews.map((r) => ({ label: `rule ${r.id}`, record: r })),
  ...rules.rulesScenarios.map((r) => ({ label: `situation ${r.id}`, record: r })),
];

/* ----------------------------------------------------------------- cache */

/** "rule-18", "definitions", "committee-procedures-sections-8". */
const pageName = (url) =>
  url.replace(/^https:\/\/www\.randa\.org\/en\/rog\//, "").replace(/^the-rules-of-golf\//, "").replace(/\//g, "-");

function officialUrls() {
  const urls = [
    ...rules.RULE_NUMBERS.map((n) => rules.ruleUrl(n)),
    rules.RULES_DEFINITIONS_URL,
    rules.MODEL_LOCAL_RULES_URL,
  ];
  for (const { record } of records) {
    for (const source of record.sources) if (source.authority === "RANDA") urls.push(source.url);
  }
  return [...new Set(urls)];
}

/** A page's own text, one item per line. */
function officialText(url, html) {
  if (url === rules.RULES_DEFINITIONS_URL) return [...definitions(html).values()].flat();
  return ruleText(html) ?? [visibleText(html)];
}

async function loadCache() {
  const urls = officialUrls();
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : null;
  const cached = manifest && urls.every((url) => manifest.pages[url]?.file);
  if (!refresh && cached) {
    const age = (Date.now() - Date.parse(manifest.fetchedOn)) / 86400000;
    if (age > 31) console.error(`Official text cached ${manifest.fetchedOn}; --refresh to fetch it again.`);
    return urls.map((url) => ({ url, name: pageName(url), text: readFileSync(`${CACHE_DIR}${manifest.pages[url].file}`, "utf8") }));
  }

  console.error(`Fetching ${urls.length} R&A pages into .cache/rules-official/ (git-ignored)…`);
  const pages = await fetchPages(urls);
  const failed = urls.filter((url) => pages.get(url)?.status !== 200);
  if (failed.length) {
    for (const url of failed) console.error(`  ${url}: ${pages.get(url)?.error ?? `HTTP ${pages.get(url)?.status}`}`);
    console.error("Cache not written; nothing checked.");
    process.exit(2);
  }
  if (manifest) {
    rmSync(PREVIOUS_DIR, { recursive: true, force: true });
    mkdirSync(PREVIOUS_DIR, { recursive: true });
    for (const { file } of Object.values(manifest.pages)) {
      if (existsSync(`${CACHE_DIR}${file}`)) renameSync(`${CACHE_DIR}${file}`, `${PREVIOUS_DIR}${file}`);
    }
    renameSync(MANIFEST, `${PREVIOUS_DIR}manifest.json`);
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  const files = {};
  const out = urls.map((url) => {
    const name = pageName(url);
    const lines = officialText(url, pages.get(url).html);
    files[url] = { file: `${name}.txt`, sha256: hashText(lines) };
    writeFileSync(`${CACHE_DIR}${name}.txt`, `${lines.join("\n")}\n`);
    return { url, name, text: lines.join("\n") };
  });
  writeFileSync(MANIFEST, `${JSON.stringify({ fetchedOn: new Date().toISOString().slice(0, 10), pages: files }, null, 2)}\n`);
  return out;
}

/** Each copy field of a record as [path, text]: "answer", "conditions[2]". */
function copyFields(record) {
  const out = [];
  for (const [key, value] of Object.entries(record)) {
    if (NOT_COPY.has(key)) continue;
    if (typeof value === "string" && value) out.push([key, value]);
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "string" && item) out.push([`${key}[${i}]`, item]);
      });
    }
  }
  return out;
}

/* ----------------------------------------------------------------- check */

const pages = await loadCache();
const runs = officialRuns(pages);
const targets = textAt === -1
  ? records.flatMap(({ label, record }) => copyFields(record).map(([field, text]) => ({ where: `${label} · ${field}`, text })))
  : [{ where: "--text", text: args[textAt + 1] }];

const problems = [];
for (const { where, text } of targets) {
  for (const run of sharedRuns(text, runs)) {
    problems.push(`${where}: ${run.length} words shared with ${run.page}: "${run.text}"`);
  }
}

if (problems.length) {
  for (const p of problems) console.log(p);
  console.error(`\n${problems.length} run(s) of ${COPY_RUN}+ words shared with the official text. Reword them (docs/rules/editorial-review.md § Writing standards).`);
  process.exit(1);
}

const fields = targets.filter((t) => t.text.trim()).length;
console.log(`✔ Rules copy: ${fields} field(s) of copy in ${textAt === -1 ? `${records.length} records` : "--text"}, no run of ${COPY_RUN}+ words shared with ${pages.length} official pages`);
