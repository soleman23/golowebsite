#!/usr/bin/env node
/**
 * Rules Center source-check tests (#245). `npm run test:rules-sources`;
 * `npm test` includes it.
 *
 * Hermetic: synthetic pages only, no network. Proves the failure path of
 * scripts/check-rules-sources.mjs end to end (the committed broken fixture
 * fails with exactly the expected lines and exit 1), that the same pages
 * with the faults fixed pass, and the parsing each check relies on.
 *
 * Exit 1 with one line per failed case.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  RULES_DEFINITIONS_URL,
  officialRules,
  ruleUrl,
} from "../lib/content/rules/official.ts";
import {
  COPY_RUN,
  checkSources,
  copyWords,
  dataText,
  decodeEntities,
  hashedUrls,
  indexTitles,
  officialRuns,
  pageSubrules,
  pageText,
  sha256,
  sharedRuns,
  urlsToFetch,
  visibleText,
} from "./rules-sources.mjs";

const failures = [];
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const R = "https://www.randa.org/en/rog/the-rules-of-golf";
const DEF = "https://www.randa.org/en/rog/definitions";
const MLR = "https://www.randa.org/en/rog/committee-procedures/sections/8";
const FIXTURE = "scripts/fixtures/rules-sources-broken.json";
const fixture = JSON.parse(readFileSync(new URL(`../${FIXTURE}`, import.meta.url), "utf8"));

const inputFrom = (f) => ({
  indexUrl: R,
  definitionsUrl: DEF,
  localRulesUrl: MLR,
  ruleUrl: (n) => `${R}/rule-${n}`,
  rules: f.rules,
  records: f.records,
  hashes: f.hashes,
});
/** As the CLI's fixture fetcher: a page the fixture lacks answers 404. */
const pagesFrom = (f) =>
  new Map(urlsToFetch(inputFrom(f)).map((url) => [url, f.pages[url] ?? { status: 404, html: "" }]));

/* ------------------------------------------------------- the broken fixture */

const EXPECTED = [
  "https://www.randa.org/en/rog/clarifications: HTTP 404",
  'Rule 19: title is now "Unplayable Balls" (official.ts has "Unplayable Ball")',
  'Rule 26: new on the index ("Fixture Rule Added After the Snapshot")',
  "Rule 18: anchor 18_2b gone from https://www.randa.org/en/rog/the-rules-of-golf/rule-18",
  "Rule 18: new anchor 18_3 on https://www.randa.org/en/rog/the-rules-of-golf/rule-18, not in official.ts",
  "https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2b: not on the page (cited by fixture-situation)",
  'Definitions: "Casual Water" not found (cited by fixture-situation)',
  'Model Local Rules: "E-3" not found (cited by fixture-situation)',
  "https://www.randa.org/en/rog/the-rules-of-golf/rule-19: text changed since the accepted hash",
  "https://www.randa.org/en/rog/the-rules-of-golf/rule-20: accepted hash for a page no longer checked (run with --update)",
];

{
  const run = spawnSync(
    process.execPath,
    ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/check-rules-sources.mjs", "--fixture", FIXTURE],
    { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" },
  );
  const lines = run.stdout.split("\n").filter(Boolean);
  check("cli: the broken fixture exits 1", run.status === 1, `exit ${run.status}; ${run.stderr.trim()}`);
  check("cli: one line per fault, nothing else on stdout", same(lines, EXPECTED), `\n    got:\n      ${lines.join("\n      ")}`);
  check("cli: a summary on stderr", /10 problem\(s\)/.test(run.stderr), run.stderr.trim());

  const refused = spawnSync(process.execPath, ["scripts/check-rules-sources.mjs", "--update", "--fixture", FIXTURE], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    encoding: "utf8",
  });
  check("cli: --update refuses a fixture", refused.status === 2);
}

{
  const { problems } = checkSources(inputFrom(fixture), pagesFrom(fixture));
  check("check: the same faults without the CLI", same(problems, EXPECTED), problems.join(" | "));
}

/* --------------------------------------------- the same pages, faults fixed */

{
  const fixed = structuredClone(fixture);
  fixed.rules[18].subrules = ["1", "2", "2a", "3"];
  fixed.rules[19].title = "Unplayable Balls";
  fixed.rules[26] = { title: "Fixture Rule Added After the Snapshot", subrules: [] };
  fixed.pages[`${R}/rule-26`] = { status: 200, html: "<main>Fixture</main>" };
  fixed.pages["https://www.randa.org/en/rog/clarifications"] = { status: 200, html: "<main>Fixture</main>" };
  fixed.records[0].sources = fixed.records[0].sources.filter(
    (s) => s.anchor !== "18_2b" && s.ruleRef !== "Definitions: Casual Water" && s.ruleRef !== "MLR E-3",
  );
  const input = inputFrom(fixed);
  const pages = pagesFrom(fixed);
  const { hashes } = checkSources(input, pages);
  const { problems } = checkSources({ ...input, hashes }, pages);
  check("check: the fixed fixture passes", problems.length === 0, problems.join(" | "));
  check("check: a USGA source isn't fetched", !problems.some((p) => p.includes("usga.org")));
  check("check: hashes cover the rule pages and the Definitions", same(Object.keys(hashes).sort(), [...hashedUrls(input)].sort()));

  const down = new Map(pages);
  down.set(`${R}/rule-18`, { error: "fetch failed (ECONNRESET)" });
  const { problems: downProblems, hashes: downHashes } = checkSources({ ...input, hashes }, down);
  check("check: a page that didn't load is one line", same(downProblems, [`${R}/rule-18: fetch failed (ECONNRESET)`]), downProblems.join(" | "));
  check("check: and gets no hash, so --update refuses", !(`${R}/rule-18` in downHashes));

  const moved = new Map(pages);
  moved.set(`${R}/rule-19`, { status: 301, html: "" });
  check("check: a redirect is a problem", checkSources({ ...input, hashes }, moved).problems.includes(`${R}/rule-19: HTTP 301`));

  const noTitles = new Map(pages);
  noTitles.set(R, { status: 200, html: "<main>Redesigned</main>" });
  check(
    "check: an index with no title links says the markup changed",
    checkSources({ ...input, hashes }, noTitles).problems.includes(`${R}: no rule titles found (the page's markup has changed)`),
  );

  const onlyE50 = new Map(pages);
  onlyE50.set(MLR, { status: 200, html: '<main>Model Local Rule E-50, and E-5a is not it either</main>' });
  check(
    "check: E-50 doesn't count as E-5",
    checkSources({ ...input, hashes }, onlyE50).problems.some((p) => p.startsWith('Model Local Rules: "E-5" not found')),
  );
}

/* --------------------------------------------------------------- parsing */

{
  check("parse: entities", decodeEntities("The Player&#x27;s &amp; &rsquo;&#8217;&nbsp;") === "The Player's & ’’ ");
  check("parse: an unknown entity stays", decodeEntities("&bogus;") === "&bogus;");

  const html =
    '<html><head><title>T</title></head><body><header>Menu</header><main><h1>Rule  9</h1><svg><text>icon</text></svg>' +
    '<p>Ball&nbsp;<span role="button">moved</span>.</p><script>var x = 1;</script><style>p{}</style><!-- note --></main>' +
    "<footer>Footer</footer></body></html>";
  check("parse: visible text drops head, header, footer, scripts, styles, icons and comments", visibleText(html) === "Rule 9 Ball moved .", visibleText(html));

  const data = (pageProps, extra = {}) =>
    `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps, siteSetupData: extra } })}</script>`;
  const withData = `<main>Shown</main>${data({ a: ["<span>Rich one</span>", "plain id"], b: { c: "<p>Rich two</p>", d: "<p>Rich one</p>" } }, { nav: "<a>Menu</a>" })}`;
  check("parse: data text is pageProps' rich text, once each", dataText(withData) === "Rich one Rich two", dataText(withData));
  check("parse: page text is both", pageText(withData) === "Shown Rich one Rich two", pageText(withData));
  check("parse: no data, no data text", dataText("<main>x</main>") === "" && dataText('<script id="__NEXT_DATA__">{oops</script>') === "");
  check("parse: the hash is of the text", sha256(pageText(withData)) === sha256("Shown Rich one Rich two"));

  const ids = pageSubrules('<div id="9_1"></div><div id="9_2b"></div><div id="19_1"></div><a href="#9_3">x</a><div data-id="9_4"></div>', 9);
  check("parse: anchors are this rule's ids only", same([...ids], ["1", "2b"]), [...ids].join(" "));

  const titles = indexTitles(
    '<header><a href="/rog/the-rules-of-golf/rule-1">Menu</a></header>' +
      '<a href="/rog/the-rules-of-golf/rule-4">The Player’s Equipment<div>›</div></a><a href="/rog/the-rules-of-golf/rule-4">Read more</a>' +
      '<a class="x" href="https://www.randa.org/en/rog/the-rules-of-golf/rule-22">Foursomes (Also Known as Alternate Shot)</a>',
  );
  check("parse: index titles, not the header or Read more", same([...titles], [[4, "The Player’s Equipment"], [22, "Foursomes (Also Known as Alternate Shot)"]]), JSON.stringify([...titles]));
}

/* --------------------------------------------------------- copy distance */

{
  check("copy: eight words is the limit", COPY_RUN === 8);
  check(
    "copy: words ignore case, accents, apostrophes and punctuation",
    same(copyWords("Don’t  DROP—the Ball, José's 18.2b"), ["dont", "drop", "the", "ball", "joses", "18", "2b"]),
    copyWords("Don’t  DROP—the Ball, José's 18.2b").join(" "),
  );
  const runs = officialRuns([
    { name: "rule-1", text: "alpha bravo charlie delta echo foxtrot golf hotel india juliet" },
    { name: "rule-2", text: "kilo lima mike november oscar papa quebec romeo" },
  ]);
  const shared = (copy) => sharedRuns(copy, runs).map((r) => `${r.length} ${r.page}: ${r.text}`);
  check("copy: seven shared words pass", same(shared("Alpha bravo charlie delta echo foxtrot golf, then something else."), []));
  check(
    "copy: eight shared words fail, whatever the punctuation",
    same(shared("So: Alpha, bravo — charlie delta echo-foxtrot golf HOTEL!"), ["8 rule-1: alpha bravo charlie delta echo foxtrot golf hotel"]),
  );
  check(
    "copy: a longer run is one line",
    same(shared("alpha bravo charlie delta echo foxtrot golf hotel india juliet"), ["10 rule-1: alpha bravo charlie delta echo foxtrot golf hotel india juliet"]),
  );
  check(
    "copy: two runs that only touch stay two",
    same(shared("alpha bravo charlie delta echo foxtrot golf hotel kilo lima mike november oscar papa quebec romeo"), [
      "8 rule-1: alpha bravo charlie delta echo foxtrot golf hotel",
      "8 rule-2: kilo lima mike november oscar papa quebec romeo",
    ]),
  );
  check("copy: empty copy passes", same(shared(""), []));
}

/* ------------------------------------------- the committed hashes file */

{
  const accepted = JSON.parse(readFileSync(new URL("../lib/content/rules/source-hashes.json", import.meta.url), "utf8"));
  const urls = [...Object.keys(officialRules).map((n) => ruleUrl(Number(n))), RULES_DEFINITIONS_URL];
  check("hashes: one per rule in official.ts and the Definitions", same(Object.keys(accepted.pages).sort(), urls.sort()));
  check("hashes: each a sha256", Object.values(accepted.pages).every((h) => /^[0-9a-f]{64}$/.test(h)));
  check("hashes: an accepted date", /^\d{4}-\d{2}-\d{2}$/.test(accepted.acceptedOn ?? ""));
}

/* ----------------------------------------------------------------- result */

if (failures.length) {
  console.error("Rules source-check tests failed:\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`✔ Rules sources: ${passed} cases passed (broken fixture, fixed fixture, parsing, copy distance, hashes file).`);
