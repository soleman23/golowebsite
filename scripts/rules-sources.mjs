/**
 * The R&A source checks behind scripts/check-rules-sources.mjs and the page
 * text scripts/check-rules-copy.mjs caches (#245). Apart from fetchPages,
 * pure: pages come in as HTML strings, problems go out as lines, so
 * scripts/test-rules-sources.mjs runs the same checks on synthetic pages.
 *
 * Nothing here stores or prints rule text. The hashes are of each page's
 * own text; the copy check's cache is git-ignored and stays on the machine.
 */

import { createHash } from "node:crypto";

/* --------------------------------------------------------------- network */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One page as { status, html } or { error }, retried twice for a dropped
 * connection, a 429 or a 5xx. A redirect is returned, not followed: a moved
 * page is a problem to look at.
 */
async function fetchPage(url) {
  let last;
  for (const wait of [0, 3000, 10000]) {
    if (wait) await sleep(wait);
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "golo-rules-source-check (+https://www.golo.golf)" },
        redirect: "manual",
        signal: AbortSignal.timeout(30000),
      });
      last = { status: res.status, html: res.status === 200 ? await res.text() : "" };
      if (res.status !== 429 && res.status < 500) return last;
    } catch (err) {
      last = { error: `fetch failed (${err.cause?.code ?? err.name})` };
    }
  }
  return last;
}

/** url → page, four at a time. */
export async function fetchPages(urls) {
  const pages = new Map();
  const queue = [...urls];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) pages.set(url, await fetchPage(url));
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  return new Map(urls.map((url) => [url, pages.get(url)]));
}

/* ------------------------------------------------------------------ HTML */

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—",
  hellip: "…", copy: "©", reg: "®", trade: "™", deg: "°", frac12: "½",
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, name) => {
    if (name[0] === "#") {
      const code = name[1] === "x" || name[1] === "X" ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    }
    return NAMED_ENTITIES[name.toLowerCase()] ?? whole;
  });
}

/** NFC, one space between words, no ends. */
export const squash = (text) => text.normalize("NFC").replace(/\s+/g, " ").trim();

/** The markup a reader sees: no head, site header, footer, scripts or icons. */
function bodyMarkup(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<head\b[\s\S]*?<\/head>/gi, " ")
    .replace(/<(script|style|noscript|template|svg|header|footer)\b[\s\S]*?<\/\1>/gi, " ");
}

/** The page's visible text, as one normalised line: the fallback when a page has no data. */
export function visibleText(html) {
  return squash(decodeEntities(bodyMarkup(html).replace(/<[^>]*>/g, " ")));
}

/* ------------------------------------------------------------ page text */

/*
 * The R&A site is a Next.js app: each page ships the content it renders as
 * `__NEXT_DATA__` pageProps, including text the markup leaves out (the
 * Definitions' statements, a rule's Interpretations, the Model Local
 * Rules). A rule page's data also carries the rules either side of it, its
 * menus, a pool of diagrams shared with nearby rules and the list of all 25
 * rules, so the text is read from the page's own item only. Otherwise an
 * edit to Rule 19 would report Rules 18, 19 and 20 as changed.
 */

/** pageProps, or null when the page has no Next.js data. */
export function pageData(html) {
  const m = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!m) return null;
  try {
    return JSON.parse(m[1])?.props?.pageProps ?? null;
  } catch {
    return null;
  }
}

/** Not the item's own text: neighbours, menus, shared diagrams, links, CMS metadata. */
const NOT_OWN = new Set([
  "nextRule", "previousRule", "ruleMenuData", "linkedItems", "availableInternalLinks",
  "system", "metadata", "url", "urlTag", "headerTheme", "ruleFor",
]);
/** Fields whose `value` is text a reader sees. */
const TEXT_FIELDS = new Set(["number", "title", "description", "purposeStatement", "headerDescription", "term", "definitionText"]);

const plain = (value) => squash(decodeEntities(value.replace(/<[^>]*>/g, " ")));

/** An item's own text, one string per field, in page order. */
function itemText(node, out = []) {
  if (Array.isArray(node)) node.forEach((child) => itemText(child, out));
  else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (NOT_OWN.has(key)) continue;
      if (TEXT_FIELDS.has(key) && typeof value?.value === "string") {
        const text = plain(value.value);
        if (text) out.push(text);
      } else itemText(value, out);
    }
  }
  return out;
}

/**
 * A rule page's own text (also Committee Procedures Section 8, which has the
 * same shape): its title, purpose, subrules, sections and Interpretations.
 * Null when the data isn't there.
 */
export function ruleText(html) {
  const rule = pageData(html)?.ruleOfGolf;
  const text = rule ? itemText(rule) : [];
  return text.length ? text : null;
}

/** The Definitions page's terms → each term's text (the term, then its definition). */
export function definitions(html) {
  const byLetter = pageData(html)?.rulesSummary?.definitions;
  const terms = new Map();
  if (!byLetter || typeof byLetter !== "object") return terms;
  for (const entries of Object.values(byLetter)) {
    for (const entry of Array.isArray(entries) ? entries : []) {
      const term = typeof entry?.term?.value === "string" ? plain(entry.term.value) : "";
      if (term) terms.set(term, itemText(entry));
    }
  }
  return terms;
}

/** One Model Local Rule's own text ("E-5"), found by its number, or null. */
export function localRuleText(html, code) {
  let found = null;
  const walk = (node) => {
    if (found || !node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.number?.value === code && node.description) {
      found = itemText(node);
      return;
    }
    for (const [key, value] of Object.entries(node)) if (!NOT_OWN.has(key)) walk(value);
  };
  walk(pageData(html)?.ruleOfGolf);
  return found?.length ? found : null;
}

/** The text a hash covers: one item per line. */
export const hashText = (lines) => sha256(lines.join("\n"));

export const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/* ----------------------------------------------------------- page facts */

/** Rule number → title, from the index's links to the rule pages. */
export function indexTitles(html) {
  const titles = new Map();
  const re = /<a\b[^>]*\bhref="(?:https:\/\/www\.randa\.org)?(?:\/en)?\/rog\/the-rules-of-golf\/rule-(\d+)"[^>]*>([^<]+)</g;
  for (const m of bodyMarkup(html).matchAll(re)) {
    const title = squash(decodeEntities(m[2]));
    // "Read more" links point at the same page.
    if (title && title !== "Read more" && !titles.has(Number(m[1]))) titles.set(Number(m[1]), title);
  }
  return titles;
}

/** Every `id` attribute on the page (not `data-id` and the like). */
export function pageIds(html) {
  return new Set([...html.matchAll(/(?<![\w-])id="([^"]+)"/g)].map((m) => m[1]));
}

/** The subrule ids ("2", "2b") a rule page carries as `id="N_xy"`. */
export function pageSubrules(html, rule) {
  const ids = new Set();
  for (const id of pageIds(html)) {
    const m = /^(\d{1,2})_(\d{1,2}[a-z]?)$/.exec(id);
    if (m && Number(m[1]) === rule) ids.add(m[2]);
  }
  return ids;
}

/* ---------------------------------------------------------------- checks */

/*
 * `input` is what the check expects, from lib/content/rules or a fixture:
 * - `indexUrl`, `definitionsUrl`, `localRulesUrl`: the R&A pages;
 * - `ruleUrl(n)`: a rule's page;
 * - `rules`: officialRules (number → { title, subrules });
 * - `records`: every overview and situation, any status;
 * - `hashes`: lib/content/rules/source-hashes.json's `pages` (url → sha256).
 */

/** What the records cite on the R&A site: pages and anchors, defined terms, Model Local Rules. */
export function expectedSources({ records, definitionsUrl, localRulesUrl }) {
  const cited = new Map(); // url → anchor ("" for the page itself) → record ids
  const terms = new Map(); // "Relief Area" → record ids
  const localRules = new Map(); // "E-5" → record ids
  const add = (map, key, id) => {
    if (!map.has(key)) map.set(key, []);
    if (!map.get(key).includes(id)) map.get(key).push(id);
  };
  for (const record of records) {
    for (const source of record.sources) {
      if (source.authority !== "RANDA") continue;
      if (!cited.has(source.url)) cited.set(source.url, new Map());
      add(cited.get(source.url), source.anchor ?? "", record.id);
      if (source.document === "definitions" && source.url === definitionsUrl) {
        add(terms, source.ruleRef.replace(/^Definitions:\s*/, ""), record.id);
      }
      if (source.document === "local-rule" && source.url === localRulesUrl) {
        add(localRules, source.ruleRef.replace(/^MLR\s*/, ""), record.id);
      }
    }
  }
  return { cited, terms, localRules };
}

/** The URLs the check fetches, in a stable order: index, rules, the rest. */
export function urlsToFetch(input) {
  const { cited } = expectedSources(input);
  const urls = [
    input.indexUrl,
    ...Object.keys(input.rules).map((n) => input.ruleUrl(Number(n))),
    input.definitionsUrl,
    input.localRulesUrl,
    ...cited.keys(),
  ];
  return [...new Set(urls)];
}

/**
 * What gets a hash: each rule page, the Definitions, and each Model Local
 * Rule a record cites ("<url>#E-5": the code, not a real fragment).
 */
export function hashedKeys(input) {
  const { localRules } = expectedSources(input);
  return [
    ...Object.keys(input.rules).map((n) => input.ruleUrl(Number(n))),
    input.definitionsUrl,
    ...[...localRules.keys()].map((code) => `${input.localRulesUrl}#${code}`),
  ];
}

/**
 * Every problem, one line each, given `pages` (url → { status, html } or
 * { error }). `changed` is the subset that is only text changing, which is
 * all --update may accept; `hashes` is the live hash of each key.
 */
export function checkSources(input, pages) {
  const problems = [];
  const ok = (url) => {
    const page = pages.get(url);
    return page && !page.error && page.status === 200;
  };
  const live = new Map(); // hash key → the text it covers, one item per line

  // Every page answers.
  for (const url of urlsToFetch(input)) {
    const page = pages.get(url);
    if (!page) problems.push(`${url}: not fetched`);
    else if (page.error) problems.push(`${url}: ${page.error}`);
    else if (page.status !== 200) problems.push(`${url}: HTTP ${page.status}`);
  }

  // Titles: the index against officialRules, both ways.
  if (ok(input.indexUrl)) {
    const titles = indexTitles(pages.get(input.indexUrl).html);
    if (titles.size === 0) {
      problems.push(`${input.indexUrl}: no rule titles found (the page's markup has changed)`);
    } else {
      for (const [n, rule] of Object.entries(input.rules)) {
        const title = titles.get(Number(n));
        if (title === undefined) problems.push(`Rule ${n}: not on the index`);
        else if (title !== squash(rule.title)) {
          problems.push(`Rule ${n}: title is now "${title}" (official.ts has "${rule.title}")`);
        }
      }
      for (const [n, title] of titles) {
        if (!input.rules[n]) problems.push(`Rule ${n}: new on the index ("${title}")`);
      }
    }
  }

  // Each rule page: its anchors against its subrules, both ways, and its text.
  for (const [n, rule] of Object.entries(input.rules)) {
    const url = input.ruleUrl(Number(n));
    if (!ok(url)) continue;
    const html = pages.get(url).html;
    const ids = pageSubrules(html, Number(n));
    const missing = rule.subrules.filter((s) => !ids.has(s)).map((s) => `${n}_${s}`);
    const added = [...ids].filter((s) => !rule.subrules.includes(s)).map((s) => `${n}_${s}`);
    const s = (list) => (list.length > 1 ? "s" : "");
    if (missing.length) problems.push(`Rule ${n}: anchor${s(missing)} ${missing.join(" ")} gone from ${url}`);
    if (added.length) problems.push(`Rule ${n}: new anchor${s(added)} ${added.join(" ")} on ${url}, not in official.ts`);
    const text = ruleText(html);
    if (text) live.set(url, text);
    else problems.push(`${url}: no rule text in the page data (the page's markup has changed)`);
  }

  const { cited, terms, localRules } = expectedSources(input);

  // Every anchor a record cites is on the page it names.
  for (const [url, anchors] of cited) {
    if (!ok(url)) continue;
    const ids = pageIds(pages.get(url).html);
    for (const [anchor, citedBy] of anchors) {
      if (anchor && !ids.has(anchor)) {
        problems.push(`${url}#${anchor}: not on the page (cited by ${citedBy.join(", ")})`);
      }
    }
  }

  // Definitions: each cited term is a defined term.
  if (ok(input.definitionsUrl)) {
    const defined = definitions(pages.get(input.definitionsUrl).html);
    if (defined.size === 0) {
      problems.push(`${input.definitionsUrl}: no defined terms in the page data (the page's markup has changed)`);
    } else {
      live.set(input.definitionsUrl, [...defined.values()].flat());
      for (const [term, ids] of terms) {
        if (!defined.has(term)) problems.push(`Definitions: "${term}" not found (cited by ${ids.join(", ")})`);
      }
    }
  }

  // Model Local Rules: each cited code is an item in the page data.
  if (ok(input.localRulesUrl)) {
    const html = pages.get(input.localRulesUrl).html;
    for (const [code, ids] of localRules) {
      const text = localRuleText(html, code);
      if (text) live.set(`${input.localRulesUrl}#${code}`, text);
      else problems.push(`Model Local Rules: "${code}" not found (cited by ${ids.join(", ")})`);
    }
  }

  // Text: each item against its accepted hash.
  const hashes = {};
  const changed = [];
  const keys = hashedKeys(input);
  for (const key of keys) {
    if (!live.has(key)) continue;
    hashes[key] = hashText(live.get(key));
    const accepted = input.hashes[key];
    if (accepted === undefined) changed.push(`${key}: no accepted hash (run with --update after reading the page)`);
    else if (accepted !== hashes[key]) changed.push(`${key}: text changed since the accepted hash`);
  }
  for (const key of Object.keys(input.hashes)) {
    if (!keys.includes(key)) changed.push(`${key}: has an accepted hash but isn't checked any more (run with --update)`);
  }

  return { problems: [...problems, ...changed], changed, hashes };
}

/**
 * Why --update may not accept these hashes, or null if it may: only text
 * changes can be accepted, and only with every item read.
 */
export function updateRefusal(input, { problems, changed, hashes }) {
  if (problems.length > changed.length) return "only text changes can be accepted. Fix the other problems first.";
  const missing = hashedKeys(input).filter((key) => !hashes[key]);
  if (missing.length) return `${missing.join(", ")} couldn't be read.`;
  return null;
}

/* ---------------------------------------------------------- copy distance */

/** The longest run of words copy may share with the official text, plus one. */
export const COPY_RUN = 8;

/** Lowercase, no accents, no apostrophes; anything else separates words. */
export const copyWords = (text) =>
  text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['‘’ʼ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/** Every COPY_RUN-word window of the official pages ({ name, text }) → the first page it's on. */
export function officialRuns(pages) {
  const runs = new Map();
  for (const { name, text } of pages) {
    const w = copyWords(text);
    for (let i = 0; i + COPY_RUN <= w.length; i++) {
      const key = w.slice(i, i + COPY_RUN).join(" ");
      if (!runs.has(key)) runs.set(key, name);
    }
  }
  return runs;
}

/**
 * The runs of COPY_RUN or more words `copy` shares with `runs`, as
 * { length, page, text }. Overlapping windows merge into one run; two runs
 * that only touch stay two.
 */
export function sharedRuns(copy, runs) {
  const w = copyWords(copy);
  const found = [];
  let run = null;
  for (let i = 0; i + COPY_RUN <= w.length; i++) {
    const page = runs.get(w.slice(i, i + COPY_RUN).join(" "));
    if (!page) continue;
    if (run && i < run.end) run.end = i + COPY_RUN;
    else {
      if (run) found.push(run);
      run = { start: i, end: i + COPY_RUN, page };
    }
  }
  if (run) found.push(run);
  return found.map(({ start, end, page }) => ({ length: end - start, page, text: w.slice(start, end).join(" ") }));
}
