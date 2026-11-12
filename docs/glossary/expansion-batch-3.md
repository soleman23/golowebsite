# Glossary expansion batch 3: formats (#168)

Prepared November 11, 2026 for the owner's review. This is the third M8 batch. The records are in `lib/content/glossary/terms/expansion-batch-3.ts` at `in-review`, so nothing here is public: an `in-review` record reaches no page, search index, sitemap, `llms.txt` or structured data (`selectors.ts`; checked again by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt` and `.next/static` for this PR).

## Why now

Batches 1 and 2 are published (#278, #283). #168's order after side games and handicaps is formats. The owner chose to start batch 3 before #167's 28-day read (due 2026-11-26), for the reasons in `expansion-batch-1.md` § Why it started before the 28-day checkpoint. That read can still reorder batch 4 onward.

## Scope

**14 terms**, under #168's cap of 15: every formats expansion term in `inventory.md` § B, rows 35–48. None waits for a later batch.

`shamble`, `chapman`, `par-competition`, `texas-scramble`, `modified-stableford`, `ryder-cup-style`, `vegas`, `quota`, `sixes`, `nines`, `greensomes`, `florida-scramble`, `peoria-system`, `three-ball`.

The revisions the owner accepted on 2026-10-29 (`inventory.md` § Revisions) are applied: **M1** Pinehurst is an alias of Chapman, **M2** Round Robin is an alias of Sixes, **S2** Par Competition, **S3** Greensomes, **S4** Florida Scramble. M1 asked the fact-check to split Chapman and Pinehurst again if a distinct regional definition turned up. None did: the R&A's Committee Procedures (Section 9B) call the same format Pinehurst Foursomes, and Golf Compendium says Pinehurst System "is the exact same thing as Chapman system". The merge stands, and so does S2.

**Canonicals** (`canonical-map.md` § Expansion terms with an existing page): Texas Scramble, Shamble and Florida Scramble are hub entries linking `/games/scramble`; Quota is a hub entry linking `/games/best-score`. The other ten are hub entries.

**Next (batch 4):** whatever #168's order and the 28-day read put next. With formats done, § A scoring, § E shots, § F course, § G equipment and § H slang still have expansion terms.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-11 | — |
| 2 | Rules fact-check | Agent prepared: Rules of Golf Rule 21 and Definitions (randa.org, 2023 edition), Committee Procedures Section 9, and RoH Appendix C (2024 edition, read in a browser), all opened 2026-11-11; every editorial source opened the same day; examples recomputed below | **Owner** signs |
| 3 | GoLo product audit | Agent prepared against the registry. Three records have a GoLo note (Shamble, Texas Scramble, Three-Ball). [Questions](#product-audit-questions) below | **Owner** signs |
| 4 | SEO/canonical | Agent: canonicals per `canonical-map.md` (all 14 are hub anchors; four link a guide). `lint:content` passes; related ids and paths resolve | **Owner** confirms |
| 5 | Approval | — | **Owner** |

None of the records has a review log. The owner delegated stages 2–4 for batch 1 and for batch 2, each time for that batch only (`editorial-review.md` § Roles), so batch 3 is back on the owner's roles. If the owner delegates this batch the same way, an agent reopens the sources, logs stages 2–4 as `by: "agent"`, and the owner's approval moves the records to `approved`.

## Product audit questions

The registry is the evidence for every GoLo statement. GoLo gives full Course Handicap, one set of tees per group, and no allowance except a scramble's team handicap (`handicap-strokes`). Every allowance in these records is golf (RoH Appendix C), never a GoLo setting.

1. **Three-Ball note.** The record says: "Without teams, GoLo plays the Overall Match and Nassau head to head, so in a group of three each player has a match with each of the other two." It's the `game-library` limit ("Without teams, Nassau and the Overall Match are played head to head: with three or four players, every pair has its own match"), applied to three players. Confirm it's wanted on a Rules of Golf format, or drop it.
2. **Shamble and Texas Scramble notes.** Both say what GoLo doesn't do, from the `scramble` limit "No Texas scramble drive count and no shamble", in the words of the published Scramble record and the scramble guide (`gameDetail.ts`). Confirm.
3. **Modified Stableford.** `round-formats` says GoLo scores Stableford rounds. It doesn't say which points. Can a group set its own table, with points below zero (the PGA Tour's 8, 5, 2, 0, −1, −3)? Until you answer, the record is golf only and cites `round-formats` so a change reopens it.
4. **Par Competition.** Does GoLo score a round as holes won and lost against par (Par/Bogey)? The registry doesn't say. Golf only for now.
5. **Greensomes and Chapman.** Does GoLo score a two-player side playing one ball (foursomes, greensomes, Chapman)? The registry doesn't say, and the published Foursomes record has no GoLo note. Golf only for now.
6. **Florida Scramble.** GoLo's scramble records one score a team on each hole, so it could record a Florida scramble's score. It doesn't know who played which shot. Is a note like "GoLo scores it as a scramble; it doesn't track who sits out" wanted? Golf only for now; the record cites `scramble`.
7. **Nothing to answer unless it's changed:** Quota (`quota` planned), Vegas and Nines (not in `game-library`; the published three-player post says GoLo doesn't score Nines), Sixes (`team-play` is two fixed pairs, so no rotating partners), the Ryder Cup-style event (`trip-tally` planned) and Peoria (GoLo uses the Index each player enters). None of these records says anything about GoLo. Each cites the capability that would reopen it, except Peoria.

## Differences from `inventory.md`

- **Chapman** also takes "chapman system" (Golf Compendium's main name for it) and "pinehurst foursomes" (the R&A's name, Committee Procedures 9B) as aliases.
- **Nines** takes "5-3-1" as an alias: the published three-player post says "Nines, also called 5-3-1". The inventory lists no alias.
- **Three-Ball** takes "three-ball match play", the Rules of Golf's own name (Rule 21.4). The inventory lists no alias.
- **Greensomes** doesn't take "Scotch foursomes", though National Club Golfer uses it: in the US, "Scotch" often means plain alternate shot.
- **Florida Scramble** keeps only "step-aside scramble". The R&A also lists dropout scramble, step aside, stand aside and stand out; the record's note names two of them.
- **Related ids** stay within existing records: Vegas and Nines relate to `point-value`; Chapman, Greensomes and Texas Scramble to `handicap-allowance`; Par Competition to `handicap-stroke` and `stroke-play`. The inventory's `all-square`, `halve` and `dormie` aren't records yet.
- **Par Competition and Three-Ball** link `/rules#rule-21` (Rule 21 is published in the Rules Center), as the published Stableford record does.
- **Ryder Cup-Style Competition** is `convention`, not `rules`: the Rules of Golf define foursomes and four-ball, not the event.
- **Peoria System** is filed under `formats` with the `handicap` tag, as the inventory has it; it's an event method, not part of the World Handicap System.

## Found along the way, outside this PR

- **Quota in the Bandon post.** `/blog/bandon` (`lib/content/blog.ts`, the "four ways" section) calls quota "Stableford scoring with no negatives — a wipe is simply zero points". That's true of plain Stableford too; what makes it quota is the target (36 minus Course Handicap), which the Scottsdale post gets right. A clause naming the target would bring the post into line with the Quota record. Not changed here.
- **Quota on the Best Score guide.** The guide's glossary (`gameDetail.ts`) says quota is "A Stableford variant that scores points against a target". Fair, though the usual quota table (1, 2, 4, 8) isn't the Stableford one (1, 2, 3, 4). Worth a look if the guide is edited; no conflict big enough to block the record.
- **Golf.com's Modified Stableford page** (`golf.com/lifestyle/what-is-a-modified-stableford-format/`) presents the standard Stableford table as the "traditional scoring format for a Modified Stableford". Read for a cross-check and not cited.
- **Golf Compendium's Peoria page** calls the result a "Peoria System handicap index". It's a one-day allowance, not an Index; the record says "strokes for the day".

## The terms

Word counts are for the short definition. "Recomputed" lines redo every number in the example from the inputs shown. Every source was opened on 2026-11-11. The R&A pages answered a plain fetch; the Rules of Handicapping page was read in a browser (`usga.org` refuses a plain fetch with 403). Pages whose URL carries a banned word were left out: Golf Digest's 5-3-1 page and The Golf News Net's Quota and Nines pages ("betting"), Golf.com's Vegas page ("gambling"), and Golf Monthly's Vegas page ("betting"). Where one was read for a cross-check, it's named below but not cited.

The worked numbers reused from published records: a 12.4 Index plays off 14 from blue tees (Course Rating 71.8, Slope 131) and 11 from white tees (69.6, 122), both par 72.

### Shamble (`shamble`, P1)

**Definition (39 words):** A team format where everyone tees off, the team picks the best drive, and then each player plays their own ball from that spot into the hole. The team counts one or more of its players' scores, as agreed.

**Explanation:** It starts like a scramble, then everyone plays their own ball: after the drive, nobody moves to a teammate's ball again.

**Example:** A four-player shamble, best two net scores count. On the 7th the team takes Dave's drive in the fairway, and from there the four of you make net 4, 5, 5 and 6. The team scores 4 + 5 = 9.

**Note (house-rules):** Events set how many scores count on each hole, from one to all four, and some require a set number of each player's drives.

**GoLo note:** GoLo scores a scramble, one ball a team to the hole, and has no shamble setting.

- Canonical: /glossary#shamble · related: scramble, texas-scramble, florida-scramble, four-ball · content links: /games/scramble · no CTA intent: "Browse the games GoLo scores" would sit oddly on a format GoLo doesn't score
- Capabilities: `scramble` (live); the note is its limit "No Texas scramble drive count and no shamble" and its summary "one ball a team".
- Sources: The Golf News Net, "How to play a shamble" <https://thegolfnewsnet.com/ryan_ballengee/2026/03/13/golf-games-how-to-play-a-shamble-124053/>: teams of two, three or four tee off, pick the best shot, then "each player will play their own ball into the hole"; the team score may be the best one, two or three scores, or every score. GolfLink, "Playing a shamble golf format" <https://www.golflink.com/lifestyle/playing-shamble-golf-format-as-fun-alternative>: best tee shot chosen, everyone plays their own ball in, the best individual score counts in its example; an organizer can require "each player's tee shot at least four times".
- Agrees with the scramble guide (`gameDetail.ts`): "Best drive, then everyone plays their own ball into the hole", and with the Scottsdale post's "best two net scores count".
- Recomputed: best two of net 4, 5, 5, 6 are 4 and 5; 4 + 5 = 9 ✓

### Chapman (`chapman`, P2)

**Definition (33 words):** A two-player team format where both partners drive, each plays a second shot with the other's ball, and the side then picks one ball and plays it by alternate shots until it's holed.

**Explanation:** The partner whose second shot wasn't picked plays the third.

**Example:** On the 3rd you both drive. You play your second with your partner's ball and finish 10 feet away; she plays hers with your ball to 40 feet. You keep the 10-footer, so she putts it.

**Note (handicapping):** The R&A's Committee Procedures list it as Pinehurst Foursomes, a variation of greensomes. Appendix C of the Rules of Handicapping recommends 60% of the lower Course Handicap plus 40% of the higher, as for greensomes.

- Canonical: /glossary#chapman · aliases: chapman system, pinehurst, pinehurst foursomes, american foursomes · related: foursomes, greensomes, handicap-allowance
- Capabilities: none. [Question 5](#product-audit-questions).
- Sources: R&A Committee Procedures, Section 9B <https://www.randa.org/en/rog/committee-procedures/sections/9>: "Pinehurst Foursomes where both players tee off, then they switch their play of golf balls … After the second shots, they then select which ball they will continue to play, and that ball is then played by alternate-shot until holed." RoH Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm>: "Pinehurst/Chapman: 60% low / 40% high". Golf Compendium, "Chapman System" <https://www.golfcompendium.com/2022/08/chapman-system-golf-format.html>: both drive, switch balls, select one after the seconds; "The golfer whose second stroke was not selected is the one who plays the third stroke"; also called Pinehurst System, Pinehurst Foursomes and American Foursomes; Eloise and Dick Chapman developed it after two rounds at Pinehurst "in March, 1947". CaddieHQ, "What is Chapman in golf?" <https://www.caddiehq.com/resources/what-is-chapman-in-golf>: the same switch and selection; "Who hits the third shot? It's the player whose second shot was NOT chosen."
- Also read: Golf Compendium's "Pinehurst System" and "American Foursomes" pages, both saying it's the same format as Chapman (the M1 check).
- Recomputed: your second (with her ball) is picked, so she, whose second wasn't, plays the third ✓

### Par Competition (`par-competition`, P2)

**Definition (35 words):** A form of stroke play scored like match play against the course: on each hole you win, halve or lose against a fixed score, usually par, and the result is holes won minus holes lost.

**Explanation:** Played against a bogey score for each hole instead, an older target about five or six strokes a round above par, it's a bogey competition. Once you've lost a hole you can pick up.

**Example:** Off 10 strokes you get one on stroke index 1 to 10. On the par-4 6th, stroke index 4, your 5 is a net 4 and halves the hole; a net 3 would win it. Win 5 holes and lose 8 and you finish 3 down.

**Note (rules):** Rule 21.3 of the Rules of Golf (Par/Bogey). Appendix C of the Rules of Handicapping recommends a 95% allowance for individual Par/Bogey: a 12.4 Index off white tees rated 69.6, Slope 122, par 72, has an unrounded Course Handicap of 10.988; × 95% = 10.44, so 10 strokes.

- Canonical: /glossary#par-competition · aliases: bogey competition, par/bogey · related: par, stableford, match-play, stroke-play, handicap-stroke · content links: /rules#rule-21
- Capabilities: none. [Question 4](#product-audit-questions).
- Sources: RoG Rule 21.3 <https://www.randa.org/en/rog/the-rules-of-golf/rule-21>: "a form of stroke play that uses scoring as in match play"; a hole is won, tied ("also known as halved") or lost against "the fixed target score (typically par or bogey) set by the Committee"; the winner has "the highest total of holes won versus holes lost"; players "are encouraged to stop playing a hole when their score exceeds the fixed score". RoG Definitions, Par/Bogey <https://www.randa.org/en/rog/definitions> (cited at page level; multi-word definitions have no stable anchor): the same, "adding up the holes won and subtracting the holes lost". RoH Appendix C: "Individual Par/Bogey 95%"; allowances apply "to the unrounded Course Handicap". Golf Monthly, "What are bogey competitions in golf?" <https://www.golfmonthly.com/features/the-game/what-are-bogey-competitions-in-golf-78821>: "if played against par, this type of competition is known as a par competition"; strokes apply by stroke index, as in Stableford; stroke-play rules and penalties.
- Recomputed: 12.4 × 122 ÷ 113 = 13.388; + (69.6 − 72) = 10.988 (unrounded, as the published Course Handicap record) ✓; 10.988 × 0.95 = 10.439 → 10 ✓; stroke index 4 ≤ 10, so one stroke: 5 − 1 = 4 = par, halved ✓; net 3 < 4 wins ✓; 5 − 8 = −3, "3 down" ✓
- "Bogey competition" is an alias, not a separate record: Rule 21.3 treats both targets as one format.

### Texas Scramble (`texas-scramble`, P1)

**Definition (32 words):** A scramble, usually for teams of four, in which the team must use a minimum number of each player's drives over the round, so the longest hitter can't take every tee shot.

**Explanation:** In the UK the name often just means a scramble, with or without a drive count.

**Example:** With four drives each, 16 of the 18 tee shots are spoken for. If the team has used Jim's drive only twice by the 15th tee, two of the last four holes have to be his.

**Note (house-rules):** The number of drives is the event's rule: three or four each in a four-player team is typical. Appendix C of the Rules of Handicapping recommends 25%, 20%, 15% and 10% of the four players' Course Handicaps, lowest to highest.

**GoLo note:** GoLo scores the scramble with team handicaps, but it doesn't count whose drive was used, so keep the drive count on paper.

- Canonical: /glossary#texas-scramble · related: scramble, florida-scramble, shamble, handicap-allowance · content links: /games/scramble · CTA intent: games
- Capabilities: `scramble` (live); the note is its label ("Scramble with team handicaps") and its limit "No Texas scramble drive count". The guide says the same: "GoLo doesn't track whose drive was used, so keep that count on paper."
- Sources: R&A Committee Procedures, Section 9C: "A Texas Scramble is a four-person team scramble, and this normally requires a minimum number of tee shots of each member of the team to be used during the round." RoH Appendix C: "Scramble (4 players) 25% low/20%/15%/10% high". Golf Monthly, "What is a Texas Scramble?" <https://www.golfmonthly.com/features/the-game/texas-scramble-64802>: "Texas Scramble, which is also called a 'Scramble'"; teams of two, three or four; "Usually a team in a Texas Scramble is required to take a certain amount of drives from each player", and in one example "each player must hit three (counting) tee shots, which is typical in a four-player Texas". England iGolf, "Golf scramble formats" <https://englandigolf.co.uk/igolf-blog/blog-archive/golf-scramble-formats-the-ultimate-guide-to-team-play/>: "typically, in a four-person team, at least three or four drives from each player must be chosen".
- The UK reading comes from Golf Monthly (a UK title). The inventory says "Britain and Ireland"; no source opened today speaks for Ireland, so the record says "the UK".
- The scramble guide says "often four each over 18"; the sources say three or four, so the record says "three or four each" and the example uses four."
- Recomputed: 4 drives × 4 players = 16; 18 − 16 = 2 free ✓. By the 15th tee 14 holes are played and 4 remain; Jim needs 4 − 2 = 2 more ✓

### Modified Stableford (`modified-stableford`, P2)

**Definition (35 words):** A version of Stableford with its own points table that rewards good holes and takes points away for bad ones, so a blow-up hole costs you instead of scoring zero. The table varies by event.

**Explanation:** The R&A's example gives 4 points for a birdie, 2 for a par and minus 1 for a bogey or worse. The PGA Tour's table at the Barracuda Championship has been 8 for a double eagle, 5 for an eagle, 2 for a birdie, 0 for a par, minus 1 for a bogey and minus 3 for a double bogey or worse.

**Example:** On the PGA Tour's table, a round of one eagle, five birdies, ten pars, one bogey and one double bogey scores 5 + 10 + 0 − 1 − 3 = 11 points.

**Note (rules):** Standard Stableford is Rule 21.1 of the Rules of Golf. Modified Stableford is one of the other forms of play in the R&A's Committee Procedures (Section 9A), which give its points only as an example.

- Canonical: /glossary#modified-stableford · related: stableford, eagle, birdie, bogey
- Capabilities: `round-formats` (live), cited so a change reopens the record; no GoLo note. [Question 3](#product-audit-questions).
- Sources: R&A Committee Procedures, Section 9A: "Modified Stableford is a form of play that gives higher points for good play, but also subtracts points for bad play. For example, four points are awarded for a birdie, two for a par and minus one for a bogey or worse." PGA Tour, "How it works: Modified Stableford format, Barracuda Championship" <https://www.pgatour.com/article/news/latest/2023/07/16/how-it-works-modified-stableford-format-barracuda-championship>: Double Eagle 8, Eagle 5, Birdie 2, Par 0, Bogey −1, Double Bogey or more −3.
- Cross-checked, not cited: Golf.com's page has the same PGA Tour table but labels standard Stableford points as "traditional" Modified Stableford (see [Found along the way](#found-along-the-way-outside-this-pr)).
- Recomputed: 1 + 5 + 10 + 1 + 1 = 18 holes ✓; 1 × 5 + 5 × 2 + 10 × 0 + 1 × (−1) + 1 × (−3) = 5 + 10 + 0 − 1 − 3 = 11 ✓

### Ryder Cup-Style Competition (`ryder-cup-style`, P1)

**Definition (36 words):** A team event built like the Ryder Cup: two teams play a series of foursomes, four-ball and singles matches, each worth one point, or half a point each if halved. The team with more points wins.

**Example:** Twelve players on a trip, six a side. Day one has three foursomes and three four-ball matches, day two six singles: 12 points in all, so 6.5 wins outright.

**Note (convention):** The Ryder Cup itself has 28 matches: eight foursomes, eight four-balls and 12 singles, so 14.5 points wins. For handicap play, Appendix C of the Rules of Handicapping recommends 100% for singles, 90% for four-ball and, in foursomes, 50% of the difference between the sides' combined Course Handicaps.

- Canonical: /glossary#ryder-cup-style · alias: ryder cup format · related: four-ball, foursomes, match-play
- Capabilities: `trip-tally` (planned), cited so it reopens the record; no GoLo note.
- Sources: Golf Monthly, "Ryder Cup format explained" <https://www.golfmonthly.com/news/ryder-cup-format-explained-how-foursomes-fourballs-and-singles-differ>: "The magic number at the Ryder Cup is 14.5"; "eight foursomes matches, eight fourballs matches, and 12 singles matches"; a match winner gets one point, "half a point for each team" if all square. Golf.com, "Ryder Cup 101" <https://golf.com/news/ryder-cup-101-how-it-works-explained/>: "28 matches long, broken out into three formats (foursomes, four-ball and singles) across five sessions". RoH Appendix C: match play Individual 100%, Four-Ball 90%; Foursomes "50% of combined team handicap", applied in C/2 Example 4 as "50% of the difference between each Team's combined Course Handicaps".
- Recomputed: day one 3 + 3 = 6 matches using 12 players a session (2 per side per match) ✓; day two 6 singles ✓; 6 + 6 = 12 points; more than half is 6.5 ✓. Ryder Cup: 8 + 8 + 12 = 28; 28 ÷ 2 = 14, so 14.5 wins outright ✓

### Vegas (`vegas`, P2)

**Definition (39 words):** A two-against-two game where each side writes its two scores on a hole as one two-digit number, lower score first, so a 4 and a 5 make 45. The lower number wins the hole by the difference, in points.

**Example:** You make 4 and your partner 5: 45. The other side makes 5 and 6: 56. You win the hole by 11 points, $1.10 at 10 cents a point.

**Note (house-rules):** A common addition is the birdie flip: when one side makes a birdie, the other side's number is written high score first, so 56 becomes 65. If both sides make one, nothing flips. Agree how a 10 is written: one common way makes 4 and 10 into 104.

- Canonical: /glossary#vegas · alias: las vegas · related: point-value, four-ball, birdie
- Capabilities: `game-library` (Vegas isn't in it), cited so a change reopens the record. No GoLo note: "Quota and Vegas are golf, full stop" (`editorial-review.md`).
- Sources: GolfLink, "How to play Vegas" <https://www.golflink.com/lifestyle/play-vegas>: two teams of two pair their scores, "Start with the lower score"; the winner takes the difference in points; "104 is better than 410"; "When one team makes a birdie, they can flip their opponent's score". The Fried Egg, "Vegas golf game" <https://www.thefriedegg.com/articles/vegas-golf-game>: low score is the first digit; on a birdie "the opposing team's score flips"; "If both teams make a birdie, the numbers remain in the original order"; its first example is 45 against 56, 11 points.
- Cross-checked, not cited (URL contains "gambling" or "betting"): Golf.com's and Golf Monthly's Vegas pages.
- Recomputed: 4, 5 → 45; 5, 6 → 56; 56 − 45 = 11 ✓; 11 × $0.10 = $1.10 ✓; flip: 5, 6 high first = 65 ✓

### Quota (`quota`, P1)

**Definition (43 words):** A points game where each player tries to beat a personal target, usually 36 minus their Course Handicap. Points come from each hole's gross score, commonly 1 for a bogey, 2 for a par, 4 for a birdie and 8 for an eagle.

**Explanation:** The result is points over or under the quota, so players of any handicap can win.

**Example:** A 12.4 Index off blue tees rated 71.8, Slope 131, par 72, plays off 14, so the quota is 36 − 14 = 22. Eight pars, six bogeys, a birdie and three double bogeys score 16 + 6 + 4 + 0 = 26: plus 4.

**Note (house-rules):** Groups set the point table and the target. Some start each player on their Course Handicap in points and play to 36, which comes to the same result.

- Canonical: /glossary#quota · related: stableford, course-handicap, best-score · content links: /games/best-score
- Capabilities: `quota` (planned), cited so it reopens the record. No GoLo note, and the record never says GoLo scores quota (its claim phrase is "quota").
- Sources: Beezer Golf, "Quota tournament" <https://beezergolf.com/games-guide/quota-tournament>: "1 point for bogeys, 2 points for a par, 4 points for birdies, and 8 points for eagles"; two versions, start on your Course Handicap and beat 36, or start at 0 and beat 36 minus Course Handicap. LiveTourney, "A complete guide to the quota golf game format" <https://www.livetourney.com/blog/quota-golf-game>: "The standard formula is 36 minus the player's Course Handicap"; points "based on their gross score"; double bogey or worse 0, bogey 1, par 2, birdie 4, eagle 8.
- Cross-checked, not cited (URL contains "betting"): The Golf News Net's Quota page. The Arizona Golf Association page in the search results returned 404.
- Recomputed: 12.4 × 131 ÷ 113 = 14.375; − 0.2 = 14.175 → 14 ✓ (published Course Handicap record); 36 − 14 = 22 ✓; 8 + 6 + 1 + 3 = 18 holes ✓; 8 × 2 + 6 × 1 + 1 × 4 + 3 × 0 = 26 ✓; 26 − 22 = +4 ✓. Starting on 14 and playing to 36: 14 + 26 = 40, 40 − 36 = +4, the same ✓

### Sixes (`sixes`, P2)

**Definition (28 words):** A game for four players in two-against-two matches, with partners changing every six holes so that over 18 holes each player partners each of the other three once.

**Explanation:** Each six-hole stretch is its own match, and any two-against-two scoring works; better ball is the most common.

**Example:** A and B play C and D on holes 1 to 6, A and C play B and D on 7 to 12, and A and D play B and C on 13 to 18. At $5 a match, win two and lose one and you're $5 up.

**Note (house-rules):** Groups decide the order of partners and the scoring for each match, and some change the scoring when partners change.

- Canonical: /glossary#sixes · aliases: round robin, hollywood · related: four-ball, match-play, nines
- Capabilities: `team-play` (live, "Four players in two fixed pairs"), cited so a change reopens the record; no GoLo note, since GoLo's pairs don't rotate.
- Sources: Golf Compendium, "Sixes golf format" <https://www.golfcompendium.com/2019/01/sixes-golf-format.html>: "Players rotate partners after every six holes"; A and B v C and D on 1–6, A and C v B and D on 7–12, A and D v B and C on 13–18; each six-hole segment is separate; "the most common name for this format is Round Robin", also Hollywood. Golf Compendium, "Round Robin" <https://www.golfcompendium.com/2023/08/round-robin.html>: three six-hole matches, "also commonly known by the name Sixes", and Hollywood. Golf.com, "How to play Sixes" <https://golf.com/news/money-games-explained-how-to-play-sixes/>: "Sixes, otherwise known as Round Robin or Hollywood"; any two-on-two scoring, "keep it the same, or switch it up when you switch partners".
- Golf Compendium, "Hollywood" <https://www.golfcompendium.com/2024/09/hollywood-format.html>: the same rotation; "fourball (better ball, meaning the lower score of the two partners counts as the side's score) being most common".
- Recomputed: pairs AB, AC, AD for A, so A partners B, C and D once ✓; +$5 + $5 − $5 = +$5 ✓

### Nines (`nines`, P2)

**Definition (38 words):** A points game, usually for three players, with nine points on every hole: 5 for the lowest score, 3 for the middle and 1 for the highest. Tied players share the points for the places they tie for.

**Explanation:** Two tied for low take 4 each; two tied for high take 2 each; three tied take 3 each. At the end, players settle the difference in points at an agreed amount a point.

**Example:** After 18 holes there are 162 points. You have 60, Jess 52 and Tom 50. At $1 a point, Jess owes you $8, and Tom owes you $10 and Jess $2: you're up $18, Jess down $6, Tom down $12.

**Note (house-rules):** Groups choose gross or net. It's also played by four, with 5, 3, 1 and 0.

- Canonical: /glossary#nines · alias: 5-3-1 · related: point-value, sixes, best-score · content links: /blog/golf-games-for-3-players
- Capabilities: `game-library` (Nines isn't in it), cited so a change reopens the record. No GoLo note; the linked post already says "GoLo doesn't score it".
- Sources: Golf Compendium, "Nines" <https://www.golfcompendium.com/2022/12/nines-golf-game.html>: nine points a hole; ties add the places' points and divide; in a foursome 5-3-1-0, "A group of three golfers playing nines would just use the 5-3-1 points". CaddieHQ, "How to play 9s" <https://www.caddiehq.com/resources/how-to-play-9s-golf>: also known as 5-3-1; "net or gross scores"; two tied for best take 4 each. GoLo, "Golf games for 3 players" <https://www.golo.golf/blog/golf-games-for-3-players> (served 200 on 2026-11-11): "Nines, also called 5-3-1, was made for three"; the tie splits; "players settle the difference in points at an agreed amount a point".
- Agrees with the post and the chooser (`chooser.ts`, "Nines (5-3-1)").
- Recomputed: 9 × 18 = 162 ✓; 60 + 52 + 50 = 162 ✓. Ties: (5 + 3) ÷ 2 = 4; (3 + 1) ÷ 2 = 2; 9 ÷ 3 = 3 ✓. Pairs: you − Jess 8, you − Tom 10, Jess − Tom 2. You +8 + 10 = +18; Jess −8 + 2 = −6; Tom −10 − 2 = −12; total 0 ✓

### Greensomes (`greensomes`, P2)

**Definition (35 words):** A two-player team format where both partners tee off, the side picks one drive, and the partner whose drive wasn't picked plays the next shot. From there they alternate shots until the ball is holed.

**Explanation:** It's foursomes with a choice of drive. In Chapman, the partners also swap balls for the second shot before choosing.

**Example:** Course Handicaps of 11 and 23: 60% of 11 is 6.6 and 40% of 23 is 9.2, so the side plays off 15.8, rounded to 16.

**Note (handicapping):** The R&A's Committee Procedures (Section 9B) describe it as a variation of foursomes. Appendix C of the Rules of Handicapping recommends 60% of the lower Course Handicap plus 40% of the higher.

- Canonical: /glossary#greensomes · related: foursomes, chapman, handicap-allowance
- Capabilities: none. [Question 5](#product-audit-questions).
- Sources: R&A Committee Procedures, Section 9B: "Greensomes is a variation of Foursomes where both partners play from the teeing area and one of the two tee shots is selected. The partner whose tee shot was not selected then plays the next stroke". RoH Appendix C: "Greensomes 60% low / 40% high". Golf Monthly, "What is greensomes?" <https://www.golfmonthly.com/features/what-is-greensomes>: each player tees off, the best drive is chosen, alternate shot from there; under the WHS "60% of the lowest handicap, plus 40% of the highest" (its example: 5 and 15 → 9). National Club Golfer, "How to play greensomes" <https://www.nationalclubgolfer.com/club/glossary/greensomes-golf-format-explained/>: both tee off, choose one ball, alternate; "60% of the lower handicap plus 40% of the higher".
- The example applies the percentages to rounded Course Handicaps, as Appendix C's own examples do "for ease of illustration"; Appendix C applies them to the unrounded figure.
- Recomputed: 11 × 0.6 = 6.6 ✓; 23 × 0.4 = 9.2 ✓; 6.6 + 9.2 = 15.8 → 16 ✓. Golf Monthly's: 5 × 0.6 + 15 × 0.4 = 3 + 6 = 9 ✓

### Florida Scramble (`florida-scramble`, P2)

**Definition (27 words):** A scramble in which the player whose shot the team picks sits out the next shot, then rejoins. No one player can hit every shot that counts.

**Explanation:** In a Miami scramble, usually a different format, the player whose drive is picked sits out until the team reaches the green.

**Example:** Four players. Your drive on the 5th is picked, so the other three play the second shot from it. Tom's approach is picked, so he sits out the third and you're back in.

**Note (house-rules):** The R&A's Committee Procedures (Section 9C) list it as a scramble variation, also called dropout scramble or stand aside. Handicaps are the organizer's call.

- Canonical: /glossary#florida-scramble · alias: step-aside scramble · related: scramble, texas-scramble, shamble · content links: /games/scramble
- Capabilities: `scramble` (live), cited; no GoLo note. [Question 6](#product-audit-questions).
- Sources: R&A Committee Procedures, Section 9C: "A Florida Scramble (also known as Dropout Scramble, Step Aside, Stand Aside, Stand Out) provides that the player whose shot is selected does not play the next shot." Beezer Golf, "Step Aside" <https://beezergolf.com/games-guide/step-aside>: four-player teams; the player whose shot was selected doesn't play the next one; "There is no fixed set of rules concerning handicaps in Florida Scramble, and they are decided by the organizer." England iGolf, "Golf scramble formats" <https://englandigolf.co.uk/igolf-blog/blog-archive/golf-scramble-formats-the-ultimate-guide-to-team-play/>: "sometimes called a 'Step Aside Scramble'"; "the player whose shot is selected steps aside for the next shot"; it also notes a less common shamble-like reading. Golf Compendium, "Miami scramble" <https://www.golfcompendium.com/2020/11/miami-scramble-golf-format.html>: the selected driver "has to skip the following strokes until the team reaches the green".
- Recomputed: your drive picked → you sit out shot 2, the other three play it ✓; Tom's shot 2 picked → Tom sits out shot 3, you play it ✓

### Peoria System (`peoria-system`, P2)

**Definition (38 words):** A one-day handicap for an event where many players have no Handicap Index. Six holes are picked in secret, and after the round each player's score on them is scaled up to set their strokes for the day.

**Explanation:** The usual sum, with each hole capped at double par: the six-hole score times 3, minus the course's par, times 80%. It sets strokes for that event only.

**Example:** The hidden holes turn out to be the 3rd, 5th, 8th, 12th, 14th and 17th, and you played them in 31 on a par-72 course. 31 × 3 = 93; 93 − 72 = 21; 21 × 80% = 16.8, so 17 strokes. A gross 95 is a net 78.

**Note (convention):** Versions differ: which holes are picked (traditionally a par 3, a par 4 and a par 5 on each nine), the 80%, and the cap on each hole (some events use double bogey instead of double par).

- Canonical: /glossary#peoria-system · alias: peoria · related: handicap-index, net-score, sandbagging
- Capabilities: none. GoLo uses the Index each player enters.
- Sources: Golf Compendium, "How the Peoria System works" <https://www.golfcompendium.com/2026/01/peoria-system-golf-handicap.html>: for events where most players "do not have real handicap indexes"; six holes not revealed until play ends; traditionally a par 3, par 4 and par 5 on each nine; double par the maximum per hole; total × 3, minus par, × 80% (its example: 32 → 96 − 72 = 24 → 19.2 → 19). Beezer Golf, "Peoria System" <https://beezergolf.com/games-guide/peoria-system>: the same steps and double-par maximum; "any of the holes can be chosen at random". CaddieHQ, "What is Peoria scoring?" <https://www.caddiehq.com/resources/what-is-peoria-scoring-in-golf>: "a quick-and-dirty, one-day handicapping method"; six secret holes, × 3, minus par; the result comes off the 18-hole score.
- Related to Sandbagging as the inventory has it: it's what events use when nobody can vouch for a handicap. The record doesn't say so; the link is enough.
- Recomputed: 31 × 3 = 93 ✓; 93 − 72 = 21 ✓; 21 × 0.8 = 16.8 → 17 ✓; 95 − 17 = 78 ✓. Golf Compendium's: 32 × 3 = 96; 96 − 72 = 24; 24 × 0.8 = 19.2 → 19 ✓

### Three-Ball (`three-ball`, P3)

**Definition (30 words):** A form of match play where three players each play an individual match against the other two at the same time, with one ball counting in both of their matches.

**Explanation:** Golfers also call any group of three a three-ball; that's a group, not this format.

**Example:** You, Jess and Tom play three matches at once. On the 1st you make 4 and both of them make 5: you win the hole in both your matches, and Jess and Tom halve theirs.

**Note (rules):** Rule 21.4 of the Rules of Golf (Three-Ball Match Play). It covers the two cases where the matches conflict: a stroke played out of turn, and a ball or ball-marker lifted or moved by one opponent.

**GoLo note:** Without teams, GoLo plays the Overall Match and Nassau head to head, so in a group of three each player has a match with each of the other two.

- Canonical: /glossary#three-ball · alias: three-ball match play · related: match-play, nassau · content links: /rules#rule-21 · CTA intent: games
- Capabilities: `game-library` (live); the note is its limit "Without teams, Nassau and the Overall Match are played head to head: with three or four players, every pair has its own match". [Question 1](#product-audit-questions).
- Sources: RoG Rule 21.4 <https://www.randa.org/en/rog/the-rules-of-golf/rule-21>: "Each of three players plays an individual match against the other two players at the same time, and Each player plays one ball that is used in both of their matches"; 21.4b playing out of turn; 21.4c ball or ball-marker lifted or moved by one opponent. Beezer Golf, "Three Ball" <https://beezergolf.com/games-guide/three-ball>: "Golfer A plays one match against B and another against C", up to two points a hole. Golf Monthly, "The best threeball formats for golf" <https://www.golfmonthly.com/features/the-game/the-best-threeball-formats-for-golf-74154>: uses "threeball" for any group of three and lists games for one, which supports the explanation.
- Recomputed: three players → three pairs (you–Jess, you–Tom, Jess–Tom) ✓; 4 < 5 twice → you win both ✓; 5 = 5 → halved ✓

## Independent review (2026-11-11)

A separate agent, given the diff, the house rules and this packet but not the drafter's conclusions, checked every sentence against the cached sources and recomputed every example. It found five errors and six suggestions; all were applied:

- **Texas Scramble:** the drive count said "four each … is common, three in some", but the cited Golf Monthly calls three typical. Now "three or four each … is typical", with England iGolf added as a source.
- **Modified Stableford:** "pays more for good holes" was wrong for the PGA Tour table (2 for a birdie, 0 for a par: less than standard Stableford). Now "with its own points table that rewards good holes".
- **Peoria System:** both sources treat the double-par cap as the standard step, so it moved into the usual sum, with double bogey as the variant; the example now states par 72.
- **Packet:** Quota's word count corrected.
- **Suggestions applied:** Chapman's history sentence cut (one publisher only); Nines "usually for three players", and "also played by four"; Sixes cites the Hollywood page for "better ball is the most common"; Three-Ball drops "or threesome" (threesomes is also a format name); Par Competition's note says "unrounded Course Handicap of 10.988", and its bogey target is described; Shamble's explanation reworded; Florida vs Miami "usually a different format"; Vegas's 104 softened to "one common way"; Shamble's `ctaIntent` dropped.
- **Confirmed by the review:** all arithmetic, the source URLs, the R&A quotes, the canonicals and aliases, and the three GoLo notes against the registry text.

## Checks run for this PR

- `npm run lint` (ESLint, filter CSS, `lint:content`: 96 glossary records valid, 82 published), `npm run typecheck`, `npm test` (glossary 140 cases), `npm run build`: all pass.
- Built output: none of the new records' text is in `.next/server/app/glossary.html`, `glossary.rsc`, `llms.txt` or `.next/static`. Results are in the PR description.
