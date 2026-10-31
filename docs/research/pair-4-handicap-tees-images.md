# No-handicap and different-tees blog images

Created October 31, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The posts' numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs no-handicap-fair-game different-tees`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `no-handicap-fair-game-hero` | `1bf4d7d1-ec6b-4ee8-a4dd-8d4a059457f4` | 21:9, 2688x1152 |
| `no-handicap-fair-game-mobile` | `b49ee3c7-de98-4ae4-887c-a1caa4794580` (reference: the hero job) | 4:5, 1792x2240 |
| `different-tees-hero` | `c8013a81-d104-4d0c-bf05-c559fc7ba609` | 21:9, 2688x1152 |
| `different-tees-mobile` | `824ce425-82fe-4d46-80c4-4d9777f52523` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share cards are cut from the heroes by the script.

## No handicap: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. A blank cream paper golf scorecard with faint grid lines and indistinct pencil marks, a short pencil and a single golf ball resting on a weathered wooden bench beside a practice putting green, early morning dew on the grass, a few practice flags softly out of focus behind. Card, pencil and ball grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed bench wood and dark out-of-focus trees and grass, quiet negative space for white headline text. Soft low morning sun, deep forest greens, muted gold light, shallow depth of field, fine film grain, authentic premium golf editorial photography. No people, no visible branding or logos, no money, no readable text, names or numbers, no typography, no watermark.

## Different tees: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. A tree-lined golf hole seen from beside the tee complex: two separate tee boxes at different distances along the same hole, a pair of dark blue tee markers on the rear tee box in the foreground and a pair of white tee markers on a forward tee box further down, the fairway stretching away beyond. Both tee boxes and markers grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed trees and dark rough, quiet negative space for white headline text. Warm evening light, long shadows, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. No people, no visible branding or logos, no money, no readable text, no yardage signs, no typography, no watermark.

## Phone frames: prompt pattern

Each hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same [subject] … Place [the subject] in the TOP 40 PERCENT of the frame. The BOTTOM 60 PERCENT is near-black deeply shadowed grass with subtle texture, empty, for white headline text. No people, no added objects, no branding, no readable text, no typography, no watermark."
