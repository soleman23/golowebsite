/**
 * Builds the blog-post photos from the source PNGs. The sources are multi-MB
 * and are not committed; drop them in tmp/img-src/ (git-ignored) as
 * {prefix}-hero.png (21:9), {prefix}-{mid}.png (3:2) and, for a post with a
 * phone frame, {prefix}-mobile.png (4:5), then run:
 *
 *   node scripts/generate-blog-images.mjs            every post
 *   node scripts/generate-blog-images.mjs bandon     just the slugs named
 *
 * Either way it builds each photo whose PNG is in tmp/img-src/ and keeps the
 * committed file for any that isn't (the share card needs the hero PNG). A
 * slug named on the command line with no PNGs at all is an error.
 *
 * Out come, per post, in public/images/blog/:
 *
 *   {slug}-hero.webp   full-resolution master for the hero and the cards
 *   {slug}-{mid}.webp  full-resolution master for each mid-article figure:
 *                      -mid, or -mid-1 and -mid-2 for a post with two
 *   {slug}-mobile.webp full-resolution master for the hero below 768px, where
 *                      the copy sits at the foot: the subject is in the top
 *                      40% of the 4:5 frame and the rest falls to near-black
 *   {slug}-og.jpg     1200x630 share card cut from the hero, from the right
 *                      so the subject (which sits on the right) survives —
 *                      except where the alt text names something further left
 *
 * One WebP master per photo rather than a width ladder: these render through
 * next/image, which resizes and picks the format per request.
 *
 * Budgets are checked rather than hoped for. A master over budget steps its
 * quality down by 4 and is re-encoded.
 */

import { access, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "tmp/img-src");
const OUT = join(ROOT, "public/images/blog");

/**
 * Post slug → its mid-article photos, whether it has a 4:5 phone frame, where
 * the share card is cut from, and the source file prefix where that isn't the
 * slug. Bingo Bango Bongo's alt names the three balls back in the fairway, and
 * a cut from the right loses the nearest one.
 */
const NO_MIDS = []; // the post's mid-article figures are still stock photos
const ONE_MID = ["mid"];
const TWO_MIDS = ["mid-1", "mid-2"];
const POSTS = {
  gimmes: { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "nine-hole-games": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "best-ball-vs-scramble": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "no-handicap-fair-game": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "different-tees": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "golf-games-for-3-players": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "side-games-for-beginners": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "five-dollar-birdie": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "closest-to-the-pin-rules": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "skins-vs-nassau": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "match-play-vs-stroke-play": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "golf-games-for-2-players": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "net-vs-gross-scoring": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "first-tee-checklist": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "group-accountant": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "bingo-bango-bongo": { prefix: "bbb", mids: ONE_MID, mobile: true, ogPosition: "centre" },
  wolf: { mids: ONE_MID, mobile: true, ogPosition: "right" },
  "skins-carryover": { prefix: "skins", mids: ONE_MID, mobile: true, ogPosition: "right" },
  nassau: { mids: ONE_MID, mobile: true, ogPosition: "right" },
  "who-pays-first": { mids: ONE_MID, mobile: true, ogPosition: "right" },
  pressing: { mids: ONE_MID, mobile: true, ogPosition: "right" },
  "index-vs-course-handicap": { mids: ONE_MID, mobile: true, ogPosition: "right" },
  sandbagging: { mids: TWO_MIDS, mobile: true, ogPosition: "right" },
  bandon: { mids: TWO_MIDS, mobile: true, ogPosition: "right" },
  rangefinder: { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  "scottsdale-trip-structure": { mids: NO_MIDS, mobile: true, ogPosition: "right" },
  // Cut from the site's own sunset backdrop (public/images/sunset.png), not a
  // generated image: the flag sits left of centre, so the card is cut from the
  // centre.
  "what-we-got-wrong": { mids: NO_MIDS, mobile: true, ogPosition: "centre" },
};
const MASTER = { quality: 82, floor: 66, budget: 600 * 1024 };
const OG = { width: 1200, height: 630, quality: 82, budget: 300 * 1024 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const exists = (path) => access(path).then(() => true, () => false);

const only = process.argv.slice(2);
const unknown = only.filter((slug) => !(slug in POSTS));
if (unknown.length) throw new Error(`No such post: ${unknown.join(", ")}`);

await mkdir(OUT, { recursive: true });

for (const [slug, { prefix = slug, mids, mobile, ogPosition }] of Object.entries(POSTS)) {
  if (only.length && !only.includes(slug)) continue;
  // Builds whatever has a source on disk and keeps the committed file for the
  // rest: most PNGs are gone once their post ships, and a later frame (a phone
  // crop, say) arrives on its own. A slug named on the command line with no
  // sources at all is a mistake; a bare run just passes it by.
  const variants = ["hero", ...mids, ...(mobile ? ["mobile"] : [])];
  const present = [];
  for (const variant of variants) {
    if (await exists(join(SRC, `${prefix}-${variant}.png`))) present.push(variant);
  }
  if (!present.length) {
    if (only.length) throw new Error(`${slug}: no ${prefix}-*.png in tmp/img-src/`);
    console.log(`${slug}: no sources in tmp/img-src/, skipped`);
    continue;
  }
  const missing = variants.filter((variant) => !present.includes(variant));
  if (missing.length) {
    console.log(`${slug}: kept the built ${missing.join(", ")}${present.includes("hero") ? "" : " and og"} (no source)`);
  }

  for (const variant of present) {
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

  if (!present.includes("hero")) continue;
  const og = join(OUT, `${slug}-og.jpg`);
  await sharp(join(SRC, `${prefix}-hero.png`))
    .resize({ width: OG.width, height: OG.height, fit: "cover", position: ogPosition })
    .jpeg({ quality: OG.quality, mozjpeg: true })
    .toFile(og);
  const ogSize = (await stat(og)).size;
  if (ogSize > OG.budget) throw new Error(`${slug}-og.jpg is ${kb(ogSize)}, over budget`);
  console.log(`${slug}-og.jpg 1200x630: ${kb(ogSize)}`);
}
