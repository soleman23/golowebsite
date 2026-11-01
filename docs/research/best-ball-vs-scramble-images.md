# Best ball vs. scramble blog images

Created October 31, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The post's numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs best-ball-vs-scramble`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `best-ball-vs-scramble-hero` | `ea3e5280-6aac-44c8-84d1-b5141ba6b0c0` | 21:9, 2688x1152 |
| `best-ball-vs-scramble-mobile` | `1b8ff3f3-471c-40c7-82ff-8671d929c4ea` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share card is cut from the hero by the script.

## Hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Four recreational golfers, ordinary adults in understated neutral golf clothes, standing together in the middle of a fairway around two golf balls lying a few feet apart on the short grass, one golfer crouching to place a tee in the turf beside one ball, the other three standing with clubs and a carry bag, looking down at the balls as if choosing which drive to play. All four people and the balls grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed fairway and dark out-of-focus trees, quiet negative space for white headline text. Low golden late-afternoon sun, long shadows across the fairway, deep forest greens, muted gold light, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. No visible branding or logos, no money, no readable text, no typography, no watermark.

## Phone frame prompt

The hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same four golfers in the fairway, the same clothes, the crouching golfer placing a tee beside one of the two balls, the same late-afternoon light, long shadows and dark trees behind. Place the four golfers and the balls in the TOP 40 PERCENT of the frame. The BOTTOM 60 PERCENT is near-black deeply shadowed fairway grass with subtle texture, empty, for white headline text. Natural anatomy and realistic golf equipment. No added people or objects, no branding, no readable text, no typography, no watermark."
