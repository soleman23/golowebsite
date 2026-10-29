#!/usr/bin/env node
/**
 * Content checks that copy review keeps missing. `npm run lint` runs this, and
 * CI runs it as its own step.
 *
 * 1. Claims. lib/content/capabilities.ts records what GoLo does. For every
 *    capability that isn't live, its `claimPhrases` may not appear in site
 *    copy as something GoLo does. A phrase passes only when its own clause
 *    denies it: a negation in front of it ("no GPS yardages", "doesn't do
 *    today: automatic presses, …"; "and", "but", "so" and ";" end its reach)
 *    or a status in the same clause ("the iPhone app is coming to the App
 *    Store"; only ";", dashes and "but" end that clause, since "and" so
 *    often joins the very things being denied). In blog posts and game
 *    guides only copy about GoLo counts — a string that mentions GoLo or "the
 *    app" — so explaining an auto-press as golf is fine and saying GoLo does
 *    one is not. Glossary term records are education too, except their
 *    `goloNote`, which is always checked in full (scripts/content-claims.mjs).
 *    `claim-ok: <reason>` on a line (or the line above) and
 *    `claim-ok-file: <reason>` in a file's header exempt copy gated behind
 *    siteConfig.appLive and the like.
 * 2. Metadata. Search titles, meta descriptions and the site description —
 *    in pageMetadata({...}) calls and in `export const metadata` objects in
 *    pages and layouts — may not name a non-live capability at all, denied
 *    or not — a snippet has no
 *    room for the denial. Golf-education titles are held to that only when
 *    they're about GoLo: "Rangefinder or GPS watch?" names gear, not a GoLo
 *    feature.
 *    Overclaims work the same way for every capability, live or not: its
 *    `overclaims` are phrases that overstate what it does ("fewest payments"
 *    for a greedy settle-up). They fail anywhere in copy, blog posts
 *    included, unless the line carries claim-ok, and in metadata at all.
 * 3. Internal links. Every "/…" href in content and components, legal copy
 *    included, in any kind of string literal, must be a page or file the site
 *    serves: a static route, a route handler that answers GET (so not the
 *    POST-only form endpoints under /api), a published post, a game guide or
 *    a file in public/. Until the glossary is live (lib/content/glossary/
 *    launch.ts) nothing outside its own files may link to /glossary, and a
 *    /glossary#fragment must name a published term (scripts/glossary-checks.mjs).
 * 4. Report lists. Every published post and game guide must be in the lead
 *    report's landing-path allow-list (docs/seo-reports/leads.sql). It may
 *    keep a retired slug, since leads from before the page went still carry
 *    its path. Every published post and guide must also be in the URL
 *    Inspection lists in the Search Console run sheet
 *    (docs/seo-reports/gsc-revalidation.md), and they may list nothing else,
 *    but only until the date in its `url-list-checked-until` comment: after
 *    the run, those lists are a record of it.
 * 5. Glossary records. Unique ids, slugs, names and aliases; related ids,
 *    capability ids and paths that resolve; real dates in order; a review
 *    record on every approved or published term (lib/content/glossary/
 *    validate.ts, #155).
 *
 * Comments are ignored throughout. Exit 1 with one line per problem.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ABOUT_GOLO,
  claimProblems,
  lineAt,
  literalAt,
  phraseRegex,
  scan,
  stripComments,
} from "./content-claims.mjs";
import { glossaryHrefProblem } from "./glossary-checks.mjs";

const rootUrl = new URL("..", import.meta.url);
const root = fileURLToPath(rootUrl);
const read = (path) => readFileSync(join(root, path), "utf8");

/**
 * Node (>= 24) runs the content modules' TypeScript as-is by stripping the
 * types. What it can't do is resolve the project's "@/" alias or an
 * extensionless "./sibling" import the way Next does, so map both to the .ts
 * file here.
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

const { capabilities } = await import(
  new URL("../lib/content/capabilities.ts", import.meta.url).href
);
const { publishedPosts } = await import(
  new URL("../lib/content/blog.ts", import.meta.url).href
);
/** The glossary's records, its launch switch and its checks (#155). */
const {
  glossaryLive,
  glossaryTerms,
  publishedGlossaryTerms,
  validateGlossary,
} = await import(
  new URL("../lib/content/glossary/index.ts", import.meta.url).href
);
/** The guides the route, the sitemap and llms.txt serve. */
const { gameDetailSlugsWithContent: guideSlugs } = await import(
  new URL("../lib/content/gameDetail.ts", import.meta.url).href
);

/* ------------------------------------------------------------------ files */

function walk(dir, ext) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory()
      ? walk(path, ext)
      : ext.some((e) => name.endsWith(e))
        ? [path]
        : [];
  });
}

/** Every file with copy or links in it. */
const files = [
  ...walk("lib/content", [".ts"]),
  // The mockups' text and accessible names (soleman23/golowebsite#172).
  "lib/mockData.ts",
  ...walk("components", [".tsx"]),
  ...walk("app", [".tsx", ".ts"]),
];

/** Not product copy: the registry itself, legal text, and image alt text. */
const NOT_CLAIMS = new Set([
  "lib/content/capabilities.ts",
  "lib/content/legal.ts",
  "lib/content/heroPhotos.ts",
]);

/** Golf education: only copy about GoLo makes claims. */
const EDUCATION = new Set([
  "lib/content/blog.ts",
  "lib/content/gameDetail.ts",
  "lib/content/games.ts",
]);

/**
 * Glossary term records are education too: defining an automatic press or a
 * 90% allowance as golf is fine, saying GoLo does one is not. Their
 * `goloNote` fields get the full check (content-claims.mjs PRODUCT_FIELDS).
 * The hub's own copy (CTAs, labels) isn't under terms, so it's checked in
 * full like any page.
 */
const isEducation = (file) =>
  EDUCATION.has(file) ||
  file === "lib/content/glossary/terms.ts" ||
  file.startsWith("lib/content/glossary/terms/");


const problems = [];
const report = (file, line, message) =>
  problems.push(`${file}:${line}  ${message}`);

const notLive = capabilities.filter(
  (c) => c.status !== "live" && c.claimPhrases?.length,
);

/** Capabilities with phrases that overstate them, whatever their status. */
const overclaimed = capabilities.filter((c) => c.overclaims?.length);


/* ----------------------------------------------------------------- claims */

for (const file of files) {
  if (NOT_CLAIMS.has(file)) continue;
  const raw = read(file);
  if (raw.includes("claim-ok-file:")) continue;
  for (const { line, message } of claimProblems(file, raw, {
    notLive,
    overclaimed,
    education: isEducation(file),
  })) {
    report(file, line, message);
  }
}

/**
 * The default share card is a PNG rendered from this page, so its words ship
 * on every route without passing through the content files above.
 */
const SHARE_CARD = "scripts/og-image.html";
{
  const raw = read(SHARE_CARD);
  // Visible text only: no comments, styles, scripts or tags.
  const text = raw
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  for (const cap of overclaimed) {
    for (const phrase of cap.overclaims) {
      for (const m of text.matchAll(phraseRegex(phrase))) {
        report(SHARE_CARD, lineAt(raw, raw.indexOf(m[0])), `"${m[0]}" overstates ${cap.id} on the share card`);
      }
    }
  }
}

/* --------------------------------------------------------------- metadata */

/** A string literal's text: "…", '…' or `…` (with ${…} left as it is). */
const LITERAL =
  String.raw`"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|` +
  "`((?:[^`\\\\]|\\\\.)*)`";

/**
 * Every search title and description: the site description, each guide's
 * seoTitle and metaDescription, each post's own title, metaDescription, dek
 * and excerpt (top-level fields only, not section and card titles), the site
 * tagline (the default <title>), and the title and
 * description inside each page's pageMetadata({...}).
 */
function metadataStrings() {
  const out = [];
  const grab = (file, text, pattern, offset = 0) => {
    for (const m of text.matchAll(pattern)) {
      const value = m[2] ?? m[3] ?? m[4] ?? "";
      out.push({
        file,
        line: lineAt(read(file), offset + m.index),
        field: m[1],
        value,
      });
    }
  };
  const field = (names, indent) =>
    new RegExp(`^${indent}(${names.join("|")}):\\s*(?:${LITERAL})`, "gm");
  const source = (file) => stripComments(read(file), file);

  grab(
    "lib/siteConfig.ts",
    source("lib/siteConfig.ts"),
    field(["description", "tagline"], " {2}"),
  );
  grab(
    "lib/content/gameDetail.ts",
    source("lib/content/gameDetail.ts"),
    field(["seoTitle", "metaDescription"], " {2}"),
  );
  grab(
    "lib/content/blog.ts",
    source("lib/content/blog.ts"),
    field(["title", "metaDescription", "dek", "excerpt"], " {4}"),
  );

  // pageMetadata({...}) calls, and metadata objects exported directly.
  const METADATA_BLOCK =
    /pageMetadata\(\{[\s\S]*?\}\)|export\s+const\s+metadata\b[^=]*=\s*\{[\s\S]*?\n\};/g;
  for (const page of walk("app", ["page.tsx", "layout.tsx"])) {
    for (const call of source(page).matchAll(METADATA_BLOCK)) {
      grab(
        page,
        call[0],
        new RegExp(`\\b(title|description):\\s*(?:${LITERAL})`, "g"),
        call.index,
      );
    }
  }
  return out;
}

for (const { file, line, field, value } of metadataStrings()) {
  for (const cap of overclaimed) {
    for (const phrase of cap.overclaims) {
      if (phraseRegex(phrase).test(value)) {
        report(file, line, `${field} overstates ${cap.id}: "${value.slice(0, 120)}"`);
      }
    }
  }
  if (isEducation(file) && !ABOUT_GOLO.test(value)) continue;
  for (const cap of notLive) {
    for (const phrase of cap.claimPhrases) {
      if (phraseRegex(phrase).test(value)) {
        report(
          file,
          line,
          `${field} names ${cap.id} (${cap.status}), which isn't live: "${value.slice(0, 120)}"`,
        );
      }
    }
  }
}

/* ----------------------------------------------------------------- links */

/**
 * Static pages, and route handlers a link can open (they export GET), under
 * app/, route groups dropped.
 */
function staticRoutes() {
  const routes = new Set(["/"]);
  const answersGet = (file) =>
    /export\s+(?:async\s+)?function\s+GET\b|export\s+const\s+GET\b/.test(read(file));
  for (const entry of walk("app", ["page.tsx", "route.ts"])) {
    if (entry.endsWith("route.ts") && !answersGet(entry)) continue;
    const dir = relative("app", entry).split("/").slice(0, -1);
    if (dir.some((part) => part.startsWith("["))) continue;
    const path = dir.filter((part) => !/^\(.*\)$/.test(part)).join("/");
    routes.add(path ? `/${path}` : "/");
  }
  return routes;
}

/** Everything in public/ is served at its path. */
const publicFiles = walk("public", [""]).map(
  (path) => `/${relative("public", path)}`,
);

const pages = new Set([
  ...staticRoutes(),
  ...publicFiles,
  ...publishedPosts.map((p) => `/blog/${p.slug}`),
  ...guideSlugs.map((slug) => `/games/${slug}`),
]);

/**
 * href="/…", href={"/…"}, href: '/…', href={`/…`}, and the \"-escaped form
 * inside HTML strings. A template with ${…} in the path is dynamic; skipped.
 */
const HREF = /href\s*(?:=|:)\s*\{?\s*\\?(["'`])(\/[^"'`\\]*)/g;

const glossaryLinks = {
  live: glossaryLive,
  publishedSlugs: new Set(publishedGlossaryTerms().map((t) => t.slug)),
};

for (const file of files) {
  const text = stripComments(read(file), file);
  for (const m of text.matchAll(HREF)) {
    const href = m[2];
    if (href.includes("${")) continue;
    const glossaryProblem = glossaryHrefProblem(href, file, glossaryLinks);
    if (glossaryProblem) {
      report(file, lineAt(text, m.index), glossaryProblem);
      continue;
    }
    const target = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!pages.has(target)) {
      report(file, lineAt(text, m.index), `link to ${href}, which isn't a page`);
    }
  }
}

/* --------------------------------------------------------------- glossary */

/**
 * Glossary records (spec §8.4, #155): ids, slugs, names and aliases unique;
 * related ids, capability ids and paths resolve to records, the registry and
 * served pages; dates real and in order; approved and published records carry
 * their review record. Each problem names its record and points at its line.
 */
{
  const termFiles = files.filter(
    (f) => f === "lib/content/glossary/terms.ts" || f.startsWith("lib/content/glossary/terms/"),
  );
  const lineOf = (id) => {
    for (const file of termFiles) {
      const raw = read(file);
      const at = Math.max(raw.indexOf(`id: "${id}"`), raw.indexOf(`id: '${id}'`));
      if (at !== -1) return [file, lineAt(raw, at)];
    }
    return [termFiles[0] ?? "lib/content/glossary/terms.ts", 1];
  };
  const problemsFound = validateGlossary(glossaryTerms, {
    capabilities,
    servedPaths: pages,
    today: new Date().toISOString().slice(0, 10),
  });
  for (const problem of problemsFound) {
    const [file, line] = lineOf(problem.split(/[:,]/)[0]);
    report(file, line, `glossary ${problem}`);
  }
}

/* ----------------------------------------------------------- report lists */

/**
 * The lead report allow-lists landing paths, and the Search Console run sheet
 * lists the URLs to inspect. Both are written by hand, so a new post or guide
 * goes missing from them unless something checks. The lead report runs every
 * month, so it's always checked, against its live SQL only (comments are
 * blanked first), and a slug that's no longer served may stay: older leads
 * still carry the path. The run sheet is for one run: only its URL
 * Inspection section counts, and only until its `url-list-checked-until` date.
 */
const LEADS_SQL = "docs/seo-reports/leads.sql";
const RUN_SHEET = "docs/seo-reports/gsc-revalidation.md";
/** `--` comments blanked to spaces, so offsets and line numbers still match. */
const leadsSql = read(LEADS_SQL).replace(/--.*$/gm, (c) => " ".repeat(c.length));
const runSheetText = read(RUN_SHEET);
const inspection = runSheetText.match(/^### 3\. URL Inspection\n[\s\S]*?(?=^#{1,3} )/m);
const checkedUntil = inspection?.[0].match(
  /<!-- url-list-checked-until: (\d{4}-\d{2}-\d{2}) -->/,
)?.[1];
if (!inspection || !checkedUntil) {
  report(RUN_SHEET, 1, "no URL Inspection section with a url-list-checked-until date");
}
const today = new Date().toISOString().slice(0, 10);
const runSheet = checkedUntil && today <= checkedUntil ? inspection[0] : null;
const runSheetLine = inspection ? lineAt(runSheetText, inspection.index) : 1;

for (const [section, served] of [
  ["blog", publishedPosts.map((p) => p.slug)],
  ["games", guideSlugs],
]) {
  const allow = leadsSql.match(
    new RegExp(`'\\^/${section}/\\(([a-z0-9|-]+)\\)\\$'`),
  );
  if (!allow) {
    report(LEADS_SQL, 1, `no /${section}/(…) landing-path allow-list found`);
    continue;
  }
  const allowed = allow[1].split("|");
  const line = lineAt(leadsSql, allow.index);
  for (const slug of served.filter((s) => !allowed.includes(s))) {
    report(LEADS_SQL, line, `/${section}/${slug} is published but not in the allow-list`);
  }

  if (!runSheet) continue;
  const listed = [
    ...runSheet.matchAll(
      new RegExp(`^- \`https://www\\.golo\\.golf/${section}/([a-z0-9-]+)\``, "gm"),
    ),
  ].map((m) => m[1]);
  for (const slug of served.filter((s) => !listed.includes(s))) {
    report(RUN_SHEET, runSheetLine, `/${section}/${slug} is published but not in the URL Inspection lists`);
  }
  for (const slug of listed.filter((s) => !served.includes(s))) {
    report(RUN_SHEET, runSheetLine, `/${section}/${slug} is in the URL Inspection lists but isn't a page`);
  }
}

/* ------------------------------------------------------------- vocabulary */

/**
 * Words that never appear in the site's copy (SIDE-GAME-POSITION §3 in
 * soleman23/golo: GoLo is a scoreboard, not a betting app), and launch-state
 * phrases that stopped being true when Android went live on 2026-10-26.
 * Every file is checked, legal text included: a disclaimer that has to name
 * what GoLo is not ("not a betting app", the Terms' "wager-style formats")
 * carries `vocab-ok: <reason>` on its line, as any reviewed exception does.
 * Golf's own terms are allowed: a pot bunker, white or red stakes, "at odds
 * with".
 */
const NEVER_WORDS =
  /\b(gambl[a-z]*|wager[a-z]*|stakes?|staked|staking|odds|betting|bets?|bettors?|pots?|pools?|purses?|winnings|payouts?|pay(s|ing)? out|paid out|payment processing|cash|cashed|cash out|anted|money on the line|who pays whom|pay through golo|tracks every dollar|beta|in beta|not live yet|isn['’]t live yet)\b/gi;
const VOCAB_EXEMPT = new Set([]);
/** Golf, not money: a pot bunker, white/red/yellow stakes, "at odds with". */
const GOLF_TERMS =
  /\bpot bunkers?\b|\b(white|red|yellow|blue|ob|out-of-bounds|hazard|penalty)\s+stakes?\b|\bat odds with\b/i;

for (const file of files) {
  if (VOCAB_EXEMPT.has(file)) continue;
  const raw = read(file);
  const { text, literals } = scan(raw, file);
  const rawLines = raw.split("\n");
  for (const m of text.matchAll(NEVER_WORDS)) {
    const line = lineAt(text, m.index);
    if (rawLines[line - 1]?.includes("vocab-ok:") || rawLines[line - 2]?.includes("vocab-ok:")) {
      continue;
    }
    const literal = literalAt(literals, m.index);
    // A .ts file's copy lives in string literals; the rest is code.
    if (file.endsWith(".ts") && !literal) continue;
    // A one-token literal is an id, slug or key ("q-gambling", "bets"), not copy.
    if (literal && /^[a-z0-9_-]+$/.test(text.slice(literal[0], literal[1]))) continue;
    // Inside a template literal's ${…} is code (`${styles.bet} …`), not copy.
    if (literal) {
      const before = text.slice(literal[0], m.index);
      if (before.lastIndexOf("${") > before.lastIndexOf("}")) continue;
    }
    if (file.endsWith(".tsx") && !literal) {
      // JSX text is copy; code around it is not: a member (styles.bet,
      // example.bets.map, bet.tag, bet?.tag) or an arrow parameter ((bet) =>).
      const before = text[m.index - 1] ?? "";
      const after = text.slice(m.index + m[0].length);
      if (before === "." || /^(\??\.\w|\)?\s*=>)/.test(after)) continue;
      // An object key on its own line (an icon map's `cash: "M3…"`) is code.
      const lineStart = text.lastIndexOf("\n", m.index - 1) + 1;
      if (/^\s*:/.test(after) && /^\s*$/.test(text.slice(lineStart, m.index))) continue;
    }
    const context = text.slice(Math.max(0, m.index - 24), m.index + m[0].length + 16);
    if (GOLF_TERMS.test(context)) continue;
    report(
      file,
      line,
      `"${m[0]}" is never in site copy (SIDE-GAME-POSITION §3, launch state); reword, or mark a reviewed exception with vocab-ok:`,
    );
  }
}

/* ----------------------------------------------------------------- result */

if (problems.length) {
  console.error("Content check failed:\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    `\n${problems.length} problem(s). Claims and statuses: lib/content/capabilities.ts.`,
  );
  process.exit(1);
}

console.log(
  `✔ Content: no claims for ${notLive.length} non-live capabilities, no overclaims for ${overclaimed.length}, ${pages.size} link targets resolve, ${glossaryTerms.length} glossary records valid (${glossaryLinks.publishedSlugs.size} published${glossaryLive ? "" : ", not live"}), report lists match ${publishedPosts.length} posts and ${guideSlugs.length} guides${runSheet ? ` (run sheet until ${checkedUntil})` : ""}`,
);
