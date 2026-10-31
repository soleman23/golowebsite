# Birdie and closest-to-the-pin blog images

Created October 31, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The posts' numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs five-dollar-birdie closest-to-the-pin-rules`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `five-dollar-birdie-hero` | `aa3d61a9-adbc-4db5-bb98-90dbf3e9fe8f` | 21:9, 2688x1152 |
| `five-dollar-birdie-mobile` | `75529d8e-cd17-4648-9520-15023a10ab18` (reference: the hero job) | 4:5, 1792x2240 |
| `closest-to-the-pin-rules-hero` | `8dc8853c-9e85-4cc7-8179-af92394b70cd` | 21:9, 2688x1152 |
| `closest-to-the-pin-rules-mobile` | `41f0a2a1-ef26-4421-be7f-6e315d13b4a4` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share cards are cut from the heroes by the script.

## Birdie: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Low ground-level close view across a putting green: a white golf ball resting on the very lip of the cup, about to drop, the head of a putter and a golfer's shoes softly out of focus just behind it, the flagstick shadow across the grass. Ball, cup and putter grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is smooth deeply shadowed green and dark out-of-focus trees, quiet negative space for white headline text. Low golden evening sun raking across the green, fine grass texture, deep forest greens, muted gold light, shallow depth of field, fine film grain, authentic premium golf editorial photography. No visible branding or logos, no money, no readable text, no typography, no watermark.

## Closest to the pin: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. A par 3 green seen from a low angle at the front edge: one white golf ball sitting about four feet from the flagstick and cup, a deep greenside bunker in the foreground edge, the flag hanging still. Ball, flag and bunker lip grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed fringe, rough and dark trees, quiet negative space for white headline text. Late-afternoon low sun, long shadows across the green, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. No people, no visible branding or logos, no money, no readable text or numbers on the flag, no typography, no watermark.

## Phone frames: prompt pattern

Each hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same [subject] … Place [the subject] in the TOP 40 PERCENT of the frame. The BOTTOM 60 PERCENT is near-black deeply shadowed grass with subtle texture, empty, for white headline text. No added objects, no branding, no readable text, no typography, no watermark."
