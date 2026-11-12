# Glossary expansion batch 2: side games and handicaps (#168)

Prepared November 11, 2026 for the owner's review; **approved by the owner the same day**. This is the second M8 batch. The records are in `lib/content/glossary/terms/expansion-batch-2.ts` at `approved`, so nothing here is public yet: an `approved` record shows only in local review and reaches no public page, search index, sitemap, `llms.txt` or structured data until a release PR publishes it (`selectors.ts`; checked again by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt` and `.next/static` for this PR).

## Why now

On 2026-11-11 the owner asked to start batch 2 straight after batch 1, still before #167's 28-day checkpoint (due 2026-11-26). The batch 1 packet gives the reasoning for starting early (`expansion-batch-1.md` § Why it started before the 28-day checkpoint). #168's order after side games is handicaps, then formats, so this batch takes the five side-games terms left over from batch 1 and then the handicaps terms. The 28-day, 56-day and 90-day reads still set the order of batch 3 onward.

## Scope

**15 terms**, #168's cap per batch.

**Side games (5).** The five the owner chose to keep on 2026-11-11 (#278), held back from batch 1 only to keep it under the cap: `barkie`, `poley`, `snake`, `arnie` (inventory rows 67–70) and `double-or-nothing` (row 72).

**Handicaps (10).** The inventory's § D lists ten handicaps expansion terms, rows 85–94: `world-handicap-system`, `scratch-golfer`, `bogey-golfer`, `plus-handicap`, `sandbagging`, `playing-conditions-calculation`, `soft-cap`, `hard-cap`, `exceptional-score-reduction`, `most-likely-score`. All ten fit, so none waits for batch 3.

**Not in this batch: Score Differential.** The brief listed it, but it's an MVP record (row 84), published on 2026-10-29 in `terms/handicaps.ts`. The Playing Conditions Calculation record below reuses its worked 88.

**Next (batch 3):** formats, per #168's order, unless the 28-day read changes it.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-11 | — |
| 2 | Rules fact-check | Agent, 2026-11-11, under the owner's delegation: every source reopened, every sentence checked, examples recomputed below. [Results](#stage-24-results-agent-2026-11-11) | — |
| 3 | GoLo product audit | Agent, 2026-11-11, under the owner's delegation: Plus Handicap's note checked against the `handicap-strokes` limit the owner confirmed; the other 14 checked for no GoLo claim. App code not read | — |
| 4 | SEO/canonical | Agent, 2026-11-11, under the owner's delegation: Sandbagging is canonical to `/blog/sandbagging` (`canonical-map.md` § Expansion terms with an existing page); the other 14 are hub anchors. `lint:content` passes; related ids and paths resolve | — |
| 5 | Approval | **Owner**, in chat, 2026-11-11: "Approve all 15" | — |

**Delegation (owner, 2026-11-11, #283).** "I delegate stages 2–4 to you for the 15 records in batch 2. Reopen the sources, verify the examples and product claims, check the canonicals and related links, and record the actual review dates with `by: "agent"`. Keep the records `in-review` and send me the completed review log for stage 5 owner approval. This delegation covers batch 2 only." Each record now has a `reviewLog` with `rules`, `product` and `seo` entries, `by: "agent"`, dated 2026-11-11. The owner approved all 15 in chat on 2026-11-11 ("Approve all 15"), so each record also has an `approval` entry `by: "owner"`, `reviewedBy: "owner"`, `reviewedOn: 2026-11-11`, and status `approved`. A release PR moves them to `published`.

### Stage 2–4 results (agent, 2026-11-11)

Every source below was reopened on 2026-11-11, so each `accessedOn` stays 2026-11-11. The Rules of Handicapping pages were reopened in a browser and each quoted phrase was checked on the page.

- **Packet fix, record unchanged: Plus Handicap.** The draft packet said Appendix C's Individual Stroke Play entry adds a plus Playing Handicap to the gross score. That line isn't on the Appendix C page; it came from a separate RoH committee page found by search. The record's "added to the gross score" stands on Appendix C's "give strokes back to the course" and its C/3 example ("player A gives 3 strokes back to the course"), and on the owner's answer for GoLo. The source line below is corrected.
- **Changed: Plus Handicap.** Now has a GoLo note and `capabilityIds: ["handicap-strokes"]`, from the owner's answer 1; its note adds the nine-hole rule (Appendix E, now cited). `ctaIntent: "handicaps"` added.
- **Changed: Arnie.** Two sources added at the owner's direction (answer 3): Swing Yard and Parful. The house-rules note now names the par-3 variant Parful describes.
- **Changed: Snake.** England iGolf's page now redirects to `/igolf-blog/blog-archive/…`; the source URL is the final one. Content unchanged.
- **Confirmed as drafted:** every other sentence matched its source on reopening, and every example recomputed as shown below.
- **Product:** Plus Handicap's note stays inside the new `handicap-strokes` limit, including the 18-hole qualifier. Barkie, Poley, Snake and Arnie cite `junk-board` (not offered) and make no GoLo claim. The other ten make none, in line with the owner's answer 2.
- **SEO:** Sandbagging canonical `/blog/sandbagging` (served 200 on 2026-11-11); the rest hub anchors. Related paths `/blog/pressing` and `/blog/index-vs-course-handicap` are served. `lint:content` passes.

## Product audit questions

The registry is the evidence for every GoLo statement. When drafted, none of the 15 made one; the owner's answers below added one, to Plus Handicap.

1. **Plus handicaps.** Can a GoLo player enter a plus Index such as +1.5, and does GoLo then add strokes from stroke index 18 (RoH Appendix C)? The registry's `handicap-strokes` doesn't say. If it does, Plus Handicap could carry a note under that capability.
2. **Posting and the Index calculation.** Nothing in the registry covers posting scores to a handicap service or calculating an Index, a Low Handicap Index, a PCC, the caps or an exceptional score reduction. The records say nothing about GoLo on any of them. Confirm that's right, or name the capability.
3. **Barkies, poleys, snakes, arnies.** The registry says GoLo doesn't score them (`junk-board` not offered; `game-library` and `skins-greenie-sandie` limits). The four records carry `junk-board` in `capabilityIds` so a change to it reopens them, and no note. Nothing to answer unless that's changed.

### Owner's answers (November 11, 2026)

Given in the parent session and relayed here; recorded on #283. This session didn't open the app's code; the answers are recorded as the owner's.

1. **Plus handicaps: yes.** GoLo accepts "+1.5" as entered. In a new 18-hole net round with a complete stroke-index card, if the calculated Course Handicap is still plus, GoLo adds one stroke to the player's net score at stroke index 18, then 17, and so on. The owner checked the packet's example against the scoring engine of production web build 1.2.2 (35) (golf-app `src/engines/handicap.js`): +1.5 on par-72 tees rated 71.8 with a Slope of 131 gives +2; strokes back on stroke index 18 and 17; gross 71 is net 73. **Changed:** a new `handicap-strokes` limit in `capabilities.ts`, with an owner-confirmed comment and the build, `verified` unchanged; Plus Handicap now cites that capability and has a GoLo note, 18-hole qualifier kept. The nine-hole rule is in the record's handicapping note as golf (RoH Appendix E), not as a GoLo claim. **This changes public output:** registry limits are listed in `llms.txt`.
2. **Posting and WHS calculations: confirmed, none.** GoLo records scores in the app and uses the Index a player enters to work out a Course Handicap and score the round. It doesn't post scores to GHIN or another service, establish or update a Handicap Index or Low Handicap Index, calculate a PCC, or apply the soft cap, hard cap or exceptional score reduction. GHIN integration code is shelved and its production flag is off (golf-app `docs/GHIN.md`, `docs/IOS-1.2.2-34-REVIEW.md`). **No change:** those records stay WHS-only.
3. **Arnie: keep it, with Swing Yard as the second source.** Swing Yard, "Fun golf games to play on the course" (Erik Schjolberg): "a par on a par 4 or 5, without touching the fairway". Parful documents the birdie and par-3 variants. **Changed:** both cited (both URLs pass the vocabulary check).
4. **Review: stages 2–4 delegated for batch 2 only;** the owner keeps approval. See [Stages](#stages).

## Differences from `inventory.md`

- **No `junk` tag** on Barkie, Poley, Snake or Arnie. The inventory tags all four `junk`; the owner cut junk as a category on 2026-10-30. They relate to the published Junk record instead. Poley and Snake carry `putting`.
- **Bogey Golfer** has the alias "bogey player", the Rules of Handicapping's own name (Definitions: Bogey Player). The inventory lists no alias.
- **Arnie** doesn't take "Seve" or "Seve's" as an alias. Where2Golf gives Seves as another name for barkies; Golf Compendium gives Seve's as another name for arnies. With the sources split, neither gets it.
- **Snake** relates to `putt` and `junk`. The inventory's `three-putt` isn't a record yet (row 114).
- **Double or Nothing** relates to `press`, `hammer` and `nassau`, and links `/blog/pressing`, which describes the 18th-tee press as "a shameless double-or-nothing".
- **Sandbagging** relates to `handicap-index`, `exceptional-score-reduction` and `score-differential`.

## Found along the way, outside this PR

- **"Hard cap" in the sandbagging post.** *Resolved in #285 ("a limit on handicap strokes"), not in this PR.* `/blog/sandbagging` (`lib/content/blog.ts`, "Rotate formats toward the stroke-free ones") says "match play with a hard cap". It means a cap on the strokes given in a match, not the WHS hard cap (Rule 5.8) defined here. Sandbagging is canonical to that post, so a reader can meet both senses. A word like "a cap on strokes" in the post would remove it.
- **Barkie in the skins guide.** *Resolved in #285, with the barkie mention in the guide's "Stack the side pots" list; not in this PR.* The skins guide's glossary (`lib/content/gameDetail.ts`) defines "Barkie / sandy" as "Bonus mini-skins". Sandies are a GoLo Skins option; barkies aren't scored. The line is golf education, but it sits on the page for GoLo's Skins game.
- **The batch 1 note in `inventory.md`.** *Resolved:* on `main` it's under § C, before § D. The draft's reading was wrong.

## The terms

Word counts are for the short definition. "Recomputed" lines redo every number in the example from the inputs shown. Every source was opened on 2026-11-11. The Rules of Handicapping (RoH) pages were read in a browser; `usga.org` refuses a plain fetch (403). Several corroborating pages were left out because their URL contains "bet" or "betting" (Golf Compendium's arnies page, Golf Monthly's snake page); where one was read for a cross-check, it's named below but not cited in the record.

### Barkie (`barkie`, P3)

**Definition (29 words):** A side point for making par or better on a hole where your ball hit a tree at least once. Each of the other players owes the agreed amount.

**Example:** At $1 each in a foursome, you clip a tree off the 4th tee, punch out, and still make 4 on the par 4. That's a barkie: $1 from each of the other three, $3 in all.

**Note (house-rules):** Some groups pay double for two trees on one hole, or for a birdie after hitting one. Agree what counts as hitting a tree before the round.

- Canonical: /glossary#barkie · aliases: barky, woodie · related: junk, sandy, par
- Capabilities: `junk-board` (not offered). No GoLo note.
- Sources: The Golf News Net, "What is a barky or barkie in golf?" <https://thegolfnewsnet.com/ryan_ballengee/2022/08/30/golf-terms-what-is-a-barky-or-barkie-in-golf-and-what-does-it-mean-to-get-one-126970/>: a tree hit on any shot of the hole, then par or better; a double barky for two trees. Golf Compendium, "Barkies golf game" <https://www.golfcompendium.com/2019/07/barkies-golf-game.html>: par after hitting a tree; "also commonly called" woodies; some groups double it for a birdie.
- Agrees with the birdies guide glossary: "Par or better after hitting a tree."
- Recomputed: tee shot (1), punch out (2), two more to hole out on a par 4 = 4, par ✓; 3 × $1 = $3 ✓

### Poley (`poley`, P3)

**Definition (34 words):** A side point for holing a putt from farther away than the length of the flagstick, measured by laying the flagstick down if anyone asks. Each of the other players owes the agreed amount.

**Example:** At $1 each in a foursome, you hole a 30-foot putt on the 11th, well past a flagstick's length. That's a poley: $1 from each of the other three.

**Note (house-rules):** Versions differ: some count only putts from off the green, some make you call the poley before you putt, and in those a three-putt costs you double.

- Canonical: /glossary#poley · alias: polie · related: junk, putt, greenie
- Capabilities: `junk-board` (not offered). No GoLo note.
- Sources: CaddieHQ, "What is a poley in golf?" <https://www.caddiehq.com/resources/what-is-a-poley-in-golf>: a putt holed from longer than the flagstick "if it were laid down on the ground"; its standard version needs the putt struck from off the green. Golf Compendium, "Poley golf game" <https://www.golfcompendium.com/2021/02/poley-golf-game.html>: putts longer than the flagstick; automatic or called; a called poley that ends in a three-putt loses double.
- No par requirement: neither source has one.
- Recomputed: 3 × $1 = $3 in all; the example says "$1 from each of the other three" ✓

### Snake (`snake`, P3)

**Definition (30 words):** A putting side game. Whoever three-putts holds the snake until someone else three-putts, and whoever holds it after the last hole owes each of the other players the agreed amount.

**Explanation:** In a common version the amount doubles every time the snake changes hands, so it starts small.

**Example:** A $5 snake in a foursome. You three-putt the 4th, Dave the 9th, and you again on the 16th. Nobody three-putts after that, so you owe $5 to each of the other three: $15.

**Note (house-rules):** Agree before the round whether the amount is fixed or doubles: at $1 doubling, the third three-putt of the day makes it $4. If two players three-putt the same hole, one common rule gives it to the last one to hole out.

- Canonical: /glossary#snake · related: putt, junk
- Capabilities: `junk-board` (not offered). No GoLo note.
- Sources: Golf Compendium, "Snake side game" <https://www.golfcompendium.com/2025/09/snake-putting-game.html>: the snake passes with each three-putt; the holder at the end owes each of the others; a fixed amount, or traditionally doubled with each new three-putt. England iGolf, "What is Snake in golf?" <https://englandigolf.co.uk/igolf-blog/blog-archive/what-is-snake-in-golf-how-to-play-this-ultimate-putting-test/>: same, plus two three-putts on one hole go to the last to hole out. Golf Monthly, "Golf bits" <https://www.golfmonthly.com/features/the-game/golf-bits-95132-95132>: "the holder of the snake at the end of the round has to pay a bit to every other player" (as written there).
- Recomputed: holders 4th → you, 9th → Dave, 16th → you; you hold it after the 18th ✓; 3 × $5 = $15 ✓. Doubling: $1, $2, $4 on the first, second and third three-putts ✓ (matches Golf Compendium's eight three-putts → $128: 2⁷ = 128).

### Arnie (`arnie`, P3)

**Definition (31 words):** A side point for making par on a hole without your ball ever finishing in the fairway, named after Arnold Palmer. It's usually counted only on par 4s and par 5s.

**Example:** On the par-5 8th you drive into the left rough, lay up into the right rough, pitch on and two-putt for 5. Never in the fairway, and par: an Arnie, worth $1 from each of the other three at $1 each.

**Note (house-rules):** Groups decide whether a birdie counts and what it's worth, and whether par 3s count at all: some groups score a par after missing the green.

- Canonical: /glossary#arnie · alias: arnold · related: junk, fairway, rough, par
- Capabilities: `junk-board` (not offered). No GoLo note.
- Sources: Where2Golf, golf dictionary <https://www.where2golf.com/dictionary/> (entry "Arnies"): a set reward for a par made without the ball being on the fairway. Swing Yard, "Fun golf games to play on the course" <https://swingyard.com/fun-golf-games-for-the-course/> (Erik Schjolberg, per the page's author tag): "a par on a par 4 or 5, without touching the fairway". Parful, "Arnies" <https://www.parful.io/games/arnies>: "a par or better on a par 4 or par 5 made without hitting the fairway"; a birdie "is still one Arnie"; "Some groups count a par after missing the green on a par 3." Cross-checked, not cited (URL contains "bet"): Golf Compendium's arnies page.
- Two citable sources now agree on par 4s and 5s (owner's answer 3), so the level-3 cross-check is met.
- Recomputed: drive (1), lay-up (2), pitch (3), two putts (5) on a par 5 = par ✓; no shot finished in the fairway ✓

### Double or Nothing (`double-or-nothing`, P3)

**Definition (30 words):** An offer to play one more contest for the amount already owed: if the side that's behind wins, the debt is cleared; if it loses, it owes twice as much.

**Explanation:** It isn't a golf game of its own. Golfers use the phrase for a press on the 18th tee, sometimes called an Aloha press, that plays the last hole for everything the trailing side is down.

**Example:** You're $10 down after 17 and offer double or nothing on the 18th. Win the hole and you're square; lose it and you owe $20.

**Note (house-rules):** The side that's ahead doesn't have to accept. Agree what a halved hole means before it's played.

- Canonical: /glossary#double-or-nothing · related: press, hammer, nassau · content links: /blog/pressing
- Capabilities: none.
- **How it's sourced:** a general definition, as the owner allowed on 2026-11-11, with the golf use as the explanation. No golf source defines it as a game of its own. Merriam-Webster, "double or nothing" <https://www.merriam-webster.com/dictionary/double%20or%20nothing>: the general meaning (win twice the amount or lose it all). Golf.com, "The Etiquetteist" <https://golf.com/instruction/rules/the-etiquetteist-deny-opponents-press/>: "the 18th tee double-or-nothing press, also known as the Aloha press"; the side that's ahead may turn a press down.
- Agrees with the site: `/blog/pressing` and `/blog/nassau` call the 18th-tee press "a shameless double-or-nothing".
- Recomputed: win → $10 − $10 = $0 ✓; lose → $10 + $10 = $20 ✓

### World Handicap System (`world-handicap-system`, P1)

**Definition (33 words):** The handicapping system run jointly by the USGA and The R&A: the Rules of Handicapping and the Course Rating System. It gives a golfer one Handicap Index that works on any rated course.

**Explanation:** National associations authorised by the USGA and The R&A run it in their countries, and clubs look after their members' Indexes.

**Example:** The same 12.4 Index plays off 14 from blue tees rated 71.8 with a Slope of 131, and off 11 from white tees rated 69.6 with a Slope of 122, both par 72.

**Note (handicapping):** Rule 1.1 of the Rules of Handicapping sets out what the system is for; Rules 1.2 and 1.3 cover who runs it.

- Canonical: /glossary#world-handicap-system · alias: whs · related: handicap-index, course-handicap, score-differential, course-rating · content links: /blog/index-vs-course-handicap · CTA intent: handicaps
- Capabilities: none.
- Sources: RoH 1.1 <https://www.usga.org/handicapping/roh/Content/rules/1%201%20Purpose%20of%20the%20World%20Handicap%20System.htm>: "The World Handicap System includes the Rules of Handicapping and the Course Rating System"; use a Handicap Index "on any golf course around the world". RoH 1.2 (authorised associations; WHS is a USGA/R&A mark). RoH 1.3 (vi): the USGA and The R&A are "the joint governing authorities"; (ii) clubs administer their members' Indexes; (iv) national associations run it in their jurisdiction. RoH 6.1a for the example.
- Recomputed (same numbers as the published Course Handicap record): 12.4 × 131 ÷ 113 = 14.375; + (71.8 − 72) = 14.175 → 14 ✓. 12.4 × 122 ÷ 113 = 13.388; + (69.6 − 72) = 10.988 → 11 ✓
- No start date is given. The RoH pages opened don't state when the system began, so the record doesn't either.

### Scratch Golfer (`scratch-golfer`, P2)

**Definition (29 words):** A golfer with a Handicap Index of 0.0. A set of tees' Course Rating is the score a scratch golfer is expected to shoot from them in normal conditions.

**Example:** A 0.0 Index gets no strokes from tees rated 71.8 on a par 72: 0 + (71.8 − 72) = −0.2, which rounds to 0. From tees rated 73.4, the same golfer gets one stroke: 1.4 rounds to 1.

**Note (handicapping):** The Rules of Handicapping call this a scratch player. In conversation, a scratch golfer is anyone who plays to par.

- Canonical: /glossary#scratch-golfer · aliases: scratch, scratch player · related: course-rating, slope-rating, handicap-index, plus-handicap
- Sources: RoH Definitions <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm>: Scratch Player, "A player with a Handicap Index of 0.0"; Course Rating, difficulty "for the scratch player under normal course and weather conditions". RoH Appendix G (e): the Course Rating "represents the expected score for a scratch player". RoH 6.1a. Where2Golf (entry "scratch (player)"): the conversational sense, par or better.
- Agrees with the MVP Course Rating record and `/blog/index-vs-course-handicap` ("roughly what a scratch golfer would shoot").
- Recomputed: 0.0 × Slope ÷ 113 = 0 for any Slope; 0 − 0.2 = −0.2 → 0 ✓; 0 + 1.4 = 1.4 → 1 ✓

### Bogey Golfer (`bogey-golfer`, P2)

**Definition (36 words):** A golfer with a Handicap Index of about 20.0 for men or about 24.0 for women. Slope Rating measures how much harder a set of tees plays for a bogey golfer than for a scratch golfer.

**Explanation:** Course raters estimate a Bogey Rating, the bogey golfer's expected score from each set of tees. The gap between it and the Course Rating sets the Slope Rating.

**Example:** A 20.0 Index from blue tees rated 71.8 with a Slope of 131, par 72: 20.0 × 131 ÷ 113 = 23.186, minus 0.2 = 22.986, so 23 strokes. That's one on every hole and a second on stroke index 1 to 5.

**Note (handicapping):** The Rules of Handicapping call this a bogey player and give the figures as approximate. Appendix G has the course rated for both the scratch player and the bogey player.

- Canonical: /glossary#bogey-golfer · alias: bogey player · related: bogey, slope-rating, course-rating, scratch-golfer
- Sources: RoH Definitions: Bogey Player, "approximately 20.0 for men and approximately 24.0 for women"; Slope Rating, relative difficulty for players who aren't scratch. RoH Appendix G (e): obstacle factors rated "for both the scratch player and the bogey player"; "The Bogey Rating represents the expected score for a bogey player. The difference between the Course Rating and the Bogey Rating is used in the determination of the Slope Rating." RoH 6.1a; RoH Appendix E (strokes above 18 repeat from stroke index 1).
- Agrees with the MVP Slope Rating record ("how much harder a set of tees plays for a bogey golfer than for a scratch golfer").
- The record doesn't give the Slope formula's multiplier: the RoH pages opened don't state it.
- Recomputed: 20.0 × 131 = 2,620; ÷ 113 = 23.186; − 0.2 = 22.986 → 23 ✓; 23 = 18 + 5, so two strokes on stroke index 1–5 and one on 6–18 ✓

### Plus Handicap (`plus-handicap`, P2)

**Definition (29 words):** A Handicap Index better than scratch, written with a plus sign, such as +1.5. Instead of receiving strokes, the player gives them back: they're added to the gross score.

**Example:** A +1.5 Index from blue tees rated 71.8 with a Slope of 131, par 72: −1.5 × 131 ÷ 113 = −1.739, plus (71.8 − 72) = −1.939, so +2. The player adds a stroke on stroke index 18 and 17, and a gross 71 is a net 73.

**Note (handicapping):** Rule 5.2c of the Rules of Handicapping asks players to write a plus Index with the + sign. Appendix C has a plus player give strokes back from stroke index 18; on nine holes they start at the highest stroke index on that nine (Appendix E). An allowance moves a plus handicap toward zero.

**GoLo note:** GoLo accepts a plus Index. In an 18-hole net round it adds the strokes back to the player's net score from stroke index 18, then 17, and so on.

- Canonical: /glossary#plus-handicap · alias: plus handicapper · related: scratch-golfer, handicap-index, course-handicap, stroke-index · CTA intent: handicaps
- Capabilities: `handicap-strokes` (live), the limit added from the owner's [answer 1](#owners-answers-november-11-2026).
- Sources: RoH 5.2c and 5.2c/1 <https://www.usga.org/handicapping/roh/Content/rules/5%202c%20For%20Plus%20Handicap%20Index.htm>: an Index that "calculates as a negative figure" is a plus Index; players "should be encouraged to always prefix their Handicap Index with a 'Plus' sign (+)". RoH Appendix C, Plus Playing Handicaps <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm>: "give strokes back to the course, beginning at the hole with stroke index 18"; +2 gives them back on 18 and 17; with an allowance, a plus handicap "moves up towards zero"; C/3: "player A gives 3 strokes back to the course". RoH Appendix E <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20E%20Stroke%20Index%20Allocation.htm>: on nine holes, give-backs "commence on the hole with the highest published stroke index allocated for the 9 holes". RoH 6.1a.
- Recomputed: −1.5 × 131 ÷ 113 = −1.739; − 0.2 = −1.939 → −2, written +2 ✓; strokes back on stroke index 18 and 17 ✓; 71 + 2 = 73 ✓

### Sandbagging (`sandbagging`, P1)

**Definition (32 words):** Keeping a Handicap Index higher than your real ability, usually by not posting good rounds or by dropping shots once a good score is going, to get more strokes than you should.

**Example:** Two players both play to about a 12. One posts every round and carries a 12.0; the other posts only the bad ones and carries an 18.0. Off tees with a Slope of 113 and a Course Rating equal to par, the second gets six strokes from the first, on stroke index 1 to 6.

**Note (handicapping):** The Rules of Handicapping expect every acceptable score to be posted (Rule 1.3). A Handicap Committee can review an Index, adjust or freeze it, and post a penalty score for a round that wasn't submitted (Rules 7.1a and 7.1b).

- Canonical: `/blog/sandbagging` (existing; the post owns the intent) · aliases: sandbagger, bandit · related: handicap-index, exceptional-score-reduction, score-differential · tags: handicap, informal
- Capabilities: none.
- Sources: Golf Monthly, "The 4 most common tricks used by golf club bandits" <https://www.golfmonthly.com/features/the-game/the-4-most-common-tricks-used-by-golf-club-bandits>: "handicap bandits, sandbaggers" keep an Index "artificially high"; throwing shots away late with a good score going; not putting in cards after improving. RoH 1.3 (i): a player is expected to "submit all acceptable scores" and not circumvent the Rules "for the purpose of gaining an unfair advantage". RoH 7.1a: review, reset or freeze an Index. RoH 7.1b: penalty scores for a score not submitted, including to keep an Index from decreasing. GoLo, "Sandbagging" <https://www.golo.golf/blog/sandbagging> (served 200 on 2026-11-11): "Keeping an index higher than your ability"; "Not posting your good rounds".
- The short definition and link per `canonical-map.md`; the record doesn't restate the post's patterns or fixes.
- "Sandbagging" isn't a Rules of Handicapping term. The note cites the rules it touches, not a definition.
- Recomputed: Slope 113 and Course Rating = par → Course Handicap = Index: 12.0 → 12, 18.0 → 18 ✓; full difference 18 − 12 = 6, on stroke index 1–6 ✓. That's golf at full handicap, not a GoLo setting (GoLo gives full Course Handicaps and doesn't play off the low man; the record says nothing about GoLo).

### Playing Conditions Calculation (`playing-conditions-calculation`, P2)

**Definition (36 words):** A daily statistical check that compares the scores posted at a course with what those players were expected to shoot. If the course played much harder or easier than normal, it adjusts that day's Score Differentials.

**Example:** An adjusted 88 from tees rated 71.8 with a Slope of 131 is a 14.0 on a normal day. With a PCC of +1 it's (88 − 71.8 − 1) × 113 ÷ 131 = 13.11, recorded as 13.1.

**Note (handicapping):** Rule 5.6 of the Rules of Handicapping: it needs at least eight acceptable scores from players with an Index of 36.0 or below, and comes out at −1.0, 0.0, +1.0, +2.0 or +3.0. A plus figure means the course played harder.

- Canonical: /glossary#playing-conditions-calculation · alias: pcc · related: score-differential, course-rating, handicap-index
- Sources: RoH 5.6 and 5.6/1 <https://www.usga.org/handicapping/roh/Content/rules/5%206%20Playing%20Conditions%20Calculation.htm>: compares scores "against expected scoring patterns"; at least eight acceptable scores; Indexes of 36.0 or below; "-1.0, 0.0, +1.0, +2.0 or +3.0"; fewer players reaching their expected score means harder. RoH 5.1a <https://www.usga.org/handicapping/roh/Content/rules/5%201a%20Calculation%20of%20a%20Score%20Differential18Hole.htm>: Score Differential = (113 ÷ Slope) × (adjusted gross score − Course Rating − PCC adjustment), to the nearest tenth. RoH Definitions: PCC.
- Recomputed: normal day (88 − 71.8) × 113 ÷ 131 = 13.97 → 14.0 ✓ (as the published Score Differential record); PCC +1: (88 − 71.8 − 1) = 15.2; × 113 = 1,717.6; ÷ 131 = 13.111 → 13.1 ✓. A harder day gives a lower differential for the same score ✓

### Soft Cap (`soft-cap`, P2)

**Definition (33 words):** A brake on how fast a Handicap Index can rise: once a newly calculated Index is more than 3.0 above the player's Low Handicap Index, only half of the rise beyond 3.0 counts.

**Explanation:** The Low Handicap Index is the lowest Index the player had in the year before their most recent round.

**Example:** Low Handicap Index 10.0. A run of poor rounds calculates to 14.6, a rise of 4.6. The first 3.0 counts in full and half of the other 1.6 counts, so the new Index is 13.8.

**Note (handicapping):** Rule 5.8 of the Rules of Handicapping. The caps start once a player has a Low Handicap Index, which takes 20 scores (Rule 5.7). There's no limit on how fast an Index can come down.

- Canonical: /glossary#soft-cap · related: hard-cap, handicap-index, score-differential
- Sources: RoH 5.8 (i) <https://www.usga.org/handicapping/roh/Content/rules/5%208%20Limit%20on%20Upward%20Movement%20of%20a%20Handicap.htm>: triggered when the new Index is "greater than 3.0 strokes" above the Low Handicap Index; "the value above 3.0 strokes is restricted to 50% of the increase"; "no limit on the amount by which a player's Handicap Index can decrease"; the caps start once a Low Handicap Index is established. RoH 5.7 <https://www.usga.org/handicapping/roh/Content/rules/5%207%20Low%20Handicap%20Index.htm>: established "once a player has at least 20 acceptable scores". RoH Definitions: Cap; Low Handicap Index ("the 365-day period … preceding the day on which the most recent score on their scoring record was played").
- Recomputed: 14.6 − 10.0 = 4.6; 4.6 − 3.0 = 1.6; 1.6 × 50% = 0.8; 10.0 + 3.0 + 0.8 = 13.8 ✓. The example avoids a rise that needs rounding to a tenth; RoH 5.8 doesn't say how a half of an odd tenth is rounded.

### Hard Cap (`hard-cap`, P2)

**Definition (27 words):** The ceiling on a rising Handicap Index: after the soft cap is applied, the Index can't end up more than 5.0 above the player's Low Handicap Index.

**Example:** Low Handicap Index 10.0, and a bad spell calculates to 19.0. The soft cap makes it 10.0 + 3.0 + half of 6.0 = 16.0; the hard cap stops it at 15.0.

**Note (handicapping):** Rule 5.8 of the Rules of Handicapping. A Handicap Committee can raise an Index past that limit only in exceptional circumstances, such as a long illness or injury (Rule 7.1a).

- Canonical: /glossary#hard-cap · related: soft-cap, handicap-index
- Sources: RoH 5.8 (ii): "after application of the soft cap, to no more than 5.0 strokes above their Low Handicap Index". RoH 7.1a (ii): a committee adjustment can "only increase a player's Handicap Index by up to 5.0 strokes above the player's Low Handicap Index, unless there are exceptional circumstances", for example "a long-term illness or injury". RoH Definitions: Cap.
- Recomputed: 19.0 − 10.0 = 9.0; 9.0 − 3.0 = 6.0; 6.0 × 50% = 3.0; 10.0 + 3.0 + 3.0 = 16.0 ✓; 16.0 − 10.0 = 6.0 > 5.0 → 15.0 ✓

### Exceptional Score Reduction (`exceptional-score-reduction`, P2)

**Definition (37 words):** An automatic cut to a Handicap Index after an unusually good round: a Score Differential at least 7.0 better than the player's Index that day takes 1.0 off, and one 10.0 or more better takes 2.0 off.

**Example:** A 15.0 Index posts a Score Differential of 6.6, which is 8.4 better. That's in the 7.0 to 9.9 band, so 1.0 comes off each of the last 20 differentials, and the new Index comes out 1.0 lower than the plain calculation.

**Note (handicapping):** Rule 5.9 of the Rules of Handicapping. Reductions for more than one exceptional score add up. The cut fades as newer rounds replace the adjusted ones, and a Handicap Committee can override it.

- Canonical: /glossary#exceptional-score-reduction · alias: esr · related: score-differential, handicap-index, sandbagging
- Sources: RoH 5.9 <https://www.usga.org/handicapping/roh/Content/rules/5%209%20Submission%20of%20an%20Exceptional%20Score.htm>: 7.0–9.9 → −1.0; 10.0 or more → −2.0; based on the unrounded differential against the Index "in effect when the round was played"; "applied cumulatively"; applied to each of the most recent 20 differentials, including the exceptional one, so it "will dilute over time"; the Handicap Committee may override it. RoH Definitions: Exceptional Score ("at least 7.0 strokes better").
- Recomputed: 15.0 − 6.6 = 8.4, in 7.0–9.9 → −1.0 ✓. The Index is the average of the best 8 of 20; lowering all 20 by 1.0 lowers that average by exactly 1.0 ✓
- Kept apart from Sandbagging: the reduction is automatic and says nothing about intent. The relation is one way of catching the effect.

### Most Likely Score (`most-likely-score`, P2)

**Definition (36 words):** The score recorded for handicap purposes on a hole a player starts but doesn't finish for a valid reason: the strokes taken, plus the strokes they'd most likely need to hole out, plus any penalty strokes.

**Example:** In a four-ball, your partner makes 4 on the 7th and you can't beat it, so you pick up 15 yards from the hole after four shots. From there the guideline adds two or three strokes: you record 6 or 7, or net double bogey if that's lower.

**Note (handicapping):** Rule 3.3 of the Rules of Handicapping. On the green within 5 feet, add one stroke; from 5 feet to 20 yards, two or three; beyond 20 yards, three or four. It can't exceed net double bogey, or par plus 5 for a player without an Index yet.

- Canonical: /glossary#most-likely-score · related: net-double-bogey, four-ball, gimme
- Sources: RoH 3.3 and 3.3/1 <https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm>: the three-part definition; record "their most likely score or net double bogey, whichever is lower"; the distance guideline; capped at net double bogey, or par plus 5 for an initial Index; 3.3/1's four-ball example (15 yards away in four, "six or seven"). RoH Definitions: Most Likely Score.
- Agrees with the Rules Center's gimme scenario (`lib/content/rules/scenarios.ts`), which cites RoH 3.3 the same way. The FAQ's `q-pickup` answer is about what a group records for its games ("usually net double bogey … or double par"), not handicap posting; no conflict.
- Recomputed: 4 + 2 = 6, 4 + 3 = 7 ✓ (15 yards is between 5 feet and 20 yards)

## Checks run for this PR

- `npm run lint` (ESLint, filter CSS, `lint:content`: 82 glossary records valid, 67 published after batch 1's release), `npm run typecheck`, `npm test` (glossary 140 cases), `npm run build`: all pass.
- Built output: none of the new records' text is in `.next/server/app/glossary.html`, `glossary.rsc`, `llms.txt` or `.next/static`. The only hits for "barkie" and "poley" are the capability registry's existing lines; "Course Rating System" is the published MVP records. The one intended public change is the new `handicap-strokes` limit in `llms.txt`.
