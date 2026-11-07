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

import "./register-ts.mjs";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  COPY_RUN,
  checkSources,
  copyWords,
  decodeEntities,
  definitions,
  hashText,
  hashedKeys,
  indexTitles,
  localRuleText,
  officialRuns,
  pageSubrules,
  ruleText,
  sharedRuns,
  updateRefusal,
  urlsToFetch,
  visibleText,
} from "./rules-sources.mjs";

const rules = await import(new URL("../lib/content/rules/index.ts", import.meta.url).href);

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
  "https://www.randa.org/en/rog/the-rules-of-golf/rule-20: has an accepted hash but isn't checked any more (run with --update)",
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
  const result = checkSources(inputFrom(fixture), pagesFrom(fixture));
  check("check: the same faults without the CLI", same(result.problems, EXPECTED), result.problems.join(" | "));
  check("check: --update refuses while anything but text has changed", updateRefusal(inputFrom(fixture), result) !== null);
}

/* --------------------------------------------- the same pages, faults fixed */

{
  const fixed = structuredClone(fixture);
  fixed.rules[18].subrules = ["1", "2", "2a", "3"];
  fixed.rules[19].title = "Unplayable Balls";
  fixed.rules[26] = { title: "Fixture Rule Added After the Snapshot", subrules: [] };
  fixed.pages[`${R}/rule-26`] = { status: 200, html: fixed.pages[`${R}/rule-19`].html };
  fixed.pages["https://www.randa.org/en/rog/clarifications"] = { status: 200, html: "<main>Fixture</main>" };
  fixed.records[0].sources = fixed.records[0].sources.filter(
    (s) => s.anchor !== "18_2b" && s.ruleRef !== "Definitions: Casual Water" && s.ruleRef !== "MLR E-3",
  );
  const input = inputFrom(fixed);
  const pages = pagesFrom(fixed);
  const first = checkSources(input, pages);
  check("check: --update accepts text changes alone", updateRefusal(input, first) === null, updateRefusal(input, first));
  const { hashes } = first;
  const { problems } = checkSources({ ...input, hashes }, pages);
  check("check: the fixed fixture passes", problems.length === 0, problems.join(" | "));
  check("check: a USGA source isn't fetched", !problems.some((p) => p.includes("usga.org")));
  check(
    "check: hashes cover the rules, the Definitions and the cited Model Local Rule",
    same(Object.keys(hashes).sort(), [...hashedKeys(input)].sort()) && `${MLR}#E-5` in hashes,
  );

  const down = new Map(pages);
  down.set(`${R}/rule-18`, { error: "fetch failed (ECONNRESET)" });
  const { problems: downProblems, hashes: downHashes } = checkSources({ ...input, hashes }, down);
  check("check: a page that didn't load is one line", same(downProblems, [`${R}/rule-18: fetch failed (ECONNRESET)`]), downProblems.join(" | "));
  check("check: and gets no hash, so --update refuses", !(`${R}/rule-18` in downHashes) && updateRefusal(input, checkSources(input, down)) !== null);

  const noData = new Map(pages);
  noData.set(`${R}/rule-19`, { status: 200, html: '<div id="19_1"></div><div id="19_2"></div>' });
  check(
    "check: a rule page without its data says the markup changed",
    same(checkSources({ ...input, hashes }, noData).problems, [`${R}/rule-19: no rule text in the page data (the page's markup has changed)`]),
    checkSources({ ...input, hashes }, noData).problems.join(" | "),
  );

  const moved = new Map(pages);
  moved.set(`${R}/rule-19`, { status: 301, html: "" });
  check("check: a redirect is a problem", checkSources({ ...input, hashes }, moved).problems.includes(`${R}/rule-19: HTTP 301`));

  const noTitles = new Map(pages);
  noTitles.set(R, { status: 200, html: "<main>Redesigned</main>" });
  check(
    "check: an index with no title links says the markup changed",
    checkSources({ ...input, hashes }, noTitles).problems.includes(`${R}: no rule titles found (the page's markup has changed)`),
  );

  const textOnly = new Map(pages);
  textOnly.set(MLR, { status: 200, html: "<main>Model Local Rule E-5, mentioned but not an item</main>" });
  check(
    "check: E-5 in the page's text but not its data isn't found",
    checkSources({ ...input, hashes }, textOnly).problems.some((p) => p.startsWith('Model Local Rules: "E-5" not found')),
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

  const page = (pageProps) => `<main>Shown</main><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps } })}</script>`;
  const v = (value) => ({ isEmpty: false, value });
  const rule = (overrides = {}) => ({
    ruleOfGolf: {
      number: v("9"),
      title: v("Fixture"),
      subRules: [
        {
          number: v("9.1"),
          description: v("<span>Own &amp; text</span>"),
          sections: [{ interpretations: [{ number: v("9.1/1"), title: v("Plain title"), description: v("<p>Own</p>") }] }],
          ruleMenuData: { title: v("Menu") },
          url: { value: "rog/x" },
        },
      ],
      nextRule: { title: v("Neighbour") },
      previousRule: { title: v("Neighbour") },
      linkedItems: [{ diagrams: [{ description: v("Shared caption") }] }],
      system: { lastModified: "today" },
      ...overrides,
    },
    rulesSummary: { rulesOfGolf: [{ description: v("Every rule's purpose") }] },
  });
  check(
    "parse: a rule's own text, Interpretation titles included, one item each",
    same(ruleText(page(rule())), ["9", "Fixture", "9.1", "Own & text", "9.1/1", "Plain title", "Own"]),
    JSON.stringify(ruleText(page(rule()))),
  );
  const base = hashText(ruleText(page(rule())));
  const elsewhere = rule({ nextRule: { title: v("Edited") }, linkedItems: [], system: { lastModified: "tomorrow" } });
  elsewhere.rulesSummary = {};
  check("parse: neighbours, menus, diagrams, metadata and the rules list don't move the hash", hashText(ruleText(page(elsewhere))) === base);
  const retitled = rule();
  retitled.ruleOfGolf.subRules[0].sections[0].interpretations[0].title = v("New title");
  check("parse: a retitled Interpretation moves the hash", hashText(ruleText(page(retitled))) !== base);
  check("parse: no data, no rule text", ruleText("<main>x</main>") === null && ruleText('<script id="__NEXT_DATA__">{oops</script>') === null);

  const defs = definitions(
    page({
      rulesSummary: {
        definitions: {
          A: [{ term: v("Advice"), definitionText: v("<span>One.</span>"), system: { name: "x" } }],
          R: [{ term: v("Relief Area"), definitionText: v("<span>Two.</span>") }],
        },
      },
    }),
  );
  check("parse: definitions by term", same([...defs], [["Advice", ["Advice", "One."]], ["Relief Area", ["Relief Area", "Two."]]]), JSON.stringify([...defs]));
  check("parse: no definitions data, no terms", definitions(page({})).size === 0);

  const mlr = page({
    ruleOfGolf: {
      sections: [{ subSections: [{ number: v("E-50"), title: v("Fifty"), description: v("x") }, { number: v("E-5"), title: v("Five"), description: v("<p>y</p>") }] }],
      nextRule: { sections: [{ subSections: [{ number: v("F-1"), title: v("Next"), description: v("z") }] }] },
    },
  });
  check("parse: a Model Local Rule by its number", same(localRuleText(mlr, "E-5"), ["E-5", "Five", "y"]), JSON.stringify(localRuleText(mlr, "E-5")));
  check("parse: E-5 isn't E-50, and the next page's items aren't this one's", localRuleText(mlr, "E-3") === null && localRuleText(mlr, "F-1") === null);

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
  // Model Local Rule keys follow the records' citations; a new one shows up
  // in the live check as "no accepted hash", so it isn't pinned here.
  const pages = [...Object.keys(rules.officialRules).map((n) => rules.ruleUrl(Number(n))), rules.RULES_DEFINITIONS_URL];
  check(
    "hashes: one for every rule in official.ts and the Definitions",
    pages.every((url) => url in accepted.pages),
    "run npm run check:rules-sources -- --update after reading the pages",
  );
  check(
    "hashes: nothing else but cited Model Local Rules",
    Object.keys(accepted.pages).every((key) => pages.includes(key) || key.startsWith(`${rules.MODEL_LOCAL_RULES_URL}#`)),
  );
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
