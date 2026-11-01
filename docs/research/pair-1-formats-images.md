# Skins-vs-Nassau and match-play blog images

Created October 30, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The posts' numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs skins-vs-nassau match-play-vs-stroke-play`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `skins-vs-nassau-hero` | `34170c2e-90e2-4b19-a1f5-6a1a33a599e8` | 21:9, 2688x1152 |
| `skins-vs-nassau-mobile` | `9217bc43-d3cb-418d-93ca-76b18dbe3952` (reference: the hero job) | 4:5, 1792x2240 |
| `match-play-vs-stroke-play-hero` | `ec4c80a3-69f0-45b6-95b1-6a4921d58851` | 21:9, 2688x1152 |
| `match-play-vs-stroke-play-mobile` | `45a0f900-d1a4-4dd8-ba6c-637e3688581f` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share cards are cut from the heroes by the script.

## Skins vs. Nassau: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Four recreational golfers, a mixed group of ordinary adults in understated neutral golf clothes, walking together up a mature parkland fairway toward a distant green and flagstick, seen from behind at a slight distance, carrying or pulling bags, relaxed candid moment. All four people grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed fairway rough and dark trees, quiet negative space for white headline text. Low late-afternoon sun, long shadows, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. No visible branding or logos, no money, no readable text, no typography, no watermark.

## Match play vs. stroke play: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Two recreational golfers, ordinary adults in understated neutral golf clothes, standing side by side on an elevated tee box looking down a long tree-lined par 4 fairway, one holding a driver, seen from behind and slightly to the side, quiet tense moment before the tee shot. Both people in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deep shadowed trees and dark rough, negative space for white headline text. Late-afternoon low sun across the fairway, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. No visible branding or logos, no money, no readable text, no typography, no watermark.

## Phone frames: prompt pattern

Each hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same [subject] … Place [the subject] in the TOP 40 PERCENT of the frame, visible head to toe. The BOTTOM 60 PERCENT is near-black deeply shadowed grass with subtle texture, empty, for white headline text. No added people, no branding, no readable text, no typography, no watermark."
