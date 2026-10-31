# Two-player and net-versus-gross blog images

Created October 30, 2026 with the built-in imagegen tool. These are fictional editorial illustrations, not app screenshots, real player records or a source for the hypothetical scorecard's numbers. The numeric example is authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs golf-games-for-2-players net-vs-gross-scoring`.

Final assets are in `public/images/blog/`, with these names:

- `golf-games-for-2-players-hero.webp`
- `golf-games-for-2-players-mobile.webp`
- `golf-games-for-2-players-og.jpg`
- `net-vs-gross-scoring-hero.webp`
- `net-vs-gross-scoring-mobile.webp`
- `net-vs-gross-scoring-og.jpg`

## Games for two: hero prompt

Use case: photorealistic-natural. Asset type: 21:9 wide editorial golf blog hero. Two regular recreational golf partners walking together off a putting green after finishing a hole, each carrying a putter, a single flagstick behind them. A man and a woman in ordinary understated neutral golf clothes, seen from behind, relaxed candid scene, no handshake or celebration. Both people grouped in the RIGHT THIRD of frame. The LEFT TWO THIRDS is empty deeply shadowed fringe and trees, negative space for white headline copy. Mature parkland municipal-style golf course in low late afternoon sunlight, deep forest greens, muted gold light, tactile natural grass, soft fine film grain, premium authentic golf editorial photography for a dark website. Natural anatomy and realistic golf equipment. No visible branding, no money, no readable text, no overlaid typography, no watermark, no third person. Wide landscape 21:9.

## Games for two: mobile edit prompt

Reference: the generated two-player hero PNG.

Use case: precise-object-edit. Adapt the supplied photograph of two golf partners leaving a green into a portrait 4:5 mobile blog header. Preserve exactly these two golfers, their appearance and neutral clothing, both putters, the flagstick, parkland green, warm late-afternoon light and photorealistic golf editorial style. Recompose with camera pulled back and both people standing/walking within the TOP 40 PERCENT of frame, visible head to toe, flagstick near top right. BOTTOM 60 PERCENT is empty deeply shadowed putting green and fringe grass with subtle texture, no equipment or objects, suitable for white headline text. Deep muted greens, soft golden light and fine grain. No branding, no readable text, no cash, no third person, no typography overlay, no watermark. Portrait 4:5.

## Net versus gross: hero prompt

Use case: photorealistic-natural. Asset type: wide 21:9 editorial golf blog hero for an article about choosing gross or net scoring. Scene: one cream paper golf scorecard on the dark charcoal seat of a parked golf cart, a short yellow pencil resting diagonally across its lower margin, one white golf ball and one pale yellow golf ball beside the card. All objects clustered in the RIGHT THIRD. The scorecard is the main subject, with indistinct small pencil marks and grid lines, no readable names, no readable numbers. LEFT TWO THIRDS are quiet deep shadowed golf-cart seat texture and out-of-focus dark course foliage, usable negative space for white headline. Background softly shows a fairway in early evening warm light. Slightly elevated close three-quarter view, natural worn paper and leatherlike seat texture, deep forest greens, charcoal and soft gold, fine film grain, authentic understated premium golf editorial photograph. No person, no money, no phone, no branding, no typography overlay, no watermark. Only ONE scorecard. Wide landscape 21:9.

## Net versus gross: mobile edit prompt

Reference: the generated net-versus-gross hero PNG.

Use case: precise-object-edit. Adapt the supplied golf-cart scorecard photograph into a 4:5 portrait mobile blog header. Preserve exactly one cream paper scorecard, yellow pencil, white ball and yellow ball, the charcoal textured cart seat and warm early-evening golf course light. Recompose these objects together in the TOP THIRD of the portrait, with a little blurred fairway above, viewed from a slightly higher camera angle. The BOTTOM TWO THIRDS should be quiet empty deeply shadowed charcoal cart-seat upholstery, suitable for white headline text; no card or balls in the bottom half. Natural physical materials, understated golf editorial photography, fine film grain. The card's marks should be indistinct, no legible names or meaningful numbers. No people, no added equipment, no branding, no money, no text overlay, no watermark. Portrait 4:5.

