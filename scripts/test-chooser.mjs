#!/usr/bin/env node
/**
 * Side-game chooser checks (soleman23/golowebsite#224). `npm run test:chooser`
 * runs this and `npm test` includes it.
 *
 * Hermetic: the same pure modules the page and the client chooser run
 * (lib/chooser/engine.ts, url.ts, view.ts) and the copy built from the
 * capability registry. No server, no network.
 *
 * - eligibility and ranking across representative groups and the boundary
 *   player counts;
 * - conflicting answers, empty results and the changes offered for them;
 * - URL parsing: malformed, unknown, duplicate and foreign parameters, round
 *   trips and reset;
 * - every "In GoLo" line is registry text, every verdict follows the
 *   registry's status, and the table's derived columns agree with the cards;
 * - the analytics URL cleaner keeps exactly the answers the chooser reads;
 * - every link on a card or the page is a served page or a published
 *   glossary anchor;
 * - the worked example still produces what its prose says.
 *
 * Exit 1 with one line per failed case.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const rootUrl = new URL("..", import.meta.url);
const root = fileURLToPath(rootUrl);

/** Map "@/" and extensionless "./sibling" imports to .ts, as check-content does. */
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

const load = (path) => import(new URL(`../${path}`, import.meta.url).href);
const engine = await load("lib/chooser/engine.ts");
const url = await load("lib/chooser/url.ts");
const view = await load("lib/chooser/view.ts");
const content = await load("lib/content/chooser.ts");
const { capabilities } = await load("lib/content/capabilities.ts");
const { publishedPosts } = await load("lib/content/blog.ts");
const { gameDetailSlugsWithContent } = await load("lib/content/gameDetail.ts");
const { glossaryLive, publishedGlossaryTerms } = await load("lib/content/glossary/index.ts");
const { dropUnusedQueryParams, isKeptQueryParam } = await load("lib/analyticsPreference.ts");

const { choose, FORMAT_IDS, FORMAT_RULES, NO_ANSWERS, PLAYER_COUNTS, evenTeams } = engine;
const { parseAnswers, serializeAnswers, sameAnswers, answersKey, isChooserParam, chooserQuery, CHOOSER_PATH } = url;
const { chooserView, goloVerdict, goloCell, simpleCell } = view;
const { chooserCopy, chooserExample, chooserTable, chooserTableCells, chooserKeepReading, chooserSideGames, chooserTeaser } = content;

const failures = [];
let passed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++;
  else failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ask = (partial) => choose({ ...NO_ANSWERS, ...partial });
const picks = (partial) => {
  const r = ask(partial);
  return r.status === "needs-players" ? null : r.picks.map((p) => p.id);
};
const eligible = (partial) => {
  const r = ask(partial);
  return r.status === "needs-players" ? null : [...r.picks.map((p) => p.id), ...r.alsoFits];
};

/* ------------------------------------------------------------ structure */

check("every format has one rule", eq([...FORMAT_IDS].sort(), FORMAT_RULES.map((r) => r.id).sort()));
check("every format has copy", eq([...FORMAT_IDS].sort(), Object.keys(chooserCopy.formats).sort()));
check("every format has table cells", eq([...FORMAT_IDS].sort(), Object.keys(chooserTableCells).sort()));
check("cards carry no hand-written GoLo verdicts", Object.values(chooserCopy.formats).every((f) => !("verdicts" in f.golo)));
check("player counts are 2 to 12", eq([...PLAYER_COUNTS], [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));

/* ---------------------------------------------------------- players gate */

check("no players: asks for them", ask({}).status === "needs-players");
for (const bad of [0, 1, 13, 2.5, -4, Number.NaN]) {
  check(`players ${bad}: asks for them`, ask({ players: bad }).status === "needs-players");
}

/* ------------------------------------------------- eligibility by count */

// With nothing else answered, eligibility is size alone.
const bySize = {
  2: ["best-score", "skins", "nassau", "bingo-bango-bongo"],
  3: ["best-score", "skins", "nassau", "bingo-bango-bongo", "nines"],
  4: ["best-score", "skins", "nassau", "best-ball", "scramble", "bingo-bango-bongo", "wolf"],
  5: ["best-score", "skins", "scramble"],
  6: ["best-score", "skins", "scramble"],
  7: ["best-score", "scramble"],
  12: ["best-score", "scramble"],
};
for (const [players, expected] of Object.entries(bySize)) {
  const got = eligible({ players: Number(players) });
  check(`${players} players: eligible set`, eq([...got].sort(), [...expected].sort()), JSON.stringify(got));
}

/* ---------------------------------------------------- default ranking */

check("4 players, nothing else: fixed order with Wolf lifted at four",
  eq(picks({ players: 4 }), ["wolf", "best-score", "skins"]), JSON.stringify(picks({ players: 4 })));
check("3 players, nothing else: Nines first at three",
  eq(picks({ players: 3 }), ["nines", "best-score", "skins"]), JSON.stringify(picks({ players: 3 })));
check("2 players: fixed order", eq(picks({ players: 2 }), ["best-score", "skins", "nassau"]));
check("at most three picks", [2, 3, 4, 5, 8].every((p) => (picks({ players: p }) ?? []).length <= 3));

/* --------------------------------------------------- partner answers */

check("4 teams: team games and Wolf only",
  eq(eligible({ players: 4, partners: "teams" }).sort(), ["best-ball", "scramble", "wolf"].sort()));
check("4 solo: no team games or Wolf",
  !eligible({ players: 4, partners: "solo" }).some((id) => ["best-ball", "scramble", "wolf"].includes(id)));
check("8 teams: scramble only", eq(eligible({ players: 8, partners: "teams" }), ["scramble"]));
check("8 solo: Best Score only", eq(eligible({ players: 8, partners: "solo" }), ["best-score"]));
check("6 solo: Best Score and Skins", eq(eligible({ players: 6, partners: "solo" }), ["best-score", "skins"]));
check("either equals no answer", [2, 3, 4, 6, 9].every((p) => eq(ask({ players: p, partners: "either" }), ask({ players: p }))));

/* --------------------------------------------------- simple answers */

check("2 simple: Nassau stays (one opponent)", eligible({ players: 2, scoring: "simple" }).includes("nassau"));
check("3 simple: Nassau drops (three pairings)", !eligible({ players: 3, scoring: "simple" }).includes("nassau"));
check("4 simple: Wolf, BBB, Nassau drop",
  !eligible({ players: 4, scoring: "simple" }).some((id) => ["wolf", "bingo-bango-bongo", "nassau"].includes(id)));
check("3 simple: Nines drops", !eligible({ players: 3, scoring: "simple" }).includes("nines"));
check("simple: Best Score first when nothing outranks it",
  [2, 3, 4, 5, 9].every((p) => picks({ players: p, scoring: "simple" })[0] === "best-score"));
check("more equals no answer", [2, 3, 4, 7].every((p) => eq(ask({ players: p, scoring: "more" }), ask({ players: p }))));

/* -------------------------------------------- handicaps change order only */

for (const players of [2, 3, 4, 5, 8]) {
  for (const handicaps of ["close", "apart", "none"]) {
    const a = eligible({ players, handicaps }).sort();
    const b = eligible({ players }).sort();
    check(`${players} players, ${handicaps}: same set as unanswered`, eq(a, b));
  }
}
check("4, no handicap: BBB then scramble first",
  eq(picks({ players: 4, handicaps: "none" }).slice(0, 2), ["bingo-bango-bongo", "scramble"]),
  JSON.stringify(picks({ players: 4, handicaps: "none" })));
check("4, apart: BBB and scramble lifted together, fixed order between them",
  eq(picks({ players: 4, handicaps: "apart" }).slice(0, 2), ["scramble", "bingo-bango-bongo"]));
check("2, apart: BBB first", picks({ players: 2, handicaps: "apart" })[0] === "bingo-bango-bongo");
check("close: same order as unanswered", [2, 3, 4, 6].every((p) => eq(picks({ players: p, handicaps: "close" }), picks({ players: p }))));
check("holes change nothing in the order", [2, 3, 4, 6, 10].every((p) => eq(ask({ players: p, holes: "9" }), ask({ players: p }))));

/* ---------------------------------------------------------- rank reasons */

{
  const r = ask({ players: 4, handicaps: "none", scoring: "simple" });
  const reasons = Object.fromEntries(r.picks.map((p) => [p.id, p.reasons]));
  check("no handicap, simple: scramble lifted for set numbers", eq(reasons.scramble, ["set-numbers"]), JSON.stringify(reasons));
  check("no handicap, simple: Best Score is simplest", eq(reasons["best-score"], ["simplest"]));
  check("ranks run 1..n", r.picks.every((p, i) => p.rank === i + 1));
  const plain = ask({ players: 2 });
  check("nothing answered: no rank reasons", plain.picks.every((p) => p.reasons.length === 0));
}

/* ------------------------------------------------- empty and conflicts */

for (const players of [2, 3]) {
  const r = ask({ players, partners: "teams" });
  check(`${players} teams: empty`, r.status === "empty" && r.picks.length === 0);
  check(`${players} teams: offers each-on-our-own`, eq(r.relaxations, [{ question: "partners", value: "solo" }]), JSON.stringify(r.relaxations));
  check(`${players} teams: every format ruled out`, r.ruledOut.length === FORMAT_IDS.length);
  const v = chooserView({ ...NO_ANSWERS, players, partners: "teams" }, chooserCopy);
  check(`${players} teams: view explains team size`, v.status === "empty" && v.message === chooserCopy.empty.teamsTooFew);
  check(`${players} teams: relaxation has a label`, v.relaxations.every((x) => x.label));
  const relaxed = ask({ players, partners: "solo" });
  check(`${players} teams relaxed: results`, relaxed.status === "ok");
}
{
  const r = ask({ players: 3, partners: "teams", scoring: "simple" });
  check("3 teams simple: only the partner change helps", eq(r.relaxations, [{ question: "partners", value: "solo" }]));
}
// No other answer set is empty: every reachable state of the form.
{
  const empties = [];
  for (const players of PLAYER_COUNTS)
    for (const partners of [null, "solo", "teams", "either"])
      for (const handicaps of [null, "close", "apart", "none"])
        for (const scoring of [null, "simple", "more"])
          for (const holes of [null, "18", "9"]) {
            const answers = { players, partners, handicaps, scoring, holes };
            const r = choose(answers);
            if (r.status === "empty") empties.push(answersKey(answers));
            if (r.status !== "needs-players") {
              const v = chooserView(answers, chooserCopy);
              if (v.status === "ok") {
                for (const p of v.picks) {
                  if (!p.summary || !p.golo.label || !p.agree.length || !p.why.length || !p.tradeoff) {
                    failures.push(`${answersKey(answers)} ${p.id}: card missing summary, why, trade-off, GoLo verdict or house rules`);
                  }
                }
              }
              if (r.status === "ok" && r.picks.length + r.alsoFits.length + r.ruledOut.length !== FORMAT_IDS.length) {
                failures.push(`${answersKey(answers)}: formats lost between picks, also-fits and ruled out`);
              }
              for (const out of v.ruledOut ?? []) {
                if (out.reasons.some((s) => !s)) failures.push(`${answersKey(answers)} ${out.id}: ruled out with no reason text`);
              }
            }
          }
  check("only 2 or 3 players with teams can be empty",
    empties.every((k) => /^(2|3)\/teams\//.test(k)), empties.filter((k) => !/^(2|3)\/teams\//.test(k)).slice(0, 5).join(", "));
}

/* ------------------------------------------------ card consistency */

{
  // A Nassau over nine among three or four is one match per pair; the card
  // must not say "one match" alone while its GoLo line says every pair plays.
  for (const players of [3, 4]) {
    const v = view.pickView("nassau", 1, [], { ...NO_ANSWERS, players, holes: "9" }, chooserCopy);
    check(`Nassau, ${players} players, 9 holes: summary is per pair`, v.summary.includes("per pair"), v.summary);
    check(`Nassau, ${players} players, 9 holes: trade-off names the pairings`, v.tradeoff.text.includes("pairings"), v.tradeoff.text);
  }
  const two = view.pickView("nassau", 1, [], { ...NO_ANSWERS, players: 2, holes: "9" }, chooserCopy);
  check("Nassau, 2 players, 9 holes: one match", two.summary.startsWith("Over nine holes it’s one match,"), two.summary);
  // A format too big or too small for the group is ruled out on size alone.
  const r = ask({ players: 6, scoring: "simple" });
  const nassauOut = r.ruledOut.find((x) => x.id === "nassau");
  check("6 simple: Nassau ruled out on size only", eq(nassauOut.reasons, ["players"]), JSON.stringify(nassauOut));
  const r4 = ask({ players: 4, scoring: "simple" });
  check("4 simple: Nassau ruled out on simplicity", eq(r4.ruledOut.find((x) => x.id === "nassau").reasons, ["scoring"]));
  // The scramble card lists the registry's drive-count limit beside its drive-rule house rule.
  const s = view.pickView("scramble", 1, [], { ...NO_ANSWERS, players: 8 }, chooserCopy);
  check("scramble: Texas scramble limit shown", s.golo.lines.some((l) => l.text.startsWith("No Texas scramble drive count")));
}

/* ---------------------------------------------------------------- URL */

check("parse: nothing", eq(parseAnswers("").answers, NO_ANSWERS) && parseAnswers("").dropped.length === 0);
{
  const p = parseAnswers("?players=4&partners=teams&handicaps=apart&scoring=simple&holes=9");
  check("parse: full", eq(p.answers, { players: 4, partners: "teams", handicaps: "apart", scoring: "simple", holes: "9" }) && !p.dropped.length);
}
for (const bad of ["1", "13", "04", "4.0", "+4", " 4", "four", "", "4e0", "0x4", "99999999999"]) {
  const p = parseAnswers(`players=${encodeURIComponent(bad)}`);
  check(`parse: players=${JSON.stringify(bad)} dropped`, p.answers.players === null && eq(p.dropped, ["players"]));
}
{
  const p = parseAnswers("players=4&partners=TEAMS&holes=27&scoring=simple");
  check("parse: bad values drop alone", eq(p.answers, { ...NO_ANSWERS, players: 4, scoring: "simple" }) && eq(p.dropped, ["partners", "holes"]));
}
{
  const p = parseAnswers("players=4&players=5");
  check("parse: conflicting duplicate dropped", p.answers.players === null && eq(p.dropped, ["players"]));
  const q = parseAnswers("players=4&players=4");
  check("parse: identical duplicate kept", q.answers.players === 4 && !q.dropped.length);
}
{
  const p = parseAnswers("utm_source=chatgpt.com&players=3&foo=<script>");
  check("parse: foreign params ignored, not reported", p.answers.players === 3 && !p.dropped.length);
}
{
  // A misspelt key for a question left blank is reported, so the visitor is
  // told (#224: "dropped on its own and the visitor is told").
  const p = parseAnswers("player=4&Partners=solo&HOLE=9&scoring=simple");
  check("parse: misspelt keys reported, good ones kept",
    p.answers.scoring === "simple" && p.answers.players === null && eq(p.dropped, ["players", "partners", "holes"]), JSON.stringify(p));
  const q = parseAnswers("players=4&player=5");
  check("parse: a misspelt copy beside the real key isn't reported", q.answers.players === 4 && !q.dropped.length);
  const r = parseAnswers("utm_source=x&utm_medium=y&gclid=1&fbclid=2&ref=z&handicapper=3");
  check("parse: campaign, click ids and longer keys never count as misspelt", !r.dropped.length, JSON.stringify(r.dropped));
  const t = parseAnswers("partner=acme&handicap=12&player=me&players=4");
  check("parse: a look-alike key whose value no question takes isn't reported", t.answers.players === 4 && !t.dropped.length, JSON.stringify(t.dropped));
  check("serialize: a misspelt chooser key is left out, others kept",
    serializeAnswers({ ...NO_ANSWERS, players: 4 }, "player=4&Holes=9&partner=acme&utm_source=x") === "?players=4&partner=acme&utm_source=x");
}
{
  const p = parseAnswers("partners=%3Cscript%3E&handicaps=none%00");
  check("parse: encoded junk dropped", p.answers.partners === null && p.answers.handicaps === null && eq(p.dropped, ["partners", "handicaps"]));
}
check("serialize: nothing is empty string", serializeAnswers(NO_ANSWERS) === "");
check("serialize: question order, unanswered left out",
  serializeAnswers({ ...NO_ANSWERS, holes: "9", players: 6 }) === "?players=6&holes=9");
check("serialize: keeps foreign params, replaces its own",
  serializeAnswers({ ...NO_ANSWERS, players: 4 }, "?players=9&utm_source=x&holes=bad") === "?players=4&utm_source=x");
check("serialize: reset keeps foreign params only", serializeAnswers(NO_ANSWERS, "?players=4&utm_source=x") === "?utm_source=x");
{
  // Round trip every reachable answer set.
  let bad = 0;
  for (const players of [null, ...PLAYER_COUNTS])
    for (const partners of [null, "solo", "teams", "either"])
      for (const handicaps of [null, "close", "apart", "none"])
        for (const scoring of [null, "simple", "more"])
          for (const holes of [null, "18", "9"]) {
            const answers = { players, partners, handicaps, scoring, holes };
            const back = parseAnswers(serializeAnswers(answers));
            if (!sameAnswers(back.answers, answers) || back.dropped.length) bad++;
          }
  check("round trip: every answer set", bad === 0, `${bad} failed`);
}
check("analytics key is closed-set", answersKey({ ...NO_ANSWERS, players: 4, scoring: "simple" }) === "4/-/-/simple/-");
check("isChooserParam", isChooserParam("players", "12") && !isChooserParam("players", "13") && !isChooserParam("utm_source", "x"));
check("chooserQuery: own params only, question order, invalid kept",
  chooserQuery("?utm_source=x&holes=9&players=99&fbclid=y") === "players=99&holes=9");
check("chooserQuery: same answers, other params: equal",
  chooserQuery("?players=4&utm_source=a") === chooserQuery("players=4&gclid=b"));
check("chooserQuery: nothing", chooserQuery("?utm_source=x") === "" && chooserQuery("") === "");

/* --------------------------------- analytics URL cleaner keeps answers */

// lib/analyticsPreference.ts strips unknown parameters before analytics
// loads (and again when a consented tab comes back). It must keep every
// answer the chooser writes, on the chooser's route only, and nothing the
// chooser would refuse. Run the real function against a stub window.
{
  const run = (href) => {
    let written = null;
    globalThis.window = {
      location: { href },
      history: { replaceState: (_state, _title, next) => (written = String(next)) },
    };
    dropUnusedQueryParams();
    delete globalThis.window;
    return written ?? href;
  };
  let lost = 0;
  for (const players of PLAYER_COUNTS)
    for (const partners of [null, "solo", "teams", "either"])
      for (const handicaps of [null, "close", "apart", "none"])
        for (const scoring of [null, "simple", "more"])
          for (const holes of [null, "18", "9"]) {
            const query = serializeAnswers({ players, partners, handicaps, scoring, holes });
            const href = `https://www.golo.golf${CHOOSER_PATH}${query}&utm_source=newsletter`;
            if (run(href) !== href) lost++;
          }
  check("cleaner keeps every chooser answer set on /games/chooser", lost === 0, `${lost} stripped`);
  check("cleaner drops invalid chooser values",
    run(`https://www.golo.golf${CHOOSER_PATH}?players=5551234567&partners=solo`) === `https://www.golo.golf${CHOOSER_PATH}?partners=solo`);
  check("cleaner drops chooser params on other routes",
    run("https://www.golo.golf/games?players=4&filter=match") === "https://www.golo.golf/games?filter=match");
  check("isKeptQueryParam: route-scoped", isKeptQueryParam("holes", "9", CHOOSER_PATH) && !isKeptQueryParam("holes", "9", "/blog"));
  // Duplicates: the parser reads an answer given twice only if both agree.
  const base = `https://www.golo.golf${CHOOSER_PATH}`;
  check("cleaner keeps one copy of an agreed duplicate",
    parseAnswers(new URL(run(`${base}?players=4&players=4&holes=9`)).search).answers.players === 4
      && new URL(run(`${base}?players=4&players=4&holes=9`)).searchParams.getAll("players").length === 1);
  check("cleaner drops a disputed duplicate, keeps the rest",
    run(`${base}?players=4&players=5&holes=9`) === `${base}?holes=9`);
  check("cleaner drops a duplicate with one bad copy",
    run(`${base}?players=4&players=99&holes=9`) === `${base}?holes=9`);
  check("cleaner leaves campaign duplicates as before",
    run(`${base}?utm_source=a&utm_source=b&players=4`) === `${base}?utm_source=a&utm_source=b&players=4`);
  check("cleaner strips personal-looking and foreign params on the chooser",
    run(`${base}?players=4&email=a%40b.com&fbclid=xyz`) === `${base}?players=4`);
  // Whatever the cleaner leaves, the chooser reads the same answers from.
  let disagree = 0;
  for (const query of ["players=4&players=4", "players=4&players=5", "partners=solo&partners=SOLO", "holes=9&holes=9&holes=18", "players=12&scoring=simple&scoring=simple"]) {
    const before = parseAnswers(query).answers;
    const after = parseAnswers(new URL(run(`${base}?${query}`)).search);
    if (!sameAnswers(before, after.answers) || after.dropped.length) disagree++;
  }
  check("cleaned URL reads as the original did, with nothing left to drop", disagree === 0, `${disagree} differ`);
}

/* ------------------------------------------------- GoLo lines vs registry */

const registryText = new Set(
  capabilities.flatMap((c) => [c.summary, ...(c.limits ?? [])]),
);
{
  const notRegistry = [];
  for (const [id, format] of Object.entries(chooserCopy.formats)) {
    for (const line of format.golo.lines) {
      // Nines isn't in the registry, so its one line is the chooser's own.
      if (id === "nines") continue;
      if (!registryText.has(line.text)) notRegistry.push(`${id}: ${line.text.slice(0, 50)}`);
    }
  }
  check("every GoLo line is registry text", notRegistry.length === 0, notRegistry.join(" | "));
  // It once listed GoLo's games from one registry label and left out the
  // scramble and team play. It names no games now, so it can't fall behind.
  const ninesLine = chooserCopy.formats.nines.golo.lines;
  check(
    "Nines says GoLo doesn't score it, without listing GoLo's games",
    ninesLine.length === 1 &&
      /^Not a game GoLo scores\./.test(ninesLine[0].text) &&
      !capabilities.some((c) => c.label.length > 12 && ninesLine[0].text.includes(c.label)),
    ninesLine.map((l) => l.text).join(" | "),
  );
}
{
  const cap = (id) => capabilities.find((c) => c.id === id);
  const limits = (id) => cap(id).limits ?? [];
  check("registry: no teams means two to four players", limits("game-library").some((l) => l.includes("two to four players")));
  check("registry: Wolf exactly four", limits("game-library").some((l) => l.startsWith("Wolf takes exactly four players")));
  check("registry: Team Play exactly four", limits("team-play").some((l) => l.startsWith("Exactly four players")));
  check("registry: scramble up to 12", cap("scramble").summary.startsWith("Up to 12 players"));
  check("registry: Nassau takes no presses", limits("overall-match-presses").some((l) => l.startsWith("Nassau doesn")));
  for (const id of ["game-library", "team-play", "scramble", "overall-match-presses", "nine-hole-rounds", "live-skins", "guests"]) {
    check(`registry: ${id} is live`, cap(id).status === "live");
  }
  // Every verdict comes from the registry status, never from the copy.
  for (const id of FORMAT_IDS) {
    const golo = chooserCopy.formats[id].golo;
    check(`${id}: GoLo status is the registry's`, golo.capability === null ? golo.status === null : golo.status === cap(golo.capability).status);
  }
  check("Nines has no GoLo capability", chooserCopy.formats.nines.golo.capability === null);
  {
    const games = cap("game-library").label.toLowerCase();
    for (const id of FORMAT_IDS) {
      if (chooserCopy.formats[id].golo.capability !== "game-library") continue;
      const name = chooserCopy.formats[id].name.toLowerCase();
      check(`${id}: named in the registry's game list`, games.includes(name), `${name} not in "${games}"`);
    }
    check("Nines isn't in the registry's game list", !games.includes("nines"));
  }
  {
    // Move a capability's status in a copy of the copy: the verdict follows.
    const labels = chooserCopy.golo;
    const best = chooserCopy.formats["best-score"].golo;
    check("verdict: live, in range, scored", eq(goloVerdict(best, 4, labels), { scored: true, label: labels.scored }));
    check("verdict: live, out of range, not one game", eq(goloVerdict(best, 5, labels), { scored: false, label: labels.notOneGame }));
    check("verdict: testing is never scored", eq(goloVerdict({ ...best, status: "testing" }, 4, labels), { scored: false, label: labels.testing }));
    for (const status of ["planned", "not-offered", null]) {
      check(`verdict: ${status} is not scored`, eq(goloVerdict({ ...best, status }, 4, labels), { scored: false, label: labels.notScored }));
    }
    const rule = FORMAT_RULES.find((r) => r.id === "best-score");
    check("table: a testing capability says so", goloCell(rule, { ...best, status: "testing" }, chooserTable.words.golo) === chooserTable.words.golo.testing);
  }
  // scoredFor ranges are the registry's own numbers.
  check("registry ranges: solo games are 2 to 4",
    FORMAT_IDS.every((id) => {
      const golo = chooserCopy.formats[id].golo;
      return !golo.scoredFor || (golo.scoredFor.min === 2 && golo.scoredFor.max === 4 && golo.capability === "game-library");
    }));
  // The table's derived cells agree with the cards for every group size.
  for (const rule of FORMAT_RULES) {
    const golo = chooserCopy.formats[rule.id].golo;
    const cell = goloCell(rule, golo, chooserTable.words.golo);
    const scoredAt = [];
    for (let players = rule.players.min; players <= rule.players.max; players++) {
      if (view.pickView(rule.id, 1, [], { ...NO_ANSWERS, players }, chooserCopy).golo.scored) scoredAt.push(players);
    }
    const expected = !scoredAt.length
      ? chooserTable.words.golo.no
      : scoredAt.length === rule.players.max - rule.players.min + 1
        ? chooserTable.words.golo.yes
        : chooserTable.words.golo.yesFor.replace("{min}", String(scoredAt[0])).replace("{max}", String(scoredAt.at(-1)));
    check(`table ${rule.id}: In GoLo matches the cards`, cell === expected, `${cell} vs ${expected}`);
    // "Simple?" says yes exactly where "keep it simple" keeps the format.
    const simpleAt = [];
    for (let players = rule.players.min; players <= rule.players.max; players++) {
      if (!ask({ players, scoring: "simple" }).ruledOut.some((r) => r.id === rule.id)) simpleAt.push(players);
    }
    const s = simpleCell(rule, chooserTable.words.simple);
    const w = chooserTable.words.simple;
    const all = simpleAt.length === rule.players.max - rule.players.min + 1;
    check(`table ${rule.id}: Simple? matches the rule`,
      all ? s === w.always : !simpleAt.length ? s === w.never : s.includes(String(simpleAt.at(-1))), `${s} vs ${JSON.stringify(simpleAt)}`);
    const strokes = chooserTableCells[rule.id].strokes;
    check(`table ${rule.id}: strokes cell agrees with the rule`,
      (strokes === "None") === Boolean(rule.noStrokes) && (strokes === "Team handicap") === Boolean(rule.setNumbers), strokes);
  }
  check("table: expected In GoLo cells",
    eq(Object.fromEntries(FORMAT_RULES.map((r) => [r.id, goloCell(r, chooserCopy.formats[r.id].golo, chooserTable.words.golo)])), {
      "best-score": "Yes, 2–4 players",
      skins: "Yes, 2–4 players",
      nassau: "Yes",
      "best-ball": "Yes",
      scramble: "Yes",
      "bingo-bango-bongo": "Yes",
      wolf: "Yes",
      nines: "No",
    }));
  check("Nassau GoLo line names the presses limit at 9 holes too",
    view.pickView("nassau", 1, [], { ...NO_ANSWERS, players: 2, holes: "9" }, chooserCopy).golo.lines.some((l) => l.text.startsWith("Over nine holes a Nassau")));
  check("scramble: uneven-teams line at 5, 7, 11 only",
    PLAYER_COUNTS.filter((p) => p >= 4).every((p) => {
      const lines = view.pickView("scramble", 1, [], { ...NO_ANSWERS, players: p }, chooserCopy).golo.lines;
      return lines.some((l) => l.text.startsWith("Teams of different sizes")) === !evenTeams(p);
    }));
  check("evenTeams", eq(PLAYER_COUNTS.filter((p) => !evenTeams(p)), [2, 3, 5, 7, 11]));
}

/* --------------------------------------------------------------- links */

{
  const appDir = join(root, "app");
  const routes = new Set(["/"]);
  const walk = (dir, rel = "") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name), entry.name.startsWith("(") ? rel : `${rel}/${entry.name}`);
      else if (entry.name === "page.tsx" && !rel.includes("[")) routes.add(rel || "/");
    }
  };
  walk(appDir);
  for (const p of publishedPosts) routes.add(`/blog/${p.slug}`);
  for (const s of gameDetailSlugsWithContent) routes.add(`/games/${s}`);
  const glossarySlugs = new Set(glossaryLive ? publishedGlossaryTerms().map((t) => t.slug) : []);
  const blog = readFileSync(join(root, "lib/content/blog.ts"), "utf8");

  const hrefs = [];
  for (const [id, f] of Object.entries(chooserCopy.formats)) {
    hrefs.push([id, f.guide.href]);
    if (f.more) hrefs.push([id, f.more.href]);
    for (const line of [...f.agree, ...f.summary, ...f.tradeoff, ...f.fit, ...Object.values(f.reasons).flat()]) {
      for (const link of line.links ?? []) hrefs.push([id, link.href]);
    }
  }
  for (const item of [...chooserKeepReading.items, ...chooserSideGames.items]) hrefs.push(["page", item.href]);
  hrefs.push(["teaser", chooserTeaser.href]);

  for (const [owner, href] of hrefs) {
    const [path, fragment] = href.split("#");
    if (path === "/glossary") {
      check(`${owner}: ${href} is a published glossary term`, glossarySlugs.has(fragment), href);
      continue;
    }
    check(`${owner}: ${href} is served`, routes.has(path), href);
    if (fragment && path.startsWith("/blog/")) {
      // Post section ids are `id: "<fragment>"` in blog.ts, inside that post.
      const slug = path.slice("/blog/".length);
      const start = blog.indexOf(`slug: "${slug}"`);
      const next = blog.indexOf('\n    slug: "', start + 1);
      const body = blog.slice(start, next === -1 ? undefined : next);
      check(`${owner}: ${href} anchor exists`, body.includes(`id: "${fragment}"`), href);
    }
  }
  check("the chooser route exists", routes.has("/games/chooser"));
  check("Nassau points to the press post and glossary entry",
    ["/blog/pressing", "/glossary#press"].every((h) => hrefs.some(([owner, href]) => owner === "nassau" && href === h)));
}

/* ------------------------------------------------------- worked example */

{
  const r = choose(chooserExample.answers);
  check("worked example: still what the prose says",
    r.status === "ok" && eq(r.picks.map((p) => p.id), chooserExample.expected), JSON.stringify(r.picks?.map((p) => p.id)));
  check("worked example: best ball also fits", r.status === "ok" && eq(r.alsoFits, ["best-ball"]));
  // 0.35 × 6 + 0.15 × 24 = 5.7 → 6; 0.35 × 12 + 0.15 × 18 = 6.9 → 7.
  const team = (low, high) => Math.round(0.35 * low + 0.15 * high);
  check("worked example: team handicaps", team(6, 24) === 6 && team(12, 18) === 7);
  check("worked example: prose names the numbers", chooserExample.math.includes("5.7") && chooserExample.math.includes("6.9"));
}

/* --------------------------------------------------------------- result */

if (failures.length) {
  console.error(`Chooser tests failed (${failures.length}):\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`✔ Chooser: ${passed} checks passed`);
