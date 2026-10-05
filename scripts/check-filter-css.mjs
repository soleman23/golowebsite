#!/usr/bin/env node
/**
 * The /games and /blog filters are CSS keyed off <html data-filter>, and CSS
 * can't compare an ancestor's attribute with a descendant's — so each filter
 * id needs its own lines in the grid's stylesheet. That list is a manual copy
 * of ids that live in lib/content, and it has already drifted once (the "gear"
 * and "product" topics filtered nothing).
 *
 * This fails the lint step when a filter id is missing a rule, or when the
 * CSS still names an id the content no longer has. Run via `npm run lint`.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(root + path, "utf8");

/** Ids matched by `pattern` in the array literal assigned at `marker`. */
function idsAfter(source, marker, pattern, path) {
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`${path}: can't find "${marker}"`);
  // Skip a type annotation like `GameFilter[]`: the array starts after "= [".
  const start = source.indexOf("= [", at);
  const block = source.slice(start, source.indexOf("];", start));
  return [...block.matchAll(pattern)].map((m) => m[1]);
}

const gameIds = idsAfter(
  read("lib/content/games.ts"),
  "export const gameFilters",
  /id: "([^"]+)"/g,
  "lib/content/games.ts",
).filter((id) => id !== "all");
const blogIds = idsAfter(
  read("lib/content/blog.ts"),
  "export const blogCategoryIds",
  /"([^"]+)"/g,
  "lib/content/blog.ts",
);

const pages = [
  {
    css: "components/sections/games/GamesGrid.module.css",
    ids: gameIds,
    rules: (id) => [
      `html[data-filter="${id}"] .grid > :not([data-tags~="${id}"])`,
      `html[data-filter="${id}"] .result > :not([data-for="${id}"])`,
      `html[data-filter="${id}"] .chips [data-chip="${id}"]`,
    ],
  },
  {
    css: "components/sections/blog/PostGrid.module.css",
    ids: blogIds,
    rules: (id) => [
      `html[data-filter="${id}"] .cards > :not([data-topic="${id}"])`,
      `html[data-filter="${id}"] .heading > :not([data-for="${id}"])`,
      `html[data-filter="${id}"] .count > :not([data-for="${id}"])`,
      `html[data-filter="${id}"] .chips [data-chip="${id}"]`,
    ],
  },
];

const problems = [];

for (const page of pages) {
  const css = read(page.css).replace(/\s+/g, " ");
  const known = new Set(["all", ...page.ids]);

  for (const id of page.ids) {
    for (const rule of page.rules(id)) {
      if (!css.includes(rule)) problems.push(`${page.css}: missing ${rule}`);
    }
  }
  for (const rule of page.rules("all").slice(1)) {
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
