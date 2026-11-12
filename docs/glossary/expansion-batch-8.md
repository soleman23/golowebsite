# Glossary expansion batch 8: equipment and technology (#168, #304)

Prepared November 12, 2026 for the owner's review; stages 2–4 done the same day under the owner's delegation, and **approved by the owner the same day**. Not published: a release PR does that. The records are in `lib/content/glossary/terms/expansion-batch-8.ts`, all `approved`, and reach no public page, search index, sitemap, `llms.txt` or structured data (`selectors.ts`; checked by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt`, `sitemap.xml` and `.next/static` for this PR).

## Why now

Batches 1–7 are published (156 records). Equipment and technology is the last batch in `inventory.md` § Expansion batch plan. The owner asked for it on 2026-11-12 ("Start batch 8"), before #167's launch + 28 read (2026-11-26). Drafting changes nothing public. Release timing is the owner's call: wait for launch + 28, or override as for batches 1–7.

**This batch completes #168.** Its release takes the count from 156 to 166, the issue's target. #168 closes once production serves exactly 166 and the docs reconcile.

## Scope

**10 terms**: every equipment and technology expansion term in `inventory.md` § G, rows 137–146.

`iron`, `wedge`, `hybrid`, `fairway-wood`, `loft`, `lie-angle`, `bounce`, `shaft-flex`, `rangefinder`, `launch-monitor`.

Definitions, not buying advice, and no brands (`inventory.md` § G). Sources that name brands are cited only for the general facts quoted below.

**Canonicals:** all 10 are hub entries (`/glossary#<slug>`). **Rangefinder is a change from the inventory** (next section).

**Driver (MVP) now relates `fairway-wood`,** as its inventory row has it. Production drops related ids to unpublished records (`selectors.ts`), so the live Driver entry is unchanged until this batch is released.

## Rangefinder's destination: owner decision

`inventory.md` row 145 and `canonical-map.md` send Rangefinder to `/blog/rangefinder` ("Short definition + post link"). That post is unpublished: `published: false` in `lib/content/blog.ts`, and www.golo.golf/blog/rangefinder answered 404 on 2026-11-12. A canonical or related path must be a served page (`lint:content`), so the record is a **hub entry** with no post link. When the post is published, the record can switch to `{ kind: "existing", path: "/blog/rangefinder" }` in its own PR.

Nothing else depends on the post. The record says nothing about GoLo. The registry's `gps-yardages` (not offered) is not cited, and no field names GoLo or the app.

## Held for the release PR: "lob shot"

The batch 6 packet held "lob shot" as a Flop Shot alias until the Wedge record existed, because "lob" is also the lob wedge. Wedge now names the lob wedge as a club, and an alias match on "lob shot" can only mean the shot. Flop Shot is already published, though, so adding the alias in this PR would change production search before the owner approves anything. **The batch 8 release PR adds it**, if the owner approves this batch.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-12 | — |
| 2 | Rules fact-check | Agent, 2026-11-12, under the owner's delegation: every source reopened, every sentence checked, examples recomputed below. [Results](#stage-24-results-agent-2026-11-12) | — |
| 3 | GoLo product audit | Agent, 2026-11-12, under the owner's delegation: no record mentions GoLo or the app, links a GoLo page, or cites a capability | — |
| 4 | SEO/canonical | Agent, 2026-11-12, under the owner's delegation: hub anchors at each slug; `lint:content` passes; related ids resolve | — |
| 5 | Approval | **Owner**, in chat, 2026-11-12: "Approve all 10" | — |

**Delegation (owner, 2026-11-12, #304).** The owner delegated stages 2–4 for the 10 records of batch 8 ("Yes, delegate"), as for batches 1–7, and kept approval. Each record now has a `reviewLog` with `rules`, `product` and `seo` entries, `by: "agent"`, dated 2026-11-12. The owner approved all 10 in chat the same day ("Approve all 10"), on a question that named Rangefinder as a glossary-page entry and the "lob shot" alias, so each record also has an `approval` entry `by: "owner"`, `reviewedBy: "owner"`, `reviewedOn: 2026-11-12`, and status `approved`. Approved records show only in local review (`next dev`); a release PR sets `published` and `publishedOn` to the day it merges, and adds the alias.

### Stage 2–4 results (agent, 2026-11-12)

- **Rules.** All 20 source URLs were reopened at 12:41 PST, and each answered 200: Rule 4 on randa.org and 19 editorial pages. Every quoted phrase below was found again in that day's text (44 quotes).
- **Two wording fixes.**
  - **Iron:** said the club has "a flat-faced metal head", which none of the cited sources says. It's gone; the definition is now the numbering and the loft-to-distance trade, which they do say.
  - **Launch Monitor:** said "many driving ranges have them". Golf Monthly says only "Maybe your local range has" one, so it now says "some".
- **Wedge's uses, checked.** Golfshake's wedges article supports each use the definition names: the pitching wedge "for those longer distance pitch shots", the sand wedge "to get you out of the sand" and "for close range chip shots", and the lob wedge "for the flop shot" and "short range approach shots".
- **Examples.** Every number recomputed again from the inputs shown; all match (the "Recomputed" lines below).
- **Product.** No `goloNote`, `ctaIntent` or `capabilityIds` on any record; no field names GoLo or the app; no brands.
- **SEO.** Every canonical is `{ kind: "hub", anchor: <slug> }`, Rangefinder included (above). Related ids resolve to records (published, or in this batch). `lint:content` passes, and the aliases are unique across all 166 records.

## GoLo

Golf only. GoLo doesn't sell, fit or measure equipment, and `gps-yardages` and `distance-logging` are `not-offered` in `capabilities.ts`. No record names GoLo, the app or a capability. No product-audit questions beyond Rangefinder's destination above.

## Differences from `inventory.md`

- **Rangefinder:** hub instead of `/blog/rangefinder` (above).
- **Aliases kept:** Hybrid keeps "rescue club" (Today's Golfer: "Hybrids, sometimes known as rescue clubs"); Shaft Flex keeps "flex"; Rangefinder keeps "laser".
- **Related ids added beyond the inventory:** Iron relates `loft`; Wedge relates `pitch` and `flop-shot`; Loft relates `driver` and `wedge`; Lie Angle relates `iron`; Launch Monitor relates `shaft-flex` (Golf Monthly: launch monitors "establish swing speed and potential shaft flex"). Shaft Flex has no related id, as the inventory has none.
- **Lie Angle** says it isn't the lie (where the ball rests), as the inventory asks; "lie" is not an alias.

## The terms

Every source was opened on 2026-11-12 at the URL in the record and answered 200. Rule 4 on randa.org is the 2023 edition.

### Iron (`iron`, P2)
- **Definition:** One of the numbered clubs, from about 3 to 9. The higher the number, the more loft, so the higher and shorter the shot.
- Sources: Golf Compendium (mid-irons): "the 3- and 4-iron were usually called the long irons, the 5-, 6- and 7-irons were known as the mid-irons, and the 8- and 9-iron plus the pitching wedge were called the short irons … today many golfers have replaced long irons with hybrids". Golf Compendium (long irons): "golf club manufacturers often market hybrids specifically as replacements for long irons". Golf Monthly (lofts): "There is no official loft angle assigned to each iron … a three-iron usually comes in at around 20 degrees … a seven-iron is usually around 34 degree and then the eight- and nine-irons often come with 37 and 41 degrees".
- Recomputed: 160 is 10 yards past the 7-iron's 150, so one club more, the 6 ✓ (illustrative)

### Wedge (`wedge`, P2)
- **Definition:** The most lofted clubs in the bag, for short approaches, pitches, chips and bunker shots. The four main types, from least loft to most, are the pitching, gap, sand and lob wedge.
- Sources: Golfshake (wedges): "The four main wedges are the lob wedge, pitching wedge, sand wedge and the gap wedge. With the 14-club maximum rule, you should be looking to carry four wedges at the very most." Golf Monthly (lofts): "a pitching wedge can range from 45-50 degrees, a gap wedge is often 50-54, and then a sand wedge is between 55-58. The most lofted club in the bag is the lob wedge which can be from 58-64 degrees." Golf Compendium (attack wedge): "the exact same thing as a gap wedge … fills the gap in loft between the pitching wedge (mid-40 degrees in loft) and sand wedge (mid-50 degrees in loft)". Rule 4.1b(1): "A player must not: Start a round with more than 14 clubs, or Have more than 14 clubs during the round."

### Hybrid (`hybrid`, P2)
- **Definition:** A club that blends a long iron and a fairway wood: its head is bigger than an iron's but smaller than a fairway wood's, and most golfers find it easier to hit than a long iron.
- Sources: Today's Golfer: "Hybrids, sometimes known as rescue clubs … Designed to be a combination of iron and fairway wood … these clubs have heads that are larger than an iron but not as big as a fairway wood." Golf.com: "A hybrid is the blend of a long iron and a fairway wood." Golf Compendium (long irons): hybrids "are easier for most golfers to play compared to long irons … rather than a 4-iron, a 4-hybrid". Golf Monthly (lofts): "Sometimes they also replace fairway woods".

### Fairway Wood (`fairway-wood`, P2)
- **Definition:** A wood with more loft than the driver, made to be hit off the fairway as well as the tee. They're numbered by loft: 3-wood, 5-wood, 7-wood.
- Sources: Golf Monthly (lofts): "there is an added element of having to be able to use the club off the tee and from the fairway. Usually fairways range from 13-19 degrees but there are also professional golfers who use seven-woods which can be as high as 24 degrees"; drivers "range between lofts of 7 degrees and 13 degrees". Golf Compendium (brassie): "the equivalent of a modern fairway wood … the term lived on and is sometimes still heard today".

### Loft (`loft`, P2)
- **Definition:** The angle of the clubface away from vertical, in degrees. More loft sends the ball higher and shorter; less loft sends it lower and farther.
- Sources: Golfshake, Loft: "A measurement, in degrees, of the angle at which the face of the club lies relative to a perfectly vertical face … the higher the loft, the less distance you will get." Golf Compendium (stronger lofts): "Strengthening lofts or getting stronger lofts refers to reducing loft angle — going from, say, 34 degrees to 32 degrees in a club. Stronger lofts mean (all other things being equal) a little more distance, a little flatter trajectory." Golf Monthly (lofts) for the driver and lob wedge ranges.
- Recomputed: 34 − 32 = 2 degrees stronger ✓

### Lie Angle (`lie-angle`, P3)
- **Definition:** The angle between a club's shaft and the ground when its sole sits flat. Not the same as the lie, which is where the ball rests.
- Sources: National Club Golfer: "Lie angle is the angle between the shaft of the club and the ground when the club arrives at impact parallel to the ground. The lie angle is known as 'too upright' when the toe of the club is lifted too high above the ground. This will cause the heel to strike the turf first, shutting the club-face and sending the ball to the left. Oppositely a 'too flat' club has the heel too high causing the toe to dig into the ground. This opens the clubface sending the ball to the right"; "one of the biggest components of custom fitting". Golf.com: "a measurement of the angle formed by the hosel/shaft and the ground when the head is at rest".

### Bounce (`bounce`, P3)
- **Definition:** The angle between a club's leading edge and the lowest point of its sole, in degrees. More bounce holds the leading edge higher off the ground.
- Sources: Golfshake, Bounce: "Measurement in degrees of the angle from the front edge of a club's sole to the point that actually rests on the ground at address." National Club Golfer: "The bounce is the angle between the leading edge of the club and the lowest point of the sole … If a wedge has a high bounce degree the leading edge will sit higher off the ground at address"; "Low bounce wedges are ideal for firm turf conditions and bunkers with harder or coarse sand. Softer turf conditions can require more bounce"; "High bounce is better for players who have a digger swing style creating a steep angle of attack as it will help the club move through the turf." Golf Monthly: "On a wedge there is often two numbers inscribed, one corresponds to the loft and the other, you guessed it, to the bounce. The bounce will be the smaller number - no more than 14 and no less than 4".

### Shaft Flex (`shaft-flex`, P3)
- **Definition:** How much a club's shaft bends during the swing. Ratings run from extra stiff at the firm end to ladies at the soft end, with stiff and regular in between.
- Sources: Golf Compendium (putter shaft flex): "The shafts in other golfer clubs are rated for flex — how much they bend during the swing — from extra stiff on the firmer end of the scale to ladies flex on the 'bendier' end of the scale. Putter shafts are not rated because they are all essentially stiff shafts due to their (relatively) short length, plus the fact that putter swings are far, far gentler". Golf Monthly: "Should I be regular or stiff?"; "the faster a player swings the club, the more load is placed on the shaft, and as such stiffer shafts are required"; "Tempo plays a huge part in determining flex also".

### Rangefinder (`rangefinder`, P2)
- **Definition:** A handheld laser you aim at a target, such as the flag, to get its exact distance. It's one kind of distance-measuring device; GPS watches and handhelds are the others.
- Sources: Golf Monthly: distance-measuring devices "come in three main forms - a laser rangefinder, GPS watch or handheld GPS"; laser rangefinders "provide exact distances to the flag and other points of interest in a speedy fashion"; slope mode is not "legal for competition use, however, so be sure to switch it off". Today's Golfer: "the slope function adjusts the straight-line distance to account for elevation changes between you and the target … the 'play as' distance on an uphill shot will be longer than the straight-line distance"; "if you're playing in a club competition … it absolutely must be switched off". Rule 4.3a(1): "Allowed. Getting information on distance or direction (such as from a distance-measuring device or compass). Not Allowed. Measuring elevation changes … See Committee Procedures, Section 8; Model Local Rule G-5 (the Committee may adopt a Local Rule prohibiting the use of distance-measuring devices)."
- Recomputed: uphill, so the slope reading (151) is longer than the straight line (143) ✓

### Launch Monitor (`launch-monitor`, P3)
- **Definition:** A device that measures each shot just after impact and reports numbers such as clubhead speed, ball speed, launch angle, spin rate and carry distance.
- Sources: Golf Monthly (launch monitor data): "Launch monitors have changed the way many PGA professionals teach"; "Maybe your local range has" one; "ball speed = clubhead speed x smash factor"; spin rate "Measured in revolutions per minute (RPM)"; "Carry distance is the number that every golfer needs to know - that's carry for every club in the bag"; "focus on your average carry distance rather than your longest". Golf Monthly (shaft flex): "Launch monitors are excellent tools to establish swing speed and potential shaft flex". Rule 4.3a(3): "Allowed … Recording (for use after the round) playing or physiological information from the round (such as club distance, playing statistics or heart rate). Not Allowed. Processing or interpreting playing information from the round (such as club recommendations based on current round distances)".
