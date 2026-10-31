# Tracking golf bets: article images

Created October 30, 2026 with the built-in imagegen tool. These are editorial illustrations, not app screenshots or photographs of an actual GoLo round.

The source PNGs are in ignored `tmp/img-src/group-accountant-{hero,mobile}.png`. Rebuild the committed WebP masters and JPEG share card with `node scripts/generate-blog-images.mjs group-accountant`.

Final assets:

- `public/images/blog/group-accountant-hero.webp`
- `public/images/blog/group-accountant-mobile.webp`
- `public/images/blog/group-accountant-og.jpg`

## Hero generation prompt

Use case: photorealistic-natural. Asset type: editorial golf blog hero photograph for an article titled How to track golf bets without becoming the group accountant. Create one photorealistic wide 21:9 landscape image, 2520x1080 if possible. Scene: a weathered wooden bench beside the 18th green at dusk. On the RIGHT THIRD of the frame lies an open cream paper golf scorecard with small indistinct pencil marks, a short pencil diagonally across it, and a dark golf glove alongside. A golf bag is softly out of focus behind the bench near the right edge. Left two thirds are deep shadowed muted golf course and bench texture, visually quiet negative space for white article text. A soft flagstick in the distant right background, warm low sunlight catching paper and wood, deep forest greens, warm amber highlights, tactile film grain, candid premium golf editorial photography. Slightly elevated three-quarter angle, believable physical objects, understated dry Saturday-golf mood. No people, no cash, no phone interface, no branding, no legible words, no overlaid type, no watermark. Keep the scorecard and pencil clustered together on the right, with generous shadow around them so the image also works cropped to a vertical mobile header.

## Mobile edit prompt

Reference: the generated hero PNG above.

Use case: precise-object-edit. Adapt the supplied editorial golf photograph into a 4:5 portrait mobile header image for the same blog post. Preserve the scorecard, pencil, glove, bench wood texture, golf bag, final green, dusk light and photorealistic style. Recompose so the complete scorecard and pencil are in the TOP THIRD, golf bag at top right, with the lower TWO THIRDS mainly empty dark bench wood and deep shadow, suitable for white headline copy. Camera slightly above bench looking down toward card and green beyond. No people, no legible writing, no added objects, no typography, no watermark. The main subject must be at the top, and the entire bottom half must be quiet dark shadowed wood.
