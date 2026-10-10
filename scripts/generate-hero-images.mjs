/**
 * Builds the page-hero photos (see PageHero's `photo` prop) from the source
 * PNGs. The sources are multi-MB and are not committed; drop them in
 * tmp/hero-src/ (git-ignored) as {page}-desktop.png (21:9) and
 * {page}-mobile.png (4:5), then run:
 *
 *   node scripts/generate-hero-images.mjs
 *
 * Out come, per page, in public/images/heroes/:
 *
 *   {page}-desktop-{1280,1920,2560}.{avif,webp}
 *   {page}-mobile-{480,768,1080}.{avif,webp}
 *   {page}-og.jpg            1200x630 share card, cropped from the right so
 *                            the subject (which sits on the right) survives
 *
 * No PNG fallback: the browserslist targets all decode AVIF, and <img src>
 * points at the WebP for anything that somehow doesn't.
 *
 * Budgets are checked rather than hoped for. If a page's 1920w desktop file
 * or 768w mobile file comes out over budget, that page's quality steps down
 * by 5 and the whole set for it is rebuilt.
 */

import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "tmp/hero-src");
const OUT = join(ROOT, "public/images/heroes");

const PAGES = ["faq", "blog", "games", "features"];
const VARIANTS = {
  desktop: { widths: [1280, 1920, 2560], budgetWidth: 1920, budget: 250 * 1024 },
  mobile: { widths: [480, 768, 1080], budgetWidth: 768, budget: 120 * 1024 },
};
const START = { avif: 55, webp: 75 };
const FLOOR = { avif: 35, webp: 50 };
const OG = { width: 1200, height: 630, quality: 82, budget: 300 * 1024 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function encode(src, file, width, format, quality) {
  const pipeline = sharp(src).resize({ width, withoutEnlargement: true });
  const out = join(OUT, file);
  if (format === "avif") await pipeline.avif({ quality, effort: 6 }).toFile(out);
  else await pipeline.webp({ quality, effort: 6 }).toFile(out);
  return (await stat(out)).size;
}

await mkdir(OUT, { recursive: true });

for (const page of PAGES) {
  for (const [variant, spec] of Object.entries(VARIANTS)) {
    const src = join(SRC, `${page}-${variant}.png`);
    const { width: srcWidth, height: srcHeight } = await sharp(src).metadata();
    const widths = spec.widths.filter((w) => w <= srcWidth);

    for (const format of ["avif", "webp"]) {
      let quality = START[format];
      for (;;) {
        const sizes = {};
        for (const w of widths) {
          sizes[w] = await encode(src, `${page}-${variant}-${w}.${format}`, w, format, quality);
        }
        const checked = sizes[spec.budgetWidth];
        if (checked <= spec.budget || quality <= FLOOR[format]) {
          if (checked > spec.budget) {
            throw new Error(`${page}-${variant} ${format} still ${kb(checked)} at the quality floor`);
          }
          console.log(
            `${page}-${variant} (${srcWidth}x${srcHeight}) ${format} q${quality}: ` +
              widths.map((w) => `${w}w ${kb(sizes[w])}`).join(", "),
          );
          break;
        }
        quality -= 5;
      }
    }
  }

  const og = join(OUT, `${page}-og.jpg`);
  await sharp(join(SRC, `${page}-desktop.png`))
    .resize({ width: OG.width, height: OG.height, fit: "cover", position: "right" })
    .jpeg({ quality: OG.quality, mozjpeg: true })
    .toFile(og);
  const ogSize = (await stat(og)).size;
  if (ogSize > OG.budget) throw new Error(`${page}-og.jpg is ${kb(ogSize)}, over budget`);
  console.log(`${page}-og.jpg 1200x630: ${kb(ogSize)}`);
}
