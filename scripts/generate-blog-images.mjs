/**
 * Builds the blog-post photos from the source PNGs. The sources are multi-MB
 * and are not committed; drop them in tmp/img-src/ (git-ignored) as
 * {prefix}-hero.png (21:9) and {prefix}-{mid}.png (3:2), then run:
 *
 *   node scripts/generate-blog-images.mjs            every post below
 *   node scripts/generate-blog-images.mjs bandon     just the slugs named
 *
 * Out come, per post, in public/images/blog/:
 *
 *   {slug}-hero.webp   full-resolution master for the hero and the cards
 *   {slug}-{mid}.webp  full-resolution master for each mid-article figure:
 *                      -mid, or -mid-1 and -mid-2 for a post with two
 *   {slug}-og.jpg      1200x630 share card cut from the hero, from the right
 *                      so the subject (which sits on the right) survives —
 *                      except where the alt text names something further left
 *
 * One WebP master per photo rather than a width ladder: these render through
 * next/image, which resizes and picks the format per request.
 *
 * Budgets are checked rather than hoped for. A master over budget steps its
 * quality down by 4 and is re-encoded.
 */

import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "tmp/img-src");
const OUT = join(ROOT, "public/images/blog");

/**
 * Post slug → source file prefix, its mid-article photos, and where the share
 * card is cut from. Bingo Bango Bongo's alt names the three balls back in the
 * fairway, and a cut from the right loses the nearest one.
 */
const ONE_MID = ["mid"];
const TWO_MIDS = ["mid-1", "mid-2"];
const POSTS = {
  "bingo-bango-bongo": { prefix: "bbb", mids: ONE_MID, ogPosition: "centre" },
  wolf: { prefix: "wolf", mids: ONE_MID, ogPosition: "right" },
  "skins-carryover": { prefix: "skins", mids: ONE_MID, ogPosition: "right" },
  nassau: { prefix: "nassau", mids: ONE_MID, ogPosition: "right" },
  "who-pays-first": { prefix: "who-pays-first", mids: ONE_MID, ogPosition: "right" },
  pressing: { prefix: "pressing", mids: ONE_MID, ogPosition: "right" },
  "index-vs-course-handicap": { prefix: "index-vs-course-handicap", mids: ONE_MID, ogPosition: "right" },
  sandbagging: { prefix: "sandbagging", mids: TWO_MIDS, ogPosition: "right" },
  bandon: { prefix: "bandon", mids: TWO_MIDS, ogPosition: "right" },
};
const MASTER = { quality: 82, floor: 66, budget: 600 * 1024 };
const OG = { width: 1200, height: 630, quality: 82, budget: 300 * 1024 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const only = process.argv.slice(2);
const unknown = only.filter((slug) => !(slug in POSTS));
if (unknown.length) throw new Error(`No such post: ${unknown.join(", ")}`);

await mkdir(OUT, { recursive: true });

for (const [slug, { prefix, mids, ogPosition }] of Object.entries(POSTS)) {
  if (only.length && !only.includes(slug)) continue;

  for (const variant of ["hero", ...mids]) {
    const src = join(SRC, `${prefix}-${variant}.png`);
    const out = join(OUT, `${slug}-${variant}.webp`);
    const { width, height } = await sharp(src).metadata();
    let quality = MASTER.quality;
    for (;;) {
      await sharp(src).webp({ quality, effort: 6 }).toFile(out);
      const size = (await stat(out)).size;
      if (size <= MASTER.budget) {
        console.log(`${slug}-${variant}.webp ${width}x${height} q${quality}: ${kb(size)}`);
        break;
      }
      if (quality <= MASTER.floor) {
        throw new Error(`${slug}-${variant}.webp still ${kb(size)} at the quality floor`);
      }
      quality -= 4;
    }
  }

  const og = join(OUT, `${slug}-og.jpg`);
  await sharp(join(SRC, `${prefix}-hero.png`))
    .resize({ width: OG.width, height: OG.height, fit: "cover", position: ogPosition })
    .jpeg({ quality: OG.quality, mozjpeg: true })
    .toFile(og);
  const ogSize = (await stat(og)).size;
  if (ogSize > OG.budget) throw new Error(`${slug}-og.jpg is ${kb(ogSize)}, over budget`);
  console.log(`${slug}-og.jpg 1200x630: ${kb(ogSize)}`);
}
