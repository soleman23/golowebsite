#!/usr/bin/env node
/**
 * The /games and /blog filters are CSS keyed off <html data-filter>, and CSS
 * can't compare an ancestor's attribute with a descendant's — so each filter
 * id needs its own lines in the grid's stylesheet. That list is a manual copy
 * of ids that live in lib/content, and it has already drifted once (the "gear"
 * and "product" topics filtered nothing).
 *
 * This fails when a filter id is missing a rule, or when the CSS still names
 * an id the content no longer has. `npm run lint` runs it locally; CI runs it
 * as its own step (npm run lint:filters) so an ESLint failure can't hide it.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(root + path, "utf8");

/**
 * The array literal assigned at `marker`: from "= [" (which skips a type
 * annotation like `GameFilter[]`) to its first "]" — no id or label has one.
 */
function arrayAfter(path, marker) {
  const source = read(path);
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`${path}: can't find "${marker}"`);
  const start = source.indexOf("= [", at);
  if (start === -1) throw new Error(`${path}: no array after "${marker}"`);
  return source.slice(start + 3, source.indexOf("]", start + 3));
}

/**
 * Fails loudly instead of checking less than it should: every entry must
 * yield an id, and every id must be a plain lowercase slug.
 */
function checked(path, ids, entries) {
  if (!ids.length) throw new Error(`${path}: found no filter ids`);
  if (ids.length !== entries) {
    throw new Error(`${path}: read ${ids.length} ids from ${entries} entries`);
  }
  for (const id of ids) {
    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new Error(`${path}: "${id}" isn't a plain lowercase slug`);
    }
  }
  return ids;
}

const gamesPath = "lib/content/games.ts";
const gameBlock = arrayAfter(gamesPath, "export const gameFilters");
const gameIds = checked(
  gamesPath,
  [...gameBlock.matchAll(/\bid:\s*["']([^"']+)["']/g)].map((m) => m[1]),
  (gameBlock.match(/\{/g) ?? []).length,
).filter((id) => id !== "all");

const blogPath = "lib/content/blog.ts";
const blogBlock = arrayAfter(blogPath, "export const blogCategoryIds");
const blogIds = checked(
  blogPath,
  [...blogBlock.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]),
  blogBlock.split(",").filter((part) => part.trim()).length,
);

const chip = (id) => `html[data-filter="${id}"] .chips [data-chip="${id}"]`;
const shows = (part, id) => [
  `html[data-filter="${id}"] .${part} > [data-for="${id}"]`,
  `html[data-filter="${id}"] .${part} > [data-for="all"]`,
];

const pages = [
  {
    css: "components/sections/games/GamesGrid.module.css",
    ids: gameIds,
    rules: (id) => [
      `html[data-filter="${id}"] .grid > :not([data-tags~="${id}"])`,
      ...shows("result", id),
      chip(id),
    ],
  },
  {
    css: "components/sections/blog/PostGrid.module.css",
    ids: blogIds,
    rules: (id) => [
      `html[data-filter="${id}"] .cards > :not([data-topic="${id}"])`,
      ...shows("heading", id),
      ...shows("count", id),
      chip(id),
    ],
  },
];

const problems = [];

for (const page of pages) {
  const css = read(page.css)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ");
  const known = new Set(["all", ...page.ids]);
  const expected = [
    chip("all"),
    `html:not([data-filter]) .chips [data-chip="all"]`,
    ...page.ids.flatMap(page.rules),
  ];
  for (const rule of expected) {
    if (!css.includes(rule)) problems.push(`${page.css}: missing ${rule}`);
  }
  for (const [, id] of css.matchAll(/data-filter="([^"]+)"/g)) {
    if (!known.has(id)) {
      problems.push(`${page.css}: "${id}" isn't a filter id in lib/content`);
    }
  }
}

if (problems.length) {
  console.error("Filter CSS is out of step with lib/content:\n");
  for (const p of [...new Set(problems)]) console.error(`  ${p}`);
  process.exit(1);
}
console.log(
  `✔ Filter CSS covers ${gameIds.length} game filters and ${blogIds.length} blog topics`,
);
