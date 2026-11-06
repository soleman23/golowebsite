#!/usr/bin/env node
/**
 * Rules Center source monitor (#245). `npm run check:rules-sources`; the
 * monthly .github/workflows/rules-sources.yml runs it and opens an issue on
 * any problem. Not in CI: it needs the network, and the R&A editing a page
 * must not block a PR.
 *
 * Fetches the R&A rules index, the 25 rule pages, the Definitions, the Model
 * Local Rules and every R&A URL a record cites, then checks
 * (scripts/rules-sources.mjs):
 *
 * - every page answers 200;
 * - each title in official.ts matches the index, and the index has no new rule;
 * - every subrule anchor in official.ts is an `id="N_xy"` on its page, and
 *   the page has none that official.ts lacks;
 * - every cited anchor is on the page it names;
 * - every cited Definition's term is on the Definitions page;
 * - every cited Model Local Rule code is in the Model Local Rules page data;
 * - the text of each rule, the Definitions and each cited Model Local Rule
 *   hashes to what lib/content/rules/source-hashes.json accepted. Each hash
 *   covers that item's own text, read from the page data (Interpretations
 *   included), not the neighbouring rules or menus the page also carries.
 *
 * One line per problem on stdout and exit 1, or a summary and exit 0.
 *
 *   --update          write the live hashes to source-hashes.json, after
 *                     someone has read what changed (docs/rules/maintenance.md).
 *                     Refused while any other problem stands, so a broken or
 *                     placeholder page can't be accepted as the new text.
 *   --fixture <file>  use a fixture's pages and expectations instead of the
 *                     network and lib/content/rules. The committed one,
 *                     scripts/fixtures/rules-sources-broken.json, must fail.
 *
 * The USGA's pages answer scripts with 403, so they stay a manual check.
 */

import "./register-ts.mjs";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { checkSources, fetchPages, updateRefusal, urlsToFetch } from "./rules-sources.mjs";

const rootUrl = new URL("..", import.meta.url);
const HASHES_FILE = fileURLToPath(new URL("lib/content/rules/source-hashes.json", rootUrl));

const args = process.argv.slice(2);
const update = args.includes("--update");
const fixtureAt = args.indexOf("--fixture");
const fixturePath = fixtureAt === -1 ? null : args[fixtureAt + 1];
if (fixtureAt !== -1 && !fixturePath) {
  console.error("--fixture needs a file");
  process.exit(2);
}
if (update && fixturePath) {
  console.error("--update writes the real hashes; it can't run with --fixture");
  process.exit(2);
}

const rules = await import(new URL("lib/content/rules/index.ts", rootUrl).href);
const fixture = fixturePath ? JSON.parse(readFileSync(fixturePath, "utf8")) : null;
const accepted = existsSync(HASHES_FILE)
  ? JSON.parse(readFileSync(HASHES_FILE, "utf8"))
  : { acceptedOn: null, pages: {} };

const input = {
  indexUrl: rules.RULES_INDEX_URL,
  definitionsUrl: rules.RULES_DEFINITIONS_URL,
  localRulesUrl: rules.MODEL_LOCAL_RULES_URL,
  ruleUrl: rules.ruleUrl,
  rules: fixture?.rules ?? rules.officialRules,
  records: fixture?.records ?? [...rules.ruleOverviews, ...rules.rulesScenarios],
  hashes: fixture?.hashes ?? accepted.pages,
};

/* ----------------------------------------------------------------- fetch */

async function fetchAll(urls) {
  if (fixture) {
    const pages = fixture.pages ?? {};
    return new Map(urls.map((url) => [url, pages[url] ?? { status: 404, html: "" }]));
  }
  return fetchPages(urls);
}

/* ----------------------------------------------------------------- check */

const pages = await fetchAll(urlsToFetch(input));
const result = checkSources(input, pages);
let { problems } = result;
const { hashes } = result;

if (update) {
  const refusal = updateRefusal(input, result);
  if (refusal) {
    for (const p of problems) console.log(p);
    console.error(`\nNot updated: ${refusal}`);
    process.exit(1);
  }
  const acceptedOn = new Date().toISOString().slice(0, 10);
  writeFileSync(
    HASHES_FILE,
    `${JSON.stringify({ ...accepted, acceptedOn, pages: hashes }, null, 2)}\n`,
  );
  accepted.acceptedOn = acceptedOn;
  console.error(`Wrote ${Object.keys(hashes).length} hashes to lib/content/rules/source-hashes.json (accepted ${acceptedOn}).`);
  ({ problems } = checkSources({ ...input, hashes }, pages));
}

if (problems.length) {
  for (const p of problems) console.log(p);
  console.error(`\n${problems.length} problem(s). What to do: docs/rules/maintenance.md § When the source check fails.`);
  process.exit(1);
}

const anchors = Object.values(input.rules).reduce((n, rule) => n + rule.subrules.length, 0);
console.log(
  `✔ Rules sources: ${pages.size} R&A pages answer, ${Object.keys(input.rules).length} titles and ${anchors} anchors match, cited definitions and Model Local Rules found, ${Object.keys(hashes).length} texts (rules, Definitions, cited Model Local Rules) match the hashes accepted ${accepted.acceptedOn ?? "today"}`,
);
