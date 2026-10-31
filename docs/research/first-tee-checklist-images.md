# First-tee checklist: article images

Created October 30, 2026 with the built-in imagegen tool. These editorial illustrations show a fictional first-tee discussion, not an actual GoLo group or app screen.

Sources: ignored `tmp/img-src/first-tee-checklist-{hero,mobile}.png`. Rebuild the committed images with `node scripts/generate-blog-images.mjs first-tee-checklist`.

Final assets:

- `public/images/blog/first-tee-checklist-hero.webp`
- `public/images/blog/first-tee-checklist-mobile.webp`
- `public/images/blog/first-tee-checklist-og.jpg`

## Hero generation prompt

Use case: photorealistic-natural. Asset type: wide editorial golf blog hero, 21:9 landscape. Primary request: four adult recreational golfers gathered on the first tee at early morning, quietly agreeing the round's games around a small cream golf scorecard held by one player. Scene: natural municipal-style golf course, teeing ground, fairway and mature trees in soft early sunlight. Composition: ALL FOUR people clustered in the RIGHT THIRD, medium-wide candid view from behind and three-quarter side, modest everyday neutral golf clothing, carry bags nearby; LEFT TWO THIRDS are empty dark shadowed tee grass and trees, usable for white article headline. One person points at the scorecard and the others listen, no argument, no exaggerated gestures, no staged handshakes. Palette: deep forest green, muted earth, soft warm amber light, fine film grain, premium natural golf editorial photograph matching a dark golf magazine website. Realistic anatomy, believable ordinary golf equipment. No cash, no money, no branding, no visible phone screen, no legible words or numbers on card, no overlaid text, no watermark. Show the first-tee agreement, not the game in progress.

## Mobile edit prompt

Reference: the generated hero PNG.

Use case: precise-object-edit. Adapt the supplied first-tee golf photograph into a 4:5 portrait mobile blog header. Preserve all four golfers, their realistic appearance and ordinary clothing, the scorecard discussion, golf bags, first tee, early morning light and photographic style. Recompose the four people as a group visible from head to knees across the TOP 40 PERCENT, taking a slightly wider view so all four fit in portrait. The BOTTOM 60 PERCENT must be quiet empty deeply shadowed tee grass with subtle natural texture and no objects, suitable for white headline text. People in background top half, camera pulled back. Deep forest greens, muted warm sunlight, fine grain, candid golf editorial photograph. No fifth person, no extra limbs, no cash, no phones, no readable branding, no legible text, no typography overlay, no watermark. Portrait 4:5.

