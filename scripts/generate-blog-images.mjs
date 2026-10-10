/**
 * Builds the blog-post photos from the source PNGs. The sources are multi-MB
 * and are not committed; drop them in tmp/img-src/ (git-ignored) as
 * {prefix}-hero.png (21:9) and {prefix}-mid.png (3:2), then run:
 *
 *   node scripts/generate-blog-images.mjs
 *
 * Out come, per post, in public/images/blog/:
 *
 *   {slug}-hero.webp   full-resolution master for the hero and the cards
 *   {slug}-mid.webp    full-resolution master for the mid-article figure
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
 * Post slug → source file prefix, and where the share card is cut from. Bingo
 * Bango Bongo's alt names the three balls back in the fairway, and a cut from
 * the right loses the nearest one.
 */
const POSTS = {
  "bingo-bango-bongo": { prefix: "bbb", ogPosition: "centre" },
  wolf: { prefix: "wolf", ogPosition: "right" },
  "skins-carryover": { prefix: "skins", ogPosition: "right" },
  nassau: { prefix: "nassau", ogPosition: "right" },
};
const MASTER = { quality: 82, floor: 66, budget: 600 * 1024 };
const OG = { width: 1200, height: 630, quality: 82, budget: 300 * 1024 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

await mkdir(OUT, { recursive: true });

for (const [slug, { prefix, ogPosition }] of Object.entries(POSTS)) {
  for (const variant of ["hero", "mid"]) {
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
