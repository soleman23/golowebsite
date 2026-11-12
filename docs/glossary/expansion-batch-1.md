# Glossary expansion batch 1: side games (#168)

Prepared November 11, 2026 for the owner's review. This is the first M8 batch. The records are in `lib/content/glossary/terms/side-games-batch-1.ts` at `in-review`, so nothing here is public: an `in-review` record reaches no page, search index, sitemap, `llms.txt` or structured data (`selectors.ts`; checked again by `npm run test:glossary`).

## Why it started before the 28-day checkpoint

#168's gate said not to start until #167's launch + 28 days section (due 2026-11-26) is filed. On 2026-11-11 the owner chose to start batch 1 now. The reasoning:

- The batch order in #168 puts side games first, whatever the data says. The 28-day read is for ordering the batches after this one.
- The 7-day read (`/glossary`: 0 clicks, 71 impressions, position 59.6) and the GA4 failed-search splits, which only start on 2026-11-05, are too thin to change which batch goes first.
- `in-review` records can merge without reaching the site.

The 28-day, 56-day and 90-day reads still set the order of batch 2 onward.

## Scope

The inventory lists 16 side-games expansion terms. #168 asks for batches of 10 to 15. This batch has **11**:

`automatic-press`, `point-value`, `buy-in`, `validation`, `net-skins`, `debt-netting`, `birdie-bounty`, `eagle-bounty`, `hammer`, `lone-wolf`, `rabbit`.

**Held back (5), kept for batch 2:**

- **Barkie, Poley, Snake, Arnie.** The inventory tags all four `junk`. On 2026-10-30 the owner cut "junk" as a content category: greenies, sandies and birdie or eagle bounties are Skins options in GoLo, and the rest aren't scored. These four would be golf education with no GoLo note, linked to the published Junk record.
- **Double or Nothing.** No established golf meaning could be sourced. Searches turned up only the general phrase, and a press or a hammer described as "essentially" double or nothing.

**Owner decision (2026-11-11): keep all five.** The owner's words, given in another session and relayed here, were "Keep these". They aren't added to this PR, because that would make 16 terms, over #168's cap of 15 per batch. They go into batch 2, so batch 2 starts with side games. #168's order still applies after them.

- The four junk items are defined as golf, with no GoLo note. The registry's `junk-board` and `skins-greenie-sandie` limits say GoLo doesn't score them.
- Double or Nothing still has no golf source that defines it as a game of its own. Batch 2 either gives it a general definition (the plain meaning, with the golf uses as examples: a press late in a nine, a hammer) or sources it to community usage, labelled as such (`editorial-review.md` § Source hierarchy, level 5).

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-11 | — |
| 2 | Rules fact-check | Agent prepared: sources opened 2026-11-11, examples recomputed below. No record cites the Rules of Golf or the Rules of Handicapping; every source is editorial or first-party | **Owner** signs |
| 3 | GoLo product audit | Agent prepared against the registry. The owner answered the three open questions from the app's code on 2026-11-11 ([answers](#owners-answers-november-11-2026)) | **Owner** signs |
| 4 | SEO/canonical | Agent: canonicals per `canonical-map.md`; `lint:content` passes; related ids and paths resolve | **Owner** confirms |
| 5 | Approval | — | **Owner** |

None of the records has a review log yet. Under `editorial-review.md` § Roles, expansion records go back to the owner's roles unless the owner delegates again, as they did for the MVP on 2026-10-29. Once the owner approves, the records move to `approved` with a dated log, and a release PR moves them to `published`.

## Product audit questions

The registry is the evidence for every GoLo note below. It was last checked against the app's code on 2026-10-29 (GoLo 1.2.1); some entries were rechecked on 2026-11-09 (GoLo 1.2.2). This repo doesn't read the app, so these points need the owner, or an app check the owner authorises:

1. **Net Skins.** Can every Skins game in GoLo be played net? The skins guide says so ("GoLo allocates strokes by stroke index, hole by hole"). The note also says a scramble's teams play off their team handicap (`scramble`, `handicap-strokes`).
2. **Lone Wolf.** The note says GoLo's Wolf scores Lone Wolf holes. The Wolf guide says so ("GoLo handles every partner pick, Lone Wolf, and settlement"), but no registry line names it. Blind Wolf isn't claimed.
3. **Eagle Bounty.** The note says only that it's the Skins game's Eagle Skin setting. The birdies guide says "Eagle Skin for the double, both at your skin price". The note doesn't repeat that, because the registry doesn't say how Eagle Skin is valued.

### Owner's answers (November 11, 2026)

The owner answered all three in chat, citing the app's scoring code (`src/engines/skins.js`, `src/engines/wolf.js`) and the live guides. This session didn't open the app's code; the answers are recorded as the owner's.

1. **Net Skins: no, not every Skins game.** Setting Skins to Net applies handicap strokes to the standard skins, including the low-score comparison that decides ties and carryovers. The Birdie Skin, Eagle Skin, Greenie and Sandie options still use gross scores. **Changed:** the note now says that and drops the scramble clause; `capabilityIds` swaps `scramble` for `skins-greenie-sandie`. The registry already says the bonus skins are gross (`game-library`: "gross birdies only"; `skins-greenie-sandie`: "GoLo checks the par from the gross score"), so the registry is unchanged.
2. **Lone Wolf: keep the note.** GoLo compares the solo wolf's score with the best score of the other three and records a win, loss or push.
3. **Eagle Bounty: keep the note, without "for the double".** A gross eagle or better earns one Eagle Skin at the configured base value. If Birdie Skin is also on, the same score earns a birdie skin too.

**Found along the way, outside this PR:** the birdies guide (`/games/birdies`, `lib/content/gameDetail.ts`) says "Birdie Skin, plus Eagle Skin for the double". Read as Eagle Skin on its own doubling the amount, that disagrees with the code. It's double only when both settings are on.

## Differences from `inventory.md`

- **Birdie Bounty and Eagle Bounty** carry no `junk` tag. The inventory tagged them `junk`; the owner's 2026-10-30 decision puts them under Skins. Tags only affect search ranking.
- **Hammer** has the `match-play` tag (a hole-by-hole match). **Net Skins** also lists `scramble` in `capabilityIds`, because its note mentions team handicaps.
- **Lone Wolf** relates to `point-value` as well as `wolf` and `four-ball`.

## The terms

Word counts are for the short definition. "Recomputed" lines redo every number in the example from the inputs shown.

### Automatic Press (`automatic-press`, P0)

**Definition (31 words):** A press that starts on its own as soon as a side falls a set number of holes behind, usually two, rather than waiting for the trailing side to call it.

**Example:** Your group plays a $5 front nine with automatic presses at two down. You lose the 1st and 2nd, so a $5 press starts on the 3rd tee for holes 3 to 9, and the front nine carries on underneath it.

**Note (house-rules):** Groups set the trigger (two down is the usual one; some use one down), whether a press can be turned down, and whether a press that falls two down starts one of its own.

- Canonical: /glossary#automatic-press · related: press, re-press, nassau · content links: /blog/pressing · CTA intent: —
- Capabilities: `auto-press` (planned, app check 2026-10-29). No GoLo note, as the inventory requires. `/blog/pressing` already says GoLo doesn't press automatically.
- Sources: The Left Rough, "Golf Press" <https://theleftrough.com/golf-press/> (opened 2026-11-11): an auto press happens "when a player or team is down a certain amount"; two down is typical, one down "can get expensive quickly". CaddieHQ <https://www.caddiehq.com/resources/what-does-pressing-mean-in-golf> (opened 2026-11-11): "a new bet automatically starts anytime a player goes 2-down".
- Recomputed: lose holes 1 and 2 → 2 down after 2 → the press covers holes 3–9 (7 holes) ✓
- Alias: "auto press" (inventory § Alias decisions). Before this record is published, a search for "auto press" finds nothing, or finds Press by its description.

### Point Value (`point-value`, P2)

**Definition (33 words):** What one point is worth in a points game such as Wolf or Bingo Bango Bongo. It's agreed before the round, and at the end the gap in points is multiplied by it.

**Example:** Bingo Bango Bongo at $2 a point. You finish with 22 points and Dave with 16: six points apart, so Dave owes you $12.

**Note (house-rules):** Groups settle points in different ways: the gap between each pair of players, or everyone in for the same amount with the most points taking it.

- Canonical: /glossary#point-value · related: wolf, bingo-bango-bongo, buy-in · content links: /games/wolf, /games/bingo-bango-bongo
- Capabilities: none. Inventory S10 (replaces "Side Pot"). Agrees with the guides' glossary lines: "What each point is worth at settlement" (Wolf), "What each point pays at settlement" (BBB).
- Sources: CaddieHQ, "How to play Bingo Bango Bongo" <https://www.caddiehq.com/resources/how-to-play-bingo-bango-bongo-golf> (opened 2026-11-11): settle on "the gap in total points" × the agreed value; the pot method also described.
- Recomputed: 22 − 16 = 6; 6 × $2 = $12 ✓

### Buy-in (`buy-in`, P2)

**Definition (32 words):** The amount each player puts in before the round to enter a game, usually the same for everyone. The total then goes to the winner or is split among the top finishers.

**Example:** Twelve players each put in $10 for skins, $120 in all. Six skins are won outright, so each one is worth $20.

**Note (convention):** Not every game has one. In many groups each hole or point has a set value instead, and players settle the differences after the round.

- Canonical: /glossary#buy-in · related: point-value, skins, settle-up · content links: /games/skins
- Capabilities: none.
- Sources: GolfLink <https://golflink.com/lifestyle/golf-skins-game-everything-you-need-to-know> (opened 2026-11-11): "Set the entry amount for each player and collect before the round begins." National Club Golfer <https://www.nationalclubgolfer.com/club/glossary/skins-golf-format-explained/> (opened 2026-11-11): the per-hole alternative, each player putting forward £1 a hole.
- Recomputed: 12 × $10 = $120; $120 ÷ 6 = $20 ✓

### Validation (`validation`, P2)

**Definition (42 words):** A skins house rule that adds a condition before a skin counts. Common versions: the winner must tie or beat the low score on the next hole, or a carried skin needs a birdie, or at least a par, to win it.

**Example:** Your group validates on the next hole. You win the 6th outright with a 4, then make 5 on the 7th, where the low score is 4. The 6th's skin isn't yours.

**Note (house-rules):** Groups differ on what validates, what happens to a skin that isn't validated (usually it goes back into play), and whether the 18th needs validating at all.

- Canonical: /glossary#validation · related: skins, carryover, push · content links: /games/skins
- Capabilities: `skins-validation` (not offered, app check 2026-10-29). No GoLo note: the app has no validation rules (#176).
- Uses the broader wording from inventory conflict 2 (birdie-to-win or a par minimum), not the skins guide glossary's narrower "birdie or better". That guide line is still on `main`.
- Sources: LiveTourney, "Skins game rules" <https://www.livetourney.com/blog/skins-game-rules-golf> (opened 2026-11-11): validate "by at least tying the low score on the next hole", or a skin "goes back into the pot"; a separate rule where "a par cannot win a skin". "What does it mean to validate a skin?" <https://intercom.help/tournament-management/en/articles/10778684-what-does-it-mean-to-validate-a-skin> (opened 2026-11-11): win the hole outright, then meet the requirement on the next hole (par, birdie or eagle). Neither source says whose help centre the second one is; its title is used.
- Recomputed: 6th won outright; 7th, your 5 is above the low score of 4 → not validated ✓

### Net Skins (`net-skins`, P1)

**Definition (28 words):** Skins played off handicaps: each player's strokes come off on the holes the stroke index gives them, and the lowest net score on a hole wins the skin.

**Explanation:** Gross skins compare the scores as played. Net skins let a higher handicap win a hole where a stroke turns a par into a net birdie.

**Example:** You play off 12 and Sam off 2. The 7th is stroke index 4, so you get a stroke there and Sam doesn't. You make 5, a net 4; Sam makes 4. Tied on net, so the skin carries.

**Note (house-rules):** Groups decide whether skins are gross or net before the round, and whether everyone takes full strokes or a percentage of them.

**GoLo note:** GoLo's Skins game can be set to net: strokes go on by the card's stroke index and decide each hole's low score, so ties and carries are net too. Its Birdie Skin, Eagle Skin, Greenie and Sandie options still use gross scores.

- Canonical: /glossary#net-skins · related: skins, net-score, handicap-stroke, stroke-index · content links: /games/skins · CTA intent: handicaps
- Capabilities: `game-library`, `handicap-strokes`, `skins-greenie-sandie` (all live, app check 2026-10-29). The note follows the owner's answer to [question 1](#owners-answers-november-11-2026).
- Sources: LiveTourney <https://www.livetourney.com/blog/skins-game-rules-golf> (opened 2026-11-11): players "apply their course handicap to get strokes on the toughest-rated holes", and the net score decides the outright winner. GolfLink <https://golflink.com/lifestyle/golf-skins-game-everything-you-need-to-know> (opened 2026-11-11): decide "whether you'll play gross or net skins".
- Recomputed: a 12 gets strokes on stroke index 1–12, so it gets one on SI 4 ✓; a 2 gets strokes on SI 1–2 only, so none on SI 4 ✓; 5 − 1 = net 4 = Sam's 4 → tie, skin carries ✓
- Agrees with the skins guide glossary: "Skins played off handicaps, with strokes allocated hole by hole."

### Debt Netting (`debt-netting`, P1)

**Definition (34 words):** Cancelling what players owe each other against what they're owed, across every game in the round, so each player ends up with one number up or down instead of an amount for each game.

**Example:** You owe Tom $15 for the Nassau and $5 in Wolf, and he owes you $10 in skins. Netted, you pay Tom $10 once instead of settling three amounts.

**GoLo note:** GoLo nets every game in a round into one number per player, then lists who owes whom. Each round settles on its own.

- Canonical: /glossary#debt-netting · related: settle-up, carryover · content links: /blog/settle-up-screen · CTA intent: settle-up
- Capabilities: `settle-up` (live, app check 2026-10-29). The note stays inside its limits: no "fewest", and nothing about holding or moving money.
- Kept apart from Settle-up (MVP): Settle-up is the whole squaring-up; Debt Netting is the step that turns many amounts into one per player.
- Sources: GoLo, "How GoLo settles up" <https://www.golo.golf/blog/settle-up-screen> (opened 2026-11-11, served 200): "each player's results across every game are added into one net number". First-party only; no rule to check.
- Recomputed: −$15 − $5 + $10 = −$10 → you pay Tom $10 ✓

### Birdie Bounty (`birdie-bounty`, P0)

**Definition (27 words):** A side game with a set price on every birdie: whoever makes one is owed that amount by each of the other players. Eagles usually count double.

**Example:** At $5 a birdie in a foursome, your birdie on the 12th is worth $15: $5 from each of the other three players.

**Note (house-rules):** Groups decide whether net birdies count or only gross ones, what an eagle is worth, and whether there's a cap.

**GoLo note:** In GoLo a birdie bounty is the Skins game's Birdie Skin setting: gross birdies only, with no cap.

- Canonical: /games/birdies (existing; the guide owns the intent) · related: birdie, eagle-bounty, skins · CTA intent: games
- Capabilities: `game-library` (live, app check 2026-10-29), limit "Birdie and eagle bounties are Skins settings (Birdie Skin, Eagle Skin), gross birdies only, no cap."
- Sources: Golf Monthly, "Golf bits, what are they?" <https://www.golfmonthly.com/features/the-game/golf-bits-95132-95132> (opened 2026-11-11): birdie and eagle bits; "An eagle typically earns a double bit"; "you have to made a gross birdie for a birdie bit, not a net birdie" (as written there). GoLo birdies guide <https://www.golo.golf/games/birdies> (opened 2026-11-11). A further corroborating page was left out because its URL contains "bet".
- Recomputed: 3 other players × $5 = $15 ✓ (matches the guide: "a $5 birdie is worth $15 in a foursome")
- Alias: "birdies game" (inventory).

### Eagle Bounty (`eagle-bounty`, P2)

**Definition (31 words):** A set amount owed to a player who makes an eagle, two under par on a hole, by each of the other players. Most groups make it double the birdie bounty.

**Example:** With birdies at $5 and eagles double, your eagle on the par-5 13th is worth $10 from each of the other three: $30.

**Note (house-rules):** Some groups count an eagle as two birdies, some give it an amount of its own, and some don't count eagles separately at all.

**GoLo note:** In GoLo an eagle bounty is the Skins game's Eagle Skin setting.

- Canonical: /glossary#eagle-bounty · related: birdie-bounty, eagle, skins · content links: /games/birdies · CTA intent: games
- Capabilities: `game-library` (live, app check 2026-10-29). See [question 3](#product-audit-questions).
- Sources: Golf Monthly, "Golf bits" (as above, opened 2026-11-11): "An eagle typically earns a double bit."
- Recomputed: $5 × 2 = $10; 3 × $10 = $30 ✓

### Hammer (`hammer`, P2)

**Definition (35 words):** A side game in which either side can double a hole's value partway through it. The other side either accepts and plays on at double, or concedes the hole at its value before the hammer.

**Explanation:** Usually played two against two, each side counting its better score, though it works in any match.

**Example:** The 5th is worth $2. Your opponents drive into the trees, so you hammer: the hole is now worth $4. They can concede and owe $2, or accept, play on, and hammer back to make it $8.

**Note (house-rules):** Versions differ on who holds the hammer next, how many hammers a hole allows, and whether a hammer can be refused at all. Settle it before the first tee.

- Canonical: /glossary#hammer · related: press, match-play, four-ball
- Capabilities: none.
- Sources: CaddieHQ, "What is a hammer in golf?" <https://www.caddiehq.com/resources/what-is-a-hammer-in-golf> (opened 2026-11-11): usually 2-on-2 best ball; the hammered team accepts, or forfeits the hole at the value before the double; hammering back; a cap of three or four a hole. Australian Golf Digest <https://australiangolfdigest.com.au/how-to-play-hammer-golf-game-explained> (opened 2026-11-11): either player can hammer; a hammer back doubles again; in that version accepting is automatic unless the group makes it optional. The Golf Digest original returned 403.
- Recomputed: $2 × 2 = $4; conceding costs the pre-hammer $2; hammer back $4 × 2 = $8 ✓
- TGL's televised Hammer adds a point rather than doubling. It isn't mentioned; the record defines the casual game.

### Lone Wolf (`lone-wolf`, P2)

**Definition (30 words):** In Wolf, the wolf's choice to play a hole alone against the other three instead of picking a partner. It's worth more points than a hole won with a partner.

**Explanation:** A Lone Wolf is declared after seeing the tee shots. Going alone before anyone tees off is a Blind Wolf, usually worth double.

**Example:** On a common points sheet, a Lone Wolf who wins the hole takes 4 points. One who loses it gives 1 point to each of the other three.

**Note (house-rules):** Lone Wolf and Blind Wolf values vary between groups. Agree them with the rest of the points sheet before the round.

**GoLo note:** GoLo's Wolf game scores Lone Wolf holes. It takes exactly four players, and the wolf rotates in player order.

- Canonical: /glossary#lone-wolf · related: wolf, four-ball, point-value · content links: /games/wolf · CTA intent: games
- Capabilities: `game-library` (live, app check 2026-10-29), limit "Wolf takes exactly four players, and the wolf rotates in player order". See [question 2](#product-audit-questions).
- Sources: National Club Golfer, "Wolf golf game rules" <https://www.nationalclubgolfer.com/club/wolf-golf-game-rules> (opened 2026-11-11): Lone Wolf after the three tee shots, 4 points for a win, 1 point to each opponent for a loss; Blind Wolf "before anyone tees off", 8 points.
- Agrees with the Wolf guide's sheet (Lone Wolf wins 4; loses, one point each to all three; partner win 2 each) and its glossary line ("Blind Wolf … usually for double the Lone Wolf value").
- Recomputed: 4 (lone win) > 2 (partner win) ✓; 8 = 2 × 4 ✓

### Rabbit (`rabbit`, P3)

**Definition (34 words):** A side game for three or four players in which the first player to win a hole outright catches the rabbit. Whoever holds it walking off the 9th and 18th greens wins that nine.

**Explanation:** In one version, the next outright winner only sets the rabbit free, and it has to be caught again. In another, the next outright winner takes it straight away.

**Example:** Playing for $5 a nine, you win the 3rd outright and catch the rabbit. Dave wins the 6th outright and sets it free, then you win the 8th outright and catch it again. Holding it after the 9th, you take $5 from each of the others.

**Note (house-rules):** If nobody holds the rabbit after the 9th, most versions play on, and whoever holds it after the 18th takes both nines.

- Canonical: /glossary#rabbit · related: skins
- Capabilities: none. Inventory S6 (replaces "Partner Bet").
- Sources: Golf Monthly, "What is the Rabbit golf game?" <https://www.golfmonthly.com/features/the-game/what-is-the-rabbit-golf-game-67302> (opened 2026-11-11): three or four players; caught by the first outright hole winner; the set-free and take-it versions; if it's free after the 9th, everything goes to whoever holds it at the end. Australian Golf Digest <https://www.australiangolfdigest.com.au/how-to-play-rabbit-golf-games-explained> (opened 2026-11-11): the same, plus "legs".
- Recomputed: in the set-free version, the 6th frees it and the 8th recaptures it; held after the 9th → front nine won ✓
