# Three-player and beginners blog images

Created October 31, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The posts' numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs golf-games-for-3-players side-games-for-beginners`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `golf-games-for-3-players-hero` | `f6b85b1f-13f0-4fef-bb62-46ddcf6c8ba2` | 21:9, 2688x1152 |
| `golf-games-for-3-players-mobile` | `0bfa1e9d-6b85-4961-bdd6-5068317ae0e5` (reference: the hero job) | 4:5, 1792x2240 |
| `side-games-for-beginners-hero` | `e76bf132-60ce-44a1-bf0a-93e8c8f98bed` | 21:9, 2688x1152 |
| `side-games-for-beginners-mobile` | `5349d045-2312-4627-8f64-235dc807ff9a` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share cards are cut from the heroes by the script.

## Games for three: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Exactly three recreational golfers, ordinary adults in understated neutral golf clothes, walking off a tee box together down a path toward the fairway, carrying bags, seen from behind at a slight distance, early morning with light mist over the course. All three people grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed trees and dark dewy grass, quiet negative space for white headline text. Soft low morning sun, long shadows, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. Exactly three people, no fourth person. No visible branding or logos, no money, no readable text, no typography, no watermark.

## Beginners: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Four recreational golfers of mixed ages, ordinary adults in understated neutral golf clothes, standing and chatting relaxed on a first tee beside a wooden bag stand and tee marker, one holding a driver, friendly candid moment, seen from a slight distance. All four people grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed trees and dark grass, quiet negative space for white headline text. Soft early morning sun, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. No visible branding or logos, no money, no readable text, no signs with writing, no typography, no watermark.

## Phone frames: prompt pattern

Each hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same [subject] … Place [the subject] in the TOP 40 PERCENT of the frame, visible head to toe. The BOTTOM 60 PERCENT is near-black deeply shadowed grass with subtle texture, empty, for white headline text. No added people, no branding, no readable text, no typography, no watermark."
