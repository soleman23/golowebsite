#!/usr/bin/env node
/**
 * Rules Center model checks (#233). `npm run test:rules` runs this, `npm test`
 * includes it, and CI runs it as its own step.
 *
 * Hermetic: the shipped records (forced to published where a case needs
 * content to search) and fixtures, run through the same pure functions the
 * hub, the content check and the client search use. No server, no network.
 *
 * - search: rule references, aliases, near misses, accents, empty and
 *   no-match queries, category filters (docs/rules/ux.md § Flows and states);
 * - the publication boundary: no planned, draft, in-review or archived record
 *   in any public selection, and no internal field in a public record;
 * - integrity: each malformed record fails with a line naming it;
 * - the edition cut-over and the stale-clarifications warning;
 * - the /rules link and fragment rules.
 *
 * Exit 1 with one line per failed case.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("..", import.meta.url);

/** As scripts/test-glossary.mjs: map "@/" and extensionless imports to .ts. */
registerHooks({
  resolve(specifier, context, nextResolve) {
    const base = specifier.startsWith("@/")
      ? new URL(specifier.slice(2), rootUrl)
      : specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)
        ? new URL(specifier, context.parentURL)
        : null;
    if (base) {
      for (const ext of [".ts", "/index.ts"]) {
        const url = new URL(base.href + ext);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const rules = await import(new URL("../lib/content/rules/index.ts", import.meta.url).href);
const glossary = await import(new URL("../lib/content/glossary/index.ts", import.meta.url).href);
const { rulesHrefProblem } = await import("./rules-checks.mjs");

const {
  RULES_PAGE_IDS,
  definitionSource,
  handicapSource,
  localRuleSource,
  officialRules,
  parseRuleRef,
  prepareRulesSearch,
  publishedRules,
  rogSource,
  ruleOverviews,
  ruleRefUrl,
  rulesEdition,
  rulesLive,
  rulesMatchType,
  rulesRecordIds,
  rulesResultBucket,
  rulesRouteVisible,
  rulesScenarios,
  rulesSearchEntries,
  rulesSelection,
  rulesWarnings,
  searchRules,
  selectRules,
  validateRules,
} = rules;

const failures = [];
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* --------------------------------------------------------------- fixtures */

const TODAY = "2026-11-06";
const REVIEW_LOG = [
  { stage: "rules", by: "agent", on: "2026-11-01" },
  { stage: "product", by: "agent", on: "2026-11-01" },
  { stage: "seo", by: "agent", on: "2026-11-01" },
  { stage: "approval", by: "owner", on: "2026-11-02" },
];
const checked = (sources) => sources.map((s) => ({ ...s, checkedOn: "2026-11-01" }));

/** A shipped record, written and published, so search and selection have content. */
function publish(record) {
  const base = {
    ...record,
    sources: checked(record.sources),
    status: "published",
    reviewedBy: "owner",
    reviewLog: REVIEW_LOG,
    reviewedOn: "2026-11-02",
    publishedOn: "2026-11-03",
  };
  return "question" in record
    ? {
        ...base,
        answer: record.answer || `Answer for ${record.id}. A second sentence.`,
        conditions: record.conditions.length ? record.conditions : ["A condition."],
        localRuleCaveat: "Only where the Committee has adopted it.",
        handicapCaveat: "For posting, see the Rules of Handicapping.",
      }
    : {
        ...base,
        summary: record.summary || `What Rule ${record.number} covers. More detail.`,
        commonQuestions: record.commonQuestions.length ? record.commonQuestions : ["When?", "How?"],
      };
}

const allOverviews = ruleOverviews.map(publish);
const allScenarios = rulesScenarios.map(publish);
const fullHub = selectRules(allOverviews, allScenarios, "published");
const index = prepareRulesSearch(rulesSearchEntries(fullHub));
const top = (query, category) => searchRules(index, query, category).map((m) => m.entry.id);

const glossarySlugs = new Set(glossary.publishedGlossaryTerms().map((t) => t.slug));
const SERVED = new Set(["/glossary", "/games/nassau", "/blog/gimmes", "/faq"]);
const CTX = { servedPaths: SERVED, glossarySlugs, today: TODAY };

/* ----------------------------------------------------------------- search */

{
  check("search: '18' puts Rule 18 first", top("18")[0] === "rule-18", top("18").join(","));
  check(
    "search: '18' then the situations that cite Rule 18",
    ["lost-ball", "provisional-ball", "out-of-bounds"].every((id) => top("18").slice(1, 4).includes(id)),
    top("18").join(","),
  );
  check("search: 'rule 18' = '18'", same(top("rule 18"), top("18")));
  check("search: 'Rule 18.2b' puts Rule 18 first", top("Rule 18.2b")[0] === "rule-18", top("Rule 18.2b").join(","));
  check(
    "search: '18.2b' finds the situations citing 18.2b, not 18.3",
    top("18.2b").includes("lost-ball") && top("18.2b").includes("out-of-bounds") && !top("18.2b").includes("provisional-ball"),
    top("18.2b").join(","),
  );
  check("search: '18-2b' = '18.2b'", same(top("18-2b"), top("18.2b")));
  check("search: '18.2' covers 18.2a and 18.2b", top("18.2").includes("lost-ball"), top("18.2").join(","));
  check("search: '1' is Rule 1 and nothing else", same(top("1"), ["rule-1"]), top("1").join(","));
  for (const form of ["#18", "18?", "Rule 18.", "rules 18", "rule no 18", "rule18", "r18", "R 18"]) {
    check(`search: '${form}' reads as Rule 18`, same(top(form), top("18")), top(form).join(","));
  }
  check("search: 'Rule 18.2b.' = '18.2b'", same(top("Rule 18.2b."), top("18.2b")));
  check(
    "search: 'rules' isn't a near miss for every overview",
    top("rules").filter((id) => id.startsWith("rule-")).length <= 2,
    top("rules").join(","),
  );
  check("search: '26' isn't a rule and matches nothing", top("26").length === 0, top("26").join(","));
  check("search: 'OB' finds out of bounds first", top("OB")[0] === "out-of-bounds", top("OB").join(","));
  check(
    "search: 'OB' finds Rule 18, not Obstructions or Object",
    top("OB").includes("rule-18") && !top("OB").some((id) => ["rule-11", "rule-15", "rule-16", "cart-path"].includes(id)),
    top("OB").join(","),
  );
  check("search: 'all' doesn't match inside 'ball'", !top("all").includes("lost-ball") && !top("all").includes("rule-9"), top("all").join(","));
  check("search: 'white stakes' finds out of bounds", top("white stakes")[0] === "out-of-bounds", top("white stakes").join(","));
  check(
    "search: 'water hazard' finds the situation, then Rule 17",
    same(top("water hazard").slice(0, 2), ["red-vs-yellow-penalty-areas", "rule-17"]),
    top("water hazard").join(","),
  );
  check("search: 'casual water' finds temporary water first", top("casual water")[0] === "temporary-water", top("casual water").join(","));
  check("search: typo 'casul water' still finds it", top("casul water")[0] === "temporary-water", top("casul water").join(","));
  check(
    "search: typo 'bunkre' finds the bunker answers",
    top("bunkre").includes("bunker-sand") && top("bunkre").includes("rule-12"),
    top("bunkre").join(","),
  );
  check("search: typo match reports 'fuzzy'", rulesMatchType(searchRules(index, "bunkre")) === "fuzzy");
  check("search: accents fold ('Bunkér')", top("Bunkér").includes("rule-12"), top("Bunkér").join(","));
  check("search: apostrophes fold ('cant find my ball')", top("cant find my ball")[0] === "lost-ball", top("cant find my ball").join(","));
  check(
    "search: a question finds its answer ('can I touch the sand')",
    top("can I touch the sand")[0] === "bunker-sand",
    top("can I touch the sand").join(","),
  );
  check("search: empty input matches nothing", top("").length === 0 && top("  ").length === 0 && top("?!").length === 0);
  check("search: 'zzz' matches nothing", top("zzz").length === 0);
  check("search: a short typo isn't fuzzy-matched ('ib')", !top("ib").includes("out-of-bounds"), top("ib").join(","));
  check(
    "search: category filter",
    top("ball", "relief").every((id) => ["rule-17", "rule-18", "rule-19", "lost-ball", "provisional-ball", "out-of-bounds", "red-vs-yellow-penalty-areas", "unplayable-ball"].includes(id)) &&
      top("ball", "relief").length > 0,
    top("ball", "relief").join(","),
  );
  check(
    "search: situations sort before rules within a tier",
    (() => {
      const m = searchRules(index, "ball");
      return m.every((x, i) => i === 0 || m[i - 1].tier < x.tier || m[i - 1].entry.kind === "scenario" || x.entry.kind === "rule");
    })(),
  );
  check("search: match types", rulesMatchType(searchRules(index, "18")) === "exact" && rulesMatchType(searchRules(index, "OB")) === "alias" && rulesMatchType([]) === "none");
  check(
    "search: a reference is 'exact' even when its rule is filtered out",
    rulesMatchType(searchRules(index, "9", "relief")) === "exact" && searchRules(index, "9", "relief")[0]?.entry.id === "lost-ball",
    searchRules(index, "9", "relief").map((m) => m.entry.id).join(","),
  );
  check("search: buckets", same([0, 1, 2, 5, 6].map(rulesResultBucket), ["0", "1", "2-5", "2-5", "6+"]));
  const ENTRY_KEYS = ["aliases", "anchor", "category", "extra", "id", "kind", "rule", "ruleRefs", "snippet", "title"];
  check(
    "search: entries carry only the search fields",
    rulesSearchEntries(selectRules(allOverviews, allScenarios, "review")).every((e) => same(Object.keys(e).sort(), ENTRY_KEYS)),
  );
}

/* -------------------------------------------------------- official links */

{
  // The R&A index on November 6, 2026 (docs/rules/inventory.md). #245 compares it with the live pages.
  const TITLES = [
    "The Game, Player Conduct and the Rules",
    "The Course",
    "The Competition",
    "The Player’s Equipment",
    "Playing the Round",
    "Playing a Hole",
    "Ball Search: Finding and Identifying Ball",
    "Course Played as It Is Found",
    "Ball Played as It Lies; Ball at Rest Lifted or Moved",
    "Preparing for and Making a Stroke; Advice and Help; Caddies",
    "Ball in Motion Accidentally Hits Person, Animal or Object; Deliberate Actions to Affect Ball in Motion",
    "Bunkers",
    "Putting Greens",
    "Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place",
    "Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play)",
    "Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball",
    "Penalty Areas",
    "Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball",
    "Unplayable Ball",
    "Resolving Rules Issues During Round; Rulings by Referee and Committee",
    "Other Forms of Individual Stroke Play and Match Play",
    "Foursomes (Also Known as Alternate Shot)",
    "Four-Ball",
    "Team Competitions",
    "Modifications for Players with Disabilities",
  ];
  check("official: 25 rules", Object.keys(officialRules).length === 25);
  const wrongTitles = TITLES.map((title, i) => [i + 1, title]).filter(([n, title]) => officialRules[n]?.title !== title);
  check("official: every title is the R&A label", wrongTitles.length === 0, wrongTitles.map(([n]) => `Rule ${n}`).join(", "));
  const subrules = Object.entries(officialRules).map(([n, r]) => [Number(n), r.subrules]);
  check(
    "official: subrule anchors are the November 6 snapshot (336 anchors)",
    createHash("sha256").update(JSON.stringify(subrules)).digest("hex") === "5035d31c4554048f28955aada1451ceaefe789e3d5a1e9331f05853f396299ee",
  );
  check("official: parse '18.2b'", same(parseRuleRef("18.2b"), { rule: 18, subrule: "2b" }));
  check("official: '182' isn't 18.2", parseRuleRef("182") === null);
  check("official: link for 18.2b", ruleRefUrl("18.2b") === "https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2b");
  check("official: no link for 18.9", ruleRefUrl("18.9") === null);
  check("official: no link for Rule 26", ruleRefUrl("26") === null);
}

/* ------------------------------------------------- publication boundary */

{
  const statuses = ["planned", "draft", "in-review", "approved", "published", "archived"];
  const base = publish(rulesScenarios[0]);
  const variants = statuses.map((status) => ({ ...base, id: `s-${status}`, slug: `s-${status}`, question: `Q ${status}?`, status }));
  const rVariants = statuses.map((status, i) => ({ ...publish(ruleOverviews[i]), status }));
  const pub = selectRules(rVariants, variants, "published");
  const review = selectRules(rVariants, variants, "review");
  check("boundary: published shows only published", same(pub.scenarios.map((s) => s.id), ["s-published"]) && same(pub.overviews.map((r) => r.number), [5]));
  check(
    "boundary: review adds approved, marked unpublished",
    same(review.scenarios.map((s) => [s.id, Boolean(s.unpublished)]), [["s-approved", true], ["s-published", false]]),
  );
  const internal = ["status", "reviewedBy", "reviewLog", "sources", "edition", "checkedOn"];
  const leaks = [...review.overviews, ...review.scenarios].flatMap((r) =>
    internal.filter((k) => JSON.stringify(r).includes(`"${k}"`)).map((k) => `${r.id}.${k}`),
  );
  check("boundary: no internal field in a public record", leaks.length === 0, leaks.join(", "));
  check(
    "boundary: the shipped records are all planned, so nothing is public",
    publishedRules().overviews.length === 0 && publishedRules().scenarios.length === 0,
  );
  check(
    "boundary: an overview lists only shown situations",
    (() => {
      const hub = selectRules([publish(ruleOverviews[17])], [publish(rulesScenarios[0]), { ...publish(rulesScenarios[1]), status: "draft" }], "published");
      return same(hub.overviews[0].scenarioIds, ["lost-ball"]);
    })(),
  );
  check(
    "boundary: primary situations come before citing ones",
    (() => {
      const r16 = fullHub.overviews.find((r) => r.number === 16);
      return r16.scenarioIds.indexOf("cart-path") < r16.scenarioIds.indexOf("lost-ball");
    })(),
    fullHub.overviews.find((r) => r.number === 16).scenarioIds.join(","),
  );
  check("boundary: links carry the subrule anchor", fullHub.scenarios[0].links[0].href.endsWith("/rule-18#18_2a"));
  check("boundary: Model Local Rule links are flagged", fullHub.scenarios[0].links.some((l) => l.ruleRef === "MLR E-5" && l.localRule));
  check("boundary: titles come from the official list", fullHub.overviews[14].title.startsWith("Relief from Loose Impediments"));
  check("boundary: record ids for fragments", rulesRecordIds(fullHub).size === 37);
}

/* ------------------------------------------------------------ selection */

{
  const env = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  check("selection: production uses published", rulesSelection() === "published");
  check("selection: production route follows the flag", rulesRouteVisible() === rulesLive);
  process.env.NODE_ENV = "development";
  check("selection: next dev uses review", rulesSelection() === "review" && rulesRouteVisible());
  process.env.NODE_ENV = env;
  check("launch: the flag is off until #247", rulesLive === false);
}

/* -------------------------------------------------------------- integrity */

{
  const shipped = validateRules(ruleOverviews, rulesScenarios, CTX);
  check("integrity: the shipped records pass", shipped.length === 0, shipped.join(" | "));
  const published = validateRules(allOverviews, allScenarios, CTX);
  check("integrity: the shipped records pass once written and published", published.length === 0, published.join(" | "));

  /** Problems for one change to the published set, and whether one matches. */
  const fails = (name, { overviews = allOverviews, scenarios = allScenarios, ctx = CTX }, pattern) => {
    const problems = validateRules(overviews, scenarios, ctx);
    check(`integrity: ${name}`, problems.some((p) => pattern.test(p)), problems.join(" | ") || "no problems");
  };
  const withScenario = (i, fields) => allScenarios.map((s, j) => (j === i ? { ...s, ...fields } : s));
  const withOverview = (n, fields) => allOverviews.map((r) => (r.number === n ? { ...r, ...fields } : r));

  fails("a missing rule", { overviews: allOverviews.filter((r) => r.number !== 7) }, /^rule-7: no overview for Rule 7/);
  fails("a duplicate rule", { overviews: [...allOverviews, { ...allOverviews[2] }] }, /more than one overview for Rule 3/);
  fails("a rule outside 1–25", { overviews: [...allOverviews, { ...allOverviews[0], id: "rule-26", number: 26 }] }, /rule-26: rule number 26 isn't 1–25/);
  fails("an id that isn't rule-N", { overviews: withOverview(4, { id: "rule-four" }) }, /rule-four: id should be rule-4/);
  fails("an unknown subrule", { scenarios: withScenario(0, { sources: [...allScenarios[0].sources, { ...rogSource("18.9"), checkedOn: TODAY }] }) }, /lost-ball: source 18.9 isn't a rule or subrule/);
  fails("a wrong anchor", { scenarios: withScenario(1, { sources: [{ ...rogSource("18.3a"), anchor: "18-3a", checkedOn: TODAY }] }) }, /provisional-ball: source 18.3a anchor should be 18_3a/);
  fails("a fragment in the URL", { scenarios: withScenario(1, { sources: [{ ...rogSource("18.3a"), url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3a", checkedOn: TODAY }] }) }, /carries a fragment/);
  fails("a non-official host", { scenarios: withScenario(1, { sources: [...allScenarios[1].sources, { ...definitionSource("Lost"), url: "https://example.com/rules", checkedOn: TODAY }] }) }, /source Definitions: Lost should point to https:\/\/www\.randa\.org\/en\/rog\/definitions/);
  fails("no citation of the primary rule", { scenarios: withScenario(4, { sources: [{ ...rogSource("17.1d"), checkedOn: TODAY }] }) }, /unplayable-ball: cites no subrule of its primary Rule 19/);
  fails("a Model Local Rule without its caveat", { scenarios: withScenario(2, { localRuleCaveat: undefined }) }, /out-of-bounds: cites a Model Local Rule without a localRuleCaveat/);
  fails("handicapping without its caveat", { scenarios: withScenario(11, { handicapCaveat: "" }) }, /conceded-putt: cites the Rules of Handicapping without a handicapCaveat/);
  fails("handicapping cited from the R&A", { scenarios: withScenario(11, { sources: [{ ...rogSource("3.2b"), checkedOn: TODAY }, { ...handicapSource("3.3", "https://www.usga.org/x"), authority: "RANDA", checkedOn: TODAY }] }) }, /source RoH 3\.3 should point to a page under https:\/\/www\.usga\.org\/handicapping/);
  fails("an unpublished glossary term", { scenarios: withScenario(3, { relatedGlossaryIds: ["provisional-ball"] }) }, /red-vs-yellow-penalty-areas: related glossary term "provisional-ball" isn't published/);
  fails("an unserved related path", { overviews: withOverview(3, { relatedContentPaths: ["/blog/not-a-post"] }) }, /rule-3: related path \/blog\/not-a-post isn't a served page/);
  fails("a related path into the hub itself", { overviews: withOverview(3, { relatedContentPaths: ["/rules"] }) }, /link the record instead/);
  fails("a reserved fragment", { scenarios: withScenario(0, { slug: "official-sources" }) }, /fragment "official-sources" is a hub section id/);
  fails("a slug that looks like a rule", { scenarios: withScenario(0, { slug: "rule-30" }) }, /looks like a rule overview/);
  fails("a duplicate slug", { scenarios: withScenario(1, { slug: "lost-ball" }) }, /fragment "lost-ball" is already used by lost-ball/);
  fails("a duplicate question", { scenarios: withScenario(1, { question: "Lost ball: what happens next?" }) }, /question duplicates lost-ball/);
  fails("an alias on two unrelated records", { scenarios: withScenario(5, { aliases: ["OB"] }) }, /alias "ob" resolves to more than one record/);
  fails("an alias that is another record's question", { overviews: withOverview(9, { aliases: ["My ball moved after it stopped"] }) }, /is the title or question of ball-moved/);
  fails("an exclamation mark", { scenarios: withScenario(0, { answer: "Go back to the tee!" }) }, /lost-ball: answer has an exclamation mark/);
  fails("markup in copy", { overviews: withOverview(12, { summary: "Read <b>this</b>." }) }, /rule-12: summary contains markup/);
  fails("a written situation without conditions", { scenarios: withScenario(6, { conditions: [] }) }, /cart-path: published without "Before you decide" conditions/);
  fails("a written overview without a summary", { overviews: withOverview(8, { status: "draft", summary: "", reviewedOn: undefined, publishedOn: undefined }) }, /rule-8: draft without a summary/);
  fails("too many common questions", { overviews: withOverview(8, { commonQuestions: ["a?", "b?", "c?", "d?", "e?"] }) }, /rule-8: published needs two to four common questions/);
  fails("an overview without its own rule page", { overviews: withOverview(10, { sources: [{ ...rogSource("10.2"), checkedOn: TODAY }] }) }, /rule-10: needs Rule 10's own page as a source/);
  fails("an unchecked source on a published record", { overviews: withOverview(2, { sources: [rogSource("2")] }) }, /rule-2: published with unchecked sources: 2/);
  fails("a future check date", { overviews: withOverview(2, { sources: [{ ...rogSource("2"), checkedOn: "2027-01-01" }] }) }, /checkedOn is in the future/);
  fails("a missing review stage", { overviews: withOverview(2, { reviewLog: REVIEW_LOG.slice(1) }) }, /without a review log entry for rules/);
  fails("published before approval", { overviews: withOverview(2, { publishedOn: "2026-11-01" }) }, /publishedOn is before the first approval/);
  fails("publishedOn on a draft", { scenarios: withScenario(0, { status: "draft" }) }, /publishedOn set while the record is draft/);
  fails("the wrong edition", { overviews: withOverview(2, { edition: "2019" }) }, /rule-2: edition 2019 isn't the 2023 Rules of Golf/);
  fails("the 2028 cut-over", { ctx: { ...CTX, today: "2028-01-01" } }, /stopped being current on 2028-01-01/);
  fails("a citation not written canonically", { scenarios: withScenario(2, { sources: [{ ...rogSource("18-2B"), checkedOn: TODAY }, ...allScenarios[2].sources] }) }, /out-of-bounds: source 18-2B should be written 18\.2b/);
  fails("a rule page on the wrong host", { scenarios: withScenario(4, { sources: [{ ...rogSource("19.1"), authority: "USGA", url: "https://www.usga.org/anything/rule-19", checkedOn: TODAY }] }) }, /source 19\.1 should be the R&A's Rule 19 page/);
  check(
    "integrity: the USGA's clarifications page is a USGA source",
    !validateRules(
      withOverview(1, { sources: [...allOverviews[0].sources, { authority: "USGA", document: "clarifications", ruleRef: "Clarifications", url: "https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html", checkedOn: TODAY }] }),
      allScenarios,
      CTX,
    ).some((p) => p.startsWith("rule-1:")),
  );
  fails(
    "a clarifications page with the other body's authority",
    { overviews: withOverview(1, { sources: [...allOverviews[0].sources, { authority: "RANDA", document: "clarifications", ruleRef: "Clarifications", url: "https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html", checkedOn: TODAY }] }) },
    /rule-1: source Clarifications is on the USGA's site, so its authority should be USGA/,
  );
  fails("a Model Local Rule at the wrong URL", { scenarios: withScenario(2, { sources: [...allScenarios[2].sources.filter((s) => s.document !== "local-rule"), { ...localRuleSource("E-5"), url: "https://www.randa.org/en/rog/clarifications", checkedOn: TODAY }] }) }, /source MLR E-5 should point to https:\/\/www\.randa\.org\/en\/rog\/committee-procedures\/sections\/8/);
  fails("an overview citing a Model Local Rule", { overviews: withOverview(18, { sources: [...allOverviews[17].sources, { ...localRuleSource("E-5"), checkedOn: TODAY }] }) }, /rule-18: an overview can't cite a Model Local Rule/);
  fails("a situation citing only a whole rule", { scenarios: withScenario(4, { sources: [{ ...rogSource("19"), checkedOn: TODAY }] }) }, /unplayable-ball: cites no subrule of its primary Rule 19/);
  fails("an alias that is a rule's title", { scenarios: withScenario(5, { aliases: ["Bunkers"] }) }, /bunker-sand: alias "Bunkers" is the title or question of rule-12/);
  fails("an alias shaped like a rule reference", { overviews: withOverview(4, { aliases: ["14"] }) }, /rule-4: alias "14" reads as a rule reference/);
  check(
    "integrity: an archived record may keep its publishedOn",
    !validateRules(allOverviews, withScenario(0, { status: "archived" }), CTX).some((p) => p.startsWith("lost-ball:")),
    validateRules(allOverviews, withScenario(0, { status: "archived" }), CTX).join(" | "),
  );

  check(
    "integrity: a planned record may have no copy, caveats or check dates",
    (() => {
      const planned = { ...rulesScenarios[2], status: "planned", answer: "", conditions: [], localRuleCaveat: undefined };
      const plannedRule = { ...ruleOverviews[17], status: "planned", summary: "", commonQuestions: [] };
      return validateRules(ruleOverviews.map((r) => (r.number === 18 ? plannedRule : r)), [planned], CTX).length === 0;
    })(),
  );
  check(
    "integrity: a situation and its primary rule may share an alias",
    !validateRules(allOverviews, allScenarios, CTX).some((p) => p.includes("water hazard")),
  );
  check(
    "integrity: deliberately ambiguous aliases are allowed",
    !validateRules(allOverviews, withScenario(5, { aliases: ["OB"] }), { ...CTX, ambiguousAliases: ["ob"] }).some((p) => p.includes('"ob"')),
  );
  check("integrity: page ids include the category sections", RULES_PAGE_IDS.includes("cat-relief") && RULES_PAGE_IDS.includes("official-sources"));
  check("integrity: localRuleSource names the MLR", localRuleSource("E-5").ruleRef === "MLR E-5");
}

/* ---------------------------------------------------------------- warnings */

{
  check("warnings: a recent clarifications check is quiet", rulesWarnings(TODAY).length === 0);
  check(
    "warnings: one older than 100 days warns",
    rulesWarnings("2027-02-15", rulesEdition).some((w) => w.includes("last checked 2026-11-06")),
  );
}

/* ------------------------------------------------------------------ links */

{
  // As check-content builds them: published records (none while planned) plus the hub's section ids.
  const off = { live: false, fragments: new Set(RULES_PAGE_IDS) };
  const on = { live: true, fragments: new Set(["lost-ball", "rule-18", ...RULES_PAGE_IDS]) };
  check("links: /rules from the blog while off fails", Boolean(rulesHrefProblem("/rules", "lib/content/blog.ts", off)));
  check("links: a section link from the hub's own files while off passes", rulesHrefProblem("/rules#official-sources", "components/sections/rules/X.tsx", off) === null);
  check(
    "links: an unpublished record's fragment fails even from the hub's own files",
    /isn't a published rule/.test(rulesHrefProblem("/rules#lost-ball", "components/sections/rules/X.tsx", off) ?? ""),
  );
  check("links: a published fragment passes once live", rulesHrefProblem("/rules#rule-18", "lib/content/blog.ts", on) === null);
  check("links: a section id passes", rulesHrefProblem("/rules#official-sources", "lib/content/blog.ts", on) === null);
  check("links: an unknown fragment fails", /isn't a published rule/.test(rulesHrefProblem("/rules#rule-99", "lib/content/blog.ts", on) ?? ""));
  check("links: a query string is still /rules", Boolean(rulesHrefProblem("/rules?category=relief", "lib/content/blog.ts", off)));
  check("links: other paths are left alone", rulesHrefProblem("/rulesbook", "lib/content/blog.ts", off) === null);
}

/* -------------------------------------------------------- schema (#243) */

{
  const { rulesCollectionNode } = await import(new URL("../lib/schema.ts", import.meta.url).href);
  const hub = {
    scenarios: [{ slug: "lost-ball", question: "Lost ball: what happens next?" }],
    overviews: [
      { id: "rule-17", number: 17, title: "Penalty Areas" },
      { id: "rule-18", number: 18, title: "Stroke-and-Distance Relief" },
    ],
  };
  const node = rulesCollectionNode(hub, { name: "Golf Rules Explained", description: "d" });
  const items = node.mainEntity.itemListElement;
  check("schema: a CollectionPage of an ItemList", node["@type"] === "CollectionPage" && node.mainEntity["@type"] === "ItemList");
  check("schema: situations first, then rules, in page order", same(items.map((i) => i.url.split("#")[1]), ["lost-ball", "rule-17", "rule-18"]), JSON.stringify(items));
  check("schema: positions count from 1", same(items.map((i) => i.position), [1, 2, 3]));
  check("schema: numberOfItems matches the list", node.mainEntity.numberOfItems === 3);
  check("schema: every item is a fragment on /rules", items.every((i) => /^https:\/\/[^/]+\/rules#[a-z0-9-]+$/.test(i.url)), JSON.stringify(items.map((i) => i.url)));
  check("schema: a rule reads \"Rule N: title\"", items[2].name === "Rule 18: Stroke-and-Distance Relief");
  check("schema: no dateModified without a real date", !("dateModified" in node));
  check("schema: dateModified when there is one", rulesCollectionNode(hub, { name: "n", description: "d", dateModified: "2026-12-01" }).dateModified === "2026-12-01");
  const json = JSON.stringify(node);
  check("schema: no FAQPage, ratings or reviews", !/FAQPage|aggregateRating|"review"|Question/.test(json), json);
  check("schema: nothing internal (review records, check dates)", !/reviewedBy|reviewLog|checkedOn|status/.test(json), json);
}

/* ------------------------------------------- sitemap and llms.txt (#243) */

{
  const empty = { overviews: [], scenarios: [] };
  check("public face: none with nothing published", rules.rulesHasPublished(empty) === false);
  check("public face: none while rulesLive is false", rules.rulesLive || rules.rulesHasPublished() === false);
}

/* ----------------------------------------------------------------- result */

if (failures.length) {
  console.error("Rules tests failed:\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`✔ Rules: ${passed} cases passed (search, official links, publication boundary, selection, integrity, warnings, links, schema).`);
