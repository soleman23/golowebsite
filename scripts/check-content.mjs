#!/usr/bin/env node
/**
 * Content checks that copy review keeps missing. `npm run lint` runs this, so
 * CI runs it on every PR.
 *
 * 1. Claims. lib/content/capabilities.ts records what GoLo does. For every
 *    capability that isn't live, its `claimPhrases` may not appear in site
 *    copy unless the same sentence says it isn't there ("not built", "on the
 *    list", "doesn't", "no", …). In the golf-education files (blog posts, game
 *    guides) only sentences about GoLo count, so explaining an auto-press as
 *    golf is fine and saying GoLo does one is not. A line holding a
 *    `claim-ok: <reason>` comment, or the line under one, is skipped — for
 *    copy gated behind siteConfig.appLive and the like — and a file whose
 *    header says `claim-ok-file: <reason>` is skipped whole.
 * 2. Metadata. Titles, meta descriptions and the site description may not
 *    name a non-live capability at all, qualified or not.
 * 3. Internal links. Every "/…" href in content and components must be a page
 *    the site builds: a static route, a published post or a game guide.
 *
 * Exit 1 with one line per problem; exit 0 silently apart from a summary.
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

/** Not copy: the registry itself, legal text, and image alt text. */
const SKIP = new Set([
  "lib/content/capabilities.ts",
  "lib/content/legal.ts",
  "lib/content/heroPhotos.ts",
]);

/** Golf education: only sentences about GoLo make claims. */
const EDUCATION = new Set([
  "lib/content/blog.ts",
  "lib/content/gameDetail.ts",
  "lib/content/games.ts",
]);

const files = [
  ...walk("lib/content", [".ts"]),
  ...walk("components", [".tsx"]),
  ...walk("app", [".tsx"]),
].filter((f) => !SKIP.has(f));

/** Comments blanked out, line numbers kept. */
function stripComments(source) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/^[ \t]*\/\/.*$/gm, blank)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank);
}

const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/** The sentence around `index`: bounded by . ! ? quotes, backticks or newlines. */
function sentenceAt(text, index, length) {
  const stops = /[.!?"`\n]/;
  let start = index;
  while (start > 0 && !stops.test(text[start - 1])) start -= 1;
  let end = index + length;
  while (end < text.length && !stops.test(text[end])) end += 1;
  return text.slice(start, end);
}

const ABOUT_GOLO = /\bGoLo\b|\bthe app\b|\bin the app\b/i;
const QUALIFIED =
  /\b(not built|isn['’]t built|aren['’]t built|on the list|not in the app|isn['’]t in the app|not yet|yet|doesn['’]t|does not|don['’]t|do not|isn['’]t|aren['’]t|won['’]t|not|no|never|planned|cut|testing|building|without)\b/i;

const problems = [];
const report = (file, line, message) =>
  problems.push(`${file}:${line}  ${message}`);

/* ----------------------------------------------------------------- claims */

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

for (const file of files) {
  const raw = read(file);
  const text = stripComments(raw);
  const rawLines = raw.split("\n");
  const education = EDUCATION.has(file);
  if (raw.includes("claim-ok-file:")) continue;

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
        const sentence = sentenceAt(text, m.index, m[0].length);
        if (education && !ABOUT_GOLO.test(sentence)) continue;
        if (QUALIFIED.test(sentence)) continue;
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

/** [file, field, text] for every search title and description on the site. */
function metadataStrings() {
  const out = [];
  const grab = (file, fields) => {
    const text = stripComments(read(file));
    const re = new RegExp(
      `\\b(${fields.join("|")}):\\s*"((?:[^"\\\\]|\\\\.)*)"`,
      "g",
    );
    for (const m of text.matchAll(re)) {
      out.push({ file, line: lineAt(text, m.index), field: m[1], value: m[2] });
    }
  };
  grab("lib/siteConfig.ts", ["description"]);
  grab("lib/content/gameDetail.ts", ["seoTitle", "metaDescription"]);
  grab("lib/content/blog.ts", ["title", "metaDescription", "dek"]);
  for (const page of walk("app", ["page.tsx"])) {
    grab(page, ["title", "description"]);
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

function staticRoutes() {
  const routes = new Set(["/"]);
  for (const page of walk("app", ["page.tsx"])) {
    const dir = relative("app", page).split("/").slice(0, -1);
    if (dir.some((part) => part.startsWith("["))) continue;
    const path = dir.filter((part) => !/^\(.*\)$/.test(part)).join("/");
    routes.add(path ? `/${path}` : "/");
  }
  return routes;
}

const guideSlugs = [
  ...read("lib/content/gameDetail.ts").matchAll(/^ {2}slug: "([a-z0-9-]+)",/gm),
].map((m) => m[1]);

const pages = new Set([
  ...staticRoutes(),
  ...publishedPosts.map((p) => `/blog/${p.slug}`),
  ...guideSlugs.map((slug) => `/games/${slug}`),
]);

const HREF = /href(?:=\\?"|:\s*"|=\{")(\/[^"\\]*)/g;

for (const file of files) {
  const text = stripComments(read(file));
  for (const m of text.matchAll(HREF)) {
    const target = m[1].split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!pages.has(target)) {
      report(file, lineAt(text, m.index), `link to ${m[1]}, which isn't a page`);
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
