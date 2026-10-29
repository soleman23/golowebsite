#!/usr/bin/env node
/**
 * Glossary model checks (#155). `npm run test:glossary` runs this, `npm test`
 * includes it, and CI runs it as its own step.
 *
 * Hermetic: fixture records only, run through the same pure functions the
 * hub, the content check and the client search use. No server, no network.
 *
 * - search ranking and normalisation (spec §5.4; QA GL-QA-03/04/05);
 * - the publication boundary: no draft, in-review, planned or archived record
 *   in any public selection, and no internal field in a public term;
 * - integrity: each malformed record fails with a line naming it;
 * - the claim guard on glossary files (education copy vs goloNote);
 * - the /glossary link and fragment rules.
 *
 * Exit 1 with one line per failed case.
 */

import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("..", import.meta.url);

/**
 * Node (>= 24) runs the lib modules' TypeScript as-is by stripping the types.
 * Map the project's "@/" alias and extensionless "./sibling" imports to the
 * .ts file, as scripts/check-content.mjs does.
 */
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

const glossary = await import(
  new URL("../lib/content/glossary/index.ts", import.meta.url).href
);
const { capabilities } = await import(
  new URL("../lib/content/capabilities.ts", import.meta.url).href
);
const { claimProblems } = await import("./content-claims.mjs");
const { glossaryHrefProblem } = await import("./glossary-checks.mjs");

const {
  glossaryLetterGroups,
  glossaryLive,
  glossaryMatchType,
  glossaryResultBucket,
  glossaryRouteVisible,
  glossarySearchEntries,
  glossarySelection,
  glossaryTerms,
  normalizeGlossaryText,
  prepareGlossarySearch,
  publishedGlossaryTerms,
  searchGlossary,
  selectGlossaryTerms,
  validateGlossary,
} = glossary;

const failures = [];
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed += 1;
  else failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* --------------------------------------------------------------- fixtures */

const TODAY = "2026-10-29";
const REVIEW_LOG = [
  { stage: "rules", by: "owner", on: "2026-10-20" },
  { stage: "product", by: "owner", on: "2026-10-20" },
  { stage: "seo", by: "agent", on: "2026-10-20" },
  { stage: "approval", by: "owner", on: "2026-10-21" },
];

/** A record that passes every check; fixtures override what they test. */
function term(id, fields = {}) {
  return {
    id,
    slug: id,
    term: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    aliases: [],
    primaryCategory: "scoring",
    tags: [],
    priority: "mvp",
    shortDefinition: `Definition of ${id}.`,
    relatedTermIds: [],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: id },
    capabilityIds: [],
    sources: [],
    status: "published",
    reviewedBy: "owner",
    reviewLog: REVIEW_LOG,
    reviewedOn: "2026-10-21",
    publishedOn: "2026-10-22",
    ...fields,
  };
}

const SERVED = new Set(["/games/skins", "/games/nassau", "/blog/pressing", "/faq"]);
const CTX = { capabilities, servedPaths: SERVED, today: TODAY };

const searchFixtures = [
  term("birdie", { shortDefinition: "One under par on a hole." }),
  term("birdie-bounty", {
    term: "Birdie Bounty",
    primaryCategory: "side-games",
    shortDefinition: "An amount every other player owes for each birdie.",
  }),
  term("albatross", { aliases: ["double eagle"], shortDefinition: "Three under par on a hole." }),
  term("foursomes", {
    primaryCategory: "formats",
    aliases: ["alternate shot"],
    shortDefinition: "Two partners play one ball, taking turns.",
  }),
  term("four-ball", {
    term: "Four-Ball",
    primaryCategory: "formats",
    aliases: ["best ball", "better ball", "fourball"],
    shortDefinition: "Partners each play their own ball; the better score counts.",
  }),
  term("best-score", {
    primaryCategory: "formats",
    shortDefinition: "The best single score in the group takes it. Not best ball.",
  }),
  term("press", { primaryCategory: "side-games", tags: ["presses"], shortDefinition: "A new match while one is running." }),
  term("re-press", {
    term: "Re-press",
    primaryCategory: "side-games",
    aliases: ["repress", "press the press"],
    shortDefinition: "A press on a press.",
  }),
  term("automatic-press", {
    primaryCategory: "side-games",
    aliases: ["auto press"],
    shortDefinition: "A press that opens without being called, often at two down.",
  }),
  term("teeing-area", { primaryCategory: "course-rules", aliases: ["tee box"], shortDefinition: "Where a hole starts." }),
  term("handicap-stroke", {
    primaryCategory: "handicaps",
    aliases: ["pop"],
    shortDefinition: "One stroke taken off a score on a hole.",
  }),
  term("wolf", { primaryCategory: "formats", shortDefinition: "A rotating captain picks a partner." }),
  term("lone-wolf", { primaryCategory: "side-games", shortDefinition: "The captain plays alone." }),
  term("members-bounce", { term: "Member's Bounce", primaryCategory: "slang", shortDefinition: "A lucky kick." }),
  term("19th-hole", { term: "19th Hole", primaryCategory: "slang", shortDefinition: "The bar after the round." }),
  term("naive-line", { term: "Naïve Line", primaryCategory: "slang", shortDefinition: "An accent test." }),
  term("poplar", { primaryCategory: "slang", shortDefinition: "A tree." }),
];

/* ----------------------------------------------------------------- search */

const index = prepareGlossarySearch(glossarySearchEntries(publishedGlossaryTerms(searchFixtures)));
const ids = (query, category) => searchGlossary(index, query, category).map((m) => m.entry.id);

const searches = [
  // GL-QA-03
  ["bir", "all", ["birdie", "birdie-bounty"]],
  // GL-QA-04: alias, any case
  ["DOUBLE EAGLE", "all", ["albatross"]],
  // GL-QA-05
  ["alternate shot", "all", ["foursomes"]],
  ["tee box", "all", ["teeing-area"]],
  ["auto press", "all", ["automatic-press"]],
  // exact name, then partial names, alphabetical
  ["press", "all", ["press", "automatic-press", "re-press"]],
  ["press", "formats", []],
  ["press", "side-games", ["press", "automatic-press", "re-press"]],
  ["wolf", "all", ["wolf", "lone-wolf"]],
  // punctuation, dashes and spacing normalised to the same form
  ["  Four–Ball!! ", "all", ["four-ball"]],
  ["fourball", "all", ["four-ball"]],
  // apostrophes and accents
  ["members", "all", ["members-bounce"]],
  ["member’s", "all", ["members-bounce"]],
  ["naive", "all", ["naive-line"]],
  ["NAÏVE", "all", ["naive-line"]],
  // tier order: exact alias (1) before name prefix (2)
  ["pop", "all", ["handicap-stroke", "poplar"]],
  // name prefix (2) before partial name (3), whatever the alphabet says
  ["pre", "all", ["press", "automatic-press", "re-press"]],
  // alias prefix (4) only when no name matches
  ["repr", "all", ["re-press"]],
  // digits
  ["19", "all", ["19th-hole"]],
  // nothing to search
  ["", "all", []],
  ["!!!", "all", []],
  ["zzz", "all", []],
];
for (const [query, category, want] of searches) {
  const got = ids(query, category);
  check(`search "${query}" in ${category}`, same(got, want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}

{
  // "best ball" resolves to Four-Ball first, by alias; Best Score is only a
  // description match below it (inventory.md: best ball never means Best Score).
  const got = searchGlossary(index, "best ball");
  check("best ball → Four-Ball first", got[0]?.entry.id === "four-ball" && got[0]?.tier === 1 && got[0]?.alias === "best ball", JSON.stringify(got.map((m) => [m.entry.id, m.tier])));
  check("best ball → Best Score never above tier 5", got.every((m) => m.entry.id !== "best-score" || m.tier === 5));
  const pop = searchGlossary(index, "pop");
  check("pop → Handicap Stroke first, via alias", pop[0]?.entry.id === "handicap-stroke" && pop[0]?.alias === "pop");
  const desc = searchGlossary(index, "two down");
  check("description match is the last tier", desc.length === 1 && desc[0].entry.id === "automatic-press" && desc[0].tier === 5);
  const tag = searchGlossary(index, "presses");
  check("tag match", tag.some((m) => m.entry.id === "press" && m.tier === 5));
}

{
  // Deterministic whatever the input order.
  const shuffled = prepareGlossarySearch(glossarySearchEntries(publishedGlossaryTerms([...searchFixtures].reverse())));
  check("ranking ignores input order", same(searchGlossary(shuffled, "press").map((m) => m.entry.id), ids("press")));
}

check("normalise", normalizeGlossaryText("  Grip It & Rip-It! ") === "grip it rip it");
check("match type exact", glossaryMatchType(searchGlossary(index, "Birdie")) === "exact");
check("match type alias", glossaryMatchType(searchGlossary(index, "tee box")) === "alias");
check("match type partial", glossaryMatchType(searchGlossary(index, "bir")) === "partial");
check("match type none", glossaryMatchType(searchGlossary(index, "zzz")) === "none");
check("result buckets", same([0, 1, 2, 5, 6, 40].map(glossaryResultBucket), ["0", "1", "2-5", "2-5", "6+", "6+"]));

/* ------------------------------------------------------ publication boundary */

const statuses = ["planned", "draft", "in-review", "approved", "published", "archived"];
const boundary = statuses.map((status) =>
  term(`t-${status}`, {
    status,
    relatedTermIds: statuses.filter((s) => s !== status).map((s) => `t-${s}`),
    ...(status === "published" ? {} : { publishedOn: undefined }),
  }),
);

{
  const pub = publishedGlossaryTerms(boundary);
  check("published selection: published only", same(pub.map((t) => t.id), ["t-published"]));
  check("published selection: related ids to unpublished dropped", same(pub[0].relatedTermIds, []));
  check("published selection: no unpublished marker", pub[0].unpublished === undefined);

  const review = selectGlossaryTerms(boundary, "review");
  check("review selection: approved and published only", same(review.map((t) => t.id).sort(), ["t-approved", "t-published"]));
  check("review selection: approved marked unpublished", review.find((t) => t.id === "t-approved")?.unpublished === true);
  check("review selection: related ids limited to the selection", same(review.find((t) => t.id === "t-published")?.relatedTermIds, ["t-approved"]));

  for (const t of [...pub, ...review]) {
    for (const key of ["status", "reviewedBy", "reviewLog", "sources", "priority"]) {
      check(`public term ${t.id} has no ${key}`, !(key in t));
    }
  }

  const entries = glossarySearchEntries(pub);
  check("search index from the published selection has no draft", same(entries.map((e) => e.id), ["t-published"]));
  check("search entries carry only search fields", same(Object.keys(entries[0]).sort(), ["aliases", "category", "id", "shortDefinition", "slug", "tags", "term"]));
  const leaked = JSON.stringify([pub, review, entries]);
  check("no internal value leaks into public output", !leaked.includes("owner") && !leaked.includes("2026-10-20"));

  const draftOnly = term("only-draft", { status: "draft", publishedOn: undefined });
  check("a draft-only set publishes nothing", publishedGlossaryTerms([draftOnly]).length === 0);
  check("a draft-only set reviews nothing", selectGlossaryTerms([draftOnly], "review").length === 0);
}

{
  // The shipped records: nothing public that isn't published.
  const pub = publishedGlossaryTerms(glossaryTerms);
  const publishedIds = glossaryTerms.filter((t) => t.status === "published").map((t) => t.id).sort();
  check("shipped: published selection matches published records", same(pub.map((t) => t.id).sort(), publishedIds));
  const shipped = validateGlossary(glossaryTerms, {
    capabilities,
    servedPaths: new Set(["/blog/pressing", "/games/nassau", ...glossaryTerms.flatMap((t) => [...t.relatedContentPaths, t.canonical.path ?? ""])]),
    today: new Date().toISOString().slice(0, 10),
  });
  check("shipped records pass validation", shipped.length === 0, shipped.join(" | "));
}

{
  // Which path a build takes. Production never reviews; the route only shows
  // in production once the flag is on.
  const saved = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  check("production takes the published path", glossarySelection() === "published");
  check("production route follows glossaryLive", glossaryRouteVisible() === glossaryLive);
  process.env.NODE_ENV = "development";
  check("next dev takes the review path", glossarySelection() === "review");
  check("next dev shows the route", glossaryRouteVisible() === true);
  process.env.NODE_ENV = "test";
  check("any other NODE_ENV takes the published path", glossarySelection() === "published");
  process.env.NODE_ENV = saved;
}

{
  const groups = glossaryLetterGroups(publishedGlossaryTerms(searchFixtures));
  check("letter groups: # first, then A–Z", groups[0].letter === "#" && groups[0].terms[0].id === "19th-hole");
  const b = groups.find((g) => g.letter === "B");
  check("letter groups: alphabetical within a letter", same(b?.terms.map((t) => t.id), ["best-score", "birdie", "birdie-bounty"]));
  check("letter groups: categories present", same(b?.categories, ["formats", "scoring", "side-games"]));
}

/* -------------------------------------------------------------- integrity */

{
  const base = [
    term("skins", { canonical: { kind: "existing", path: "/games/skins" }, relatedTermIds: ["carryover"] }),
    term("carryover", { relatedTermIds: ["skins"], relatedContentPaths: ["/games/skins"] }),
  ];
  const clean = validateGlossary(base, CTX);
  check("valid fixtures pass", clean.length === 0, clean.join(" | "));
  const reReviewed = validateGlossary(
    [term("skins", {
      reviewLog: [...REVIEW_LOG, { stage: "rules", by: "owner", on: "2026-10-25" }, { stage: "approval", by: "owner", on: "2026-10-25" }],
      reviewedOn: "2026-10-25",
    })],
    CTX,
  );
  check("a term re-approved after publication passes", reReviewed.length === 0, reReviewed.join(" | "));

  /** Each mutation must produce a problem that names the record and the issue. */
  const broken = [
    ["duplicate slug", [...base, term("skins-2", { slug: "skins" })], "skins-2", "slug \"skins\" is already used"],
    ["duplicate id", [...base, term("skins", { slug: "skins-again", term: "Skins Again" })], "skins", "duplicate id"],
    ["duplicate name", [...base, term("skins-x", { term: "SKINS" })], "skins-x", "duplicates skins"],
    ["bad id", [...base, term("Bad_ID")], "Bad_ID", "isn't a lower-case slug"],
    ["dangling related id", [term("skins", { relatedTermIds: ["nope"] })], "skins", "related term \"nope\" isn't a record"],
    ["self relation", [term("skins", { relatedTermIds: ["skins"] })], "skins", "relates to itself"],
    ["unknown capability", [term("skins", { capabilityIds: ["teleport"] })], "skins", "capability \"teleport\" isn't in the registry"],
    ["goloNote without a live capability", [term("skins", { goloNote: "GoLo keeps the carry count.", capabilityIds: ["auto-press"] })], "skins", "goloNote needs at least one live capability"],
    ["impossible date", [term("skins", { reviewedOn: "2026-02-30" })], "skins", "reviewedOn \"2026-02-30\" isn't a YYYY-MM-DD date"],
    ["badly formatted date", [term("skins", { publishedOn: "10/22/2026" })], "skins", "publishedOn \"10/22/2026\""],
    ["future date", [term("skins", { updatedOn: "2027-01-01" })], "skins", "updatedOn 2027-01-01 is in the future"],
    ["published before the first approval", [term("skins", { reviewedOn: "2026-10-21", publishedOn: "2026-10-20" })], "skins", "publishedOn is before the first approval"],
    ["reviewedOn behind the review log", [term("skins", { reviewLog: [...REVIEW_LOG, { stage: "approval", by: "owner", on: "2026-10-25" }] })], "skins", "reviewedOn isn't the latest approval"],
    ["updated before published", [term("skins", { updatedOn: "2026-10-21" })], "skins", "updatedOn is before publishedOn"],
    ["published without publishedOn", [term("skins", { publishedOn: undefined })], "skins", "published without publishedOn"],
    ["publishedOn on a draft", [term("skins", { status: "draft" })], "skins", "publishedOn set on a draft record"],
    ["approved without reviewedOn", [term("skins", { status: "approved", publishedOn: undefined, reviewedOn: undefined })], "skins", "approved without reviewedOn"],
    ["approved without reviewedBy", [term("skins", { status: "approved", publishedOn: undefined, reviewedBy: undefined })], "skins", "approved without reviewedBy"],
    ["approved without a review stage", [term("skins", { status: "approved", publishedOn: undefined, reviewLog: REVIEW_LOG.slice(1) })], "skins", "without a review log entry for rules"],
    ["approved with an unchecked source", [term("skins", { status: "approved", publishedOn: undefined, sources: [{ title: "RoG Rule 23", url: "https://www.randa.org/rog", kind: "official-rules" }] })], "skins", "unchecked sources: RoG Rule 23"],
    ["handicap term without a checked official source", [term("course-handicap", { primaryCategory: "handicaps", sources: [{ title: "A blog", url: "https://example.com", kind: "editorial", accessedOn: "2026-10-20" }] })], "course-handicap", "rules-sensitive record without a checked official source"],
    ["source accessed in the future", [term("skins", { status: "draft", publishedOn: undefined, sources: [{ title: "RoH", url: "https://www.usga.org/handicapping/roh/", kind: "handicapping", accessedOn: "2027-01-01" }] })], "skins", "accessedOn is in the future"],
    ["http source", [term("skins", { status: "draft", publishedOn: undefined, sources: [{ title: "Old", url: "http://example.com", kind: "editorial" }] })], "skins", "needs an https URL"],
    ["canonical not served", [term("skins", { canonical: { kind: "existing", path: "/games/skinz" } })], "skins", "canonical /games/skinz isn't a served page"],
    ["related path not served", [term("skins", { relatedContentPaths: ["/blog/nope"] })], "skins", "related path /blog/nope isn't a served page"],
    ["related path with a glossary fragment", [term("skins", { relatedContentPaths: ["/glossary#press"] })], "skins", "related path /glossary#press isn't a served page"],
    ["hub anchor not the slug", [term("skins", { canonical: { kind: "hub", anchor: "skin" } })], "skins", "hub anchor \"skin\" isn't the slug"],
    ["detail canonical", [term("skins", { canonical: { kind: "detail", path: "/glossary/skins" } })], "skins", "detail canonicals wait for standalone term pages"],
    ["alias collision", [term("four-ball", { aliases: ["best ball"] }), term("best-score", { aliases: ["Best-Ball"] })], "four-ball, best-score", "alias \"best ball\" resolves to more than one record"],
    ["alias is another term's name", [term("press"), term("re-press", { aliases: ["Press"] })], "re-press", "alias \"press\" is the name of press"],
    ["alias is its own name", [term("press", { aliases: ["press"] })], "press", "is the term's own name"],
    ["alias listed twice", [term("press", { aliases: ["auto press", "Auto-Press"] })], "press", "is listed twice"],
    ["markup in copy", [term("skins", { shortDefinition: "A <b>skin</b> is a hole." })], "skins", "shortDefinition contains markup"],
    ["entity in copy", [term("skins", { example: "Skins &amp; carryovers." })], "skins", "example contains markup"],
    ["exclamation mark", [term("skins", { example: "What a hole!" })], "skins", "exclamation mark"],
    ["emoji", [term("skins", { shortDefinition: "A skin ⛳ is a hole." })], "skins", "emoji"],
    ["unknown category", [term("skins", { primaryCategory: "trivia" })], "skins", "unknown category"],
  ];
  for (const [name, terms, owner, fragment] of broken) {
    const found = validateGlossary(terms, CTX);
    const hit = found.find((p) => p.startsWith(`${owner}:`) && p.includes(fragment));
    check(`integrity: ${name}`, Boolean(hit), `want "${owner}: …${fragment}…", got ${JSON.stringify(found)}`);
  }

  const ambiguous = validateGlossary(
    [term("four-ball", { aliases: ["best ball"] }), term("best-score", { aliases: ["best ball"] })],
    { ...CTX, ambiguousAliases: ["best ball"] },
  );
  check("a listed ambiguous alias passes", ambiguous.length === 0, ambiguous.join(" | "));
}

/* ------------------------------------------------------------ claim guard */

{
  const notLive = capabilities.filter((c) => c.status !== "live" && c.claimPhrases?.length);
  const overclaimed = capabilities.filter((c) => c.overclaims?.length);
  const run = (file, source, education) =>
    claimProblems(file, source, { notLive, overclaimed, education }).map((p) => p.message);
  const record = (fields) => `export const glossaryTerms = [\n  {\n${fields}\n  },\n];\n`;
  const TERMS = "lib/content/glossary/terms.ts";

  const definition = run(TERMS, record(`    shortDefinition: "An automatic press opens at two down, and a Nassau press covers the holes left.",\n    explanation: "A 90% allowance is common in four-ball. Quota and low man are house choices.",`), true);
  check("glossary: golf definitions of non-live capabilities pass", definition.length === 0, definition.join(" | "));

  const note = run(TERMS, record(`    goloNote: "On Overall Match, presses open as an automatic press at two down.",`), true);
  check("glossary: a goloNote claiming an automatic press fails", note.some((m) => m.includes("auto-press")), JSON.stringify(note));

  const concatenated = run(TERMS, record(`    goloNote:\n      "On Overall Match, the side behind calls a press. " +\n      "Mixed tees work too.",`), true);
  check("glossary: a concatenated goloNote is still checked", concatenated.some((m) => m.includes("mixed-tees")), JSON.stringify(concatenated));

  const denied = run(TERMS, record(`    goloNote: "GoLo doesn't open presses automatically, and its Nassau takes no presses.",`), true);
  check("glossary: a goloNote denying it passes", denied.length === 0, denied.join(" | "));

  const aboutGolo = run(TERMS, record(`    shortDefinition: "GoLo handles automatic presses.",`), true);
  check("glossary: a definition that says GoLo does it fails", aboutGolo.some((m) => m.includes("auto-press")));

  const cta = run("lib/content/glossary/copy.ts", `export const glossaryCta = { lead: "GoLo handles automatic presses." };\n`, false);
  check("glossary: a CTA saying GoLo handles automatic presses fails", cta.some((m) => m.includes("auto-press")), JSON.stringify(cta));

  const overclaim = run(TERMS, record(`    shortDefinition: "Settle-up finds the fewest payments.",`), true);
  check("glossary: overclaims fail even in a definition", overclaim.some((m) => m.includes("overstates settle-up")));
}

/* ------------------------------------------------------------------ links */

{
  const off = { live: false, publishedSlugs: new Set() };
  const on = { live: true, publishedSlugs: new Set(["press", "skins"]) };
  const cases = [
    ["off: a page links to the hub", "/glossary", "lib/content/faq.ts", off, "isn't live"],
    ["off: a page links to a term", "/glossary#press", "lib/content/blog.ts", off, "isn't live"],
    ["off: the glossary links to itself", "/glossary", "lib/content/glossary/copy.ts", off, null],
    ["off: hub component", "/glossary?category=side-games", "components/sections/glossary/GlossaryControls.tsx", off, null],
    ["on: hub link", "/glossary", "lib/content/faq.ts", on, null],
    ["on: published term", "/glossary#press", "lib/content/blog.ts", on, null],
    ["on: not a term", "/glossary#not-a-term", "lib/content/blog.ts", on, "\"not-a-term\" isn't a published glossary term"],
    ["on: unpublished term", "/glossary#re-press", "lib/content/gameDetail.ts", on, "isn't a published glossary term"],
    ["on: category link", "/glossary?category=side-games", "lib/content/faq.ts", on, null],
    ["not the glossary", "/games/skins#rules", "lib/content/faq.ts", off, null],
    ["not the glossary, similar path", "/glossary-of-terms", "lib/content/faq.ts", off, null],
  ];
  for (const [name, href, file, state, want] of cases) {
    const got = glossaryHrefProblem(href, file, state);
    check(`links: ${name}`, want === null ? got === null : Boolean(got?.includes(want)), `got ${JSON.stringify(got)}`);
  }
}

/* ----------------------------------------------------------------- result */

if (failures.length) {
  console.error("Glossary tests failed:\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`✔ Glossary: ${passed} cases passed (search, publication boundary, integrity, claim guard, links).`);
