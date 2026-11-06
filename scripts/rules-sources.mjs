/**
 * The R&A source checks behind scripts/check-rules-sources.mjs and the page
 * text scripts/check-rules-copy.mjs caches (#245). Apart from fetchPages,
 * pure: pages come in as HTML strings, problems go out as lines, so
 * scripts/test-rules-sources.mjs runs the same checks on synthetic pages.
 *
 * Nothing here stores or prints rule text. Hashes are of the page's text;
 * the copy check's cache is git-ignored and stays on the machine.
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

/** The page's visible text, as one normalised line. What the hashes cover. */
export function visibleText(html) {
  return squash(decodeEntities(bodyMarkup(html).replace(/<[^>]*>/g, " ")));
}

/** Every text node of the body, decoded and squashed, for exact-match checks. */
function textNodes(html) {
  const nodes = new Set();
  for (const m of bodyMarkup(html).matchAll(/>([^<]+)</g)) {
    const text = squash(decodeEntities(m[1]));
    if (text) nodes.add(text);
  }
  return nodes;
}

/**
 * The prose a Next.js page ships in its data (`__NEXT_DATA__` pageProps)
 * rather than its markup: the Definitions' statements, a rule's
 * Interpretations, the Model Local Rules. Rich-text strings only, tags
 * stripped, each once, in page order.
 */
export function dataText(html) {
  const m = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!m) return "";
  let props;
  try {
    props = JSON.parse(m[1])?.props?.pageProps;
  } catch {
    return "";
  }
  const seen = new Set();
  const walk = (value) => {
    if (typeof value === "string") {
      if (/<[a-z][^>]*>/i.test(value)) {
        const text = squash(decodeEntities(value.replace(/<[^>]*>/g, " ")));
        if (text) seen.add(text);
      }
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(props);
  return [...seen].join(" ");
}

/** What the hashes cover and the copy check compares with: the visible text, then the data's prose. */
export const pageText = (html) => squash(`${visibleText(html)} ${dataText(html)}`);

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

/** The pages whose text is hashed: the rule pages and the Definitions. */
export function hashedUrls(input) {
  return [...Object.keys(input.rules).map((n) => input.ruleUrl(Number(n))), input.definitionsUrl];
}

/**
 * Every problem, one line each, given `pages` (url → { status, html } or
 * { error }). Also returns the live hashes, which --update writes.
 */
export function checkSources(input, pages) {
  const problems = [];
  const ok = (url) => {
    const page = pages.get(url);
    return page && !page.error && page.status === 200;
  };

  // Every page answers.
  for (const url of urlsToFetch(input)) {
    const page = pages.get(url);
    if (!page) problems.push(`${url}: not fetched`);
    else if (page.error) problems.push(`${url}: ${page.error}`);
    else if (page.status !== 200) problems.push(`${url}: HTTP ${page.status}`);
  }

  // Titles: the index against officialRules, both ways.
  if (ok(input.indexUrl)) {
    const live = indexTitles(pages.get(input.indexUrl).html);
    if (live.size === 0) {
      problems.push(`${input.indexUrl}: no rule titles found (the page's markup has changed)`);
    } else {
      for (const [n, rule] of Object.entries(input.rules)) {
        const title = live.get(Number(n));
        if (title === undefined) problems.push(`Rule ${n}: not on the index`);
        else if (title !== squash(rule.title)) {
          problems.push(`Rule ${n}: title is now "${title}" (official.ts has "${rule.title}")`);
        }
      }
      for (const [n, title] of live) {
        if (!input.rules[n]) problems.push(`Rule ${n}: new on the index ("${title}")`);
      }
    }
  }

  // Anchors: each rule page's ids against its subrules, both ways.
  for (const [n, rule] of Object.entries(input.rules)) {
    const url = input.ruleUrl(Number(n));
    if (!ok(url)) continue;
    const live = pageSubrules(pages.get(url).html, Number(n));
    const missing = rule.subrules.filter((s) => !live.has(s)).map((s) => `${n}_${s}`);
    const added = [...live].filter((s) => !rule.subrules.includes(s)).map((s) => `${n}_${s}`);
    const s = (list) => (list.length > 1 ? "s" : "");
    if (missing.length) problems.push(`Rule ${n}: anchor${s(missing)} ${missing.join(" ")} gone from ${url}`);
    if (added.length) problems.push(`Rule ${n}: new anchor${s(added)} ${added.join(" ")} on ${url}, not in official.ts`);
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

  // Definitions: each cited term is a text node on the page.
  if (ok(input.definitionsUrl)) {
    const nodes = textNodes(pages.get(input.definitionsUrl).html);
    for (const [term, ids] of terms) {
      if (!nodes.has(term)) problems.push(`Definitions: "${term}" not found (cited by ${ids.join(", ")})`);
    }
  }

  // Model Local Rules: the page renders client-side, so look in its data.
  if (ok(input.localRulesUrl)) {
    const html = pages.get(input.localRulesUrl).html;
    for (const [code, ids] of localRules) {
      const re = new RegExp(`(?<![A-Za-z0-9-])${code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![0-9A-Za-z])`);
      if (!re.test(html)) problems.push(`Model Local Rules: "${code}" not found (cited by ${ids.join(", ")})`);
    }
  }

  // Text: each hashed page against the accepted hash.
  const hashes = {};
  for (const url of hashedUrls(input)) {
    if (!ok(url)) continue;
    hashes[url] = sha256(pageText(pages.get(url).html));
    const accepted = input.hashes[url];
    if (accepted === undefined) problems.push(`${url}: no accepted hash (run with --update after reading the page)`);
    else if (accepted !== hashes[url]) problems.push(`${url}: text changed since the accepted hash`);
  }
  for (const url of Object.keys(input.hashes)) {
    if (!hashedUrls(input).includes(url)) problems.push(`${url}: accepted hash for a page no longer checked (run with --update)`);
  }

  return { problems, hashes };
}

/* ---------------------------------------------------------- copy distance */

/** The longest run of words copy may share with the official text, plus one. */
export const COPY_RUN = 8;

/** Lowercase, no accents, no apostrophes; anything else separates words. */
export const copyWords = (text) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2018\u2019\u02bc]/g, "")
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
