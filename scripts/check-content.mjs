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
 *    or a status in the same clause ("iPhone and Android apps are on the list,
 *    not built"; only ";", dashes and "but" end that clause, since "and" so
 *    often joins the very things being denied). In blog posts and game
 *    guides only copy about GoLo counts — a string that mentions GoLo or "the
 *    app" — so explaining an auto-press as golf is fine and saying GoLo does
 *    one is not. `claim-ok: <reason>` on a line (or the line above) and
 *    `claim-ok-file: <reason>` in a file's header exempt copy gated behind
 *    siteConfig.appLive and the like.
 * 2. Metadata. Search titles, meta descriptions and the site description may
 *    not name a non-live capability at all, denied or not — a snippet has no
 *    room for the denial. Golf-education titles are held to that only when
 *    they're about GoLo: "Rangefinder or GPS watch?" names gear, not a GoLo
 *    feature.
 * 3. Internal links. Every "/…" href in content and components, legal copy
 *    included, in any kind of string literal, must be a page or file the site
 *    serves: a static route, a route handler, a published post, a game guide
 *    or a file in public/.
 *
 * Comments are ignored throughout. Exit 1 with one line per problem.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

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
 * Comments blanked out, line numbers kept. A small scanner rather than a
 * regex, so a trailing `// note` goes but the "//" inside a URL string stays.
 * In .tsx files an apostrophe in JSX text ("don't") isn't a string quote, so
 * only " and ` open strings there; the project writes strings with "" anyway.
 */
function stripComments(source, file) {
  const quotes = file.endsWith(".tsx") ? "\"`" : "\"'`";
  let out = "";
  let i = 0;
  let quote = null;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (c === quote || (c === "\n" && quote !== "`")) quote = null;
      i += 1;
    } else if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") {
        out += " ";
        i += 1;
      }
    } else if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += source.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
    } else {
      if (quotes.includes(c)) quote = c;
      out += c;
      i += 1;
    }
  }
  return out;
}

const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/** Text between the nearest unescaped double quotes around `index`. */
function stringAt(text, index) {
  let start = index;
  while (start > 0 && !(text[start - 1] === '"' && text[start - 2] !== "\\")) {
    start -= 1;
  }
  let end = index;
  while (end < text.length && !(text[end] === '"' && text[end - 1] !== "\\")) {
    end += 1;
  }
  return text.slice(start, end);
}

/** The sentence around a match: bounded by . ! ? quotes or newlines. */
function sentenceAt(text, index, length) {
  const stops = /[.!?"`\n]/;
  let start = index;
  while (start > 0 && !stops.test(text[start - 1])) start -= 1;
  let end = index + length;
  while (end < text.length && !stops.test(text[end])) end += 1;
  return { text: text.slice(start, end), offset: index - start };
}

const ABOUT_GOLO = /\bGoLo\b|\bthe app\b/i;

/** A status anywhere in the phrase's clause says it isn't working. */
const STATUS =
  /\b(not built|isn['’]t built|aren['’]t built|on the list|not in the app|isn['’]t in the app|aren['’]t in the app|in testing|not yet|cut|(does not|doesn['’]t) track)\b/i;

/** A negation counts only before the phrase, in the same clause. */
const NEGATION =
  /\b(no|not|never|without|nor|doesn['’]t|does not|don['’]t|do not|isn['’]t|aren['’]t|won['’]t|can['’]t|cannot)\b/gi;
/** Where a negation's reach ends. */
const NEGATION_BREAK = /\b(?:and|but|so|while|though|although)\b|[;—–]/gi;
/** Where a status's reach ends. */
const STATUS_BREAK = /\bbut\b|[;—–]/gi;

/** The stretch of `sentence` around [offset, offset + length) between breaks. */
function clauseAt(sentence, offset, length, breaks) {
  let start = 0;
  let end = sentence.length;
  for (const m of sentence.matchAll(breaks)) {
    if (m.index + m[0].length <= offset) start = m.index + m[0].length;
    else if (m.index >= offset + length) {
      end = m.index;
      break;
    }
  }
  return { text: sentence.slice(start, end), offset: offset - start };
}

function denied(sentence, offset, length) {
  // "GoLo works offline; trip mode is not built" denies only trip mode, and
  // "no setup required and GPS yardages" doesn't deny the yardages.
  if (STATUS.test(clauseAt(sentence, offset, length, STATUS_BREAK).text)) {
    return true;
  }
  const clause = clauseAt(sentence, offset, length, NEGATION_BREAK);
  NEGATION.lastIndex = 0;
  return NEGATION.test(clause.text.slice(0, clause.offset));
}

const problems = [];
const report = (file, line, message) =>
  problems.push(`${file}:${line}  ${message}`);

const notLive = capabilities.filter(
  (c) => c.status !== "live" && c.claimPhrases?.length,
);

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Word edges only where the phrase starts or ends with a word character.
  const lead = /^\w/.test(phrase) ? "\\b" : "";
  const tail = /\w$/.test(phrase) ? "\\b" : "";
  return new RegExp(`${lead}${escaped}${tail}`, "gi");
}

/* ----------------------------------------------------------------- claims */

for (const file of files) {
  if (NOT_CLAIMS.has(file)) continue;
  const raw = read(file);
  if (raw.includes("claim-ok-file:")) continue;
  const text = stripComments(raw, file);
  const rawLines = raw.split("\n");
  const education = EDUCATION.has(file);

  for (const cap of notLive) {
    for (const phrase of cap.claimPhrases) {
      for (const m of text.matchAll(phraseRegex(phrase))) {
        const line = lineAt(text, m.index);
        if (
          rawLines[line - 1]?.includes("claim-ok:") ||
          rawLines[line - 2]?.includes("claim-ok:")
        ) {
          continue;
        }
        if (education && !ABOUT_GOLO.test(stringAt(text, m.index))) continue;
        const { text: sentence, offset } = sentenceAt(
          text,
          m.index,
          m[0].length,
        );
        if (denied(sentence, offset, m[0].length)) continue;
        report(
          file,
          line,
          `"${m[0]}" presents ${cap.id} (${cap.status}) as working: "${sentence.trim().slice(0, 140)}"`,
        );
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
 * seoTitle and metaDescription, each post's own title, metaDescription and
 * dek (top-level fields only, not section and card titles), and the title and
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

  grab("lib/siteConfig.ts", source("lib/siteConfig.ts"), field(["description"], " {2}"));
  grab(
    "lib/content/gameDetail.ts",
    source("lib/content/gameDetail.ts"),
    field(["seoTitle", "metaDescription"], " {2}"),
  );
  grab(
    "lib/content/blog.ts",
    source("lib/content/blog.ts"),
    field(["title", "metaDescription", "dek"], " {4}"),
  );

  for (const page of walk("app", ["page.tsx"])) {
    for (const call of source(page).matchAll(/pageMetadata\(\{[\s\S]*?\}\)/g)) {
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
  if (EDUCATION.has(file) && !ABOUT_GOLO.test(value)) continue;
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

/** Static pages and route handlers under app/, route groups dropped. */
function staticRoutes() {
  const routes = new Set(["/"]);
  for (const entry of walk("app", ["page.tsx", "route.ts"])) {
    const dir = relative("app", entry).split("/").slice(0, -1);
    if (dir.some((part) => part.startsWith("["))) continue;
    const path = dir.filter((part) => !/^\(.*\)$/.test(part)).join("/");
    routes.add(path ? `/${path}` : "/");
  }
  return routes;
}

const guideSlugs = [
  ...read("lib/content/gameDetail.ts").matchAll(/^ {2}slug: "([a-z0-9-]+)",/gm),
].map((m) => m[1]);

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

for (const file of files) {
  const text = stripComments(read(file), file);
  for (const m of text.matchAll(HREF)) {
    const href = m[2];
    if (href.includes("${")) continue;
    const target = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!pages.has(target)) {
      report(file, lineAt(text, m.index), `link to ${href}, which isn't a page`);
    }
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
  `✔ Content: no claims for ${notLive.length} non-live capabilities, ${pages.size} link targets resolve`,
);
