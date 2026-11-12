# Glossary expansion batch 7: slang, plus Halve (#168, #301)

Prepared November 12, 2026 for the owner's review. The records are in `lib/content/glossary/terms/expansion-batch-7.ts`, all `in-review`. Nothing here reaches a public page, the search index, the sitemap, `llms.txt` or structured data until a record is approved and a release PR publishes it (`selectors.ts`; checked by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt`, `sitemap.xml` and `.next/static` for this PR).

## Why now

Batches 1–6 are published (141 records). Slang, plus Halve, is next in `inventory.md` § Expansion batch plan. The owner asked for it on 2026-11-12 ("Start batch 7"), before #167's launch + 28 read (2026-11-26). Drafting changes nothing public. Release timing is the owner's call: wait for launch + 28, which can reorder the batches not yet released, or override as for batches 1–6.

**This batch crosses 150.** Its release takes the count from 141 to 156, so spec §7.4's title ("Golf Glossary: 150+ Terms, Slang & Games | GoLo Golf") ships in the batch 7 release PR, not this one.

## Scope

**15 terms**, #168's cap: every slang expansion term in `inventory.md` § H, rows 153–166, plus Halve (§ A, row 20).

`halve`, `knee-knocker`, `fried-egg`, `chili-dip`, `lip-out`, `inside-the-leather`, `the-turn`, `dormie`, `all-square`, `good-good`, `the-yips`, `army-golf`, `members-bounce`, `grip-it-and-rip-it`, `ham-and-egg`.

**Mixed batch.** Halve is a scoring term (row 20) that moved here because scoring had 16 expansion terms, and because its source, Rule 3.2a, is shared with Dormie and All Square (`inventory.md` § Expansion batch plan). It keeps `primaryCategory: "scoring"`, so no category total moves. Substitutions S1 (Halve), S7 (Knee-Knocker), S8 (Inside the Leather) and S9 (Ham and Egg) are applied as `inventory.md` § Substitutions has them.

**Canonicals:** all 15 are hub entries (`/glossary#<slug>`). Halve, Dormie and All Square also link `/games/nassau`, as `canonical-map.md` has them. Halve, All Square, Fried Egg, Inside the Leather and Good-Good link the published Rules Center (`/rules#rule-3`, `/rules#rule-16`, `/rules#conceded-putt`).

**Fat Shot (batch 6) now relates `chili-dip`.** The batch 6 packet left that id until Chili Dip was a record. Production drops related ids to unpublished records (`selectors.ts`), so the published Fat Shot entry is unchanged until this batch is released.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-12 | — |
| 2 | Rules fact-check | Sources opened and quoted below; examples recomputed | Owner sign-off, or a delegation for this batch |
| 3 | GoLo product audit | No record makes a GoLo claim or cites a capability; the three Nassau links checked against the guide's own glossary | Owner sign-off, or a delegation |
| 4 | SEO/canonical | Hub anchors at each slug; `lint:content` passes; related ids and paths resolve | Owner sign-off, or a delegation |
| 5 | Approval | — | **Owner** |

## GoLo

Golf only, with three links to a GoLo guide. Halve, Dormie and All Square link `/games/nassau`, whose own glossary defines all three: All square (AS), "The match is dead even — nobody is up"; Halve, "A tied hole. It counts for nothing and the match standing stays put"; Dormie, "You’re up by exactly as many holes as are left — you can’t lose the match, only win or tie it". The records agree with it. Dormie is more precise: under Rule 3.2a(4) a match that must have a winner goes to extra holes, where the dormie side can still lose; in a Nassau a level nine or eighteen is a push, so the guide's line holds there. No record says what GoLo does, so no capability id is cited and `capabilities.ts` needs no recheck. No product-audit questions.

## Differences from `inventory.md`

- **Aliases kept:** Halve keeps "halved hole"; Lip-Out "lipped out" (Golf Compendium: "your putt lipped out"); Inside the Leather "in the leather"; The Turn "making the turn"; Dormie "dormy"; The Yips "yips"; Ham and Egg "ham-and-egging" (Golf Compendium: "ham-and-egging it").
- **Not added:** "AS" for All Square. It's the leaderboard abbreviation (Golf Compendium), but as a search alias it would match the word "as". The explanation names it instead.
- **Related ids added beyond the inventory:** Fried Egg relates `unplayable-ball` (Rule 19.3 is its only relief); Inside the Leather relates `putter` (the measuring stick); Halve relates `dormie`; Chili Dip relates `pitch` (NCG: "whether you are hitting a pitch or a chip"). Member's Bounce has no related id, as the inventory has none.
- **Dormie and the Rules.** Golf Compendium says "dormie" was removed from the Rules in the 2019 revision. The 2023 Rule 3 text has no "dormie", so the record says only that the Rules don't use it.

## The terms

Every source was opened on 2026-11-12 at the URL in the record and answered 200. The R&A pages are the 2023 edition. Not cited because they refused the request: MyGolfSpy's glossary and "grip it and rip it" article (403), the Mayo Clinic yips page (403), The Golf Expert's K glossary (404) and Hole19's scariest shots post (404). Golf Monthly's "32 golfing cliches" credits Ian Baker-Finch with "I don't go that far on my holidays", not "grip it and rip it", so it isn't cited either.

### Halve (`halve`, P1, scoring)
- **Definition:** In match play, a tied hole: both sides take the same number of strokes, so neither wins it. A match that ends level is halved too.
- Sources: Rule 3.2a(2): "A hole is tied (also known as “halved”) when: The player and opponent complete the hole in the same number of strokes (including strokes made and penalty strokes), or The player and opponent agree to treat the hole as tied (but this is allowed only after at least one of the players has made a stroke to begin the hole)." Rule 3.2a(4): "If a match is tied after the final hole: The match is extended one hole at a time until there is a winner … But the Terms of the Competition may say that the match will end in a tie". Golf Compendium: "a golf match can be halved (if the match ends in a tie score, it is halved)"; "In the Ryder Cup, Presidents Cup and Solheim Cup … matches can end in ties". Golfshake: "'Halved' is a match play term that means a hole or match was tied."

### Knee-Knocker (`knee-knocker`, P3)
- **Definition:** A short putt you really should make but easily could miss, usually somewhere inside 6 feet, with enough riding on it to make your knees shake.
- Sources: All Square Golf: "A short putt, which you really shouldn't miss, but often do." Golf Monthly: "make more putts from that knee knocker range of 6 ft and in".

### Fried Egg (`fried-egg`, P3)
- **Definition:** A ball half buried in a bunker, sitting in its own small crater with only the top showing, like the yolk of a fried egg.
- Sources: Golf Compendium: "happens when your golf ball hits soft or wet sand and winds up partially buried in the bunker. Only the top half or so of the golf ball remains visible above the sand, looking, in a way, like the yolk in the middle of the white part of a fried egg"; "There are two schools of thought … One is take your normal stance for a bunker shot and open the clubface of your most-lofted wedge. Then take a very steep backswing, and hit down on the ball … just behind the ball". Rule 16 purpose: "This Rule also covers free relief when a player’s ball is embedded in its own pitch-mark in the general area." Rule 19.3 (unplayable ball in a bunker).

### Chili Dip (`chili-dip`, P3)
- **Definition:** A chip or pitch hit fat: the club digs into the ground behind the ball and makes little or no contact, so the ball goes only a short way.
- Sources: National Club Golfer: "Across the pond, we have a much simpler term for this. It’s a shot that’s fat. When you chili-dip, it means the club – whether you are hitting a pitch or a chip – strikes the ground behind the ball … little, or no contact, with the ball … a dribble of a shot that doesn’t go very far." Golf.com: "That dreaded shot around the green when the leading edge sticks in behind the ball and your club makes feeble (if any) contact."
- Recomputed: 10 yards short, the ball moves 3, so it's still 7 yards short ✓

### Lip-Out (`lip-out`, P3)
- **Definition:** A putt that catches the edge of the hole, looks like it's dropping, then spins around the rim and stays out.
- Sources: Golf Compendium: "the ball caught the edge of the hole, appeared to be falling, but then whipped around a portion of the rim before finishing outside the cup … That's because the speed of the putt was too fast"; "I can't believe your putt lipped out like that." Golfshake, Lip: "The rim of the hole or cup, which leads to the phrase 'lip out'".
- Recomputed: par putt missed, tap-in: par + 1 = bogey ✓

### Inside the Leather (`inside-the-leather`, P3)
- **Definition:** A rule of thumb for gimmes: a putt is given if the ball is nearer the hole than the length of a putter from its head to the bottom of the grip, about two feet on a standard putter.
- Sources: Golf Compendium: "'inside the leather' corresponds to the distance from the bottom of your putter up the shaft to the bottom edge of your putter's grip … with a conventional putter, inside the leather roughly means about two feet"; "you might want to hash out an agreement among your buddies before the round begins which putter will be the 'official' inside-the-leather measuring stick"; "lay the head of your putter inside the cup … and your putter shaft on the ground next to the disputed golf ball". Golf Compendium (gimmes): "Gimmes … are never allowed under the rules." Rules 3.2b(1), 3.3c, as the published Gimme record.
- Recomputed: 20 inches is under about 24 ✓

### The Turn (`the-turn`, P3)
- **Definition:** The halfway point of an 18-hole round, between finishing the 9th and starting the 10th. Making the turn means moving from the front nine to the back nine.
- Sources: Golf Compendium: "'The turn' is an expression golfers use to denote the part of the golf course where the front nine turns into the back nine … the halfway point of an 18-hole golf course. So 'making the turn' means leaving the front nine and moving on to the back nine"; "many golfers look forward to 'making the turn' as a time when they can grab a snack or a beverage".

### Dormie (`dormie`, P2)
- **Definition:** In match play, being up by exactly as many holes as are left: 2 up with 2 to play, for example. The side that's up can't lose over the remaining holes; at worst the match ends level.
- Sources: Golf Compendium: "the golfer or side that is leading the match is ahead by the same number of holes as remain to be played"; "In the revisions to the rule book made in 2019, 'dormie' was removed." Golfshake: "a lead that matches the holes remaining (i.e., 3 holes up with 3 holes to play), thus assuring at least a halve." Rule 3.2a(3): a player wins when they lead "by more holes than remain to be played"; 3.2a(4): a tied match is extended unless the Terms of the Competition say it may end in a tie.
- Recomputed: 2 up, loses the 17th and 18th: 2 − 2 = 0, all square ✓

### All Square (`all-square`, P2)
- **Definition:** In match play, level: both sides have won the same number of holes, so nobody is up.
- Sources: Rule 3.2d(1): "whether one of them leads by a certain number of holes (“holes up” in the match) or the match is tied (also known as “all square”)". Golf Compendium: "'all square' means that the two golfers or two sides in a match play contest have won the same number of holes"; "On leaderboards, all square is abbreviated as 'AS.'" Golfshake: "'all square' means the match is tied." The published Even Par record ("A match that's tied is all square, not even par").
- Recomputed: through 6, won 1 (3rd), lost 1 (5th), halved 4: 1 − 1 = 0 ✓

### Good-Good (`good-good`, P3)
- **Definition:** An offer between two opponents on the same green to concede each other's next putt, so both pick up without putting.
- Sources: Golf Compendium: "When two golfers verbally agree to 'good-good,' it means they both count their putts as made and pick up their golf balls without actually putting. A double concession"; "allowed under the Rules of Golf — but in match play only"; "only allowed under the rules during the play of a given hole". Rule 3.2b(1): "A player may concede the opponent's next stroke, a hole or the match". Rule 3.3c (holing out in stroke play).
- Recomputed: three strokes + one conceded = 4 each on a par 4, so the hole is halved ✓

### The Yips (`the-yips`, P3)
- **Definition:** An involuntary jerk or twitch in the hands or wrists that wrecks a simple stroke, most often a short putt.
- Sources: Golfshake, Yips: "An nervous affliction in which the person putting cannot make short putts due to the inability to create a smooth putting stroke." Golf Monthly: "involuntary jerking when playing a shot … involuntary wrist spasms"; "most associated with putting but they can affect any part of a golfer's game"; "Tommy Armour coined the terms 'the yips' in 1927"; "still imperfectly understood from a medical and physical standpoint". Today's Golfer: "in essence it’s an involuntary jerk".

### Army Golf (`army-golf`, P3)
- **Definition:** Spraying shots both ways: left on one, right on the next, then left again, like the left-right-left of a marching cadence.
- Sources: Golf Compendium: "a golfer who is spraying her shots in all directions, with no consistency"; "going from the left rough to the right rough and back again? That's army golf"; "the marching cadence used in the Army … 'Left-right-left, left-right-left!'"

### Member's Bounce (`members-bounce`, P3)
- **Definition:** A lucky bounce: a ball that kicks the right way, off a slope, tree or path, instead of into trouble.
- Sources: Golf Compendium: "a synonym for a lucky bounce or a lucky break"; "kicked in a good direction instead of a bad direction"; "The term derives from member-guest tournaments at private golf clubs … the golfer in the group who is a member at the club being played knows the bumps and humps and contours of the golf course and, therefore, might just be getting some of those good bounces by design."

### Grip It and Rip It (`grip-it-and-rip-it`, P3)
- **Definition:** Stop thinking and swing freely and hard. It's said before an all-out drive, and some players use it as a swing thought to clear their head.
- Sources: SwingU: "Popularized by John Daly, this refers to minimizing the mental part of the game and swinging freely and ferociously." Backswing (a teaching pro): "We all get into our heads too much … So I started saying a simple phrase to myself … 'Grip it and Rip it!'" Golf Compendium (1991 PGA Championship): Daly "burst onto the scene at the 1991 PGA Championship bombing drives and going for broke. He wound up the unlikely champion".

### Ham and Egg (`ham-and-egg`, P3)
- **Definition:** Two partners taking turns playing well, so that on each hole one of them is good enough to keep the team in it.
- Sources: Golf Compendium: "two golfers who are playing as partners, when only one of them at a time is playing good golf"; "Golfer A is 'carrying' Golfer B" is the contrast; "neither golfer is consistently good or consistently poor throughout the round … one of the partners, on each hole, plays good enough to keep the team in the match." The published Four-Ball record (the better score counts).
- Recomputed: hole one min(4, 5) = 4; hole two min(6, 3) = 3 ✓
