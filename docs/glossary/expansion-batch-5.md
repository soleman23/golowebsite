# Glossary expansion batch 5: course, rules and etiquette (#168, #295)

Prepared November 11, 2026 for the owner's review; stages 2–4 done the same day under the owner's delegation, and **approved by the owner the same day, and published by the batch 5 release PR**. The records are in `lib/content/glossary/terms/expansion-batch-5.ts`, now `published`. Until the release PR, they were checked at each stage to reach no public page, search index, sitemap, `llms.txt` or structured data (`selectors.ts`; checked by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt`, `sitemap.xml` and `.next/static` for this PR).

## Why now

Batches 1–4 are published (111 records). Course, rules and etiquette is next in `inventory.md` § Expansion batch plan. The owner asked for it on 2026-11-11 ("Start batch 5"), before #167's launch + 28 read (2026-11-26). Release timing was the owner's call, as for batches 1–4; they released it the same day.

## Scope

**15 terms**, #168's cap: every course, rules and etiquette expansion term in `inventory.md` § F, rows 120–134.

`putting-green`, `fringe`, `general-area`, `out-of-bounds`, `provisional-ball`, `unplayable-ball`, `stroke-and-distance`, `relief-area`, `nearest-point-of-complete-relief`, `ground-under-repair`, `temporary-water`, `preferred-lies`, `ready-golf`, `local-rule`, `pace-of-play`.

Merge **M6** is applied: Dance Floor is an alias of Putting Green (Golf Compendium: "the term 'dance floor' is a slang term that means the putting green").

**Canonicals:** all 15 are hub entries (`/glossary#<slug>`), as `inventory.md` has them. No published guide or post owns any of these intents. Twelve link the published Rules Center rule they cite (`/rules#rule-N`), as earlier records do.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-11 | — |
| 2 | Rules fact-check | Agent, 2026-11-11, under the owner's delegation: every source reopened, every sentence checked, examples recomputed below. [Results](#stage-24-results-agent-2026-11-11) | — |
| 3 | GoLo product audit | Agent, 2026-11-11, under the owner's delegation: no record mentions GoLo or the app, links a GoLo page, or cites a capability | — |
| 4 | SEO/canonical | Agent, 2026-11-11, under the owner's delegation: hub anchors at each slug; `lint:content` passes; related ids and Rules Center paths resolve | — |
| 5 | Approval | **Owner**, in chat, 2026-11-11: "Approve all 15" | — |

**Delegation (owner, 2026-11-11, #295).** The owner delegated stages 2–4 for the 15 records of batch 5 ("Yes, delegate"), as for batches 1–4, and kept approval. Each record now has a `reviewLog` with `rules`, `product` and `seo` entries, `by: "agent"`, dated 2026-11-11. The owner approved all 15 in chat the same day ("Approve all 15"), so each record also has an `approval` entry `by: "owner"`, `reviewedBy: "owner"`, `reviewedOn: 2026-11-11`, and status `approved`. The owner then asked for the merge and release once each PR was reviewed and ready ("merged after they are reviewed and ready"), ahead of #167's launch + 28 read, as for batches 1–4. The batch 5 release PR moved them to `published`, with `publishedOn` the day it merged. The release recheck (`editorial-review.md` § Release recheck) is this day's stage 2 and 3 work: every source reopened at 20:13–20:16 PST, the Rules of Golf still the 2023 edition, and no capability ids to recheck.

### Stage 2–4 results (agent, 2026-11-11)

- **Rules.** All 15 source URLs were reopened between 20:13 and 20:16 PST, and each answered 200. The nine R&A Rules pages (Definitions and Rules 1, 5, 6, 13, 14, 16, 18, 19) are the 2023 edition, and every phrase quoted below was found again. Definitions text was checked from the page's embedded data. Committee Procedures Section 8 was opened in headless Chrome, and its Section 8E Model Local Rule E-3 was read in full. It is now cited on Preferred Lies and Local Rule (`CP8`).
- **One correction from E-3.** The draft said preferred lies applies to "a closely mown area, usually the fairway", for when "the course is wet or worn". E-3's wording is "When any part of a player's ball touches part of the general area cut to fairway height or less", relief is taken "once" by placing a ball within a specified size "such as one club-length, one scorecard length or 6 inches", and the purpose names "heavy snows, spring thaws, prolonged rains or extreme heat". The record now says "the general area cut to fairway height or less", "when bad weather has damaged the course", and that the relief is free, taken once, and "should be withdrawn as soon as conditions allow" (E-3's words).
- **Earlier correction (Codex on #296).** Provisional Ball now includes Rule 18.3c(3)'s penalty-area case.
- **Examples.** Every number recomputed again from the inputs shown; all match (the "Recomputed" lines below).
- **Product.** No `goloNote`, `ctaIntent` or `capabilityIds` on any record; no field names GoLo or the app.
- **SEO.** Every canonical is `{ kind: "hub", anchor: <slug> }`. Related ids resolve to records. The twelve `/rules#rule-N` paths are published Rules Center anchors. `lint:content` passes.

## GoLo

Golf only. GoLo keeps score and runs side games; it doesn't apply or enforce any of these Rules, and no capability in `capabilities.ts` touches them (`rules-rulings` is not offered). No product-audit questions.

## Differences from `inventory.md`

- **Putting Green** keeps "green" and "dance floor" (M6).
- **Fringe** keeps "collar", "apron" and "frog hair" (Golfshake: apron "May also be know as 'Fringe' or 'Collar'"; Golf Compendium on frog hair).
- **General Area** keeps "through the green", the pre-2019 Rules term (National Club Golfer: "Old: Through the green New: General area"). Golfshake also uses "through the green" informally for a ball that ran over the back of the green. The alias stays because it's the old Rules name, and the entry says so.
- **Nearest Point of Complete Relief** keeps "nearest point of relief" (National Club Golfer, the pre-2019 name) and "npcr".
- **Unplayable Ball** keeps "unplayable". **Out of Bounds** keeps "ob". **Provisional Ball** keeps "provisional".
- **Preferred Lies** keeps "lift clean and place" and "winter rules" (R&A winter rules FAQ; Golfshake: "also known as 'winter rules'").
- **Penalty Area, Bunker, Fairway, Rough, Teeing Area** are the MVP records; related ids point at them. `stroke-and-distance` is now a record, so Out of Bounds, Provisional Ball and Unplayable Ball relate to it.
- **Vocabulary check.** The site bans a bare "stakes"; only a colour or golf phrase ("white stakes", "red stakes") passes. Out of Bounds says "white stakes"; Ground Under Repair says "marked out with rope or lines".

## The terms

Every source was opened on 2026-11-11 at the URL in the record. The R&A pages answered a plain fetch and are the 2023 edition; Definitions text was read from the page's embedded data. The R&A's Committee Procedures Section 8 page (the Model Local Rules) renders only in a browser, so Preferred Lies and Local Rule first cited the R&A's own winter rules FAQ for Model Local Rule E-3, plus Rule 1.3a; stage 2 opened the Section 8 page in headless Chrome and added it.

### Putting Green (`putting-green`, P2)
- **Definition:** The specially prepared area around the hole you're playing, made for putting. Its edge is where the specially prepared grass starts, unless the committee marks it another way.
- Sources: Definitions, Putting Green: "Is specially prepared for putting"; the edge "is defined by where it can be seen that the specially prepared area starts … unless the Committee defines the edge in a different way"; other holes' greens "are wrong greens and part of the general area". Rule 13.1a: on the green "when any part of the ball: Touches the putting green". 13.1b: may be lifted and cleaned, spot marked, replaced on its original spot. 13.1c(2): "A player may repair damage on the putting green". 13.1f: "Relief Must Be Taken from Wrong Green". Rule 1.2a names "repairing ball-marks".

### Fringe (`fringe`, P2)
- **Definition:** The band of closely mown grass around a putting green, cut shorter than the fairway but longer than the green. Under the Rules of Golf it's part of the general area, not the green.
- Sources: Golf Compendium (frog hair): fringe and apron "both refer to golf turfgrass that is mowed shorter than the height of the fairway grass" [and higher than the green]. Golfshake (Apron/Fringe/Collar). Definitions, General Area (everything but the four defined areas) and Putting Green (the edge).
- Rule 13.1b applies to "A ball on the putting green", so not on the fringe ✓

### General Area (`general-area`, P2)
- **Definition:** Under the Rules of Golf, the whole course except four defined areas: the teeing area you start the hole from, penalty areas, bunkers, and the green you're playing to. Fairway, rough and trees are all general area.
- Sources: Definitions, General Area: "all of the course except for the other four defined areas"; it "includes: All teeing locations on the course other than the teeing area, and All wrong greens". National Club Golfer: "Old: Through the green New: General area". Rule 19.2: unplayable ball relief in the general area for one penalty stroke.

### Out of Bounds (`out-of-bounds`, P2)
- **Definition:** Everything outside the course's boundary edge, usually marked by white stakes, lines or a fence. A ball is out of bounds only when all of it is outside that edge, and playing again costs stroke and distance.
- Sources: Definitions, Out of Bounds: "All areas outside the boundary edge of the course as defined by the Committee"; stakes or fence posts defining it "are out of bounds". Definitions, Boundary Object: "from which free relief is not allowed". Rule 18.2a(2): "A ball at rest is out of bounds only when all of it is outside the boundary edge". 18.2b: "the player must take stroke-and-distance relief". Golfshake: "Out of bounds will be marked usually by white stakes".
- Recomputed: tee shot 1 + penalty 1 = 2; the replayed drive is the 3rd ✓

### Provisional Ball (`provisional-ball`, P2)
- **Definition:** A second ball played in case the first is out of bounds or lost outside a penalty area. It saves walking back to play again, but you must say you're playing a provisional before you hit it.
- Sources: Definitions, Provisional Ball: "in case the ball just played … may be: Out of bounds, or Lost outside a penalty area". Rule 18.2a(1): lost "if not found in three minutes". 18.3b: "must announce … It is not enough … only to say that they are playing another ball … must use the word 'provisional' or otherwise clearly indicate"; otherwise that ball is in play "under penalty of stroke and distance". 18.3c(2)–(3): it becomes the ball in play when the original is lost or out of bounds; it must be abandoned when the original is found on the course outside a penalty area before the three minutes end, and also when the original "Is Found in Penalty Area or Is Known or Virtually Certain to Be in Penalty Area" (play it as it lies or take relief under Rule 17.1d). The draft's explanation first missed the penalty-area case; Codex caught it on #296 and it's fixed.
- Recomputed: drive 1 + penalty 1 + provisional 1 = 3 played ✓

### Unplayable Ball (`unplayable-ball`, P2)
- **Definition:** A ball you decide not to play where it lies. You can declare it anywhere except in a penalty area and take relief for one penalty stroke: stroke and distance, back on a line from the hole, or within two club-lengths.
- Sources: Rule 19.1: "A player is the only person who may decide to treat their ball as unplayable"; "allowed anywhere on the course, except in a penalty area"; in a penalty area "the player's only relief option is … Rule 17". 19.2: three options, "in each case adding one penalty stroke"; 19.2c "Two club-lengths", not nearer the hole. 19.3a: in a bunker the back-on-the-line and lateral drops "must be dropped in and come to rest in the bunker". 19.3b: back on the line outside the bunker "for a total of two penalty strokes".
- Recomputed: second shot 2 + penalty 1 = 3; next stroke is the 4th ✓

### Stroke and Distance (`stroke-and-distance`, P2)
- **Definition:** Playing again from where you made your previous stroke, with one penalty stroke added. You lose any distance that stroke gained. It's required for a ball lost or out of bounds.
- Sources: Definitions, Stroke and Distance: "Gets one penalty stroke, and Loses the benefit of any gain of distance"; relief "under Rule 17, 18 or 19". Rule 18.1: "At any time, a player may take stroke-and-distance relief by adding one penalty stroke". 18.2b: for lost or out of bounds "the player must take stroke-and-distance relief" (with exceptions for a ball known or virtually certain to be somewhere a Rule gives other relief).
- Recomputed: drive 1 + penalty 1 + re-tee 3rd + 4th on the green + 2 putts = 6 = par 4 + 2, double bogey ✓

### Relief Area (`relief-area`, P3)
- **Definition:** The area where you must drop a ball when taking relief under a Rule. It's measured from a reference point, is one or two club-lengths in size, and has limits, such as no nearer the hole.
- Sources: Definitions, Relief Area (reference point; "either one or two club-lengths"; limits such as "not nearer the hole"). Rule 14.3b(2): "dropped straight down from knee height". 14.3c(1): "The ball must come to rest in the relief area". Rule 16.1b: one club-length from the nearest point of complete relief, not nearer the hole.

### Nearest Point of Complete Relief (`nearest-point-of-complete-relief`, P3)
- **Definition:** The reference point for free relief from conditions such as temporary water or ground under repair: the nearest spot, no nearer the hole and in the required area, where the condition no longer interferes.
- Sources: Definitions, Nearest Point of Complete Relief: the reference point for free relief from an abnormal course condition and others; "Nearest to the ball's original spot, but not nearer the hole"; "In the required area of the course"; no interference "for the stroke the player would have made"; "requires the player to identify the choice of club, stance, swing and line of play". Abnormal Course Condition: animal hole, ground under repair, immovable obstruction, temporary water. National Club Golfer: "Old: Nearest point of relief New: Nearest point of complete relief". Rule 16.1b: one club-length.
- The cart path is an immovable obstruction, so an abnormal course condition ✓

### Ground Under Repair (`ground-under-repair`, P2)
- **Definition:** Any part of the course the committee defines as under repair, usually marked out with rope or lines, plus holes made by maintenance staff and material piled for removal. If it interferes, you get free relief.
- Sources: Definitions, Ground Under Repair: "Any part of the course the Committee defines … (whether by marking it or otherwise)"; also "Any hole made by the Committee or the maintenance staff", "but not including aeration holes"; "Grass cuttings, leaves and any other material piled for later removal". Rule 16.1b: free relief, one club-length. Golfshake: "designated … by staking, roping or otherwise mar[king]".
- Recomputed: second shot 2, free relief adds 0, next is the 3rd ✓

### Temporary Water (`temporary-water`, P2)
- **Definition:** A temporary accumulation of water on the ground outside a penalty area, such as a puddle from rain or irrigation, that you can see before or after you take your stance. You get free relief from it.
- Sources: Definitions, Temporary Water (quoted in the definition); "It is not enough for the ground to be merely wet, muddy or soft"; "Dew and Frost are not temporary water"; snow and natural ice "are either loose impediments or, when on the ground, temporary water, at the player's option". National Club Golfer: "Old: Casual water New: Temporary Water". Rule 16.1b.

### Preferred Lies (`preferred-lies`, P2)
- **Definition:** A local rule that lets you lift, clean and place a ball lying in the general area cut to fairway height or less, within a set distance of where it lay, no nearer the hole. Committees use it when bad weather has damaged the course.
- Sources: The R&A winter rules FAQ: relief "generally restricted to when your ball lies on the fairway"; "lift your ball, clean it and replace it on another spot within a specified relief area (for example, six inches, a scorecard length or one club length) of the original spot, no nearer the hole"; "The decision to enforce preferred lies under Model Local Rule E-3 rests with the Committee"; it "should end" when conditions improve. Golfshake: "'Preferred lies' (also known as 'winter rules') … exists by local rule only". Golf Monthly: clubs adopt it "to allow balls on the fairways or other closely mown areas to be lifted, cleaned and placed". Rule 1.3a: local rules are part of the Rules.
- Committee Procedures Section 8E, Model Local Rule E-3 (opened in headless Chrome at stage 2): "When any part of a player's ball touches part of the general area cut to fairway height or less … the player may take free relief once by placing the original ball or another ball" in a relief area of "[Specify size … such as one club-length, one scorecard length or 6 inches]", "Must not be nearer the hole", "Must be in the general area"; the purpose: conditions "such as heavy snows, spring thaws, prolonged rains or extreme heat"; "Such a Local Rule should be withdrawn as soon as conditions allow"; use outside the fairway "is not recommended".

### Ready Golf (`ready-golf`, P2)
- **Definition:** Playing when you're ready instead of strictly in turn, safely and responsibly, to keep the round moving. The Rules of Golf allow and encourage it in stroke play.
- Sources: Rule 6.4b(2): "Playing Out of Turn in a Safe and Responsible Way ('Ready Golf'). Players are both allowed and encouraged". Rule 6.4 purpose: in match play "the opponent may cancel that stroke and make the player play again"; in stroke play "there is no penalty for playing out of turn". Rule 5.6b refers to ready golf.

### Local Rule (`local-rule`, P2)
- **Definition:** A change to the Rules of Golf that a committee adopts for its course or competition, such as preferred lies. For that round, a local rule is part of the Rules you play by.
- Sources: Rule 1.3a: "The term 'Rules' means: Rules 1-25 and the definitions … and Any 'Local Rules' the Committee adopts for the competition or the course"; it points to "Committee Procedures, Section 8 (Local Rules and full set of authorized Model Local Rules)". The R&A winter rules FAQ (Model Local Rule E-3).

### Pace of Play (`pace-of-play`, P2)
- **Definition:** How quickly a group gets round the course. The Rules of Golf expect a prompt pace and recommend taking no more than 40 seconds for a stroke once it's your turn, usually less.
- Sources: Rule 5.6b: "Play continuously and at a prompt pace"; "it is recommended that they make the stroke in no more than 40 seconds, and usually more quickly than that"; 5.6b(3): "the Committee should adopt a Local Rule setting a Pace of Play Policy … it may set penalties for not following the Policy". Rule 6.4b(2) for ready golf.
