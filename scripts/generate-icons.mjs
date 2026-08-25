/**
 * Regenerates every raster icon from the one vector mark, so the set can never
 * drift from `app/icon.svg`. Run it after any change to the logo:
 *
 *   node scripts/generate-icons.mjs
 *
 * Geometry is traced from app/icon.svg (viewBox 0 0 120 124): the lime "G" is a
 * 40px-radius arc centred on (56, 60) with a 12px round-capped stroke, so the
 * artwork's real bounds are a 92x92 square, also centred on (56, 60), and its
 * bounding circle has radius ~49 (the flag tip at (86, 22) reaches further than
 * the arc does). Everything below is expressed against those two numbers.
 *
 * Two canvases come out of that:
 *
 *   STANDARD (120)  artwork fills 77% of the tile — the proportion the design
 *                   handoff drew, reused for the favicon, the manifest icons
 *                   and the structured-data logo.
 *   MASKABLE (140)  artwork fills 66%, so its bounding circle lands inside the
 *                   80%-diameter safe zone Android crops a maskable icon to.
 *
 * Two more rules the platforms impose rather than us:
 *
 *   - The Apple touch icon and the maskable icon ship square and full-bleed.
 *     iOS applies its own squircle and Android its own mask; rounding the
 *     source too would show a rounded tile inside a rounded mask.
 *   - The ball's inner ring is dropped below 180px. At favicon sizes it closes
 *     up into a grey smudge and costs more than it adds.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Traced from app/icon.svg. Keep in step with it and with LogoMark. */
const ART = { cx: 56, cy: 60, tile: "#0c0f12", accent: "#d4f23a" };
const STANDARD = 120;
const MASKABLE = 140;
/** rx 26 on a 120 tile — the corner radius the handoff drew. */
const CORNER = 26 / 120;

/**
 * @param {number} canvas   Square viewBox to centre the artwork in.
 * @param {object} opts
 * @param {boolean} opts.rounded  false = full-bleed, for masked platforms.
 * @param {boolean} opts.dimple   The ball's inner ring. Off below 180px.
 */
function markSvg(canvas, { rounded, dimple }) {
  const dx = canvas / 2 - ART.cx;
  const dy = canvas / 2 - ART.cy;
  const rx = rounded ? (canvas * CORNER).toFixed(2) : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">
  <rect width="${canvas}" height="${canvas}" rx="${rx}" fill="${ART.tile}"/>
  <g transform="translate(${dx} ${dy})">
    <path d="M56 20 A40 40 0 1 0 95.8 64" stroke="${ART.accent}" stroke-width="12" stroke-linecap="round" fill="none"/>
    <line x1="95.8" y1="64" x2="64" y2="64" stroke="${ART.accent}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="56" cy="58" r="15" fill="#fff"/>
    ${dimple ? `<circle cx="56" cy="58" r="9" fill="none" stroke="rgba(10,36,24,0.28)" stroke-width="2.4"/>` : ""}
    <line x1="56" y1="44" x2="56" y2="14" stroke="${ART.accent}" stroke-width="3.4"/>
    <path d="M56 14 L86 22 L56 34 Z" fill="#fff"/>
  </g>
</svg>`;
}

/**
 * Rasterise the mark at `size`, rendering the vector at target resolution.
 *
 * A full-bleed tile has nothing transparent in it, so its alpha channel is
 * dropped: iOS rejects transparency in a touch icon outright, and carrying a
 * uniformly-opaque channel anywhere else is dead weight. Rounded tiles keep
 * theirs — the corners are the transparency.
 */
function png(size, { canvas = STANDARD, rounded = true, dimple = size >= 180 } = {}) {
  const pipeline = sharp(Buffer.from(markSvg(canvas, { rounded, dimple })), {
    density: 384,
  }).resize(size, size, { fit: "fill" });

  return (rounded ? pipeline : pipeline.flatten({ background: ART.tile }))
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

/**
 * Packs PNGs into an ICO container: a 6-byte ICONDIR, one 16-byte ICONDIRENTRY
 * each, then the payloads. PNG-compressed entries are read by every browser
 * that still asks for /favicon.ico, and by Windows Vista and later.
 */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = entries.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); // 0 encodes 256
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size — 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]);
}

async function write(relPath, data) {
  const full = join(ROOT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, data);
  console.log(`  ${relPath.padEnd(42)} ${(data.length / 1024).toFixed(1)} KB`);
}

console.log("Generating icons from app/icon.svg\n");

// Legacy favicon. Crawlers, feed readers and older Safari ask for this path
// directly and ignore icon.svg, so it stays even though the SVG covers modern
// browsers. Rounded, no dimple — 16px has no room for either detail.
const sizes = [16, 32, 48];
await write(
  "app/favicon.ico",
  ico(await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) }))))
);

// iOS home screen. Square and opaque: iOS masks it to a squircle itself, and
// composites any transparency onto black.
await write("app/apple-icon.png", await png(180, { rounded: false }));

// Web app manifest.
await write("public/icons/icon-192.png", await png(192));
await write("public/icons/icon-512.png", await png(512));
await write(
  "public/icons/icon-maskable-512.png",
  await png(512, { canvas: MASKABLE, rounded: false })
);

// Organization.logo and Article.publisher.logo in the JSON-LD. Google's
// structured-data spec takes a raster here — an SVG is silently dropped.
await write("public/images/brand/golo-logo-600.png", await png(600));

console.log("\nDone.");
