# Glossary expansion batch 6: shots and ball flight (#168, #298)

Prepared November 12, 2026 for the owner's review; stages 2–4 done the same day under the owner's delegation. The records are in `lib/content/glossary/terms/expansion-batch-6.ts`, all `in-review`. Nothing here reaches a public page, the search index, the sitemap, `llms.txt` or structured data until a record is approved and a release PR publishes it (`selectors.ts`; checked by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt`, `sitemap.xml` and `.next/static` for this PR).

## Why now

Batches 1–5 are published (126 records). Shots and ball flight is next in `inventory.md` § Expansion batch plan. The owner asked for it on 2026-11-12 ("Start batch 6"), before #167's launch + 28 read (2026-11-26). Drafting changes nothing public. Release timing is the owner's call: wait for launch + 28, which can reorder the batches not yet released, or override as for batches 1–5.

## Scope

**15 terms**, #168's cap: every shots and ball-flight expansion term in `inventory.md` § E, rows 100–114.

`draw`, `fade`, `hook`, `shank`, `flop-shot`, `punch-shot`, `bump-and-run`, `lag-putt`, `approach-shot`, `layup`, `fat-shot`, `thin-shot`, `topped-shot`, `up-and-down`, `three-putt`.

**Canonicals:** all 15 are hub entries (`/glossary#<slug>`), as `inventory.md` has them. No published guide or post owns any of these intents. None links the Rules Center: the Rules of Golf define none of these shots.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-12 | — |
| 2 | Rules fact-check | Agent, 2026-11-12, under the owner's delegation: every source reopened, every sentence checked, examples recomputed below. [Results](#stage-24-results-agent-2026-11-12) | — |
| 3 | GoLo product audit | Agent, 2026-11-12, under the owner's delegation: no record mentions GoLo or the app, links a GoLo page, or cites a capability | — |
| 4 | SEO/canonical | Agent, 2026-11-12, under the owner's delegation: hub anchors at each slug; `lint:content` passes; related ids resolve | — |
| 5 | Approval | — | **Owner** |

**Delegation (owner, 2026-11-12, #298).** The owner delegated stages 2–4 for the 15 records of batch 6 ("Yes, delegate"), as for batches 1–5, and kept approval. Each record now has a `reviewLog` with `rules`, `product` and `seo` entries, `by: "agent"`, dated 2026-11-12. The records stay `in-review` until the owner approves them.

### Stage 2–4 results (agent, 2026-11-12)

- **Rules.** All 16 source URLs were reopened between 11:06 and 11:07 PST, and each answered 200. Every quoted phrase below was found again in that day's text (52 quotes; punctuation inside quotation marks aside, and Golfshake's "slighly" typo on Thin quoted as it stands). The Rules of Golf define none of these shots, so there is no Rules page to recheck.
- **Three wording fixes.** Fade said the ball "starts a little left of the target"; Golfshake says only "moving to the left of the target", so "a little" is gone. Bump-and-Run said it's "usually played from farther out" than a chip; no source says so (Golfshake has it "played close to the green"), so the explanation now states the difference the sources support: less loft than a wedge, a lower flight and more roll. Topped Shot called nobble "the old British word"; Golf Compendium says "chiefly a British term", and the record now says that.
- **Examples.** Every number recomputed again from the inputs shown; all match (the "Recomputed" lines below). The Montgomerie example matches National Club Golfer's account.
- **Product.** No `goloNote`, `ctaIntent` or `capabilityIds` on any record; no field names GoLo or the app. Three-Putt names Snake as a golf side game and links its glossary entry only.
- **SEO.** Every canonical is `{ kind: "hub", anchor: <slug> }`. Related ids resolve to records (published, or in this batch). `lint:content` passes, and the aliases are unique across all 141 records.

## GoLo

Golf only. GoLo keeps a score per hole (`hole-scoring`: one scorer taps in each hole) and runs side games. No capability in `capabilities.ts` records putts, shot types or up-and-downs, so no record says anything about the app. Three-Putt mentions Snake as a golf side game and links its glossary entry, not a GoLo page, and makes no claim about GoLo. No product-audit questions.

## Differences from `inventory.md`

- **Aliases kept as listed:** Shank keeps "hosel rocket" (Golf Compendium: "hence another term for the shank, 'hosel rocket'") and "socket" (Golf24: "In socket golf, the club does not hit the ball with the clubface, but with the joint between the shaft and club head - the so-called hosel"). Flop Shot keeps "flop" (Golf.com: "a flop (or lob) shot"). Punch Shot keeps "punch", Lag Putt "lag", Approach Shot "approach", Layup "lay up" (Golfshake's headword). Fat Shot keeps "chunk", "chunked" (Golf Compendium: "A chunk shot and a fat shot are the same thing") and "heavy" (National Club Golfer, on Montgomerie in 2006: "The shot was heavy"). Thin Shot keeps "skull", "skulled" and "bladed" (Golf Compendium: skulls "are sometimes called 'bladed shots'"). Topped Shot keeps "topped". Three-Putt keeps "three jack" and "3-putt" (Golf Compendium: "three jack is just a snappier slang expression for the more standard term of 'three putt' or '3-putt'").
- **Not added:** "lob shot" for Flop Shot. Golf.com uses it, but "lob" is also the lob wedge, an equipment term, so the alias waits for batch 8, which has the Wedge record (row 138).
- **Related ids not yet records:** Fat Shot's inventory row relates `chili-dip`, which is a slang record in batch 7. The explanation names chili dip in words, and the related id gets added when that record exists. Every other related id is a published record or in this batch.
- **Thin and skulled.** Golfshake has thin as contact "near its midpoint or slighly [sic] lower"; Golf Compendium has a skull as the leading edge striking "above its equator". The record treats skulled and bladed as the bad end of a thin shot rather than a separate record, as the inventory's aliases do.
- **Up-and-Down and par.** Sources differ on whether it must be for par. Golfshake's and NCG's examples are pars; the record says it's "usually" how a missed green becomes a par, and defines it by the two strokes only.

## The terms

Every source was opened on 2026-11-12 at the URL in the record and answered 200 to a plain fetch. MyGolfSpy's up-and-down page answered 403 and isn't cited.

### Draw (`draw`, P2)
- **Definition:** A shot that curves gently in the air: right to left for a right-handed golfer, left to right for a left-handed one.
- Sources: Golfshake, Draw: "A flight path of the ball in which the ball curves gently right-to-left for a right-handed player, or left-to-right for a left-handed player". Golf Compendium (duck hook): "Hooks are typically mishits, but are sometimes played intentionally."

### Fade (`fade`, P2)
- **Definition:** A shot that starts left of the target and curves gently back to the right, for a right-handed golfer. For a left-hander it's the other way round.
- Sources: Golfshake, Fade: "the golf ball comes off the clubface moving to the left of the target before curving gently back to the right (for a right-handed golfer; reverse directions for a left-hander)". The slice comparison follows the published Slice record ("A gentle, controlled curve the same way is a fade").

### Hook (`hook`, P2)
- **Definition:** A shot that curves sharply in the air, usually by accident: right to left for a right-handed golfer, left to right for a left-handed one.
- Sources: Golf Compendium (duck hook, snap hook): "A 'hook shot' is when the golfer's shot curves in flight to the left of the target line … for lefties, it will be the opposite"; "Hooks are the opposite of slices. Hooks are typically mishits, but are sometimes played intentionally"; a snap hook "is a really bad hook shot". Golfshake, Duck Hook: "another term for a snap hook … curving hard from right to left (for a right-handed golfer) and 'ducks,' or dips, to the ground".

### Shank (`shank`, P2)
- **Definition:** A mishit off the hosel, where the clubhead joins the shaft, instead of the clubface. For a right-handed golfer the ball shoots off sharply to the right.
- Sources: Golfshake, Shank: "makes contact with the ball with a part of the club other than the clubface … shoots out to the right (for a right-hander) at a severe angle". Golf Compendium ("the s-word"): "the club's hosel (hence another term for the shank, 'hosel rocket') or even the shaft is what strikes the golf ball"; golfers say "the s-word" because naming it is "considered very bad luck". Golf.com: "you hit the ball off the neck, toe, or heel of the club". Golf24 (socket).

### Flop Shot (`flop-shot`, P2)
- **Definition:** A short, very high shot that lands softly with little roll, usually played with a lob wedge and an open clubface. It's for when there's little green to land on or something to carry first.
- Sources: Golf.com: "a flop (or lob) shot — a high, soft pitch played intentionally with extra loft"; "a lob wedge (58–60 degrees of loft)"; "for extreme flop shots, you'll need to open the face"; "The more loft you add, the bigger the swing required — and the greater the risk." American Golf: "the ball travels high but not very far, and lands softly with very little roll … when the hole is cut near to the edge of the putting surface … trying to clear a bunker". Hole19: "played with a lob wedge and open club face … particularly useful around greens with limited landing area".

### Punch Shot (`punch-shot`, P2)
- **Definition:** A shot hit deliberately lower than normal, with the ball played farther back in the stance and a shorter follow-through. Players use it most in the wind.
- Sources: Golfshake, Punch Shot: "designed to fly lower than normal … ball played farther back in the stance and a shorter follow-through. The player often chokes down on the club used. Punch shots are frequently used in windy conditions."
- The example's two-club choice is illustrative, not a rule.

### Bump-and-Run (`bump-and-run`, P2)
- **Definition:** A low shot from near the green, played with a less-lofted club such as a 6-, 7- or 8-iron, that spends little time in the air and runs most of the way to the hole.
- Sources: Golfshake, Bump and Run: "played close to the green with a lower-lofted club relative to a wedge (an 8-, 7- or 6-iron, for example), and with very little airtime … played from the back of the stance … mostly scooting along the ground and running up to the green". The difference from a chip (inventory row 106) is stated: a kind of chip with less loft than a wedge, so lower and with more roll. The draft's "usually from farther out" had no source and was cut at stage 2.

### Lag Putt (`lag-putt`, P2)
- **Definition:** A long putt you don't expect to hole, hit to stop close to the hole so the next putt is easy.
- Sources: Golfshake, Lag: "A long putt which, because of its length, the putter does not expect to make but hopes to get close to the cup … A good lag putt positions the golfer to have a simple and easily makeable follow-up putt."
- Recomputed: lag 1 + tap-in 1 = 2 putts ✓

### Approach Shot (`approach-shot`, P2)
- **Definition:** A shot played onto the green, usually from the fairway: typically the second shot on a par 4 or the third on a par 5.
- Sources: Golfshake, Approach: "Your shot into the green usually named from the fairway". Golfshake, Green in Regulation: "your ball must be on the putting surface in the expected number of strokes in relation to par"; on a par 5 "you must reach in three shots".
- Recomputed: 410 − 260 = 150 yards ✓

### Layup (`layup`, P2)
- **Definition:** A shot hit shorter than you could hit it, on purpose, to stay out of trouble or to leave a better distance for the next shot.
- Sources: Golfshake, Lay up: "can be used as a noun, verb or adjective … choosing to hit a shot shorter than you are capable of in order to avoid a hazard or to position the ball in a certain spot. For example on a par 5", with water in front of the green, "you 'Lay up' leaving you an easier shot into the green".
- Recomputed: 520 − 250 = 270 to the green; 270 − 170 = 100 left ✓

### Fat Shot (`fat-shot`, P2)
- **Definition:** A shot where the club hits the ground before the ball, taking too much turf, so the ball comes up well short of the target.
- Sources: Golfshake, Fat Shot: "the golfer's club hits the ground before making contact with the ball … digging up a lot of turf and a shot that travels far shorter than desired". Golf Compendium (chunk): "A chunk shot and a fat shot are the same thing. 'Chili dip' is another common slang term for this shot." National Club Golfer, Fat: "the club hits the ground before the ball, generally taking too big a divot"; on Montgomerie's approach to the last at the 2006 US Open: "The shot was heavy and finished in rough to the side of the putting surface … He took six, a four would have won him the US Open."
- The example is NCG's account; the 72nd hole is "the last" of four rounds ✓

### Thin Shot (`thin-shot`, P2)
- **Definition:** A shot where the club strikes the ball too high, near its middle, instead of below it. The ball comes off low and can run well past the target.
- Sources: Golfshake, Thin: "the clubhead strikes the ball too high (near its midpoint or slighly [sic] lower), often resulting in a low, sometimes slicing shot that can travel a long distance". Golf Compendium (skull): "the leading edge of the clubface striking the golf ball above its equator … skulls are sometimes called 'bladed shots' … Skulled chips, pitches and bunker shots are particularly vexing".

### Topped Shot (`topped-shot`, P2)
- **Definition:** A shot where the club catches only the top of the ball, so it rolls or bounces along the ground instead of flying.
- Sources: Golf Compendium (nobble): contact "above the equator of the golf ball, or merely with the very top of the ball. Nobble, in other words, is another term for a 'top' or topped shot … chiefly a British term". Golf Compendium (skull) for the difference from a skull. The published Worm Burner record: "A shot that barely gets off the ground and skims along the grass."

### Up-and-Down (`up-and-down`, P2)
- **Definition:** Getting the ball into the hole in two strokes from off the green: one shot up onto the green, then one putt down into the hole.
- Sources: Golfshake, Up and Down: "To get the ball into the hole in two strokes when starting from off the green or in a greenside hazard … If you make par, you've made an up-and-down." National Club Golfer: "getting the ball from the edge of the green and into the cup in just two strokes. The first stroke will get you 'up' onto the green and the second will get you 'down' into the hole"; "missed the green, but they managed to get up and down to save par"; tour statistics "Sand save percentage and scrambling". Golf Compendium (chip-in): "A chip-in is a hole-out from a chip shot." The published Sandy record (an up-and-down from a bunker, as a side point).
- Recomputed: approach 2 + chip 3 + putt 4 = 4 = par ✓

### Three-Putt (`three-putt`, P2)
- **Definition:** Taking three putts to hole out once your ball is on the green: miss the first, miss the second, make the third.
- Sources: Golf Compendium (three jack): "'Three-jack' refers to needing three attempts to sink your ball when putting. Miss your first putt, miss your second putt, make your third putt"; "'3-Putt Avoidance' is an official statistical category on PGATour.com". The published Snake record ("Whoever three-putts holds the snake").
- Recomputed: on in 2 + 3 putts = 5 = par 4 + 1, bogey ✓
