/**
 * Blog content. Post bodies are a typed block union rather than markup, so
 * ProseBlocks can render them and adding a post is a data edit — never a new
 * page file. The index, the topic counts, the JSON-LD and the sitemap are all
 * generated from `posts`, so publishing is a one-line change.
 *
 * Publication is still controlled per record. A false record remains visible
 * as an unlinked coming-soon card while its direct route, metadata, related
 * rail, and sitemap entry stay unavailable.
 */

/**
 * Post bodies. Two additions to the BUILD-SPEC §3 union, both optional so
 * nothing that already type-checks stops:
 *
 * - `atAGlance.title` — the grid carries a heading ("SETTLING UP AT A GLANCE").
 * - `steps[].id` / `.tag` — numbered rules need stable anchors for deep links
 *   (/blog/who-pays-first#rule-5) and rule one wears a "BROKEN EVERY SATURDAY"
 *   flag in the design.
 */
export type Block =
  | { kind: "p"; html: string }
  | { kind: "h2"; text: string; id: string }
  | {
      kind: "atAGlance";
      title?: string;
      items: { label: string; value: string }[];
    }
  | { kind: "callout"; title: string; html: string }
  | { kind: "quote"; text: string; cite?: string }
  | {
      kind: "steps";
      items: { id?: string; tag?: string; title: string; body: string }[];
    }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "keyStat"; value: string; label: string }
  | { kind: "image"; src: string; alt: string; caption?: string; position?: string }
  | {
      kind: "cardGrid";
      title?: string;
      items: { title: string; body: string; eyebrow?: string }[];
    }
  | { kind: "summary"; title: string; items: string[] };

export const blogCategoryIds = [
  "rules",
  "etiquette",
  "handicaps",
  "trips",
  "building",
  "gear",
  "product",
] as const;

export type BlogCategoryId = (typeof blogCategoryIds)[number];

export type Post = {
  slug: string;
  category: BlogCategoryId;
  title: string;
  /** The index card's summary. */
  excerpt: string;
  /** The standfirst under the H1, and the page's meta description. */
  dek?: string;
  /** Short last breadcrumb — the full title is too long for the trail. */
  crumb?: string;
  /** Byline. Everything is team-written until somebody signs one. */
  author?: string;
  /** ISO date — drives <time>, JSON-LD publishedTime and the sitemap. */
  date: string;
  readMins: number;
  /**
   * Undefined until the photo is actually in public/images/blog/. The card
   * renders a flat panel in its place rather than a broken <img>.
   */
  hero?: { src: string; alt: string; position?: string };
  /** false = hidden from the index's links, 404 on the detail route. */
  published: boolean;
  featured?: boolean;
  body: Block[];
};

export type BlogCategory = { id: BlogCategoryId; label: string };

export const blogCategories: BlogCategory[] = [
  { id: "rules", label: "Game rules & how-to" },
  { id: "etiquette", label: "Betting etiquette" },
  { id: "handicaps", label: "Handicaps explained" },
  { id: "trips", label: "Trip guides" },
  { id: "building", label: "Build in public" },
  { id: "gear", label: "Course & gear" },
  { id: "product", label: "Product updates" },
];

type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  blocks?: Block[];
};

function article(intro: string, sections: ArticleSection[]): Block[] {
  const firstSection = sections[0];
  const openingGlance = (firstSection?.blocks ?? []).filter(
    (block) => block.kind === "atAGlance",
  );

  return [
    { kind: "p", html: intro },
    ...openingGlance,
    ...sections.flatMap((section): Block[] => [
      { kind: "h2", id: section.id, text: section.title },
      ...(section.paragraphs ?? []).map(
        (html): Block => ({ kind: "p", html }),
      ),
      ...(section.blocks ?? []).filter(
        (block) => section !== firstSection || block.kind !== "atAGlance",
      ),
    ]),
  ];
}

const blogMedia = {
  course: "/images/course-1600.webp",
  sunset: "/images/sunset-1600.webp",
  turf: "/images/turf-1600.webp",
  bunkerFairway: "/images/blog/bunker-fairway.webp",
  bunkerGreen: "/images/blog/bunker-green.webp",
} as const;

export const posts: Post[] = [
  {
    slug: "who-pays-first",
    category: "etiquette",
    title: "Who pays first? The unwritten rules of settling up",
    excerpt:
      "On the green, in the parking lot, or by dinner — a field guide to not being the guy everybody has to chase.",
    dek: "Nine rules, ranked by how often your group breaks them. Number one is not negotiable: if you lost, you pay, and you pay first.",
    crumb: "Settling up",
    author: "From the GoLo team",
    date: "2026-08-11",
    readMins: 5,
    published: true,
    featured: true,
    body: [
      { kind: "p", html: "Golf has a rulebook, a governing body on two continents, and an official decision on what to do when your ball comes to rest against a burrowing animal. It has nothing whatsoever to say about when you hand over the ten dollars. So your group made up its own norms, and your group is quietly certain they're the universal ones." },
      { kind: "p", html: "Here they are, ranked by how often they get broken rather than how noble they sound. Rule one is not up for discussion." },
      {
        kind: "atAGlance",
        title: "SETTLING UP AT A GLANCE",
        items: [
          { label: "WHO MOVES FIRST", value: "Whoever's down. Winners don't invoice." },
          { label: "WHEN", value: "In the lot, before anyone drives off" },
          { label: "HOW", value: "Cash under $20, app over it" },
          { label: "THE ODD DOLLAR", value: "Round against yourself. Always." },
        ],
      },
      {
        kind: "h2",
        id: "the-nine-rules",
        text: "The nine rules, most-violated first",
      },
      {
        kind: "steps",
        items: [
          {
            id: "rule-1",
            tag: "BROKEN EVERY SATURDAY",
            title: "The loser pays. Unprompted.",
            body: "You lost, so the money is your errand. Nobody should have to ask, because asking is the moment a friendly bet turns into an invoice. The man already sat through your account of the drive on 14. Making him also request his ten dollars is a lot to put on one afternoon.",
          },
          {
            id: "rule-2",
            title: "\"Catch you next week\" is not a payment.",
            body: "It's a subscription. Once is fine, from a guy who genuinely shows up every week, for a number nobody will remember. Twice and you've become the group's least favorite lender. And never let a balance ride into the next round: carry $12 into next Saturday's $10 Nassau and one of you is now playing for $22, which one of you did not agree to.",
          },
          {
            id: "rule-3",
            title: "Money moves in the parking lot, not in the group text.",
            body: "The lot is the last moment all four of you are in one place with the same memory of what happened. Let everyone drive off and the settle becomes a thread; the thread becomes a debate about whether the press on 15 counted; the thread dies Tuesday at 11pm when somebody replies with a laughing emoji instead of six dollars. If it truly has to happen later, say the day out loud — 48 hours is the ceiling, not the plan.",
          },
          {
            id: "rule-4",
            title: "The junk gets paid with the match.",
            body: "Greenies, sandies, closest-to-the-pin, the skin nobody claimed on 7 — real dollars, and the first ones to evaporate. Total them on 18 alongside the match so every player ends up with one figure. \"We'll sort the junk out later\" is the most expensive sentence in amateur golf, because later means whoever remembers loudest wins.",
          },
          {
            id: "rule-5",
            title: "Settle players, not bets.",
            body: "Four players have six relationships. Pay them out one wager at a time and you'll stand there handing the same twenty around a circle until someone's wife calls. Net everything — Nassau, skins, junk — into one number per person, then move the fewest dollars that make everybody whole. It's usually two or three payments instead of six, and it ends the arithmetic before the beer gets warm.",
          },
          {
            id: "rule-6",
            title: "Round against yourself.",
            body: "Split skins and half-strokes produce numbers like $7.50, and nobody is making change on a cart path. Pay the extra dollar; collect the lesser one. If that dollar changes how you feel about the day, the stakes were wrong — and that's a first-tee problem, not a settle-up problem.",
          },
          {
            id: "rule-7",
            title: "Cash if it's small, app if it isn't — and send it while you're standing there.",
            body: "Cash is undefeated: instant, unforgettable, impossible to renegotiate. Keep a couple of twenties in the bag and you'll never be the holdup. Above roughly twenty bucks, Venmo or Zelle is perfectly fine on one condition — you send it in the lot, not from your couch. \"I'll send it when I get home\" has never once been true. Add a note (\"back nine + greenie\"), because a bare $14 in somebody's feed three weeks later is a riddle.",
          },
          {
            id: "rule-8",
            title: "If the number ran away, the winner brings it back.",
            body: "Presses compound, and every so often a man walks off 18 owing four times what he thought he was risking. That's the group's fault, not his. Collect the number he expected to lose and forgive the runaway. A bet that actually stings stops being a game, and the guy who felt it will develop a standing Saturday conflict. This isn't charity — it's foursome maintenance.",
          },
          {
            id: "rule-9",
            title: "Be careful with the new guy's money.",
            body: "Take it if he insisted on playing — refusing has its own sting. But don't run the full press ladder at somebody who hasn't learned your house rules yet, and tell him the stakes on the first tee instead of the ninth green. The fastest way to turn a guest into a permanent fourth is to let him leave roughly even and slightly curious.",
          },
        ],
      },
      {
        kind: "callout",
        title: "THE ONE HABIT THAT FIXES EIGHT OF THESE",
        html: "Say the numbers out loud on the 18th green, while everyone is still standing there. Not \"I think you got me\" — actual figures, one per player, agreed in sixty seconds. Nearly all settle-up friction is a number two people never said to each other's faces.",
      },
      { kind: "quote", text: "Nobody minds losing ten dollars. Everybody minds asking for it twice." },
      // The tailgate photo is not sourced yet. When it lands in
      // public/images/blog/, restore the block here:
      // { kind: "image", src: "/images/blog/who-pays-first-tailgate.png",
      //   alt: "Four players settling up on a tailgate after the round",
      //   caption: "The tailgate is the real 19th hole. Anything that doesn't get settled here gets litigated by group text on Tuesday." },
      { kind: "h2", id: "why-it-matters", text: "Why any of this matters over eleven dollars" },
      { kind: "p", html: "Because the money was never the point. The bet exists to make a twilight round on a Tuesday feel like it counts — to give the eight-footer on 12 a reason to matter. Settling is what keeps that device working. Pay fast, pay first, round against yourself, and the bet stays a game instead of becoming a small unspoken thing between two guys who used to enjoy playing together." },
      { kind: "p", html: "And if remembering all nine sounds like work: the honest reason groups break these rules isn't character, it's arithmetic. Nobody wants to do six-way netting in a parking lot with a beer in his hand. So don't. Let something else keep the tally and just move the money." },
    ],
  },
  {
    slug: "nassau",
    category: "rules",
    title: "How to play a Nassau: the $2 bet that runs every group in America",
    excerpt: "Front nine, back nine, total match — plus presses. The whole format in five minutes.",
    dek: "Front nine, back nine, total match — plus presses. The whole format in five minutes, including the three rules your group is definitely playing differently than the next one.",
    crumb: "Nassau",
    author: "From the GoLo team",
    date: "2026-07-28",
    readMins: 5,
    hero: { src: blogMedia.course, alt: "A fairway opening toward a distant green", position: "50% 55%" },
    published: true,
    body: article(
      "A Nassau is the default bet in American golf, and almost nobody explains it before the first tee. Somebody says “five-five-five?”, everyone nods, and eighteen holes later there is an argument in the parking lot about whether the back nine was still alive. Here is the whole format, start to settle.",
      [
        { id: "three-bets", title: "It is three bets, not one", paragraphs: ["That is the only idea you need. A Nassau splits the round into three separate match-play wagers of equal value: the front nine, the back nine, and the overall eighteen. Each one is won by whoever is up when that segment ends. Ties push, and nobody pays.", "Match play means you are counting holes won, not strokes. Lose the 4th by six shots and it costs you exactly one hole, the same as losing it by one. That is why the format survives a blow-up: a triple bogey ends the hole, not the afternoon."], blocks: [{ kind: "atAGlance", title: "NASSAU AT A GLANCE", items: [{ label: "PLAYERS", value: "2, or two teams of two" }, { label: "SCORING", value: "Match play, hole by hole" }, { label: "THE BETS", value: "Front 9, back 9, total 18" }, { label: "TYPICAL STAKE", value: "$2 / $5 / $10 a side" }] }] },
        { id: "five-dollar-example", title: "A $5 Nassau, played out", paragraphs: ["Two players, $5 a side, one press. You win the front nine comfortably, get run over on the back, and still walk off the 18th collecting money. Here is how that happens."], blocks: [
          { kind: "steps", items: [
            { title: "Front nine: 2 up", body: "You win holes 2, 5, and 7, and lose the 6th. The first bet is in the bank." },
            { title: "Three down with five to play", body: "Your opponent birdies 10 and 11 and wins 13, so you press on the 14th tee." },
            { title: "A new match begins", body: "The press is a new $5 match covering holes 14 through 18. The back-nine bet keeps running underneath it." },
            { title: "The press wins; the total pushes", body: "You win 15 and 18, lose 17. The press finishes 1 up, the back nine 2 down, and the total eighteen all square." },
          ] },
          { kind: "table", head: ["Bet", "Result", "Pays"], rows: [["Front nine", "You win, 2 up", "+$5"], ["Back nine", "You lose, 2 down", "−$5"], ["The press · 14–18", "You win, 1 up", "+$5"], ["Total 18", "All square", "Push"], ["Settle", "Net for the day", "+$5"]] },
          { kind: "p", html: "Four bets, one number. Lose the back nine, win the press, and the day still goes your way." },
          { kind: "keyStat", value: "$15", label: "The most you can lose in a straight $5 Nassau before anybody presses. That ceiling is the whole appeal — small enough that nobody plays scared, big enough that a five-footer on 18 still means something." },
          { kind: "image", src: blogMedia.course, alt: "Two golfers agreeing to a Nassau on the first tee", caption: "Three bets get agreed on the first tee in about four seconds. The trouble always starts later.", position: "50% 52%" },
        ] },
        { id: "presses", title: "Presses: the part that gets people in trouble", paragraphs: ["A press is a brand-new bet, at the same stake, covering only the holes left in that segment. It is how the player who is losing buys a way back in, and it is also how a $5 Nassau quietly becomes a $40 afternoon. Presses can be pressed, which is where groups lose the thread entirely."], blocks: [{ kind: "callout", title: "SETTLE THIS ON THE FIRST TEE", html: "Automatic presses at 2 down, or press only when somebody asks? Auto-presses roughly double the money at stake over eighteen holes. Both are fine. Finding out on the 14th which one you are playing is not." }, { kind: "quote", text: "Nobody argues about the golf. They argue about what the bet was." }] },
        { id: "house-rules", title: "The three rules your group plays differently", paragraphs: ["There is no governing body for the Nassau. Every group has house rules and every group assumes theirs are the standard ones. These three cause the parking-lot conversation."], blocks: [{ kind: "cardGrid", items: [
          { title: "Do strokes count?", body: "A Nassau with handicaps is a different game than one without. Most groups play the low handicap off scratch and give everybody else their difference, allocated by the stroke index printed on the card. If a 6 and a 22 are playing straight up, the 22 is making a donation." },
          { title: "When does the total 18 close?", body: "Some groups close the overall match the moment it is mathematically decided — 3 up with 2 to play, done. Others play all eighteen because the back-nine bet is live anyway. Pick one, because it decides whether 17 and 18 mean anything." },
          { title: "Can you press on the 18th tee?", body: "A one-hole press on the last tee is either a fair last chance or a shameless double-or-nothing, depending entirely on who is asking for it. Decide before somebody needs it." },
        ] }] },
        { id: "settling", title: "Settling up without the parking-lot math", paragraphs: ["With two players it is one number. With four, in a two-on-two Nassau with a couple of presses in it, you have six or eight small bets closing in different directions and somebody doing arithmetic with a beer in his hand. That is the part that goes wrong — not the golf, not even the rules. The tally.", "The fix is boring: say the format out loud, write the stake down before the first tee shot, and mark each press when it is called instead of reconstructing it on the drive home. Do that and the Nassau is the best bet in golf — three chances to win, a ceiling you can live with, and every hole still mattering to somebody.", "Or let GoLo hold the card. It runs the three matches at once, tracks every press from the hole it was called on, and nets the whole group down to one number when you walk off 18."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Three equal bets: front nine, back nine, total 18. Match play. Ties push.", "A press is a new bet on the holes that are left, at the same stake.", "Decide strokes, automatic presses, and the 18th-tee press before you tee off.", "Straight $5 Nassau: $15 is the most anyone can lose. Presses change that."] }] },
      ],
    ),
  },
  {
    slug: "skins-carryover",
    category: "rules",
    title: "Skins, explained: the carryover is where the money is",
    excerpt:
      "How a $1 skin turns into a $9 hole, and the one setting that decides whether your group loves the format or bans it.",
    date: "2026-07-14",
    readMins: 6,
    dek: "How a $5 skin turns into a $60 hole, why a tied hole is the most important thing that can happen, and the setting that decides whether your group loves the format or bans it.",
    crumb: "Skins",
    author: "From the GoLo team",
    hero: { src: blogMedia.turf, alt: "Close-cut golf turf beside the rough", position: "50% 50%" },
    published: true,
    body: article(
      "Skins is the simplest bet in golf to explain and the easiest one to underestimate. One skin per hole, low score takes it, nothing complicated. Then four holes get halved in a row, somebody rolls in a twelve-footer on the 8th, and the hole is suddenly worth sixty dollars.",
      [
        { id: "outright", title: "One skin per hole, won outright", paragraphs: ["Every hole is worth one skin. The lowest score on the hole wins it, and the emphasis is on outright — if two players tie for low, nobody wins. That single word is what separates skins from every other format. In a Nassau a halved hole is a non-event. In skins it is the engine.", "Unlike match play, skins does not care who is second. Make a 4 when the winner makes a 3 and it costs you exactly what a 9 would have. That is why it plays well in a bigger group and why one wild hole never ruins your day."], blocks: [{ kind: "atAGlance", title: "SKINS AT A GLANCE", items: [{ label: "PLAYERS", value: "3 to 6, four is ideal" }, { label: "SCORING", value: "Low score wins the hole outright" }, { label: "THE BET", value: "One skin per hole, 18 total" }, { label: "TYPICAL STAKE", value: "$5 a skin, per player" }] }] },
        { id: "carryover", title: "The carryover is the whole game", paragraphs: ["When a hole is tied, the skin does not disappear — it rides to the next hole and stacks on top of it. Four players, $5 a skin, and a quiet stretch of halved holes is how a small game turns into a big one."], blocks: [
          { kind: "steps", items: [
            { title: "Three skins carry", body: "Holes 1, 2, and 3 are all halved. The 4th hole is now worth four skins." },
            { title: "Birdie wins the stack", body: "You make birdie on the 4th and nobody matches it, so you take all four skins." },
            { title: "That one hole pays $60", body: "Four skins at $5, collected from three other players." },
            { title: "The count resets", body: "The 5th is worth one skin again, and everybody who just paid is now playing a little harder." },
          ] },
          { kind: "table", head: ["Hole", "What happened", "You"], rows: [["Holes 1–3", "All halved, 3 skins carry", "—"], ["Hole 4", "Your birdie takes 4 skins", "+$60"], ["Hole 9", "Tom wins 1 with a par", "−$5"], ["Holes 12–15", "Three halved, Mike takes 4", "−$20"], ["Full 18", "You 7, Tom 6, Mike 5, Dave 0", "+$50"]] },
          { kind: "p", html: "A $5 skins game between four players, all 18 skins claimed. Every skin moves $5 from each of the three losers to the winner." },
          { kind: "keyStat", value: "$90", label: "What a “$5 skins game” actually costs the player who never wins a hole: 18 skins at $5. Run the number before you set the stake, because nobody in the group has done that math either." },
          { kind: "image", src: blogMedia.turf, alt: "A birdie putt that can win a large carried skins pot", caption: "Nothing changes the mood of a round faster than a twelve-footer that four people are watching for money.", position: "50% 50%" },
        ] },
        { id: "settings", title: "The settings that change everything", paragraphs: ["Skins looks like one game but plays like four, depending on how you answer these. Groups that love the format and groups that banned it are usually running different settings, not different golf."], blocks: [{ kind: "cardGrid", items: [
          { title: "Carryovers on, or off?", body: "Off means every hole is worth exactly one skin and the money stays flat and predictable. On is where the format gets its teeth. If your group has one player who tilts, carryovers are the setting that finds him." },
          { title: "Gross or net skins?", body: "Gross rewards the best player, full stop. Net skins hand strokes out by the card’s stroke index, which is the only version where a 20 handicap can realistically win one. In a mixed group, net is the difference between a game and a spectator sport." },
          { title: "What happens to skins left over on 18?", body: "If the last hole is halved, split the carried skins evenly, settle it with a chip-off from the back of the green, or roll them into next week. All three are common. Pick one before it is worth $40." },
        ] }, { kind: "quote", text: "Skins is quiet for an hour, and then somebody makes a birdie worth sixty dollars." }] },
        { id: "validation", title: "Validation, and the two-putt rule", paragraphs: ["Some groups add a validation rule: to win a skin you have to make par or better, or you have to two-putt rather than chip in from off the green. It cuts down on flukes and it makes the closing holes tighter, because a scrambled bogey no longer takes a $40 pot. It also slows things down and gives you one more thing to argue about, which is why plenty of groups skip it."] },
        { id: "tracking", title: "Keeping track without losing the thread", paragraphs: ["The failure mode is always the same: everybody remembers the $60 hole and nobody remembers holes 6 through 11. By the parking lot there are two versions of the carry count, and the guy who is down is the one arguing hardest.", "GoLo keeps the carry count live on the scoring screen, applies net strokes if you are playing them, and nets four players’ skins into one number at the end. You still get the twelve-footer. You just stop doing the multiplication."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["One skin per hole. Low score wins it outright — a tie means nobody does.", "Tied holes carry, so a quiet stretch turns the next hole into real money.", "Decide carryovers, gross or net, and what happens to leftovers on 18.", "A $5 skins game is a $90 ceiling per player. Set the stake with that in mind."] }] },
      ],
    ),
  },
  {
    slug: "wolf",
    category: "rules",
    title: "Wolf, for foursomes that can’t agree on anything",
    excerpt:
      "Pick a partner or go it alone, hole by hole. The rotation, the lone-wolf multiplier, and when the gamble is actually worth it.",
    date: "2026-07-02",
    readMins: 6,
    dek: "Pick a partner or go it alone, hole by hole. The rotation, the timing rule most groups get wrong, and when the lone-wolf gamble is worth taking.",
    crumb: "Wolf",
    author: "From the GoLo team",
    hero: { src: blogMedia.bunkerFairway, alt: "A golf fairway running between bunkers", position: "50% 48%" },
    published: true,
    body: article(
      "Wolf is the format for a foursome that cannot agree on a bet. Nobody has a fixed partner, the teams change every hole, and one player each hole decides whether he wants help or wants all the money. It takes one hole to learn and about four to get genuinely competitive.",
      [
        { id: "rotation", title: "Everybody gets to be the wolf", paragraphs: ["The tee order rotates. On the 1st hole player one is the wolf, on the 2nd it is player two, and so on, which means each player is the wolf on holes 1, 5, 9, and 13 — four turns each over sixteen holes. The last two holes are a house rule, and we will get to those.", "Being the wolf is the whole job: after the tee shots you either take a partner for that hole or play the hole alone against the other three. Everything else is a two-on-two best-ball hole, decided the way you would expect."], blocks: [{ kind: "atAGlance", title: "WOLF AT A GLANCE", items: [{ label: "PLAYERS", value: "4 — the format is built for it" }, { label: "SCORING", value: "Best ball vs. best ball, per hole" }, { label: "THE BET", value: "New teams every hole" }, { label: "TYPICAL STAKE", value: "$5 a hole, lone wolf doubles" }] }] },
        { id: "partner-timing", title: "Picking a partner, and the timing rule that matters", paragraphs: ["This is the part groups get wrong. The wolf does not watch all three drives and then shop around — he has to decide immediately after each one."], blocks: [{ kind: "steps", items: [
          { title: "The wolf tees off first", body: "He is committing his own drive before he sees anybody else’s." },
          { title: "The next player hits", body: "Right then, before the following player tees off, the wolf either takes him or passes forever." },
          { title: "Pass on all three", body: "You are the lone wolf by default — you against the other three, for double." },
          { title: "The partnership lasts one hole", body: "On the next tee everybody is on their own again." },
        ] },
        { kind: "table", head: ["Hole", "What happened", "You"], rows: [["Hole 5", "You take Mike; your side wins", "+$5"], ["Hole 9", "Tom declares lone wolf and birdies", "−$10"], ["Hole 13", "You go alone; par beats all three", "+$30"], ["Hole 17", "Dave picks you; your side wins", "+$5"], ["Settle", "One good gamble carried the round", "+$30"]] },
        { kind: "p", html: "A $5 Wolf game. Partnered holes pay $5 a man; a winning lone wolf takes $10 from each of the other three." },
        { kind: "keyStat", value: "6×", label: "How much more a lone-wolf hole moves than a partnered one: $30 against $5. Four turns as the wolf is four chances to make that call, and the round is usually decided by whoever read them right." },
        { kind: "image", src: blogMedia.bunkerFairway, alt: "The wolf committing to a drive before seeing the rest of the group", caption: "The wolf hits first, which is the elegant cruelty of the format — you commit before you know anything.", position: "50% 48%" },
        ] },
        { id: "lone-wolf", title: "When going alone is actually the right call", paragraphs: ["Lone wolf is not bravado, it is arithmetic. You need to beat the best score of three players, so the question is only ever how likely a good score is to be enough on this specific hole."], blocks: [{ kind: "cardGrid", items: [
          { title: "Go alone on the short holes", body: "A par 3 you can hit and a drivable par 4 are where three opponents are most likely to all make par. If a birdie wins outright and a par often ties, the odds are with you." },
          { title: "Go alone after three bad drives", body: "The best information you get is the three tee shots in front of you. Two in the trees and one laid up with an iron is the cheapest lone wolf you will ever have." },
          { title: "Never go alone into trouble", body: "Water, out of bounds, or a hole where your miss is a lost ball. A double bogey as the lone wolf pays out to three people at double the rate, and that is how a good round turns into a bad settle." },
        ] }, { kind: "quote", text: "The wolf tees off first. Every decision you make after that is made with better information than the one you already made." }] },
        { id: "last-two", title: "The last two holes, and the blind wolf", paragraphs: ["Sixteen holes divide evenly by four, and eighteen do not, so every group patches the ending differently. The three common answers: the two players furthest down get holes 17 and 18 as the wolf, the overall leader is wolf on both so he has to defend it, or you simply run the rotation twice more and let it be uneven. Any of them work. Deciding on the 17th tee does not.", "The other addition worth knowing is the blind wolf: declaring you are going alone before anybody hits, including yourself. It pays triple. It is also the fastest way to be down $45 on one hole, which is exactly why somebody in your group will call it on the 18th."] },
        { id: "tracking", title: "Keeping the rotation straight", paragraphs: ["Wolf has more moving parts than any other common bet: whose turn it is, who partnered with whom, which holes were doubled, and what the running total looks like four holes later. Groups usually lose the rotation somewhere around the turn and reconstruct it from memory, which always favors whoever remembers loudest.", "GoLo holds the rotation, records the partner the moment you pick one, applies the double or the triple, and nets four players down to one number. You get to spend the round deciding whether to go alone instead of doing bookkeeping."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["The wolf rotates every hole and tees off first. Four turns each over sixteen holes.", "Take a partner immediately after his drive, or pass and lose the option.", "Lone wolf pays double, blind wolf triple, and both cut in either direction.", "Agree how holes 17 and 18 work before you get to the 17th tee."] }] },
      ],
    ),
  },
  {
    slug: "bingo-bango-bongo",
    category: "rules",
    title: "Bingo Bango Bongo keeps the 22-handicap interested",
    excerpt:
      "Three points a hole, no strokes required. The fairest game in golf for a group with a 6 and a 26 in it.",
    date: "2026-06-18",
    readMins: 5,
    dek: "Three points a hole, no strokes required. The fairest game in golf for a group with a 6 and a 22 — and why order of play does all the work.",
    crumb: "Bingo Bango Bongo",
    author: "From the GoLo team",
    hero: { src: blogMedia.bunkerGreen, alt: "A golf green guarded by bright sand bunkers", position: "50% 46%" },
    published: true,
    body: article(
      "Every group has one: a 22-handicap who is out of the bet by the 5th hole and spends the back nine watching three other people play for money. Bingo Bango Bongo fixes that without a single stroke changing hands. Three points a hole, and two have almost nothing to do with how far you hit it.",
      [
        { id: "three-points", title: "Three points, three different skills", blocks: [{ kind: "atAGlance", title: "BINGO BANGO BONGO AT A GLANCE", items: [{ label: "PLAYERS", value: "3 or 4 — four is the sweet spot" }, { label: "SCORING", value: "3 points every hole, 54 total" }, { label: "THE BET", value: "A price per point" }, { label: "HANDICAPS", value: "Not required" }] }, { kind: "cardGrid", items: [
          { eyebrow: "BINGO", title: "First ball on the green", body: "Not the best shot, the first one to find the putting surface. This is the point the short hitter wins, because he is playing before everybody else and can be on in three while the long hitters are still deciding on a club." },
          { eyebrow: "BANGO", title: "Closest to the pin once everybody is on", body: "Measured when all balls are on the green, not after the approach shots. A player who chips on from the rough can win bango over three players who found the green in regulation." },
          { eyebrow: "BONGO", title: "First ball in the hole", body: "A putting point, and the one that rewards the guy who can hole a twenty-footer from off the front edge. Farthest away putts first, so being 30 feet out is an opportunity rather than a problem." },
        ] }] },
        { id: "order", title: "Order of play is the whole game", paragraphs: ["Every point depends on the oldest rule in golf: farthest from the hole plays first. That single convention is what turns a format about distance into a format about position. Here is a normal par 4 with a 6, a 12, a 15, and a 22 playing it."], blocks: [
          { kind: "steps", items: [
            { title: "Dave wins bingo", body: "The 22 is 60 yards behind the other three, hits next from 130 out, and puts it on the front edge." },
            { title: "Everybody reaches the surface", body: "You and Mike hit approaches, Tom misses left and chips on. Bango is not decided until all four balls are on." },
            { title: "You win bango", body: "Distances are compared with everybody on. You are eight feet away, closest of the four." },
            { title: "Mike wins bongo", body: "Mike is farthest at 25 feet, so he putts first — and pours it in. Three points, three players, one hole." },
          ] },
          { kind: "table", head: ["Player", "Points over 18", "Net at $2 a point"], rows: [["You · 12 index", "15", "+$12"], ["Mike · 6 index", "14", "+$4"], ["Tom · 15 index", "13", "−$4"], ["Dave · 22 index", "12", "−$12"], ["54 points", "Three a hole, all claimed", "$0 net"]] },
          { kind: "p", html: "Each point moves $2 from each of the other three players, so a point is worth $6 to whoever wins it. Nobody took strokes." },
          { kind: "keyStat", value: "3", label: "Points on every hole, which means there is no such thing as a dead hole. Make a triple and you can still walk off with a point — that is the reason the 22 is still paying attention on the 16th." },
          { kind: "image", src: blogMedia.bunkerGreen, alt: "Four balls around a green waiting for bango to be measured", caption: "Bango is measured once every ball is on the green, which is why a chip-on can beat three good approach shots.", position: "50% 48%" },
        ] },
        { id: "why-it-works", title: "Why it works with a 6 and a 22 in the group", paragraphs: ["Most bets need handicaps to be fair, and handicaps are where arguments live. Bingo Bango Bongo is fair by construction: two of the three points are decided by order of play, and order of play favors the player who is behind.", "The better player still wins more often. He is closer more often, which is bango, and he holes more putts, which is bongo. But he cannot run away with a hole, and he certainly cannot run away with the round. A four-point spread over 54 is a normal result, and a four-point spread is a bet everybody is still in on the 18th tee."], blocks: [{ kind: "quote", text: "Being 60 yards behind everybody is not a disadvantage here. It is a head start on bingo." }] },
        { id: "rules", title: "The four rules worth settling first", blocks: [{ kind: "cardGrid", items: [
          { title: "Does the fringe count for bingo?", body: "Most groups require the putting surface. A ball two feet off the front in the collar is not on the green, and that call is much easier to make before somebody is standing over it." },
          { title: "Bango is measured with everybody on", body: "Not after the approaches. If one player is chipping from the rough, bango is not decided until his ball is on the surface too. Groups that measure early hand the point to the wrong person about twice a round." },
          { title: "Playing out of turn forfeits the point", body: "Hit before the player who is farther away and you give up whatever point you just won. No argument, no discussion." },
          { title: "It fights with ready golf", body: "Strict order is slower than everybody hitting when ready. On a busy Saturday, keep order on the approach and green and let tee shots go however they go." },
        ] }] },
        { id: "tracking", title: "Keeping 54 points straight", paragraphs: ["The format’s only real weakness is bookkeeping. Three points a hole across 18 holes is 54 separate results, and nobody is writing that on a scorecard margin. Groups either lose track by the turn or quietly stop counting bingos.", "GoLo tallies all three points per hole, keeps a running total per player, and settles the point value at the end. You play the order of play. The app does the multiplication."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Three points a hole: first on the green, closest once all are on, first in the hole.", "Farthest from the hole always plays first — that rule is what makes it fair.", "No handicaps needed, which is why it works with a 6 and a 22 in the same group.", "Play out of turn and you forfeit the point. Settle the fringe question up front."] }] },
      ],
    ),
  },
  {
    slug: "pressing",
    category: "etiquette",
    title: "Pressing: when it’s fair game and when it’s just rude",
    excerpt:
      "The automatic 2-down press, the vulture press, and the one press that gets you left off next week’s text.",
    date: "2026-06-04",
    readMins: 6,
    dek: "The automatic 2-down press, the vulture press, and the one press that gets you left off next week’s text — plus what auto-presses do to the size of your bet.",
    crumb: "Pressing",
    author: "From the GoLo team",
    hero: { src: blogMedia.sunset, alt: "Golfers finishing a round beneath an orange sunset", position: "50% 52%" },
    published: true,
    body: article(
      "A press is the most useful tool in a friendly bet and the fastest way to sour one. Called at the right moment it keeps a beaten player in the round; called at the wrong one it tells three people exactly what you think of them. The mechanics take a paragraph. The etiquette is the actual subject.",
      [
        { id: "what-is-a-press", title: "What a press actually is", paragraphs: ["It is a second bet, not an adjustment to the first one. The original match keeps running to the end of its segment; the press runs alongside it, at the same stake, over whatever holes are left. Win the press and you have clawed back the segment without ever winning the original bet.", "That is the whole appeal. A player who is 3 down on the back nine has nothing to play for over the last five holes, and a bet nobody is playing for is worse than no bet. The press gives him a live match again."], blocks: [{ kind: "atAGlance", title: "A PRESS AT A GLANCE", items: [{ label: "WHAT IT IS", value: "A new bet, same stake" }, { label: "WHAT IT COVERS", value: "Only the holes remaining" }, { label: "WHO CALLS IT", value: "The side that is down" }, { label: "WHEN", value: "On the tee, before anybody hits" }] }] },
        { id: "four-presses", title: "The four presses you will meet", blocks: [{ kind: "cardGrid", items: [
          { title: "The automatic 2-down", body: "No conversation required: any time a side goes 2 down, a press opens on the spot. It is the cleanest version because nobody has to ask, and it is also the one that quietly doubles the money at stake over eighteen holes." },
          { title: "The requested press", body: "You are down, you want another crack, you ask on the tee. Standard and perfectly fair. The only rule is that the answer is allowed to be no." },
          { title: "The vulture press", body: "Pressing when you are the one up, usually against somebody who has visibly stopped playing well. It is legal in the sense that nothing stops you, and it is the press that gets you left off next week’s text." },
          { title: "The 18th-tee press", body: "A one-hole press on the last tee. Either a fair last chance or a shameless double-or-nothing, depending entirely on who needs it. Groups that allow it always allow it; groups that do not should say so on the first tee." },
        ] }] },
        { id: "auto-presses", title: "What auto-presses do to a $5 Nassau", paragraphs: ["Here is one round, two players, $5 a side, automatic presses at 2 down. Nobody did anything unusual and nobody pressed out of spite."], blocks: [{ kind: "table", head: ["Bet", "Result", "Pays"], rows: [["Front nine", "You lose, 1 down", "−$5"], ["Your front press · 5–9", "You win, 2 up", "+$5"], ["Back nine", "You win, 1 up", "+$5"], ["His back press · 13–18", "He wins, 2 up", "−$5"], ["Your press on his press · 16–18", "You win, 1 up", "+$5"], ["Total 18", "All square", "Push"]] }, { kind: "p", html: "A quiet round of golf with three presses in it. The final number is small; the exposure was not." }, { kind: "keyStat", value: "$30", label: "Total money in play in that “$5 Nassau” — double the $15 a straight one can cost. Automatic presses are not a small setting. Agree on them before the first tee, not on the 14th." }, { kind: "image", src: blogMedia.sunset, alt: "Players calling a press from a tee box before anyone hits", caption: "Every legitimate press starts on a tee box, before anybody has an advantage.", position: "50% 54%" }] },
        { id: "friendly-rules", title: "Three rules that keep it friendly", blocks: [{ kind: "cardGrid", items: [
          { title: "Only the side that is down gets to press", body: "This is the one that separates a bet from a shakedown. If you are up and want more money on the line, you are not pressing, you are pushing. Wait until the situation reverses." },
          { title: "Call it on the tee, not after your drive", body: "A press called from the middle of the fairway after you have striped one is a different bet than a press called on the tee, and everybody knows it. Before anybody hits, or not at all." },
          { title: "Read the room", body: "If somebody is having a genuinely rough day, the correct move is often not to press at all. The money is not the point, and everybody can tell when you have forgotten that." },
        ] }, { kind: "quote", text: "A press should give a beaten player something to play for. If it is doing anything else, do not call it." }] },
        { id: "accept-or-decline", title: "When to say yes, and when to decline", paragraphs: ["If your group plays presses on request rather than automatically, accepting is the default. Declining a press from a player who is 3 down with four to play is technically your right and socially expensive — you are choosing to protect $5 at the cost of the next hour being awkward.", "The exception is stakes. If a press would take the round past what somebody in the group can comfortably lose, say so out loud and cap it. “Happy to press, but that is the last one” is a completely normal sentence and it protects everybody, including the guy asking."] },
        { id: "write-it-down", title: "If it is not written down, it did not happen", paragraphs: ["Presses are where friendly bets go wrong, and almost never because somebody cheated. It is because a press called on the 13th tee is remembered on the 18th green as starting on the 14th, and now two people are describing different bets with equal confidence.", "Mark it when it is called. GoLo stamps each press to the hole it opened on, runs it alongside the original match, and nets everything — presses on presses included — into one number at the end. The etiquette is still your job. The bookkeeping is not."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["A press is a new bet at the same stake over the holes that are left.", "Only the losing side presses, and only from the tee before anybody hits.", "Automatic 2-down presses roughly double the money at stake. Decide up front.", "Mark each press to the hole it was called on, or you are settling from memory."] }] },
      ],
    ),
  },
  {
    slug: "index-vs-course-handicap",
    category: "handicaps",
    title: "Handicap index vs. course handicap: what goes on the card",
    excerpt:
      "Why a 12.4 becomes 14 strokes at one course and 11 at another — and how those strokes land hole by hole.",
    date: "2026-05-21",
    readMins: 8,
    dek: "Why a 12.4 becomes 14 strokes at one tee box and 11 at another, how those strokes land hole by hole, and which number belongs on the card.",
    crumb: "Handicaps",
    author: "From the GoLo team",
    hero: { src: blogMedia.course, alt: "A golf course with multiple teeing areas and a distant green", position: "50% 42%" },
    published: true,
    body: article(
      "Somebody in your group says “I’m a twelve.” That is a handicap index, and it is not the number he plays off today. Move him back one set of tees and it changes. Take him to a harder course and it changes again. Here is the difference, the formula, and which number belongs on the card when there is money on the hole.",
      [
        { id: "index-vs-course", title: "The index is the number you own. The course handicap is the number you play.", paragraphs: ["Your handicap index measures your demonstrated ability on a course of average difficulty. It travels with you and it has a decimal, because it is a calculation, not a scorecard entry. Nobody gets strokes equal to their index.", "Your course handicap converts that ability into strokes for the exact tees you are playing, on the exact course you are playing. It is a whole number, it changes when the tees change, and it is the one that decides who gives what."], blocks: [{ kind: "atAGlance", title: "THE THREE NUMBERS", items: [{ label: "HANDICAP INDEX", value: "Portable, one decimal, e.g. 12.4" }, { label: "COURSE HANDICAP", value: "Whole number, per tee set" }, { label: "PLAYING HANDICAP", value: "Course handicap × format allowance" }, { label: "STROKE INDEX", value: "Which holes the strokes land on" }] }] },
        { id: "formula", title: "The formula, run twice", paragraphs: ["Course handicap = index × (slope rating ÷ 113) + (course rating − par). Slope rating measures difficulty for a bogey golfer, 113 is the neutral value, and the rating-minus-par term accounts for a course that plays harder or easier than its par. Here is a 12.4 on two sets of tees at the same club."], blocks: [{ kind: "table", head: ["Step", "Blues · 131 / 71.8 / 72", "Whites · 122 / 69.6 / 72"], rows: [["Handicap index", "12.4", "12.4"], ["× slope ÷ 113", "14.4", "13.4"], ["+ (rating − par)", "−0.2", "−2.4"], ["Unrounded", "14.2", "11.0"], ["Course handicap", "14", "11"]] }, { kind: "p", html: "Same player, same afternoon, same golf swing. Three strokes’ difference depending on which tee box he walks to." }, { kind: "keyStat", value: "3", label: "Strokes that appeared out of nowhere when the group moved up a tee box. If everybody is not playing the same tees, using raw indexes is not a rounding error — it is the bet." }, { kind: "image", src: blogMedia.course, alt: "A scorecard showing slope, course rating, par, and stroke indexes", caption: "Slope, course rating, and par are printed on the card. Everything else is arithmetic.", position: "50% 42%" }] },
        { id: "stroke-allocation", title: "Where the strokes actually land", paragraphs: ["A course handicap of 14 does not mean you subtract 14 at the end. In any hole-by-hole bet, the strokes are allocated to specific holes by the stroke index printed on the card."], blocks: [{ kind: "steps", items: [
          { title: "Find the stroke index row", body: "The scorecard ranks the holes 1 through 18 by difficulty." },
          { title: "A 14 gets one stroke on indexes 1 through 14", body: "Those are the holes where the player’s net score is adjusted." },
          { title: "Above 18, strokes double up", body: "A 22 gets two strokes on the four hardest holes and one everywhere else." },
          { title: "The net score settles the hole", body: "A bogey 5 on stroke index 3 is a net par, and it wins against an unaided par." },
        ] }, { kind: "quote", text: "“I’m a twelve” is a fact about the player. It is not the number that settles the hole." }] },
        { id: "playing-handicap", title: "In a bet, nobody plays their full number", paragraphs: ["Two more conventions sit between the course handicap and what your group actually plays, and both exist for the same reason: to stop the format from doing something silly."], blocks: [{ kind: "cardGrid", items: [
          { title: "Play the differences, not the totals", body: "In a match, the lowest course handicap plays off scratch and everybody else gets the difference. If you are 14 and your opponent is 11, he plays even and you get three strokes — on stroke index 1, 2, and 3." },
          { title: "Formats have allowances", body: "Handicap allowances exist because some formats amplify a high handicap. Four-ball match play is commonly played at 90%; individual match play at 100%. Casual groups can skip them if everybody knows that is the choice." },
          { title: "Cap the hole, not the round", body: "Net double bogey is the standard maximum for posting purposes, and it works as a house rule. It keeps one lost ball from distorting every bet on the card." },
        ] }] },
        { id: "why-index-moves", title: "Why the index moves", paragraphs: ["Your index is the average of the best 8 score differentials out of your most recent 20 rounds, and it updates as soon as you post a score. That is why it drifts down after a good week and why it does not move much after one bad round — a single 92 has to beat out eight better rounds to matter.", "If nobody in your group carries an official index, agree on informal numbers and write them down. Consistency matters more than accuracy: a made-up 15 that everybody agrees on settles more bets than a real 12.4 that only one person remembers."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Index is portable and has a decimal. Course handicap is per tee set and is a whole number.", "Course handicap = index × (slope ÷ 113) + (course rating − par).", "Strokes land on specific holes by stroke index, not at the end of the round.", "In a match, the low handicap plays off scratch and everybody else gets the difference."] }] },
      ],
    ),
  },
  {
    slug: "sandbagging",
    category: "handicaps",
    title: "Sandbagging: how to spot it without starting a fight",
    excerpt: "The patterns that give it away, the odds that make the case, and four fixes that get an honest game back without an accusation.",
    dek: "The patterns that give it away, the odds that make the case for you, and four fixes that get an honest game back without ever accusing anybody.",
    crumb: "Sandbagging",
    author: "From the GoLo team",
    date: "2026-05-14",
    readMins: 6,
    hero: { src: blogMedia.turf, alt: "A golf ball sitting in closely cut turf", position: "50% 56%" },
    published: true,
    body: article(
      "Somebody in your group wins more than he should. He has an 18 that never moves, he never seems to have a bad Saturday, and the money has been going one direction since March. You can accuse him, which ends badly whether you are right or wrong. Or you can make the numbers visible and let the group fix itself.",
      [
        { id: "innocent-first", title: "Rule out the innocent explanations first", paragraphs: ["Most players who look like sandbaggers are not. Before you start counting anybody’s scorecards, count these out."], blocks: [
          { kind: "atAGlance", title: "WHAT WE ARE ACTUALLY TALKING ABOUT", items: [
            { label: "SANDBAGGING", value: "Keeping an index higher than your ability" },
            { label: "THE MECHANISM", value: "Not posting your good rounds" },
            { label: "THE TELL", value: "Beating your number, consistently" },
            { label: "THE FIX", value: "Structural, not confrontational" },
          ] },
          { kind: "cardGrid", items: [
            { title: "He is actually improving", body: "An index is a lagging measure — it averages your best 8 differentials out of 20 rounds, so it takes weeks to catch up with a player who found something on the range. A genuinely improving 15 will beat his number repeatedly and honestly for a month." },
            { title: "He is lazy, not larcenous", body: "Plenty of players post rounds when they remember to, which in practice means they post the ones they were annoyed about and forget the ones where they were buying drinks. The effect is identical to sandbagging. The intent is not." },
            { title: "You are comparing the wrong numbers", body: "A 12.4 index becomes a 14 course handicap from the back tees. If he is getting two more strokes than you expected, check the slope rating before you check his character." },
            { title: "He is a good putter on his own greens", body: "Home-course knowledge is worth two or three shots and it is completely legitimate. If his index comes from away rounds and he cleans you out at his own club, that is not fraud, that is local knowledge." },
          ] },
        ] },
        { id: "the-math", title: "The math that does the arguing for you", paragraphs: ["Here is what makes this solvable without an accusation: handicaps make a specific, checkable prediction about how often a player should beat his own number."], blocks: [
          { kind: "steps", items: [
            { title: "Your index is built from your best 8 of 20 rounds", body: "It describes something close to your potential, not your average day." },
            { title: "An honest index plays to its course handicap about one round in five", body: "That expectation gives the group a number it can observe instead of a personality it has to judge." },
            { title: "Three or more shots better is closer to one round in twenty", body: "One exceptional round happens. A repeating pattern is evidence." },
            { title: "Four Saturdays in a row is about a 1-in-160,000 afternoon", body: "At that point the index is the thing that is wrong, not the golf." },
          ] },
          { kind: "table", head: ["Saturday game · 18 strokes", "Gross", "Net vs. par 72"], rows: [["April 12", "85", "−5"], ["April 26", "84", "−6"], ["May 10", "85", "−3"], ["May 24", "83", "−7"], ["Rounds he posted this spring", "0", "Index still 18.2"]] },
          { kind: "p", html: "Nobody here called anybody a cheat. This is four Saturdays of arithmetic, and it makes its own case." },
          { kind: "keyStat", value: "1 in 5", label: "Roughly how often an honest handicap plays to his number. If somebody in your group is doing it most weeks, you do not have a golf problem or a character problem. You have a data problem, and data problems have fixes." },
          { kind: "image", src: blogMedia.bunkerGreen, alt: "A scorecard and handicap record being compared after a round", caption: "The index is the argument. Nobody needs to raise their voice about a spreadsheet.", position: "50% 58%" },
        ] },
        { id: "patterns", title: "The patterns worth noticing", blocks: [
          { kind: "cardGrid", items: [
            { title: "The index that never moves", body: "Everybody’s number drifts. One that has read 18.2 since last summer, through a winter of lessons and a new driver, is a number being managed rather than measured." },
            { title: "The quiet eight after the match is over", body: "Watch what happens once his bet is decided. A player who makes three straight bogeys after closing you out on 15 is protecting something, and it is not his score." },
            { title: "Net scores that cluster just under the line", body: "A real player’s net results scatter — some blowups, some good days. A managed handicap produces suspiciously tidy results: net 70, 71, 69, week after week, never a 78." },
            { title: "Strong opinions about the format", body: "If one player always wants net skins over gross, always wants full strokes rather than an allowance, and gets uncomfortable when somebody suggests Bingo Bango Bongo, he is telling you where his edge lives." },
          ] },
          { kind: "quote", text: "You do not have to accuse anybody. You just have to make the round expensive for the number and cheap for the golf." },
        ] },
        { id: "four-fixes", title: "Four fixes that require no confrontation", paragraphs: ["Every one of these is a rule about the group, not about a person. That is the entire trick — the sandbagger has to agree to them, because arguing against fairness in public is worse than losing the edge."], blocks: [
          { kind: "cardGrid", items: [
            { title: "Everybody posts every round", body: "Announce it as a group habit, not a policy aimed at anyone. If all four of you enter every score, the indexes converge on reality within a month and the problem quietly disappears." },
            { title: "Cap the strokes you give", body: "Play an allowance — 90% in four-ball, or simply cap the maximum strokes anybody can receive at, say, eight. A capped bet limits what a bad number can cost you without ever naming it." },
            { title: "Rotate formats toward the stroke-free ones", body: "Bingo Bango Bongo, gross skins, and match play with a hard cap all reduce the value of an inflated index. Keep them in the rotation and nobody has to explain why." },
            { title: "Use the lowest index of the last twelve months", body: "This is how club events handle it. If a player was a 12 in September, he plays as a 12 in April. It is the single most effective rule you can adopt, and it sounds like housekeeping rather than an accusation." },
          ] },
          { kind: "callout", title: "BEFORE YOU SAY ANYTHING", html: "An accusation costs more than the money. If you are wrong you have insulted a friend over $20; if you are right, you have made the next twenty rounds awkward for four people. Change the structure first and see whether the results change with it. They usually do." },
          { kind: "image", src: blogMedia.course, alt: "A regular foursome walking together after posting every score", caption: "The group that posts every round together never has this conversation.", position: "50% 58%" },
        ] },
        { id: "say-something", title: "If you do have to say something", paragraphs: ["Say it privately, once, and about the bet rather than the man. “Your net has been beating par most weeks, so I think your number is stale — want to play off 14 and see how it goes?” gives him a way to fix it without admitting anything. That is the point. You are not trying to win an argument, you are trying to get an honest game back.", "And keep your own house clean. Post the 79 as promptly as you post the 94. The player who does that has standing in this conversation. The one who does not is just complaining about a better sandbagger."], blocks: [
          { kind: "summary", title: "THE SHORT VERSION", items: ["An honest handicap plays to its number about one round in five. Track that.", "Rule out improvement, laziness, slope, and home-course knowledge first.", "Fix it structurally: post every round, cap the strokes, rotate stroke-free formats.", "If you must raise it, do it privately, about the bet, and offer a number instead of a verdict."] },
        ] },
      ],
    ),
  },
  {
    slug: "rangefinder",
    category: "gear",
    title: "Rangefinder or GPS watch? An honest answer for the $10 crowd",
    excerpt: "What saves a stroke, what only looks prepared, and which tool belongs in a fast group playing for small money.",
    dek: "What actually saves you a stroke over 18 holes, what just makes you look prepared on the first tee, and which one belongs in a group that plays fast for small money.",
    crumb: "Rangefinders",
    author: "From the GoLo team",
    date: "2026-05-09",
    readMins: 5,
    hero: { src: blogMedia.bunkerGreen, alt: "A distant golf flag viewed across a bunker", position: "50% 40%" },
    published: true,
    body: article(
      "If you play for ten dollars a side with the same three guys, this decision is smaller than the internet makes it. A laser gives you one exact number. A watch gives you three approximate ones without you doing anything. The honest answer depends on how you miss, how fast your group plays, and whether you will actually use the thing.",
      [
        { id: "different-questions", title: "They answer different questions", paragraphs: ["A rangefinder answers “how far is that, exactly?” — the flag, the front bunker, the tree you keep hitting. A GPS watch answers “roughly where am I?” — front, middle, and back of the green, without taking your glove off or asking anybody to stand still.", "Both are legal for handicap purposes as long as they are measuring distance only. Slope-adjusted readings are the exception: switch slope off in competition, and know that most tournaments treat a slope-capable laser as fine only when the feature is visibly disabled."], blocks: [{ kind: "atAGlance", title: "THE SHORT ANSWER", items: [{ label: "BUY A LASER IF", value: "You flag-hunt and play good courses" }, { label: "BUY A WATCH IF", value: "You just need front, middle, back" }, { label: "BUY NEITHER IF", value: "You are not yet clubbing consistently" }, { label: "WHAT SAVES SHOTS", value: "Knowing the number to the back" }] }, { kind: "table", head: ["On the course", "Laser", "GPS watch"], rows: [["Distance to the flag", "Exact, wherever it is cut", "Middle only — could be 12 yards off"], ["Time per shot", "15 to 30 seconds, both hands", "Glance at your wrist"], ["Blind tee shot", "Useless without a target", "Its best moment"], ["Layup and hazards", "One at a time", "All of them, instantly"], ["Rain, wind, cold hands", "Fogged lens, shaky hold", "Unbothered"], ["Battery over 36 holes", "Months on one cell", "Charge it the night before"]] }, { kind: "p", html: "Neither one is better. One is precise and slow, the other is quick and approximate, and only one of those problems costs you shots." }, { kind: "keyStat", value: "30 yds", label: "Front to back on a big green. If you play to the middle and the pin is at the back, you are one full club short before you swing — the actual mistake either device is there to prevent." }, { kind: "image", src: blogMedia.bunkerGreen, alt: "A golfer measuring a distant flag across a large green", caption: "The number is only worth what you do with it, and most players use it to confirm the club they already pulled.", position: "50% 40%" }] },
        { id: "saves-a-stroke", title: "What actually saves you a stroke", paragraphs: ["Not the third decimal place. Four habits do almost all the work, and three of them are free."], blocks: [{ kind: "steps", items: [
          { title: "Play to the back number, not the flag", body: "Long is usually fine and short is usually a bunker. Knowing you have 168 to the back and 152 to the front is worth more than knowing it is 159 to the stick." },
          { title: "Know your real carry numbers", body: "Not your best-ever 7-iron. Use the one you hit when tired on the 15th. Most amateurs are a club and a half optimistic, and no device fixes that." },
          { title: "Get the number before it is your turn", body: "Shoot while somebody else is hitting, or glance at your wrist while you walk. This is the whole pace-of-play argument." },
          { title: "Use it to say no", body: "The best use of an exact yardage is talking yourself out of the 3-wood over water from 235 and laying up instead." },
        ] }, { kind: "quote", text: "Precision you cannot use is just a heavier golf bag." }] },
        { id: "buying-advice", title: "Buying advice for the $10 crowd", blocks: [{ kind: "cardGrid", items: [
          { title: "Cheap laser, good laser", body: "The gap is mostly how fast it locks and how well it handles a shaky hand. Both give the same yardage. If you play twenty rounds a year, buy the cheap one and put the difference into green fees." },
          { title: "The watch you will actually wear", body: "If you already wear a smartwatch, start with a free golf app for a season before buying dedicated hardware. That is enough to learn whether you use yardages at all." },
          { title: "Your phone is a fine third option", body: "Every course app gives front-middle-back for free. It is slower and eats the battery you need for scoring, but compared with nothing, the app wins." },
          { title: "Skip both if you are not clubbing consistently", body: "If your 7-iron ranges from 130 to 165, an exact number has nothing to attach to. Buy a lesson and learn your carry distances first." },
        ] }, { kind: "callout", title: "THE ONE THING TO CHECK BEFORE COMPETITION", html: "Distance-measuring devices are generally allowed under the Rules of Golf, but the committee can prohibit them entirely, and slope functions must be switched off. Two minutes on the entry sheet beats a conversation on the first tee." }] },
        { id: "what-we-carry", title: "What we carry", paragraphs: ["Watch on the wrist for every shot, and one laser in the group for the times somebody genuinely needs the flag. That covers about ninety-five percent of it, keeps the round moving, and means nobody is standing on a tee box waiting for four people to shoot the same bunker.", "And keep the yardage device separate from the scoring device. A phone doing GPS all afternoon is a phone that is dead when the bet needs settling, which is the one moment of the round where the battery actually matters."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Laser for exact flag yardages, watch for front-middle-back without breaking stride.", "Play the back number, know your tired carry distances, and get the number early.", "Buy the cheap laser or the watch you will wear. Skip both if your clubbing is not settled.", "Do not let a GPS app drain the phone you are keeping the bet on."] }] },
      ],
    ),
  },
  {
    slug: "bandon",
    category: "trips",
    title: "Bandon on foot: what to bet when the wind decides everything",
    excerpt: "Match play, quota, and why net stroke play falls apart when it blows 30 out of the southwest.",
    dek: "Match play, quota, and why a net stroke-play bet falls apart the moment it blows 30 out of the southwest — with one windy round scored four different ways.",
    crumb: "Bandon",
    author: "From the GoLo team",
    date: "2026-05-12",
    readMins: 5,
    hero: { src: blogMedia.sunset, alt: "A coastal-looking golf course under a windy sunset sky", position: "50% 45%" },
    published: true,
    body: article(
      "You booked a links trip, you are walking every hole, and on the second morning it is blowing 30 out of the southwest with rain in it. Your golf will be fine — that is what you came for. Your bet will not. Stroke play does not survive weather like this, and the group usually finds that out around the 12th, when two of the four have stopped keeping score.",
      [
        { id: "wind-multiplier", title: "Wind is a handicap multiplier", paragraphs: ["Here is the thing nobody accounts for when they set the bet in the hotel bar the night before: hard wind does not add the same number of shots to everybody. It adds a few to the good player and a pile to everybody else.", "A low handicap flights the ball down, takes more club, and accepts 30 feet. A 20-handicap cannot do that on command, so his misses get bigger, his three-putts multiply, and one hole into the teeth becomes a 9. His handicap was built on calm afternoons at home; it is not a wind handicap, and no allowance in the system pretends otherwise.", "So the format does the real work out here. The same two scorecards can produce a blowout or a one-hole match, depending entirely on how you agreed to count them."], blocks: [{ kind: "atAGlance", title: "LINKS BETTING AT A GLANCE", items: [{ label: "THE GOLF", value: "Walking, caddies, 36 a day" }, { label: "THE VARIABLE", value: "Wind, and it changes mid-round" }, { label: "WHAT WORKS", value: "Match play, quota, nine-hole bets" }, { label: "WHAT BREAKS", value: "Net stroke play and big purses" }] }] },
        { id: "four-ways", title: "One windy round, scored four ways", paragraphs: ["A real pairing: you play off 12, Rick plays off 20, and it blows all afternoon. You shoot 88. Rick shoots 104, and twelve of those shots live on three holes — a 9, an 8, and another 9, all into the wind."], blocks: [{ kind: "table", head: ["How you counted it", "Result", "When it was over"], rows: [["Net stroke play", "You win by 8 shots", "The 12th"], ["Net match play", "You win, 1 up", "The 18th green"], ["Quota points", "You +1, Rick −1", "The 17th"], ["Two nine-hole bets", "Front to Rick, back to you", "Both went the distance"]] }, { kind: "p", html: "Nothing changed except the counting. Rick’s three disaster holes cost him twelve shots in stroke play and exactly three holes in match play." }, { kind: "keyStat", value: "16", label: "Shots between the gross scores. Match play compressed that into a one-hole match, because it does not care how badly you lose a hole — only that you lost it. In wind, that is the whole bet." }, { kind: "image", src: blogMedia.sunset, alt: "A links hole exposed to a strong crosswind", caption: "A links hole plays two clubs different depending on which way you walk off the green.", position: "50% 45%" }] },
        { id: "formats", title: "Four formats that survive 30 miles an hour", blocks: [{ kind: "cardGrid", items: [
          { title: "Match play, everything", body: "A hole is a hole. The 9 you made on the par 3 into the wind costs one hole, not six shots, so nobody is out before lunch. If you change one thing about links betting, change this." },
          { title: "Quota, with a floor at zero", body: "Stableford with no negatives means a wipe is simply zero points and you walk to the next tee. It keeps a card alive through two blowups and totals easily on a wet scorecard." },
          { title: "Gross skins get cheap and good", body: "In hard wind a par wins most holes outright, so skins carry less and get claimed by whoever is grinding best that hour. Even the 20 can steal one with bogey when everybody else makes doubles." },
          { title: "Two-man best ball on the worst day", body: "If the forecast is genuinely ugly, use pairs. Either ball counting means one player can take a hole off when a squall comes through." },
        ] }, { kind: "quote", text: "Match play does not care how badly you lost the hole. In a gale, that is the most generous rule in golf." }] },
        { id: "first-tee", title: "Settle these on the first tee, not the sixth", blocks: [{ kind: "cardGrid", items: [
          { title: "Gorse is a drop, not a search", body: "One look each, then drop at the edge for a shot and keep moving. Four people beating gorse with wedges in the rain is how a round becomes six hours." },
          { title: "If the wind moves your ball, play it from there", body: "When natural forces move a ball at rest, there is no penalty and you play from its new position. On firm greens in 30 miles an hour, that will come up." },
          { title: "Give the card to your caddie", body: "No stake in the bet, dry hands, and he will remember the press called on 13. Keeping it yourself? Keep it in a phone, in a zipped pocket." },
          { title: "Cap the day, not the round", body: "Thirty-six holes means two bets. Set a number for the day — the afternoon round plays for whatever remains." },
        ] }, { kind: "callout", title: "BET THE NINE, NOT THE EIGHTEEN", html: "Links weather changes inside a round. A front nine downwind and a back nine into it are two different courses, so make them two different bets. Anyone buried in the first half starts even after the turn." }] },
        { id: "one-number", title: "Thirty-six holes, one number", paragraphs: ["The practical problem out here is not the formats, it is the bookkeeping. Two rounds a day, a different game each time, and a scorecard that has been through the ocean. By dinner nobody can reconstruct the morning, so the group defaults to “call it even” — a quiet way of saying the bet did not matter.", "GoLo runs match play, quota, and skins off the same card, keeps the morning and afternoon on separate lines, and rolls the whole day into one number. You keep your hands in your pockets and let the wind be the only thing you argue about."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Wind adds more shots to high handicaps than low ones. Net stroke play cannot absorb that.", "Match play caps a disaster at one hole. Quota with a floor at zero does the same thing.", "Split the round into two nine-hole bets, because the weather already did.", "Cap the day rather than the round, and let the caddie keep the card."] }] },
      ],
    ),
  },
  {
    slug: "scottsdale-trip-structure",
    category: "trips",
    title: "The Scottsdale buddies trip: a four-day betting structure that works",
    excerpt:
      "One running tally, stakes that escalate, and a Day 4 format that keeps the guy down $60 in the fight.",
    date: "2026-05-07",
    readMins: 9,
    dek: "One running tally, stakes that escalate, and a Sunday format that keeps the guy down $60 in the fight — plus the desert rules to settle before anybody flies.",
    crumb: "Scottsdale",
    author: "From the GoLo team",
    hero: { src: blogMedia.bunkerFairway, alt: "A desert-style golf fairway bordered by sand", position: "50% 50%" },
    published: true,
    body: article(
      "Eight guys, four rounds, one desert. The golf takes care of itself. What ruins buddies trips is the betting: a different game every morning, nobody sure what the running total is, and by Sunday two players have stopped caring because they are down $80 with no way back. Here is a structure that fixes both problems.",
      [
        { id: "one-ledger", title: "One ledger, four days", paragraphs: ["The single best decision a trip can make is to stop settling every night and start keeping one number per player for the whole weekend. Nightly settling turns four rounds into four unrelated afternoons; a trip ledger turns them into a tournament, and a tournament has a story.", "It also solves the mixed-ability problem: over one round the 6 beats the 19 most of the time, but over four formats the 19 gets two days that suit him."], blocks: [{ kind: "atAGlance", title: "THE TRIP AT A GLANCE", items: [{ label: "GROUP", value: "8 players, two foursomes" }, { label: "ROUNDS", value: "4, one format each" }, { label: "THE LEDGER", value: "One running total, all trip" }, { label: "STAKES", value: "$10 → $20 → $30 → adjusted" }] }] },
        { id: "ladder", title: "The four-day ladder", blocks: [
          { kind: "steps", items: [
            { title: "Day 1 — Calibration day", body: "A $10 stroke purse plus $2 skins, individual. Cheap on purpose: find out whose index is real before there is money on it." },
            { title: "Day 2 — Teams", body: "Draw partners by handicap and play a $20 four-ball Nassau. Presses on request only; nobody chooses an easy side." },
            { title: "Day 3 — The marquee round", body: "A $30-a-man shamble, two teams of four. Everybody drives, everybody plays from the best one, and the best two net scores count." },
            { title: "Day 4 — The equalizer", body: "Individual quota, with each target adjusted by the ledger. The leader needs more points; the player buried gets a cushion." },
          ] },
          { kind: "table", head: ["Day", "Format", "Your ledger"], rows: [["Thursday", "$10 purse + $2 skins", "−$14"], ["Friday", "$20 four-ball Nassau", "+$40"], ["Saturday", "$30 shamble, two teams", "−$30"], ["Sunday", "Adjusted quota", "+$54"], ["Trip settle", "One transfer, Sunday night", "+$50"]] },
          { kind: "p", html: "Four formats, four results, one number at the end. Nobody paid anybody until Sunday." },
          { kind: "keyStat", value: "$60", label: "What Rick was down walking to the first tee Sunday. His adjusted quota gave him a four-point cushion, he shot the round of his trip, and flew home even. That is the argument for Day 4." },
          { kind: "image", src: blogMedia.bunkerFairway, alt: "Two foursomes playing a four-day desert golf trip", caption: "Two foursomes, four days, and one number that nobody argues about because everybody watched it move.", position: "50% 50%" },
        ] },
        { id: "day-four", title: "Why Day 4 has to be different", paragraphs: ["By Sunday morning the ledger has a leader and a straggler, and both of them are a problem. The leader wants to protect his number; the straggler has nothing to protect. An adjusted quota gives them both something to play for."], blocks: [{ kind: "cardGrid", items: [
          { title: "How the adjustment works", body: "Start at normal quota, then move it one point for every $20 on the ledger: up for the leader, down for everybody in red. Cap it at four points either way." },
          { title: "Why doubling the stakes is the wrong fix", body: "It keeps the straggler alive and lets the worst player lose his whole weekend in one round. Adjust the target, not the money." },
          { title: "The bounty alternative", body: "If quota is a stretch, everybody down puts a price on the leader’s head, payable for any hole where you beat him straight up." },
          { title: "Close the ledger on 18", body: "No parking-lot chip-offs and no double-or-nothing on the airport run. The ledger closes when the last putt drops." },
        ] }, { kind: "quote", text: "A trip where two guys stop caring on Saturday is a trip that got the last round wrong." }] },
        { id: "desert-rules", title: "Desert rules worth agreeing on Thursday", paragraphs: ["Scottsdale golf has its own physics, and every one of these turns into a bet argument if you have not settled it in advance."], blocks: [{ kind: "cardGrid", items: [
          { title: "One look in the desert, then drop", body: "Agree on a one-minute look, then drop at the edge for a stroke. A group of eight cannot afford four people searching cactus for three minutes." },
          { title: "Heat is a handicap", body: "For a summer trip, tee off at dawn, play nine-hole bets, and settle at the turn. Nobody makes good decisions at 108 degrees, including about money." },
          { title: "Play the tees that make the bet close", body: "Desert courses stretch fast; a group with a 6 and a 19 has a far better week from 6,400 yards than 6,900." },
        ] }, { kind: "callout", title: "THE ONE RULE THAT SAVES TRIPS", html: "Announce the whole four-day structure before anybody books a flight, in the group text, in writing. Formats, stakes, and how Sunday is adjusted. Everything that goes wrong on a buddies trip goes wrong because the terms arrived after the deposits did." }] },
        { id: "settle-once", title: "Settle once, and settle small", paragraphs: ["Eight players over four days is a lot of small debts pointing in every direction. Settled naively it is twenty-odd payments; netted properly it is usually five or six, because most of it cancels out — and nobody wants to work that out by hand at 10 p.m. with a flight in the morning.", "GoLo carries the ledger across all four rounds, keeps every format on its own line, and reduces the whole trip to the fewest payments that clear it. You show up Sunday night with one number, not a spreadsheet."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["One ledger for the whole trip. Do not settle nightly — it kills the story.", "Escalate the stakes and change format daily: purse, four-ball, shamble, quota.", "Adjust Sunday’s target by the ledger, one point per $20, capped at four.", "Agree formats, stakes, and desert rules in the group text before anybody flies."] }] },
      ],
    ),
  },
  {
    slug: "forty-rounds",
    category: "building",
    title: "We tested GoLo on 40 rounds before writing any marketing",
    excerpt:
      "What real groups broke, what they ignored completely, and the three features we cut because nobody used them.",
    date: "2026-04-23",
    readMins: 7,
    dek: "What real groups broke, what they ignored completely, and the three features we cut because nobody used them — with the numbers from all forty rounds.",
    crumb: "Build notes",
    author: "From the GoLo team",
    hero: { src: blogMedia.course, alt: "Golfers testing a scoring app during a real round", position: "50% 58%" },
    published: true,
    body: article(
      "We did not write a word of marketing until GoLo had been carried around a golf course forty times. Not demos, not internal testing at a desk — real Saturday rounds, real money, real groups who did not care about our roadmap. Here is what we learned, including the parts that were unflattering.",
      [
        { id: "only-question", title: "The only question that mattered", paragraphs: ["Everybody who has built a golf app believes people will enter scores. We wanted to know whether they would still be entering them on the 14th hole, four hours in, one beer deep, when the bet had gotten complicated. Nothing else we could build matters if the answer is no.", "So we tracked one thing above everything else: how many rounds made it all the way to a settled number, and where the rest fell apart."], blocks: [{ kind: "atAGlance", title: "THE TEST", items: [{ label: "ROUNDS", value: "40, over one season" }, { label: "GROUPS", value: "11, none of them ours" }, { label: "FORMATS", value: "6 different games" }, { label: "FEATURES CUT", value: "3" }] }, { kind: "table", head: ["What we counted", "N", "What it told us"], rows: [["Rounds started", "40", "Eleven groups, six formats"], ["Finished with a complete card", "31", "Score entry survives a round"], ["Abandoned before the turn", "6", "Five quit on holes 3 to 5"], ["Settled in the app", "27", "Four settled from memory"], ["Changed the bet mid-round", "9", "We had no way to let them"]] }, { kind: "p", html: "Forty rounds, one season, eleven groups. The nine that fell apart taught us more than the thirty-one that did not." }, { kind: "keyStat", value: "5 of 6", label: "Abandoned rounds that died on holes 3 through 5 — not from boredom, but because setup had spilled into the round. If your app is still asking questions on the 4th tee, you have already lost." }, { kind: "image", src: blogMedia.course, alt: "A group using GoLo during a real Saturday round", caption: "Forty rounds of watching people use it badly is worth more than four hundred hours of designing it well.", position: "50% 58%" }] },
        { id: "what-broke", title: "What broke", blocks: [{ kind: "cardGrid", items: [
          { title: "Setup was a conversation, not a screen", body: "We asked for course, tees, players, handicaps, format, stakes, and press rules before anybody hit. Groups answered half on the first tee and the rest on the 4th, badly. Setup is now one screen with sane defaults." },
          { title: "Nobody scores on the green they just putted on", body: "They score on the next tee, two holes later, or in the bar. Real groups backfill in bursts, so entry had to accept scores out of order without complaining." },
          { title: "The bet moved and we could not follow", body: "Nine of forty groups changed the wager mid-round — a press, a side bet, doubling the back. We treated the bet as a setting chosen once. That was our biggest mistake." },
          { title: "Gloves, rain, and one hand", body: "Everything worth tapping must be reachable with a thumb while the other hand holds a putter and scorecard. We rebuilt scoring twice for that alone." },
        ] }] },
        { id: "ignored", title: "What they ignored completely", paragraphs: ["Three things we were proud of got looked at once and never again."], blocks: [{ kind: "cardGrid", items: [
          { title: "Post-round stats", body: "Fairways hit, putts, strokes-gained approximations. Two players opened it. Everybody else already has a stats app they do not use either." },
          { title: "Streaks and badges", body: "We built a “four weeks in a row” streak. Nobody mentioned it, ever, including when it broke." },
          { title: "Following other groups", body: "A feed of buddies’ rounds. The group you play with is the group you already text, and they sent each other the settle screenshot anyway." },
        ] }, { kind: "quote", text: "Nobody wants a golf app. They want the argument to be over." }] },
        { id: "three-features", title: "The three features we cut", blocks: [{ kind: "steps", items: [
          { title: "GPS yardages", body: "Everybody already had a watch, laser, or course app. It doubled scope, ate battery, and improved nobody’s round. Cut." },
          { title: "Scorecard photo scanning", body: "A great demo. Groups spent longer correcting a misread 5 than typing four numbers and never opened it again. Cut." },
          { title: "In-app group chat", body: "The group already has a text thread with eight years of history. A second, worse one is not a feature. Cut." },
        ] }, { kind: "callout", title: "WHAT WE WOULD DO DIFFERENTLY", html: "We spent the first fifteen rounds asking groups what they thought and the last twenty-five just watching. The watching was worth more. Nobody could tell us setup was too long — they quietly stopped entering scores on the 4th tee and blamed themselves." }, { kind: "image", src: blogMedia.bunkerGreen, alt: "Players gathered around the settle-up screen after a round", caption: "The moment the app has to be good at is this one, and it lasts about ninety seconds.", position: "50% 58%" }] },
        { id: "what-we-kept", title: "What we kept", paragraphs: ["Three things got used in every single round, without prompting. The live bet state on the scoring screen, so anybody can glance and see where the money is. One-tap logging for a press or a carry, stamped to the hole it happened on. And a settle screen that turns four players’ debts into the fewest payments that clear them.", "That is the whole product, and it took forty rounds to be confident that it was. Everything else was us being interested in golf rather than paying attention to golfers."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["31 of 40 rounds finished. Five of the six early dropouts died on holes 3 to 5.", "Setup belongs on one screen. Anything you ask on the 4th tee, you do not get.", "Groups change the bet mid-round. Treating the wager as fixed was our worst call.", "We cut GPS, card scanning, and chat. Nobody has asked for any of them since."] }] },
      ],
    ),
  },
  {
    slug: "settle-up-screen",
    category: "product",
    title: "Building the settle-up screen, and why it took four tries",
    excerpt: "The math was easy. Turning five players’ debts into the fewest legible payments in a parking lot was not.",
    dek: "The math was the easy part. Turning five players’ debts into the fewest payments — legibly, in a parking lot, in ninety seconds — was not.",
    crumb: "Settle-up screen",
    author: "From the GoLo team",
    date: "2026-04-16",
    readMins: 5,
    hero: { src: blogMedia.turf, alt: "A golf ball on the final green before settling a round", position: "50% 46%" },
    published: true,
    body: article(
      "The settle-up screen is the only screen in GoLo that has to be perfect. Everything before it happens while people are playing golf and forgiving. This one happens in a parking lot, with five guys looking at a phone, and it either ends the round cleanly or starts the conversation we built the app to prevent. It took four attempts.",
      [
        { id: "math", title: "The math was the easy part", paragraphs: ["Adding up a Nassau with two presses, a skins game with carryovers, and a birdie bounty is arithmetic. Any computer does it instantly and correctly. What it produces, though, is a pile of pairwise debts — you owe Rick, Rick owes Mike, Mike owes you — and a five-player round with three games running can generate a dozen of them.", "Handing a group twelve separate debts is technically a complete answer and practically useless. Nobody is making twelve payments. So the real job is not the accounting, it is reducing the accounting to the smallest set of transfers that clears it."], blocks: [{ kind: "atAGlance", title: "THE PROBLEM, SIZED", items: [{ label: "PLAYERS", value: "5" }, { label: "BETS RUNNING", value: "Nassau, skins, birdies" }, { label: "SEPARATE DEBTS", value: "12" }, { label: "PAYMENTS NEEDED", value: "4" }] }] },
        { id: "netted", title: "One round, netted down", paragraphs: ["Here is a real Saturday: five players, three games running, everything totalled and then reduced. Net each player to a single number, then match the biggest debtor to the biggest creditor until nothing is left."], blocks: [{ kind: "table", head: ["Player", "Net", "What the screen says"], rows: [["You", "+$47", "Collect $35 from Rick, $12 from Dave"], ["Mike", "+$18", "Collect $9 from Dave, $9 from Tom"], ["Tom", "−$9", "Pay Mike $9"], ["Dave", "−$21", "Pay you $12, pay Mike $9"], ["Rick", "−$35", "Pay you $35"], ["Settled", "$0", "Four payments, twelve debts cleared"]] }, { kind: "p", html: "Check it: you collect $47, Mike collects $18, and the three debtors pay exactly what they owe. Nothing is approximated." }, { kind: "keyStat", value: "n − 1", label: "The most payments a group ever needs: one fewer than the number of players. Five players, four payments — every time, no matter how many bets were running. That is the ceiling we designed around." }, { kind: "image", src: blogMedia.turf, alt: "Five players reading the settle-up screen over one shoulder", caption: "The screen has about ninety seconds of attention and five people reading over one shoulder.", position: "50% 46%" }] },
        { id: "four-tries", title: "Four tries", blocks: [{ kind: "steps", items: [
          { title: "The ledger", body: "Every bet, every hole, in order. Completely accurate and fourteen rows long. Groups scrolled it, gave up, and asked somebody to say the number out loud." },
          { title: "The matrix", body: "A who-owes-whom grid. Elegant on a whiteboard, unreadable on a phone, and half the group read it in the wrong direction." },
          { title: "Net per player", body: "One plus or minus number each. Everybody understood it and immediately asked: so who pays who? We had skipped the actual task." },
          { title: "The payment list", body: "One line per transfer, written to the person holding the phone, with the reason one tap away. That is the version that shipped." },
        ] }, { kind: "quote", text: "The hard part was never the math. It was making somebody believe a number they had not watched arrive." }] },
        { id: "four-rules", title: "Four rules we ended up with", blocks: [{ kind: "cardGrid", items: [
          { title: "Fewest payments beats fullest accounting", body: "Both are correct. Only one gets done in a parking lot. The complete ledger still exists one tap down for the two people who want it." },
          { title: "Explain the payment nobody expected", body: "Netting creates transfers between players who never bet directly. That single explanatory line took longer to write than the algorithm took to build." },
          { title: "Never round quietly", body: "If the number is $8.50, the screen says $8.50. Tidying it is the fastest way to lose the room — somebody did the math and will notice." },
          { title: "Send it where the group already talks", body: "No in-app notifications about money. One tap sends the settled summary to the text thread the group has used for eight years." },
        ] }, { kind: "callout", title: "THE RULE WE WILL NOT BREAK", html: "No payment appears without its reason one tap away. A settle screen that cannot show its work is just a bill, and a bill from an app is exactly the thing a friendly bet does not need." }] },
        { id: "does-not-do", title: "What it deliberately does not do", paragraphs: ["GoLo does not move money. It does not hold a balance, take a cut, or process a payment. It works out who owes what and then gets out of the way — you settle in whatever your group already uses, cash included. That was a product decision before it was a legal one: the app trusted with the tally is not automatically the app you want holding the pot.", "Four versions to land on something that reads like a friend saying “you get thirty-five from Rick.” That is the whole screen. It just took us a while to stop showing off the accounting."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["A five-player round with three games running can produce a dozen debts — and never needs more than four payments.", "Net every player to one number, then match the biggest debtor to the biggest creditor.", "Write the screen as instructions to a person, not as a table of results.", "Show your work, never round quietly, and hand the summary to the group text."] }] },
      ],
    ),
  },
];

/** Newest first. The index and the "next post" links both read this order. */
export const postsByDate: Post[] = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const publishedPosts: Post[] = postsByDate.filter((p) => p.published);

/**
 * Only a published post resolves. The detail route 404s on everything else,
 * so a card that isn't written can't be reached by typing the URL either.
 */
export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug && post.published);
}

export function blogCategoryLabel(id: string): string {
  return blogCategories.find((c) => c.id === id)?.label ?? id;
}

/** The card that leads the index: the flagged post, or the newest one. */
export const featuredPost: Post | undefined =
  postsByDate.find((p) => p.featured) ?? postsByDate[0];

export type BlogFilter = { id: string; label: string; count: number };

/**
 * Chip data for the topic rail. Counts have to be of the cards the grid will
 * actually render, which means excluding whichever post is featured above it —
 * otherwise "Betting etiquette 2" sits over a grid holding one card.
 */
export function blogFilters(excludeSlug?: string): BlogFilter[] {
  const inGrid = postsByDate.filter((p) => p.slug !== excludeSlug);
  return [
    { id: "all", label: "All posts", count: inGrid.length },
    ...blogCategories.map((c) => ({
      id: c.id,
      label: c.label,
      count: inGrid.filter((p) => p.category === c.id).length,
    })),
  ];
}

/** Every topic id the URL accepts, "all" included. */
export const blogTopicIds: string[] = [
  "all",
  ...blogCategories.map((c) => c.id),
];

export const blogCountLine = `${postsByDate.length} posts · ${blogCategories.length} topics`;

/** "Elsewhere on GoLo" — the three cards under the newsletter band. */
export type BlogElsewhere = {
  label: string;
  blurb: string;
  cta: string;
  href: string;
};

export const blogElsewhere: BlogElsewhere[] = [
  {
    label: "Features",
    blurb:
      "Round setup, live scoring, presses and the settle-up — what the app does today.",
    cta: "SEE THE FEATURES",
    href: "/features",
  },
  {
    label: "The games",
    blurb:
      "Every format GoLo scores, with the rules and the settings that matter.",
    cta: "BROWSE THE GAMES",
    href: "/games",
  },
  {
    label: "FAQ",
    blurb:
      "Handicaps, settling up, and the honest answer on where the app is today.",
    cta: "READ THE FAQ",
    href: "/faq",
  },
];
