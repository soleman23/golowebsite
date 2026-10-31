# Gimmes and nine-hole blog images

Created October 30, 2026 in Higgsfield with `gpt_image_2_5` (quality high, 2k). These are fictional editorial illustrations, not app screenshots or real players. The posts' numbers are authored in `lib/content/blog.ts`.

Source PNGs: ignored `tmp/img-src/{slug}-{hero,mobile}.png`. Rebuild with `node scripts/generate-blog-images.mjs gimmes nine-hole-games`.

| File | Higgsfield job | Size |
| --- | --- | --- |
| `gimmes-hero` | `8937b689-5391-4ef0-ab50-92ded7669fa3` | 21:9, 2688x1152 |
| `gimmes-mobile` | `81d14ce3-99f2-49e9-8532-08ef25a93cd8` (reference: the hero job) | 4:5, 1792x2240 |
| `nine-hole-games-hero` | `6aa7ac99-5f7d-4e61-8bfe-1307287cd71b` | 21:9, 2688x1152 |
| `nine-hole-games-mobile` | `b6a80b96-ccc0-489f-a4d1-1742e426669e` (reference: the hero job) | 4:5, 1792x2240 |

The `-og.jpg` share cards are cut from the heroes by the script.

## Gimmes: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Low angle across a putting green: a white golf ball sitting about three feet short of the cup, a putter lying flat on the grass beside the ball, the flagstick out and lying on the fringe in the background, late-afternoon light. Ball, cup and putter grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is smooth deeply shadowed green and dark out-of-focus trees, quiet negative space for white headline text. Low golden sun, long shadows, fine grass texture, deep forest greens, muted gold light, shallow depth of field, fine film grain, authentic premium golf editorial photography. No people, no visible branding or logos, no money, no readable text, no typography, no watermark.

## Nine holes: hero prompt

Photorealistic wide 21:9 editorial golf photograph for a dark website blog hero. Four recreational golfers, ordinary adults in understated neutral golf clothes, walking up the final fairway toward a green with a flag and a modest low clubhouse with warm lit windows behind it, seen from behind at a distance, carrying bags, the sun setting low on the horizon. All four people, the green and clubhouse grouped in the RIGHT THIRD of the frame. The LEFT TWO THIRDS is deeply shadowed fairway and dark trees, quiet negative space for white headline text. Dusk light, orange sky low on the horizon, deep forest greens, fine film grain, authentic premium golf editorial photography. Natural anatomy and realistic golf equipment. No visible branding or logos, no signs with writing, no money, no readable text, no typography, no watermark.

## Phone frames: prompt pattern

Each hero's job id passed as the reference image, with: "Recompose the supplied photograph as a vertical 4:5 mobile hero banner. Keep the same [subject] … Place [the subject] in the TOP 40 PERCENT of the frame. The BOTTOM 60 PERCENT is near-black deeply shadowed grass with subtle texture, empty, for white headline text. No added people or objects, no branding, no readable text, no typography, no watermark."
