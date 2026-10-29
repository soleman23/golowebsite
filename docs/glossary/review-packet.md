# Glossary MVP: review packet for the owner (#158–#162)

Prepared October 29, 2026 for the owner's sign-off. **Nothing here is a review.** An agent opened the sources, recomputed the examples and checked GoLo claims against `lib/content/capabilities.ts`; the owner signs the rules fact-check, the product audit, the SEO/canonical confirmation and approval (`editorial-review.md` § Roles). All 56 records are at `in-review`, with no `reviewLog`, `reviewedBy` or `reviewedOn`.

## What changed in this pass

- **Sources.** Every record now carries the pages that were actually opened on October 29, 2026, each with `accessedOn`. The old handicap source URL (`usga.org/handicapping/roh/`) is a 404; each rule now links its own page under `usga.org/handicapping/roh/Content/rules/`. Corroborating pages whose URL contains a banned word (`bet`, `betting`, `gambling`) were left out of the records rather than excepted, so `lint:content` stays as strict as it was; they're listed below where they support a term.
- **Corrections from the primary sources (18 records):** Playing Handicap applies the allowance to the unrounded Course Handicap (RoH 6.2a); Course Handicap rounding (6.1a) and exact intermediate figures; Handicap Index updates the day after a score (5.4); low Playing Handicap off zero is RoH Appendix C, not just convention; allowances exist for every format; net double bogey is for players with an Index, par + 5 before (3.1a/b); par is defined for a scratch golfer with two putts (Definitions, Appendix F); a match is won when one side leads by more holes than remain (RoG 3.2a(3)); a Nassau is usually, not always, match play; "tied, or halved" (RoG 3.2a(1)); greenie conditions vary; the teeing-area penalty is Rule 6.1b; the bunker definition's exclusions; mulligans and breakfast balls under RoH 2.1b(ii); gimmes under RoG 3.2b, 3.3c and RoH 3.3; slice, rough and driver-loft wording; pitch "often used".
- **Examples recomputed** for all 56; six were rewritten (Press, Re-press, Bingo Bango Bongo, Best Score, Settle-up, Skins' "tie" instead of "halve") and are recomputed below.
- **GoLo notes** added only from `live` entries: Skins and Carryover (`live-skins`), Nassau (`game-library`, `overall-match-presses`), Scramble (`scramble`), Closest to the Pin (now `closest-to-pin`, from #194), Course Handicap, Handicap Stroke, Handicap Allowance (`handicap-strokes`). Each passes the full claim guard.
- **CTA intents** (rendered by #164's branch): Press, Re-press and Carryover now `settle-up`; Four-Ball, Foursomes, Match Play and Stableford `games` ("Browse the games GoLo scores").

## Currency (checked October 29, 2026)

| Source | In force | Next change | Evidence |
|---|---|---|---|
| Rules of Golf | 2023 edition, with clarifications of 2 October 2026 | Next edition published **1 January 2028** | R&A, "New and Updated Model Local Rules for 2026" (randa.org/articles/new-and-updated-model-local-rules-for-2026); R&A Rules hub |
| Rules of Handicapping | 2024 edition | None announced | USGA Handicapping home ("Effective January, 2024") |

`inventory.md` and `editorial-review.md` said a Rules revision might take effect January 1, 2027; both now say 2028. #166 still rechecks both at publication.

Spot-checked by hand from the primary pages, not just the agent's notes: RoH 6.2a and clarification 6.2a/1, RoH 3.3, RoH 2.1b, and the R&A's 2028 statement.

## Decisions and confirmations the owner needs (content)

1. **Sign the four stages per record**, or send corrections. To record approval, an agent adds a `reviewLog` with `rules`, `product`, `seo` and `approval` entries dated the day you actually did each (`by: "owner"`), `reviewedBy: "owner"`, `reviewedOn`, and `status: "approved"`. The validator refuses anything less.
2. **`handicap-strokes` (capability-check row 2).** The Course Handicap, Handicap Stroke and Handicap Allowance GoLo notes rest on an app-check of 0.6.2 (2026-10-11). Confirm against the current build, or say to drop the notes. Rows 1–13 are still unconfirmed in general.
3. **Closest to the Pin carry.** PR #195 (open, another session) records that an unwon Closest to Pin hole carries. The glossary note doesn't claim it. After #195 merges, say whether to add "A hole nobody wins carries to the next one."
4. **Wolf tee order.** GoLo's Wolf tees off last (your answer, #154 Q-e), but no registry entry records it, so the Wolf record has no GoLo note. Add a `game-library` limit if you want the note.
5. **Short definitions under 20 words**, kept short on purpose: Birdie, Eagle, Bogey, Double Bogey (9), 19th Hole (11), Snowman (14), Gross Score, Gimme (15), Net Score, Stroke Play (16), Closest to the Pin, Longest Drive (17), Putter (18), Playing Handicap, Teeing Area (19). Accept as exceptions to "normally 20–45 words", or name the ones to lengthen.
6. **Thin corroboration** (source hierarchy level 5, community usage): Closest to the Pin and Longest Drive are corroborated by event rule sheets; Re-press only by Wikipedia and CaddieHQ. Accept, or drop the claim the source can't carry.
7. **Not opened:** "teeing ground until 2019" and "water hazards before 2019" (the 2019 renaming), the 7-iron loft (now worded as "roughly three times" a driver's), and "topped" as the cause of a worm burner. Strike or confirm.
8. **Fairway alias "short grass".** Kept (aliases are stable), but it isn't a strict synonym: the Rules' "closely mown area" also covers fringes and paths mown to fairway height. Keep or drop.

## Reading the term entries

The "Rules/WHS claims checked" verdicts are the agent's verdicts on the **draft as merged in #188–#192**. Where a verdict says *imprecise* or *disagrees*, the record above it already carries the fix; check the wording shown, not the verdict. "Recomputed" lines for rewritten examples are recomputed from the new text.

## Existing-site wording noticed (outside M7, no change made)

- `/games/skins` glossary "Validation: … only count on a birdie or better" is narrower than the guide's own step 4 and the post (inventory conflict 2, still on `main`).
- `/blog/sandbagging` "Play an allowance — 90% in four-ball" is the four-ball **match play** figure; four-ball stroke play is 85% (RoH Appendix C).
- `/blog/index-vs-course-handicap` says "a course of average difficulty"; the RoH says "standard difficulty". The glossary uses "standard".


## #158 Games and formats

### Skins (`skins`, P0)

**Definition (40 words):** A game where every hole is worth a skin, won only by the player with the lowest score outright. If the low score is tied, nobody wins the hole, and in most groups the skin carries to the next one.

**Example:** Four players at $5 a skin tie holes 1 to 3. Your birdie on the 4th takes four skins: $60, $20 from each of the other three.

**Note (house-rules):** Groups set whether ties carry, whether skins are gross or net, and what happens to skins still carried after the 18th.

**GoLo note:** GoLo builds skins and carries hole by hole on the scoring screen and the live leaderboard, and nets them into the settle-up with the round's other games.

- Canonical: /games/skins · related: carryover, push, nassau, best-score · content links: /blog/skins-carryover · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015), `live-skins` (live, OWNER_1029)
- Sources in the record: Golf.com <https://golf.com/news/skins-game-2025-everything-to-know-format-money/> (opened 2026-10-29); LINKS Magazine <https://linksmagazine.com/6-common-golf-games-explained/> (opened 2026-10-29)
- Recomputed: 4 skins × $5 × 3 opponents = $60, $20 from each ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-skins-golf-betting-games-explained> (lowest score wins; tie carries); <https://golf.com/news/skins-game-2025-everything-to-know-format-money/> (lowest score wins a skin; tie carries); <https://linksmagazine.com/6-common-golf-games-explained/> (ties carry over)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Nassau (`nassau`, P0)

**Definition (34 words):** Three matches in one round, each for the same amount: the front nine, the back nine and the full eighteen. Most groups play each as match play, counted in holes won rather than strokes.

**Example:** In a $5 Nassau you win the front 2 up, halve the back and win the eighteen 2 up: $10 for the day. Lose all three and you're down $15, the most a straight Nassau can cost.

**Note (house-rules):** No governing body writes rules for the Nassau. Whether strokes count, whether presses are allowed and when the eighteen closes are up to the group.

**GoLo note:** GoLo plays the three matches and nets them into the settle-up. Its Nassau takes no presses; presses are on the Overall Match game.

- Canonical: /games/nassau · related: match-play, press · content links: /blog/nassau · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015), `nassau-presses` (planned, APP_CHECK_062), `overall-match-presses` (live, APP_CHECK_062)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf> (opened 2026-10-29); National Club Golfer <https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/> (opened 2026-10-29)
- Recomputed: Front +$5, back push $0, eighteen +$5 = $10 ✓; Lose all three: 3 x $5 = $15 ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-a-nassau-golf-gambling-game> (three bets; match play; stroke-play variant); <https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf> (three-part bet, usually match play); <https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/> (match play most common; can be stroke play)
- Revised in this pass.
- Site copy: None. /games/nassau and games.ts define it as match play; the glossary can keep 'most groups' while the guide describes GoLo's version.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Wolf (`wolf`, P0)

**Definition (33 words):** A four-player game where one player, the wolf, rotates each hole and either picks a partner for that hole or plays alone against the other three for a bigger share of the points.

**Example:** On the 5th the wolf passes on all three drives and goes alone. A birdie that beats the other three's best score wins double the usual points.

**Note (house-rules):** Groups differ on whether the wolf tees off first or last, what going alone is worth, and who is wolf on the 17th and 18th.

- Canonical: /games/wolf · related: four-ball, match-play · content links: /blog/wolf · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015)
- Sources in the record: Golf.com <https://golf.com/travel/are-you-the-leader-of-your-foursome-try-this-golf-game/> (opened 2026-10-29); LINKS Magazine <https://linksmagazine.com/6-common-golf-games-explained/> (opened 2026-10-29)
- Usage corroborated by: <https://www.golfdigest.com/story/golf-game-wolf-betting-gambling-explained> (rotating wolf, partner or lone wolf, wolf goes last); <https://golf.com/travel/are-you-the-leader-of-your-foursome-try-this-golf-game/> (wolf tees off first; lone wolf worth more); <https://linksmagazine.com/6-common-golf-games-explained/> (wolf hits last; lone wolf)
- Site copy: None. Owner decision: GoLo's Wolf tees last; glossary says order varies and links the guide.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Bingo Bango Bongo (`bingo-bango-bongo`, P0)

**Definition (41 words):** A points game with three points on every hole: one for the first ball on the green (bingo), one for the closest to the pin once every ball is on (bango), and one for the first ball in the hole (bongo).

**Example:** Eighteen holes hold 54 points. The 22-handicapper who lays up short of the green on the 7th still plays first from there, so bingo is theirs to lose, which is why the game suits a group with a 6 and a 22 in it.

**Note (house-rules):** Groups decide whether the fringe counts as on the green. Most keep strict order of play, farthest from the hole first, so the points go to the right player.

- Canonical: /games/bingo-bango-bongo · related: skins · content links: /blog/bingo-bango-bongo · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015)
- Sources in the record: Golf Digest <https://www.golfdigest.com/story/how-to-play-bingo-bango-bongo-golf-games-explained> (opened 2026-10-29); LINKS Magazine <https://linksmagazine.com/6-common-golf-games-explained/> (opened 2026-10-29)
- Recomputed: 18 holes × 3 points = 54 ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-bingo-bango-bongo-golf-games-explained> (bingo/bango/bongo definitions; play in order); <https://linksmagazine.com/6-common-golf-games-explained/> (same three points)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Best Score (`best-score`, P0)

**Definition (31 words):** An individual game where everyone plays for the same amount and the best score for the round takes it, net or gross, or the top two or three finishers split it.

**Explanation:** It isn't best ball. Best ball, or Four-Ball, is a team format where a side counts its better score on each hole. Best Score compares each player's own total.

**Example:** Four players at $10 each, played net. The low net score, a 70, takes $10 from each of the other three and finishes $30 up. Split two ways, the top two each finish $10 up and the other two $10 down.

- Canonical: /games/best-score · related: four-ball, skins · content links: — · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Four-Ball <https://www.randa.org/en/rog/definitions> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Best ball / Four-Ball: team counts its better score on each hole → **agrees**. Side's score is the lower of the two partners' scores on each hole. Draft keeps Best Score and Four-Ball distinct.
- Recomputed: $10 × 4 players, winner takes all = winner +$30, others −$10 each ✓; split two ways = $20 each to top two = +$10 each; others −$10 ✓
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Scramble (`scramble`, P0)

**Definition (34 words):** A team format where everyone tees off, the team picks the best shot, and every player plays the next shot from there, until the ball is holed. Each team records one score per hole.

**Example:** Four players drive; the team takes the one in the middle of the fairway. All four hit approaches from that spot, the team picks the best again, and so on.

**Note (handicapping):** A scramble team's handicap is usually a set percentage of each player's Course Handicap, and the percentages depend on the team's size.

**GoLo note:** GoLo scores a scramble for up to 12 players in 2 to 6 teams, with team handicaps from the WHS percentages, played gross, or set by the organizer. It doesn't count Texas scramble drives and doesn't score a shamble.

- Canonical: /games/scramble · related: four-ball, foursomes · content links: — · CTA intent: games
- Capabilities: `scramble` (live, APP_CHECK_121)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/scramble> (opened 2026-10-29); Golf.com <https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - ruleNote: team handicap is a set percentage of each player's Course Handicap, by team size → **agrees**. Scramble 4 players 25/20/15/10%, 3 players 30/20/10%, 2 players 35/15%, low to high, applied to unrounded Course Handicaps.
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/scramble> (team competition, best tee shot selected, all play from there); <https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/> (scramble procedure)
- Revised in this pass.
- Site copy: /games/scramble percentages (35/15, 30/20/10, 25/20/15/10, unrounded, round once) match Appendix C.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Four-Ball (`four-ball`, P1)

**Definition (33 words):** A partnership format where each player plays their own ball and the side counts the better of its two scores on each hole. It can be played as match play or stroke play.

**Explanation:** Usually called best ball, though golfers also use best ball loosely for other team games. In handicap play, a percentage allowance is common, so partners don't get their full strokes.

**Example:** On a par 4 you make a 5 and your partner makes a 4. Your side's score for the hole is 4.

**Note (rules):** The Rules of Golf define Four-Ball and cover it in Rule 23.

- Canonical: /glossary#four-ball · related: best-score, foursomes, match-play, scramble · content links: /games/wolf · CTA intent: games
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Four-Ball; Rule 23.2a <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29); Rules of Golf, 2023 edition (R&A) — Rule 23 <https://www.randa.org/en/rog/the-rules-of-golf/rule-23> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/best%20ball> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/four-ball> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Partners each play own ball; side counts the better score; match or stroke play → **agrees**. Sides of two partners, each playing their own ball; side score is the lower score; match play or stroke play.
  - Percentage allowance common in handicap play → **agrees**. 85% stroke play, 90% match play.
  - ruleNote: Rule 23 → **agrees**. Rule 23 is Four-Ball.
- Recomputed: min(5, 4) = 4 ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/best%20ball> (best-ball includes four-ball sense); <https://www.merriam-webster.com/dictionary/four-ball> (best individual score of each partnership)
- Site copy: /games/wolf glossary 'Best ball (informal): the team's better score on the hole' agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Foursomes (`foursomes`, P1)

**Definition (32 words):** A partnership format where two players play one ball, taking turns: one tees off on the odd-numbered holes, the other on the even, and they alternate strokes until the ball is holed.

**Explanation:** Also called alternate shot. It isn't the same as a foursome, which is just a group of four players. In greensomes and Chapman, both partners tee off before the alternating starts.

**Example:** You drive on the 1st, your partner plays the second shot and you play the third. On the 2nd your partner drives.

**Note (rules):** The Rules of Golf define Foursomes and cover it in Rule 22.

- Canonical: /glossary#foursomes · related: four-ball, scramble, match-play · content links: — · CTA intent: games
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Foursomes; Rule 22.3; Rule 22 <https://www.randa.org/en/rog/the-rules-of-golf/rule-22> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/foursome> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Two players one ball, alternate strokes; one tees off on odd holes, other on even → **agrees**. Partners play one ball in alternating order; they must alternate who plays first from the teeing area of each hole, and alternate strokes after that. Over a normal round this is the odd/even pattern.
  - ruleNote: Rule 22 → **agrees**. Rule 22 is Foursomes.
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/foursome> (alternate-shot match and group-of-four senses)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Match Play (`match-play`, P1)

**Definition (38 words):** A form of play where a player or side plays another hole by hole. The lower score wins the hole, and the match is won when one side is ahead by more holes than are left to play.

**Example:** A triple bogey loses you one hole, the same as losing it by one stroke. Three up with two to play, the match is over.

**Note (rules):** Rule 3.2 of the Rules of Golf covers match play: how a hole and the match are won (3.2a) and conceding a stroke, a hole or the match (3.2b).

- Canonical: /glossary#match-play · related: nassau, four-ball, foursomes · content links: /games/nassau · CTA intent: games
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Match Play; Rule 3.2a(1); Rule 3.2a(3); Rule 3.2b <https://www.randa.org/en/rog/the-rules-of-golf/rule-3> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/match%20play> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Side plays another hole by hole; lower score wins the hole → **agrees**. A hole is won by completing it in fewer strokes, including penalty strokes.
  - Match goes to whoever has won more holes → **imprecise**. A match is won when a player leads by more holes than remain, or by concession or disqualification.
  - ruleNote: Rule 3.2 covers match play including concessions → **agrees**. 3.2b allows conceding the next stroke, a hole or the match.
- Recomputed: 3 up with 2 to play: 3 > 2 = match over (3 and 2) ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/match%20play> (winner wins the greater number of holes)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Stableford (`stableford`, P1)

**Definition (37 words):** A scoring format that awards points for each hole's score against par instead of counting strokes. In the standard version, a bogey earns 1, a par 2, a birdie 3 and an eagle 4. Most points wins.

**Example:** A par, a bogey and a double bogey on three holes is 2 + 1 + 0: three points. A blow-up hole costs zero points, never more.

**Note (rules):** Rule 21.1 of the Rules of Golf sets out Stableford and its standard points.

- Canonical: /glossary#stableford · related: match-play · content links: — · CTA intent: games
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Stableford; Rule 21.1b(1) table; Rule 21.1b, 21.1c <https://www.randa.org/en/rog/the-rules-of-golf/rule-21> (opened 2026-10-29); Golf.com <https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Points vs par: bogey 1, par 2, birdie 3, eagle 4; most points wins → **agrees**. Points against a fixed target score (par unless the Committee sets another): more than one over or no score 0, one over 1, target 2, one under 3, two under 4, three under 5, four under 6.
  - A blow-up hole costs zero points, never more → **agrees**. Score cannot go below zero points for a hole.
- Recomputed: par 2 + bogey 1 + double 0 = 3 ✓
- Usage corroborated by: <https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/> (0 double or worse, 1 bogey, 2 par, 3 birdie, 4 eagle)
- Site copy: Golf.com and blog Quota copy use the same 0/1/2/3/4 scale.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.


## #159 Side games

### Press (`press`, P0)

**Definition (33 words):** A new match started while an existing one is still running, usually called by the side that is behind. It covers only the holes left, and the original match carries on underneath it.

**Example:** In a $10 back nine you're two down with four to play. You press on the 15th tee: holes 15 to 18 are a second $10 match, and the back nine carries on as a match of its own.

**Note (house-rules):** Groups decide whether presses are called or automatic, when they can be called, and whether a press can itself be pressed.

**GoLo note:** On GoLo's Overall Match game, the side two or more down calls a press at two, three or four times the amount, with up to two live at once. GoLo doesn't open presses automatically, and its Nassau takes none.

- Canonical: /blog/pressing · related: re-press, nassau, match-play · content links: /games/nassau · CTA intent: settle-up
- Capabilities: `overall-match-presses` (live, APP_CHECK_062), `auto-press` (planned, APP_CHECK_062), `nassau-presses` (planned, APP_CHECK_062)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf> (opened 2026-10-29)
- Recomputed: back-nine match two down with four to play, press on 15th tee = second $10 match over 15–18; original match continues ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-a-nassau-golf-gambling-game> (press at 2 down opens a same-amount bet); <https://thegolfnewsnet.com/ryan_ballengee/2023/04/14/what-is-a-press-golf-bet-when-to-press-auto-press-107060/> (new bet by the side that is down, lasting as long as the pressed bet); <https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf> (press offered by losing side over remaining holes)
- Revised in this pass.
- Site copy: None. Note: the example (two down after six holes of a $5 front nine, press on the 7th, holes 7-9 are a second $5 match) closely matches Links Magazine's own press example (down two after six holes on the front nine, a second match for holes 7 to 9). Consider changing the numbers so it doesn't read as adapted.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Re-press (`re-press`, P0)

**Definition (23 words):** A press on a press: a new match started by the side that has fallen behind in a press that is already running.

**Example:** You press on the 14th tee, then lose the 14th and 16th and halve the 15th. Two down in the press, you press it on the 17th tee: a third match for the 17th and 18th, on top of the other two.

**Note (house-rules):** Some groups allow it, some cap the number of presses, and some never allow a press on a press. Agree before the first tee.

**GoLo note:** On GoLo's Overall Match game a side can press a press, with no more than two presses live at once.

- Canonical: /glossary#re-press · related: press, nassau · content links: /blog/pressing · CTA intent: settle-up
- Capabilities: `overall-match-presses` (live, APP_CHECK_062)
- Sources in the record: CaddieHQ <https://www.caddiehq.com/resources/what-does-pressing-mean-in-golf> (opened 2026-10-29)
- Recomputed: press from 14th tee; lose 14, halve 15, lose 16 = 2 down in the press after 16; re-press covers 17–18 (GoLo: 2+ down, at most two live) ✓
- Usage corroborated by: <https://en.wikipedia.org/wiki/Nassau_(bet)> (press bets can themselves be pressed at two down); <https://www.caddiehq.com/resources/what-does-pressing-mean-in-golf> ('press the press' when 2 down in the new bet)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Carryover (`carryover`, P0)

**Definition (20 words):** A prize nobody won outright on a hole, usually a skin, added to the next hole's value instead of disappearing.

**Example:** Holes 1 to 3 are tied, so the 4th is worth four skins. At $5 a skin among four players, winning it outright takes $60.

**Note (house-rules):** Groups decide whether ties carry at all and what happens to anything still carried after the 18th.

**GoLo note:** GoLo shows skins and carries building hole by hole on the scoring screen and the live leaderboard.

- Canonical: /blog/skins-carryover · related: skins, push · content links: /games/skins · CTA intent: settle-up
- Capabilities: `game-library` (live, OWNER_1015), `live-skins` (live, OWNER_1029)
- Sources in the record: Golf.com <https://golf.com/news/skins-game-2025-everything-to-know-format-money/> (opened 2026-10-29)
- Recomputed: Holes 1-3 tied -> hole 4 worth 1+3 = 4 skins; 4 x $5 x 3 = $60 ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-skins-golf-betting-games-explained> (skin carries over on a tie); <https://golf.com/news/skins-game-2025-everything-to-know-format-money/> (tied skin's value carries to next hole)
- Revised in this pass.
- Site copy: /games/skins glossary 'A skin nobody won. It rolls onto the next hole' agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Push (`push`, P1)

**Definition (26 words):** A tie that leaves things where they were: nobody wins and nobody owes. In a game that carries, the value rolls on to the next hole.

**Explanation:** Push is the side-game word. In match play the Rules of Golf say a hole is tied, or halved.

**Example:** In a $5 Nassau the eighteen-hole match finishes all square. That match is a push, and nobody pays for it.

- Canonical: /glossary#push · related: carryover, skins, match-play · content links: /games/skins · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Rule 3.2a(2) <https://www.randa.org/en/rog/the-rules-of-golf/rule-3> (opened 2026-10-29); National Club Golfer <https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - In match play the Rules of Golf call a tied hole halved → **imprecise**. The 2023 Rules call it 'tied (also known as halved)'.
- Usage corroborated by: <https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/> (tie = push, no money exchanged); <https://www.golfdigest.com/story/the-best-golf-gambling-games-explained> (uses 'ties/pushes' interchangeably)
- Revised in this pass.
- Site copy: /games/skins glossary has 'Halve: the match-play word for a tied hole'. Same minor imprecision; a later edit could say 'tied (or halved)'.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Greenie (`greenie`, P3)

**Definition (35 words):** A side point for the tee shot closest to the hole on a par 3. Most groups only pay it if the ball is on the green, and many also require a par or better.

**Example:** On the 7th your tee shot stops eight feet away and you two-putt for par: that's the greenie. Hit it closer and make bogey, and in most groups nobody gets it.

**Note (house-rules):** Groups differ on whether the par is required, whether the fringe counts and whether an unclaimed greenie carries to the next par 3.

- Canonical: /glossary#greenie · related: closest-to-the-pin, junk, sandy · content links: /games/closest-to-pin · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29); Golf.com <https://practical-golf.com/golf-terms> (opened 2026-10-29)
- Recomputed: Tee shot to 8 ft, two putts on par 3 = 1 + 2 = 3 = par ✓
- Usage corroborated by: <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (first shot closest to the hole on a par 3); <https://practical-golf.com/golf-terms> (closest to the pin on a par 3, on the green)
- Revised in this pass.
- Site copy: /games/closest-to-pin glossary: 'on in one, par or better to win' - agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Sandy (`sandy`, P3)

**Definition (27 words):** A side point for getting up and down from a bunker: out of the sand and into the hole in two strokes, usually for par or better.

**Example:** You find the greenside bunker on a par 4, splash out to four feet and hole the putt for 4. That's a sandy.

**Note (house-rules):** Some groups pay a sandy for any up-and-down from sand, whatever the score.

- Canonical: /glossary#sandy · related: junk, greenie · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golf News Net <https://thegolfnewsnet.com/ryan_ballengee/2022/08/30/golf-terms-what-is-a-sandy-in-golf-and-what-does-it-mean-to-get-one-126969/> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29)
- Recomputed: 2 strokes to bunker + splash + putt = 4 = par on a par 4 ✓
- Usage corroborated by: <https://thegolfnewsnet.com/ryan_ballengee/2022/08/30/golf-terms-what-is-a-sandy-in-golf-and-what-does-it-mean-to-get-one-126969/> (up-and-down from a bunker for par or better); <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (junk includes par after finding sand)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Junk (`junk`, P1)

**Definition (25 words):** The small side points a group plays for on top of its main game, such as greenies, sandies and birdies, each worth an agreed amount.

**Example:** At $1 a point, a round with a greenie, a sandy and a birdie is $3 from each of the other players before the main game is counted.

**Note (house-rules):** Every group keeps its own list of what counts. Agree it before the first tee, and total it with the main game at the end.

- Canonical: /glossary#junk · related: greenie, sandy, settle-up · content links: /blog/who-pays-first · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29); LINKS Magazine <https://linksmagazine.com/6-common-golf-games-explained/> (opened 2026-10-29)
- Recomputed: 3 points x $1 = $3 from each other player ✓
- Usage corroborated by: <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (junk = side wagers during the round); <https://linksmagazine.com/6-common-golf-games-explained/> (garbage/junk/dots); <https://www.golfdigest.com/story/how-to-play-a-nassau-golf-gambling-game> (side bets known as junk)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Settle-up (`settle-up`, P0)

**Definition (21 words):** Squaring up after the round: working out what each player is up or down across every game, then who owes whom.

**Example:** Four players, three games. Netted, Mike is $25 up, Tom $5 up, Jess $10 down and Sarah $20 down. Three payments square it: Sarah pays Mike $20, Jess pays Mike $5 and Tom $5.

**GoLo note:** GoLo nets every game into one number per player and lists who owes whom for the group. Each round settles on its own, and GoLo never holds, moves or processes money.

- Canonical: /glossary#settle-up · related: junk, press · content links: /blog/who-pays-first, /blog/settle-up-screen · CTA intent: settle-up
- Capabilities: `settle-up` (live, APP_CHECK_100)
- Sources in the record: none
- Recomputed: nets +25 +5 −10 −20 = sum 0 ✓; Sarah→Mike 20, Jess→Mike 5, Jess→Tom 5 = Mike +25, Tom +5, Jess −10, Sarah −20; 3 payments = n − 1 ✓
- Usage corroborated by: <https://www.golfdigest.com/story/how-to-play-skins-golf-betting-games-explained> (money divided up at the end of the round)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Closest to the Pin (`closest-to-the-pin`, P0)

**Definition (17 words):** A side game on a chosen par 3: the tee shot that finishes nearest the hole wins.

**Example:** On the 12th, three of four tee shots are on the green. The one 11 feet away beats 14 and 30 feet.

**Note (house-rules):** Some groups also require the ball to be on the green, or a par, which makes it a greenie.

**GoLo note:** In GoLo the scorer marks the winner on the holes the group chose, and the amount goes into the settle-up. No distance is recorded, and whether a par is needed is the group's call.

- Canonical: /games/closest-to-pin · related: greenie, longest-drive · content links: — · CTA intent: games
- Capabilities: `closest-to-pin` (live, OWNER_1029), `distance-logging` (not-offered, OWNER_1015)
- Sources in the record: lasvegasnational.com <https://lasvegasnational.com/contests/> (opened 2026-10-29); web.stanford.edu <https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html> (opened 2026-10-29)
- Recomputed: 11 < 14 < 30 ft = 11 ft wins ✓
- Usage corroborated by: <https://lasvegasnational.com/contests/> (closest to the pin on par 3s); <https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html> (closest to the hole must be first tee shot)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Longest Drive (`longest-drive`, P0)

**Definition (17 words):** A side game on a chosen hole: the longest tee shot that finishes in the fairway wins.

**Example:** On the par-5 9th, a 260-yard drive in the rough loses to a 240-yard drive in the fairway.

**Note (house-rules):** Most groups only count a drive that finishes in the fairway; some allow the first cut.

**GoLo note:** GoLo scores Longest Drive as a game, but it doesn't record a measured distance.

- Canonical: /games/longest-drive · related: closest-to-the-pin · content links: — · CTA intent: games
- Capabilities: `game-library` (live, OWNER_1015), `distance-logging` (not-offered, OWNER_1015)
- Sources in the record: lasvegasnational.com <https://lasvegasnational.com/contests/> (opened 2026-10-29); web.stanford.edu <https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html> (opened 2026-10-29)
- Usage corroborated by: <https://lasvegasnational.com/contests/> (winning drive must remain in the fairway); <https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html> (ball must rest in the fairway)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.


## #160 Handicaps and course ratings

### Handicap Index (`handicap-index`, P1)

**Definition (41 words):** A number, to one decimal, that measures a golfer's demonstrated ability on a course of standard difficulty. It's worked out from the best 8 of the player's most recent 20 score differentials, and it travels with them from course to course.

**Example:** A golfer whose best eight differentials out of their last twenty average 12.4 carries a 12.4 Handicap Index. Nobody receives 12.4 strokes: the Course Handicap turns it into strokes.

**Note (handicapping):** Rule 5.2 of the Rules of Handicapping sets out the calculation. The index is updated the day after each new score is posted (Rule 5.4).

- Canonical: /blog/index-vs-course-handicap · related: course-handicap, score-differential · content links: — · CTA intent: handicaps
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Handicap Index <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 5.2b <https://www.usga.org/handicapping/roh/Content/rules/5%202b%20For%2020%20Scores.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 5.4 <https://www.usga.org/handicapping/roh/Content/rules/5%204%20Frequency%20of%20Revision%20of%20a%20Handicap%20Index.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 6.1a <https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Measures demonstrated ability on a course of standard difficulty → **agrees**. Defined as the measure of demonstrated ability calculated against the Slope Rating of a course of standard playing difficulty (Slope 113).
  - Worked out from the best 8 of the most recent 20 score differentials → **imprecise**. Average of the lowest 8 of the most recent 20 Score Differentials, rounded to the nearest tenth, then subject to the soft cap and hard cap (Rule 5.8) and exceptional-score adjustments. Fewer than 20 scores use Rule 5.2a.
  - To one decimal → **agrees**. Rounded to the nearest tenth.
  - The index is revised after each new score is posted (ruleNote) → **imprecise**. Updated no later than the day after a score is submitted.
  - Nobody receives 12.4 strokes: the Course Handicap turns it into strokes → **agrees**. Course Handicap converts the index to strokes for the tees played.
- Recomputed: Average of best 8 = 12.4 -> Handicap Index 12.4 = 12.4 ✓
- Revised in this pass.
- Site copy: Blog /blog/index-vs-course-handicap says the index 'updates the day after each new score is posted'; the draft ruleNote says 'revised after each new score is posted'. Align to 'the day after'. Blog also says 'a course of average difficulty' where ROH says 'standard playing difficulty'; the glossary wording is the correct one.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Course Handicap (`course-handicap`, P1)

**Definition (28 words):** The number of strokes a player receives from a particular set of tees, worked out from their Handicap Index, those tees' Slope Rating and Course Rating, and par.

**Explanation:** Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − par), rounded to the nearest whole number, .5 up, for the strokes a player receives. A format's allowance is applied to the unrounded figure.

**Example:** A 12.4 Index from blue tees rated 71.8 with a Slope of 131, par 72: 12.4 × 131 ÷ 113 = 14.375, plus (71.8 − 72) = 14.175, so 14. From the whites (69.6, 122): 12.4 × 122 ÷ 113 = 13.388, minus 2.4 = 10.988, so 11.

**Note (handicapping):** Rule 6.1a of the Rules of Handicapping sets out the formula.

**GoLo note:** GoLo takes each player's Index and works out their Course Handicap for the group's tees. Everyone in a GoLo round plays one set of tees.

- Canonical: /blog/index-vs-course-handicap · related: handicap-index, playing-handicap, slope-rating, course-rating · content links: — · CTA intent: handicaps
- Capabilities: `handicap-strokes` (live, APP_CHECK_062), `mixed-tees` (planned, APP_CHECK_062)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Course Handicap <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 6.1a; Rule 6.1a, Note <https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Number of strokes a player receives from a particular set of tees, from Index, Slope, Course Rating and par → **agrees**. Strokes received, before handicap allowances, from a specific set of tees, determined by Slope Rating and Course Rating minus par.
  - Formula Index x (Slope / 113) + (Course Rating - par) → **agrees**. Same formula for an 18-hole round.
  - ...rounded to a whole number (explanation) → **imprecise**. Rounded to the nearest whole number with .5 rounded up for net double bogey, holes not played and Score Differentials; otherwise the full calculated value is kept and rounding happens only after the Playing Handicap calculation.
- Recomputed: 12.4 × 131 ÷ 113 = 14.3752 ✓; + (71.8 − 72) = 14.175 → 14 ✓; 12.4 × 122 ÷ 113 − 2.4 = 10.988 → 11 ✓
- Revised in this pass.
- Site copy: None. Blog table shows 14.4 / -0.2 / 14.2 / 14 and 13.4 / -2.4 / 11.0 / 11, same rounding of intermediates as the draft.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Playing Handicap (`playing-handicap`, P1)

**Definition (19 words):** The strokes a player actually receives in a particular format: their Course Handicap with that format's handicap allowance applied.

**Example:** In four-ball stroke play, with the recommended 85% allowance, the 12.4 Index from the blue tees plays off 12: the unrounded Course Handicap is 14.175, and 14.175 × 0.85 = 12.05, rounded to 12.

**Note (handicapping):** Rule 6.2a of the Rules of Handicapping applies the allowance to the unrounded Course Handicap, then rounds. Appendix C lists the recommended allowances.

- Canonical: /glossary#playing-handicap · related: course-handicap, handicap-allowance, four-ball · content links: /blog/index-vs-course-handicap · CTA intent: handicaps
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Playing Handicap <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 6.2a and 6.2a/1 <https://www.usga.org/handicapping/roh/Content/rules/6%202a%20Standard%20Calculation.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Course Handicap with the format's allowance applied → **agrees**. The Course Handicap adjusted for handicap allowances or Terms of the Competition; the strokes actually given or received.
  - Four-ball stroke play recommended allowance 85% → **agrees**. Four-Ball stroke play 85%.
  - Example: 14 x 0.85 = 11.9, rounded, = 12 → **disagrees**. Playing Handicap = unrounded Course Handicap x allowance, then rounded (.5 up). Clarification 6.2a/1 says apply the allowance to the unrounded Course Handicap to avoid double rounding; the rounded figure is a fallback only when the unrounded one isn't available.
- Recomputed: 12.4 × 131 ÷ 113 + (71.8 − 72) = 14.175 (unrounded) ✓; 14.175 × 0.85 = 12.049 → 12 (Rule 6.2a) ✓
- Revised in this pass.
- Site copy: Blog says 'Course handicap x format allowance' without saying unrounded; not a conflict, but the corrected glossary example is more precise than the blog.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Course Rating (`course-rating`, P1)

**Definition (22 words):** The score a scratch golfer is expected to shoot from a particular set of tees in normal conditions, given to one decimal.

**Example:** Blue tees rated 71.8 on a par 72 play slightly easier than par for a scratch golfer, so they take 0.2 of a stroke off a Course Handicap before it's rounded.

**Note (handicapping):** Course Ratings come from the Course Rating System, set out in Appendix G of the Rules of Handicapping.

- Canonical: /glossary#course-rating · related: slope-rating, course-handicap · content links: /blog/index-vs-course-handicap · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Course Rating; Appendix G <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix G <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20G%20Golf%20Course%20CourseRatingSlopeRating.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 6.1a <https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm> (opened 2026-10-29); USGA <https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Score a scratch golfer is expected to shoot from a set of tees in normal conditions, to one decimal → **agrees**. Indication of difficulty for the scratch player under normal course and weather conditions; Appendix G says it is expressed in strokes to one decimal and represents the expected score for a scratch player.
  - Course Ratings come from the Course Rating System, set out in Appendix G → **agrees**. Appendix G covers measurement and rating under the Course Rating System.
  - 71.8 on par 72 takes 0.2 off a Course Handicap → **agrees**. The (Course Rating - par) term.
- Recomputed: 71.8 - 72 = -0.2 ✓
- Usage corroborated by: <https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html> (Course Rating = expected score for a scratch player when playing well)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Slope Rating (`slope-rating`, P1)

**Definition (29 words):** A number from 55 to 155 that shows how much harder a set of tees plays for a bogey golfer than for a scratch golfer. 113 is the standard.

**Example:** From tees with a Slope of 131, a 12.4 Index is worth 14.4 strokes before the Course Rating adjustment; from tees rated 113, it would be worth 12.4.

**Note (handicapping):** Slope Rating is defined in the Rules of Handicapping and set through the Course Rating System (Appendix G).

- Canonical: /glossary#slope-rating · related: course-rating, course-handicap · content links: /blog/index-vs-course-handicap · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: USGA: What Exactly are Course Rating and Slope Rating? — USGA article, Nov 2025 <https://www.usga.org/content/usga/home-page/articles/2025/11/what-exactly-are-course-rating-slope-rating.html> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Definitions: Slope Rating; Appendix G <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29); USGA <https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Range 55 to 155; 113 standard → **agrees**. USGA article states Slope Rating can be anywhere from 55 to 155 and the standard is 113. Appendix G (opened) confirms 113 as standard relative difficulty but does not state the range.
  - Shows how much harder a set of tees plays for a bogey golfer than for a scratch golfer → **agrees**. Relative difficulty for non-scratch players compared with scratch players; derived from the gap between Course Rating and Bogey Rating.
- Recomputed: 12.4 x 131 / 113 = 14.375 (draft 14.4) ✓; 12.4 x 113 / 113 = 12.4 ✓
- Usage corroborated by: <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (Slope runs 55-155, measures difficulty for bogey golfer vs expert); <https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html> (Slope from Course Rating vs Bogey Rating)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Stroke Index (`stroke-index`, P1)

**Definition (22 words):** The ranking printed on the scorecard that orders a course's holes from 1 to 18 by where handicap strokes are received first.

**Example:** A Course Handicap of 14 gets one stroke on the holes indexed 1 to 14. A 22 gets two strokes on 1 to 4 and one on the other fourteen.

**Note (handicapping):** Appendix E of the Rules of Handicapping sets out how clubs allocate the stroke index.

- Canonical: /glossary#stroke-index · related: handicap-stroke, course-handicap · content links: /blog/index-vs-course-handicap · CTA intent: handicaps
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Stroke Index; Appendix E <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix E <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20E%20Stroke%20Index%20Allocation.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Ranking 1-18 by where handicap strokes are received first → **agrees**. Value assigned to each hole to show where handicap strokes are given or received. Appendix E allocates by difficulty relative to par within six triads, odd/even by nine; it is not a pure difficulty ranking, so the draft's wording is the accurate one.
  - A 22 gets two strokes on 1-4, one on the other fourteen → **agrees**. Above 18 strokes, stroke index 1 repeats as 19, and so on.
- Recomputed: 14 strokes -> SI 1-14 = one each on 14 holes ✓; 22 - 18 = 4 extra -> SI 1-4 get two; SI 5-18 (14 holes) get one ✓
- Site copy: /games/scramble glossary and How It Works call stroke index a ranking of hole difficulty (1 hardest). Simplification, not a contradiction; the glossary is more precise.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Handicap Stroke (`handicap-stroke`, P1)

**Definition (21 words):** A stroke taken off a player's score on a particular hole because of their handicap, placed by the scorecard's stroke index.

**Example:** With a stroke on stroke index 3, a bogey 5 counts as a net 4: it halves the hole against an opponent's par 4 with no stroke.

**Note (handicapping):** In match play, the Rules of Handicapping have the lowest Playing Handicap play off zero and everyone else receive the difference (Appendix C).

**GoLo note:** GoLo places strokes by the card's stroke index and gives every player their full Course Handicap; it doesn't play anyone off the low man.

- Canonical: /glossary#handicap-stroke · related: stroke-index, course-handicap, playing-handicap · content links: /blog/index-vs-course-handicap · CTA intent: handicaps
- Capabilities: `handicap-strokes` (live, APP_CHECK_062), `handicap-allowances` (planned, APP_CHECK_062)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Appendix E <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20E%20Stroke%20Index%20Allocation.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix C, Handicap Competitions <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Stroke taken off a hole score because of handicap, placed by stroke index → **agrees**. Stroke index shows where strokes are given or received.
  - ruleNote kind 'convention': in a match, the lowest handicap plays off scratch and others receive the difference → **imprecise**. This is the Rules of Handicapping's own match-play procedure: the player with the lowest Playing Handicap plays off zero and the others receive the difference. It is not merely a convention.
- Recomputed: Bogey 5 on a par 4 with one stroke: 5 - 1 = net 4 = opponent's gross 4 -> hole halved ✓
- Revised in this pass.
- Site copy: Blog wording is 'With a stroke on stroke index 3'; draft says 'on the 3rd'. Not a factual conflict; align.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Handicap Allowance (`handicap-allowance`, P1)

**Definition (39 words):** The percentage of a Course Handicap a player gets in a particular format, set so players of different handicaps have a fair chance. The Rules of Handicapping recommend one for every format; some, like singles match play, are 100%.

**Example:** The recommended allowances include 95% for individual stroke play, 85% for four-ball stroke play, 100% for individual match play and 90% for four-ball match play.

**Note (handicapping):** Appendix C of the Rules of Handicapping lists the recommended allowances; the Committee or the group can set others.

**GoLo note:** GoLo gives every player their full Course Handicap. It applies no percentage, except a scramble's team handicap.

- Canonical: /glossary#handicap-allowance · related: playing-handicap, course-handicap, four-ball, scramble · content links: /blog/index-vs-course-handicap · CTA intent: —
- Capabilities: `handicap-strokes` (live, APP_CHECK_062), `handicap-allowances` (planned, APP_CHECK_062), `scramble` (live, APP_CHECK_121)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Handicap Allowance; Appendix C <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix C table; Appendix C; C/1 <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - A percentage applied to Course Handicaps in some formats to keep them fair → **imprecise**. Defined as the percentage of a Course Handicap recommended to create equity in a specific format. Appendix C gives a recommendation for every format, including 100% for singles match play, and applies it to the unrounded Course Handicap.
  - 95% individual stroke play, 85% four-ball stroke play, 100% individual match play, 90% four-ball match play → **agrees**. Same four figures; 95% is the recommendation for medium-sized fields (30-100) and can be varied (C/1).
  - Committee or the group can set others → **agrees**. Allowances are recommendations; Committees specify them in the Terms of the Competition and may adjust for field size and make-up.
- Revised in this pass.
- Site copy: Blog: four-ball match play 90%, individual match play 100% - agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit, SEO/canonical confirmation, approval.

### Net Double Bogey (`net-double-bogey`, P1)

**Definition (31 words):** The most a player with a Handicap Index can count on a hole for handicap purposes: par plus two, plus any strokes their full Course Handicap gives them on that hole.

**Example:** On a par 4 where you receive one stroke, net double bogey is 4 + 2 + 1 = 7. Take a 9 and it goes on your handicap record as a 7.

**Note (handicapping):** Rule 3.1b of the Rules of Handicapping sets it. A player without an Index yet is capped at par plus 5 (Rule 3.1a). Many groups also use net double bogey as the most anyone can take on a hole in their games.

- Canonical: /glossary#net-double-bogey · related: score-differential, handicap-stroke · content links: /faq · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Rule 3.1b; Definitions: Net Double Bogey <https://www.usga.org/handicapping/roh/Content/rules/3%201b%20After%20a%20Handicap%20Index%20Has%20Been%20Established.htm> (opened 2026-10-29); Rules of Golf, 2023 edition (R&A) — Definitions: Maximum Score <https://www.randa.org/en/rog/definitions> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Maximum hole score for handicap purposes: double bogey plus handicap strokes received → **imprecise**. Par + 2 + strokes received (minus strokes given back by a plus handicap) for a player with an established Index, using the full, unrounded-allowance-free Course Handicap. Before an Index is established the cap is par + 5 (Rule 3.1a); if Course Handicap is over 54 and 4+ strokes fall on a hole, par + 5.
- Recomputed: 4 + 2 + 1 = 7 ✓; Gross 9 capped at 7 = 7 ✓
- Revised in this pass.
- Site copy: FAQ q-pickup ('usually net double bogey (the handicap system's cap) or double par') and blog ('the standard maximum for posting purposes') agree.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Score Differential (`score-differential`, P1)

**Definition (28 words):** The value one round contributes to a Handicap Index: how far the adjusted gross score was above the Course Rating, scaled to standard difficulty by the Slope Rating.

**Explanation:** Score Differential = (adjusted gross score − Course Rating) × 113 ÷ Slope Rating, with any playing conditions adjustment applied, to one decimal.

**Example:** An adjusted 88 from tees rated 71.8 with a Slope of 131: (88 − 71.8) × 113 ÷ 131 = 13.97, recorded as 14.0.

**Note (handicapping):** Rule 5.1 of the Rules of Handicapping sets out the calculation.

- Canonical: /glossary#score-differential · related: handicap-index, course-rating, slope-rating, net-double-bogey · content links: /blog/index-vs-course-handicap · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Rule 5.1a; 5.1c <https://www.usga.org/handicapping/roh/Content/rules/5%201a%20Calculation%20of%20a%20Score%20Differential18Hole.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Definitions: Score Differential <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Formula (AGS - Course Rating) x 113 / Slope, with any PCC applied, to one decimal → **agrees**. (113 / Slope) x (AGS - Course Rating - PCC), rounded to nearest tenth, .5 up; PCC ranges -1.0 to +3.0; negative differentials round toward zero (5.1c).
  - The value one round contributes to a Handicap Index → **agrees**. Numerical value of a score posted to the scoring record, reflecting Slope and PCC.
- Recomputed: (88 - 71.8) x 113 / 131 = 16.2 x 0.86260 = 13.974 -> 14.0 ✓
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.


## #161 Scoring and shots

### Par (`par`, P2)

**Definition (40 words):** The score a scratch golfer is expected to make on a hole, allowing two putts: usually 3, 4 or 5, and mostly set by the hole's length. A course's par is the total of its holes, often 70 to 72.

**Example:** On a 168-yard par 3, three strokes is par. Two is a birdie and four is a bogey.

- Canonical: /glossary#par · related: birdie, bogey, stroke-play · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Definitions: Par; Appendix F <https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Appendix F <https://www.usga.org/handicapping/roh/Content/rules/Appendix%20F%20Establishing%20Par.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/par> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Strokes a skilled player is expected to need on a hole → **imprecise**. Par is the score a scratch player would generally be expected to make under normal conditions, allowing two strokes on the putting green; Appendix F sets length guidelines (men: par 3 up to 260 yd, par 4 240-490, par 5 450-710, par 6 670+).
  - Usually 3, 4 or 5, mostly set by length → **agrees**. Length guidelines plus difficulty adjustments; par 6 exists.
- Recomputed: 168 yards = within par-3 range (men up to 260 yd) ✓; 2 vs par 3; 4 vs par 3 = birdie; bogey ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/par> (standard score for a hole); <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (strokes an expert golfer is expected to take)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Birdie (`birdie`, P2)

**Definition (9 words):** A score one stroke under par on a hole.

**Example:** A 3 on a par 4, or a 4 on a par 5. With a handicap stroke on the hole, a gross par can be a net birdie.

- Canonical: /glossary#birdie · related: eagle, par · content links: /games/birdies · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/birdie> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29)
- Recomputed: 3 on par 4; 4 on par 5 = -1 ✓; Gross 4 on par 4 with one stroke = net 3 = net birdie ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/birdie> (one under par); <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (one under par)
- Site copy: /games/birdies glossary agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Eagle (`eagle`, P2)

**Definition (9 words):** A score two strokes under par on a hole.

**Example:** A 3 on a par 5, or a hole-in-one on a par 3. Most golfers make a lot more birdies.

- Canonical: /glossary#eagle · related: birdie, par · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/eagle> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Recomputed: 3 on par 5; 1 on par 3 = -2 ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/eagle> (two under par); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (two under par)
- Site copy: /games/birdies glossary agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Bogey (`bogey`, P2)

**Definition (9 words):** A score one stroke over par on a hole.

**Explanation:** In older British usage, bogey was the expected score for a hole, close to what par means now.

**Example:** A 5 on a par 4, or a 4 on a par 3.

- Canonical: /glossary#bogey · related: double-bogey, par · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/bogey> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29)
- Recomputed: 5 on par 4; 4 on par 3 = +1 ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/bogey> (one over par; historic standard-score sense); <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (one more than par)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Double Bogey (`double-bogey`, P2)

**Definition (9 words):** A score two strokes over par on a hole.

**Explanation:** Not the same as net double bogey, the handicap system's maximum for a hole, which adds any handicap strokes the player receives.

**Example:** A 6 on a par 4, or a 5 on a par 3.

- Canonical: /glossary#double-bogey · related: bogey, net-double-bogey, par · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Rule 3.1b <https://www.usga.org/handicapping/roh/Content/rules/3%201b%20After%20a%20Handicap%20Index%20Has%20Been%20Established.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/double%20bogey> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Net double bogey adds any handicap strokes received → **agrees**. Par + 2 + strokes received.
- Recomputed: 6 on par 4; 5 on par 3 = +2 ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/double%20bogey> (two over par); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (bogey/par scoring terms)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Gross Score (`gross-score`, P1)

**Definition (15 words):** The actual number of strokes taken, penalty strokes included, before any handicap strokes are deducted.

**Example:** Eighty-eight strokes over eighteen holes is a gross 88.

- Canonical: /glossary#gross-score · related: net-score, stroke-play · content links: /games/best-score · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/gross> (opened 2026-10-29)
- Usage corroborated by: <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (total strokes plus penalty strokes, no adjustments); <https://www.merriam-webster.com/dictionary/gross> (whole before deductions)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Net Score (`net-score`, P1)

**Definition (16 words):** A score after handicap strokes are deducted: the gross score minus the strokes the player receives.

**Example:** A gross 88 with a Course Handicap of 14 is a net 74. On a single hole, a 5 with one stroke is a net 4.

- Canonical: /glossary#net-score · related: gross-score, handicap-stroke, course-handicap · content links: /blog/index-vs-course-handicap · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Recomputed: 88 - 14 = 74 ✓; 5 - 1 = 4 ✓
- Usage corroborated by: <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (gross minus course-handicap strokes)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Stroke Play (`stroke-play`, P1)

**Definition (16 words):** A form of play where every stroke counts, and the lowest total for the round wins.

**Example:** A triple bogey on the 6th costs three strokes against par in stroke play. In match play it would only lose one hole.

**Note (rules):** Rule 3.3 of the Rules of Golf covers stroke play.

- Canonical: /glossary#stroke-play · related: match-play, gross-score, stableford · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Stroke Play; Rule 3.3 <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/stroke%20play> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Every stroke counts; lowest total wins → **agrees**. In regular stroke play the score is total strokes including penalties and the fewest total wins; Stableford, Maximum Score and Par/Bogey are other forms.
- Recomputed: Triple bogey = +3 strokes in stroke play; one hole lost in match play ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/stroke%20play> (scored by total strokes)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Drive (`drive`, P2)

**Definition (21 words):** The first shot on a par 4 or par 5, hit from the teeing area for distance, usually with a driver.

**Explanation:** Not the same as the driver, which is the club. A tee shot with an iron on a par 3 is a tee shot, but rarely called a drive.

**Example:** A 240-yard drive leaves about 160 yards into a 400-yard par 4.

- Canonical: /glossary#drive · related: longest-drive · content links: /games/longest-drive · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/drive> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Recomputed: 400 - 240 = 160 yards ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/drive> (hit a ball from the tee, especially with a driver); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (first stroke of a par 4 or par 5 from the tee)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Chip (`chip`, P2)

**Definition (24 words):** A short, low shot from just off the green that spends little time in the air and most of it rolling toward the hole.

**Explanation:** A chip rolls more than it flies; a pitch flies more than it rolls.

**Example:** From the fringe 30 feet away, a chip lands a few feet onto the green and rolls the rest of the way.

- Canonical: /glossary#chip · related: pitch, putt · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/chip%20shot> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/chip%20shot> (short usually low approach that lofts to the green and rolls); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (briefly in the air, then rolls)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Pitch (`pitch`, P2)

**Definition (30 words):** A short, high shot that carries most of the way to its target and stops quickly, often used when rough, sand or water is between the ball and the hole.

**Example:** Forty yards out with a bunker in front of the flag, a pitch flies the sand and stops near the hole.

- Canonical: /glossary#pitch · related: chip · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/pitch> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/pitch> (high arc with backspin, rolls very little); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (highly lofted, short, high trajectory)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Putt (`putt`, P2)

**Definition (22 words):** A stroke that rolls the ball along the ground toward the hole, usually on the putting green and usually with a putter.

**Example:** On in two on a par 4, two putts make par. Three putts make bogey.

- Canonical: /glossary#putt · related: chip · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/putt> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Recomputed: 2 to green + 2 putts = 4 = par on par 4 ✓; 2 + 3 putts = 5 = bogey ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/putt> (stroke on the putting green to roll the ball); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (putt on the putting surface)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Slice (`slice`, P2)

**Definition (25 words):** A shot that curves sharply in the air, usually by accident: left to right for a right-handed golfer, right to left for a left-handed one.

**Explanation:** A gentle, controlled curve the same way is a fade. A slice is the same curve, bigger and unplanned.

**Example:** A right-hander aims down the middle and the ball finishes in the trees on the right.

- Canonical: /glossary#slice · related: drive · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/slice> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/slice> (deviates in the direction of the dominant hand); <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (curves to your strong side); <https://practical-golf.com/golf-terms> (left to right for a right-hander)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.


## #162 Course and rules, equipment, slang

### Teeing Area (`teeing-area`, P2)

**Definition (19 words):** The area a hole is played from: between the two tee markers and up to two club-lengths behind them.

**Explanation:** Most golfers call it the tee box. The Rules called it the teeing ground until 2019.

**Example:** Teeing up six inches ahead of the markers is outside the teeing area. In stroke play that's a two-stroke penalty and the shot is replayed.

**Note (rules):** The Rules of Golf define the teeing area. Rule 6.1b sets the penalty for playing from outside it, and Rule 6.2 covers playing from it.

- Canonical: /glossary#teeing-area · related: drive, fairway · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Teeing Area <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Rules of Golf, 2023 edition (R&A) — Rule 6.1b(2); Rules 6.1b, 6.2b <https://www.randa.org/en/rog/the-rules-of-golf/rule-6> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/teeing%20ground> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Between the two tee markers and up to two club-lengths behind them → **agrees**. A rectangle two club-lengths deep; front edge between the forward-most points of the tee-markers, sides back from their outside points.
  - Called the teeing ground until 2019 → **not covered by the source**. Not checked against an opened R&A/USGA page; consistent with the 2019 rename and Merriam-Webster's 'teeing ground' entry.
  - Outside the teeing area in stroke play: two-stroke penalty and the shot is replayed → **agrees**. General penalty (two strokes); that stroke doesn't count and the player must play from inside the teeing area. In match play there is no penalty but the opponent may cancel the stroke.
  - ruleNote cites Rule 6.2 for playing from it → **imprecise**. The penalty in the example is Rule 6.1b; Rule 6.2b covers teeing-area rules (ball in the teeing area if any part touches or is above it).
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/teeing%20ground> (teeing ground = tee)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Fairway (`fairway`, P2)

**Definition (21 words):** The closely mown strip between the teeing area and the green, where the ball sits up best for the next shot.

**Explanation:** The Rules don't treat it separately: the fairway and the rough are both part of the general area.

**Example:** A drive that finishes in the fairway on a 400-yard par 4 usually leaves a clean lie for the approach.

- Canonical: /glossary#fairway · related: rough, teeing-area, longest-drive · content links: /games/longest-drive · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: General Area <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/fairway> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Fairway and rough are both part of the general area → **agrees**. General area is all of the course except the teeing area being played, penalty areas, bunkers and the putting green. Note: some Model Local Rules refer to areas 'cut to fairway height or less', but the Rules define no 'fairway'.
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/fairway> (closely mowed part between tee and green); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (closely mown area between tee box and green)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Rough (`rough`, P2)

**Definition (20 words):** The longer grass beside the fairway, where the ball can sit down and the next shot is harder to control.

**Explanation:** Like the fairway, it's part of the general area under the Rules, so no special rules apply there.

**Example:** From thick rough 150 yards out, grass gets between the club and the ball, so it comes out with less spin and is harder to stop. Many players aim for the middle of the green or lay up.

- Canonical: /glossary#rough · related: fairway · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: General Area <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/rough> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Longer grass beside the fairway; part of the general area → **agrees**. 
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/rough> (ground bordering a fairway); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (higher, thicker grass outside fairways)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Bunker (`bunker`, P2)

**Definition (31 words):** A specially prepared area of sand, often a hollow where turf or soil was removed. Its lip, walls and faces, and any grass growing inside its edge, aren't part of it.

**Example:** In a greenside bunker you can't rest your club on the sand right behind the ball before you play.

**Note (rules):** The Rules of Golf define a bunker, and Rule 12 covers playing from one, including when the club may touch the sand.

- Canonical: /glossary#bunker · related: sandy, penalty-area · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Bunker <https://www.randa.org/en/rog/definitions> (opened 2026-10-29); Rules of Golf, 2023 edition (R&A) — Rule 12.2b(1) <https://www.randa.org/en/rog/the-rules-of-golf/rule-12> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/sand%20trap> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Specially prepared area of sand, often a hollow where turf or soil was removed → **agrees**. 
  - Grass-covered edges and walls aren't part of it → **imprecise**. Not part of a bunker: any lip, wall or face at the edge made of soil, grass, stacked turf or artificial material; soil or growing things inside the edge; spilled sand; natural sand areas outside the edge.
  - Can't rest the club on the sand right behind the ball → **agrees**. Must not touch sand with a club right in front of or right behind the ball, in a practice swing or in the backswing.
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/sand%20trap> (sand trap); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (bunker = sand-filled depression)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Penalty Area (`penalty-area`, P2)

**Definition (31 words):** Water, or another area the course marks with red or yellow stakes or lines, where a player can play the ball as it lies or take relief for one penalty stroke.

**Explanation:** Before 2019 the Rules called these water hazards and lateral water hazards. Red marks allow more relief options than yellow.

**Example:** Your tee shot finds the pond on the 9th. You take one of the relief options for one penalty stroke, so your next shot is your third.

**Note (rules):** The Rules of Golf define a penalty area, and Rule 17 sets out the relief options.

- Canonical: /glossary#penalty-area · related: bunker · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Definitions: Penalty Area; Rule 17.1b, 17.1d <https://www.randa.org/en/rog/the-rules-of-golf/rule-17> (opened 2026-10-29); Rules of Golf, 2023 edition (R&A) — Definitions: Penalty Area <https://www.randa.org/en/rog/definitions> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Water or another area marked red or yellow; play as it lies or relief for one stroke → **agrees**. Any body of water on the course (marked or not) or area the Committee defines; play as it lies without penalty or take relief for one penalty stroke.
  - Red allows more relief options than yellow → **agrees**. Red adds the lateral relief option; unmarked penalty areas are treated as red.
  - Water hazards and lateral water hazards before 2019 → **not covered by the source**. Not checked against an opened page; standard history.
- Recomputed: Tee shot 1 + 1 penalty stroke = next stroke is the 3rd ✓
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Driver (`driver`, P2)

**Definition (29 words):** The longest club in the bag, with the biggest head and the least loft apart from the putter, used for tee shots on most par 4s and par 5s.

**Explanation:** The driver is the club; the drive is the shot.

**Example:** Most drivers have between 8 and 12 degrees of loft. A 7-iron has roughly three times as much.

- Canonical: /glossary#driver · related: drive, longest-drive · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/driver> (opened 2026-10-29); Golfshake <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/driver> (golf wood used in driving); <https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html> (club designed to hit the ball furthest); <https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them> ('big dog' = driver)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Putter (`putter`, P2)

**Definition (18 words):** The club used to roll the ball on the green, with a flat face and very little loft.

**Example:** From the fringe a few feet off the green, many players putt rather than chip: a putter is the easiest club to control.

- Canonical: /glossary#putter · related: putt · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/putter> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/putter> (club used in putting); <https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them> (flatstick; about 3-4 degrees of loft)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Mulligan (`mulligan`, P2)

**Definition (21 words):** Replaying a bad shot without counting it, by agreement within a group. Informal, and not allowed under the Rules of Golf.

**Example:** Your opening drive goes out of bounds, your group allows one mulligan a side, and you hit again as if the first never happened.

**Note (handicapping):** A mulligan ignores the Rules of Golf. Under Rule 2.1b of the Rules of Handicapping, a round where a player deliberately ignores a Rule generally isn't acceptable for posting.

- Canonical: /glossary#mulligan · related: breakfast-ball · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Rule 2.1b(ii); 2.1b/3 <https://www.usga.org/handicapping/roh/Content/rules/2%201b%20Played%20by%20the%20Rules%20of%20Golf.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/mulligan> (opened 2026-10-29); Golf.com <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - ruleNote: a round with mulligans shouldn't be posted for handicap as if it were played under the Rules → **imprecise**. A score must be played by the Rules of Golf to be acceptable; in general play, a score is generally not acceptable if a player deliberately ignores a Rule, though the Committee may make it acceptable by recording the actual hole score, net double bogey or net par (2.1b/3). The ROH never mentions mulligans by name (searched all 176 online pages). ruleNote kind should be 'handicapping', and the source ref 'Rule 2.1' should be 'Rule 2.1b'.
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/mulligan> (free shot in informal play); <https://golf.com/instruction/golf-terms-guide-beginner-golfers/> (recreational only; against the Rules); <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (second attempt, often on the first tee)
- Revised in this pass.
- Site copy: /games/longest-drive glossary 'Reloads and mulligans are out' - agrees.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Gimme (`gimme`, P2)

**Definition (15 words):** A short putt the other players agree to count as holed without it being played.

**Example:** Your ball stops eighteen inches from the hole and your opponent says to pick it up: you count one more stroke and move on.

**Note (rules):** In match play an opponent can concede your next stroke (Rule 3.2b). In regular stroke play you must hole out on every hole (Rule 3.3c). For handicap posting, a ball left within five feet on the green counts as one more stroke (Rules of Handicapping 3.3).

- Canonical: /glossary#gimme · related: putt, match-play · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Golf, 2023 edition (R&A) — Rule 3.2b(1); Rule 3.3c <https://www.randa.org/en/rog/the-rules-of-golf/rule-3> (opened 2026-10-29); Rules of Handicapping, 2024 edition (USGA) — Rule 3.3 <https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm> (opened 2026-10-29); Merriam-Webster <https://www.merriam-webster.com/dictionary/gimme> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/the-game/what-is-a-gimme-244054> (opened 2026-10-29)
- Rules/WHS claims checked (agent, 2026-10-29):
  - Match play: opponent may concede a stroke (Rule 3.2b) → **agrees**. May concede the next stroke at any time before it is made; the conceded stroke counts in the score.
  - In stroke play every ball has to be holed out (Rule 3.3c) → **imprecise**. Regular stroke play requires holing out at every hole, or disqualification if not corrected; Stableford, Maximum Score and Par/Bogey are exceptions (Rule 21).
  - (Not in draft) Handicap posting of an unholed putt → **not covered by the source**. Most likely score: ball on the green within 5 ft, add one stroke; this is the official answer to how a gimme is posted. Suggested as an addition, not required.
- Recomputed: 18 in. putt conceded = +1 stroke ✓
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/gimme> (short putt conceded in casual or match play); <https://www.golfmonthly.com/features/the-game/what-is-a-gimme-244054> (conceded short putt still counts as a stroke; only correct in match play); <https://practical-golf.com/golf-terms> (putt close enough to be considered made)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Breakfast Ball (`breakfast-ball`, P3)

**Definition (21 words):** A mulligan on the first tee only, by group agreement, for the player who arrived with no time to warm up.

**Example:** Your first drive of the day hits a tree twenty yards out. Your group allows a breakfast ball, so you hit another.

**Note (handicapping):** It's a mulligan by another name, so the same posting rule applies: a round that deliberately ignores a Rule generally isn't acceptable for handicap (Rules of Handicapping 2.1b).

- Canonical: /glossary#breakfast-ball · related: mulligan · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Rules of Handicapping, 2024 edition (USGA) — Rule 2.1b(ii) <https://www.usga.org/handicapping/roh/Content/rules/2%201b%20Played%20by%20the%20Rules%20of%20Golf.htm> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/what-is-a-breakfast-ball-in-golf> (opened 2026-10-29); Golf News Net <https://thegolfnewsnet.com/ryan_ballengee/2026/03/13/what-is-a-breakfast-ball-in-golf-what-does-that-mean-for-a-golfer-123650/> (opened 2026-10-29)
- Usage corroborated by: <https://www.golfmonthly.com/features/what-is-a-breakfast-ball-in-golf> (mulligan on the 1st tee; not part of the Rules); <https://thegolfnewsnet.com/ryan_ballengee/2026/03/13/what-is-a-breakfast-ball-in-golf-what-does-that-mean-for-a-golfer-123650/> (do-over on the first tee)
- Revised in this pass.
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Snowman (`snowman`, P3)

**Definition (14 words):** A score of 8 on a hole, named for the shape of the number.

**Example:** An 8 on a par 4 is a quadruple bogey; on a par 5 it's a triple. Either way, it's a snowman.

- Canonical: /glossary#snowman · related: double-bogey, par · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them> (opened 2026-10-29)
- Recomputed: 8 - 4 = +4 quadruple bogey ✓; 8 - 5 = +3 triple bogey ✓
- Usage corroborated by: <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (score of eight on one hole); <https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them> (8 resembles a snowman); <https://practical-golf.com/golf-terms> (an 8 on a hole)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### 19th Hole (`19th-hole`, P3)

**Definition (11 words):** The clubhouse bar, or wherever the group goes after the round.

**Example:** Scores get compared, the settle-up gets done and the 14th gets replayed at the 19th hole.

- Canonical: /glossary#19th-hole · related: settle-up · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Merriam-Webster <https://www.merriam-webster.com/dictionary/nineteenth%20hole> (opened 2026-10-29); Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29)
- Usage corroborated by: <https://www.merriam-webster.com/dictionary/nineteenth%20hole> (bar at a golf course after a round); <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (the clubhouse bar)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.

### Worm Burner (`worm-burner`, P3)

**Definition (21 words):** A shot that never gets off the ground and skims along the grass, usually from catching the top of the ball.

**Example:** A worm burner off the tee can still run 150 yards on a firm fairway. It just won't look good doing it.

- Canonical: /glossary#worm-burner · related: drive · content links: — · CTA intent: —
- Capabilities: none (golf education only)
- Sources in the record: Golf Monthly <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (opened 2026-10-29); Golf.com <https://practical-golf.com/golf-terms> (opened 2026-10-29)
- Usage corroborated by: <https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang> (never gets off the ground, or a couple of feet); <https://practical-golf.com/golf-terms> (barely gets off the ground and rolls)
- Status `in-review`; owner stages outstanding: rules fact-check, product audit (no GoLo claim to audit), SEO/canonical confirmation, approval.
