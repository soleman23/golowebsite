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
  return [
    { kind: "p", html: intro },
    ...sections.flatMap((section): Block[] => [
      { kind: "h2", id: section.id, text: section.title },
      ...(section.paragraphs ?? []).map(
        (html): Block => ({ kind: "p", html }),
      ),
      ...(section.blocks ?? []),
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
        { id: "three-bets", title: "It is three bets, not one", paragraphs: ["That is the only idea you need. A Nassau splits the round into three separate match-play wagers of equal value: the front nine, the back nine, and the overall eighteen. Each one is won by whoever is up when that segment ends. Ties push, and nobody pays.", "Match play means counting holes won, not strokes. Lose the 4th by six shots and it costs exactly one hole, the same as losing it by one. A triple bogey ends the hole, not the afternoon."] },
        { id: "five-dollar-example", title: "A $5 Nassau, played out", paragraphs: ["Two players, $5 a side, one press. You win the front comfortably, get run over on the back, and still walk off the 18th collecting money."], blocks: [
          { kind: "table", head: ["Bet", "Result", "You"], rows: [["Front nine", "You win", "+$5"], ["Back nine", "Tom wins", "−$5"], ["Overall 18", "You win", "+$5"], ["Back-nine press", "You win", "+$5"]] },
          { kind: "keyStat", value: "+$10", label: "Four bets, one number. Lose the back nine, win the press, and the day still goes your way." },
        ] },
        { id: "presses", title: "Presses: the part that gets people in trouble", paragraphs: ["A press is a brand-new bet, at the same stake, covering only the holes left in that segment. It is how the player who is losing buys a way back in, and also how a $5 Nassau quietly becomes a $40 afternoon. Presses can be pressed, which is where groups lose the thread entirely."], blocks: [{ kind: "callout", title: "DECIDE BEFORE THE ROUND", html: "Automatic presses at 2 down, or only when somebody asks? Both are fine. Finding out on the 14th which one you are playing is not." }, { kind: "quote", text: "Nobody argues about the golf. They argue about what the bet was." }] },
        { id: "house-rules", title: "The three rules your group plays differently", paragraphs: ["There is no governing body for the Nassau. Every group has house rules and every group assumes theirs are standard."], blocks: [{ kind: "cardGrid", items: [
          { title: "Do strokes count?", body: "Most groups play the low handicap off scratch and allocate the difference by the card’s stroke index." },
          { title: "Are presses automatic?", body: "A 2-down auto-press can roughly double the money at stake. On-request presses make the player say it." },
          { title: "Can you press on 18?", body: "A one-hole press is either a fair last chance or double-or-nothing. Decide before somebody needs it." },
        ] }] },
        { id: "settling", title: "Settling up without the parking-lot math", paragraphs: ["With four players and a couple of presses, six or eight small bets close in different directions. Say the format out loud, write the stake down, and mark each press when it is called instead of reconstructing it on the drive home.", "GoLo runs all three matches at once, tracks each press from the hole it opened, and nets the group down to one number after 18."] },
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
        { id: "outright", title: "One skin per hole, won outright", paragraphs: ["Every hole is worth one skin. The lowest score wins it, and the emphasis is on outright — if two players tie for low, nobody wins. That word is what separates skins from every other format.", "Skins does not care who is second. Make a 4 when the winner makes a 3 and it costs exactly what a 9 would have."] },
        { id: "carryover", title: "The carryover is the whole game", paragraphs: ["When a hole is tied, the skin does not disappear — it rides to the next hole and stacks. Four players, $5 a skin, and a quiet stretch of halves is how a small game turns into a big one."], blocks: [{ kind: "table", head: ["Hole", "Result", "Live pot"], rows: [["4", "Halved", "$30"], ["5", "Halved", "$45"], ["6", "Halved", "$60"], ["7", "Halved", "$75"], ["8", "Won outright", "$75 paid"]] }] },
        { id: "settings", title: "The settings that change everything", paragraphs: ["Skins looks like one game but plays like four depending on how you answer these."], blocks: [{ kind: "cardGrid", items: [
          { title: "Gross or net", body: "Net skins allocate handicap strokes hole by hole; gross skins favor the best player." },
          { title: "Carry or split", body: "Ties can roll the full pot or split the skin. Carrying creates the drama." },
          { title: "Validation", body: "Require par or better to collect a carry so a scrambled bogey cannot steal a large pot." },
          { title: "What happens after 18", body: "Split, chip off, or carry it to next week — choose before the round." },
        ] }, { kind: "quote", text: "Skins is quiet for an hour, and then somebody makes a birdie worth sixty dollars." }] },
        { id: "validation", title: "Validation, and the two-putt rule", paragraphs: ["Validation cuts down on flukes and makes the closing holes tighter. It also adds one more rule to remember, which is why plenty of groups skip it."] },
        { id: "tracking", title: "Keeping track without losing the thread", paragraphs: ["The failure mode is always the same: everybody remembers the $60 hole and nobody remembers holes 6 through 11. GoLo keeps the carry count live, applies net strokes, and nets the group at the end."] },
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
        { id: "rotation", title: "Everybody gets to be the wolf", paragraphs: ["The tee order rotates, so each player is Wolf on holes 1, 5, 9, and 13. The last two holes are a house rule.", "After the tee shots, the Wolf either takes a partner or plays alone against the other three. Partnered holes are two-on-two best ball."] },
        { id: "partner-timing", title: "Picking a partner, and the timing rule that matters", paragraphs: ["The Wolf does not watch all three drives and then shop around — he has to decide immediately after each one."], blocks: [{ kind: "steps", items: [
          { title: "First drive lands", body: "Take that player now or pass permanently." },
          { title: "Second drive lands", body: "Take the second player or pass again." },
          { title: "Third drive lands", body: "Take the third player or become Lone Wolf." },
        ] }] },
        { id: "lone-wolf", title: "When going alone is actually the right call", paragraphs: ["Lone Wolf is not bravado, it is arithmetic. You need to beat the best score of three players, so the question is how likely your good score is to hold up on this hole."], blocks: [{ kind: "cardGrid", items: [
          { eyebrow: "GOOD SPOT", title: "Short par 3", body: "One committed iron can beat three average ones." },
          { eyebrow: "GOOD SPOT", title: "Reachable par 5", body: "A strong drive creates an advantage you can protect." },
          { eyebrow: "BAD SPOT", title: "Long par 4", body: "Three opponents get three chances at par while you get one." },
          { eyebrow: "HIGH LEVERAGE", title: "Late and trailing", body: "The multiplier matters most when a normal win cannot close the gap." },
        ] }] },
        { id: "last-two", title: "The last two holes, and the blind wolf", paragraphs: ["Sixteen holes divide evenly by four and eighteen do not. Give 17 and 18 to the trailing players, the leader, or continue the rotation — but decide before the 17th tee.", "Blind Wolf means declaring alone before anybody hits, including you. It usually pays triple and is exactly why somebody will call it on 18."] },
        { id: "tracking", title: "Keeping the rotation straight", paragraphs: ["GoLo holds the order, records the partner as soon as you pick one, applies every multiplier, and nets four players to one number."] },
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
        { id: "three-points", title: "Three points, three different skills", blocks: [{ kind: "cardGrid", items: [
          { eyebrow: "1 POINT", title: "Bingo", body: "First ball to come to rest on the green." },
          { eyebrow: "1 POINT", title: "Bango", body: "Closest to the pin once every ball is on." },
          { eyebrow: "1 POINT", title: "Bongo", body: "First ball in the cup." },
        ] }] },
        { id: "order", title: "Order of play is the whole game", paragraphs: ["Every point depends on the oldest rule in golf: farthest from the hole plays first. That convention turns a format about distance into one about position.", "Each point moves $2 from each of the other three players, so a point is worth $6 to whoever wins it. Nobody took strokes."], blocks: [{ kind: "image", src: blogMedia.turf, alt: "Golf turf showing the different lies players face around a hole", caption: "The player who is away gets first claim on the next point.", position: "50% 62%" }] },
        { id: "why-it-works", title: "Why it works with a 6 and a 22 in the group", paragraphs: ["Most bets need handicaps to be fair, and handicaps are where arguments live. Bingo Bango Bongo is fair by construction: two points are decided by order, and order favors the player who is behind.", "Being 60 yards behind everybody is not a disadvantage here. It is a head start on bingo."], blocks: [{ kind: "keyStat", value: "54", label: "Points awarded over 18 holes — enough that one player rarely runs away." }] },
        { id: "rules", title: "The four rules worth settling first", blocks: [{ kind: "summary", title: "BEFORE THE FIRST TEE", items: ["Furthest away always plays first.", "Measure bango only after everyone is on.", "Put every ball in the hole — no concessions.", "Split or carry a genuine tie; decide which now."] }] },
        { id: "tracking", title: "Keeping 54 points straight", paragraphs: ["Three points a hole across 18 is 54 separate results. GoLo tallies all three, keeps a running total, and settles the point value at the end."] },
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
        { id: "what-is-a-press", title: "What a press actually is", paragraphs: ["It is a second bet, not an adjustment to the first one. The original match keeps running; the press runs beside it at the same stake over the holes left.", "A player 3 down on the back has nothing to play for over the last five. The press gives him a live match again."] },
        { id: "four-presses", title: "The four presses you will meet", blocks: [{ kind: "cardGrid", items: [
          { title: "The automatic press", body: "A new bet opens whenever a player falls 2 down. Clear, consistent, and easy to underestimate." },
          { title: "The request press", body: "The trailing player asks. Accepting is the norm when the stakes are still comfortable." },
          { title: "The vulture press", body: "Called after an opponent finds trouble. Legal in some groups, rude in most." },
          { title: "The revenge press", body: "A one-hole double-or-nothing on 18. Settle whether it exists before anyone needs it." },
        ] }] },
        { id: "auto-presses", title: "What auto-presses do to a $5 Nassau", paragraphs: ["One ordinary two-player Nassau with automatic presses at 2 down can create three extra bets without anybody doing anything unusual."], blocks: [{ kind: "table", head: ["Line", "Stake", "Exposure"], rows: [["Front", "$5", "$5"], ["Back", "$5", "$5"], ["Overall", "$5", "$5"], ["Three presses", "$5 each", "$15"]] }, { kind: "keyStat", value: "$30", label: "Maximum active exposure in a round that began as five-five-five." }] },
        { id: "friendly-rules", title: "Three rules that keep it friendly", blocks: [{ kind: "summary", title: "PRESS WITH A PURPOSE", items: ["A press belongs to the player who is behind.", "Call it before the next tee shot, not after seeing it.", "Cap the ladder when the total leaves anybody’s comfort zone."] }] },
        { id: "accept-or-decline", title: "When to say yes, and when to decline", paragraphs: ["Accepting a reasonable request is the default. The exception is stakes: “Happy to press, but that is the last one” is normal and protects everybody."] },
        { id: "write-it-down", title: "If it is not written down, it did not happen", paragraphs: ["Presses go wrong because a bet called on 13 is remembered as starting on 14. GoLo stamps each press to the hole it opened and nets everything, including presses on presses, at the end."] },
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
        { id: "index-vs-course", title: "The index is the number you own. The course handicap is the number you play.", paragraphs: ["Your handicap index measures demonstrated ability on a course of average difficulty. It travels with you and has a decimal. Nobody gets strokes equal to their index.", "Course handicap converts that ability into strokes for the exact tees and course. It is a whole number and decides who gives what."] },
        { id: "formula", title: "The formula, run twice", paragraphs: ["Course handicap = index × (slope rating ÷ 113) + (course rating − par). Slope measures difficulty for a bogey golfer, 113 is neutral, and rating minus par accounts for the tee’s actual difficulty."], blocks: [{ kind: "table", head: ["12.4 index", "Rating / slope", "Course handicap"], rows: [["Forward tees", "68.8 / 121", "11"], ["Back tees", "73.5 / 139", "14"]] }, { kind: "keyStat", value: "3", label: "Different strokes for the same player, same course, different tees." }] },
        { id: "stroke-allocation", title: "Where the strokes actually land", paragraphs: ["A course handicap of 14 does not mean subtracting 14 at the end. In hole-by-hole bets, strokes are allocated to specific holes by the stroke index printed on the card."], blocks: [{ kind: "callout", title: "THE CARD NUMBER", html: "“I’m a twelve” is a fact about the player. It is not the number that settles today’s hole." }] },
        { id: "playing-handicap", title: "In a bet, nobody plays their full number", paragraphs: ["Two conventions sit between course handicap and what the group plays: everyone can play off the low player, and team formats may apply a percentage allowance. Both stop the format from doing something silly."], blocks: [{ kind: "cardGrid", items: [
          { title: "Play off the low ball", body: "The low handicap becomes zero and everyone else receives the difference." },
          { title: "Use the format allowance", body: "Best ball and team games may use less than 100% of a course handicap." },
        ] }] },
        { id: "why-index-moves", title: "Why the index moves", paragraphs: ["Your index uses the best 8 differentials from the most recent 20 rounds. It updates when you post, which is why a good week moves it faster than one bad round.", "If nobody carries an official index, agree on informal numbers and write them down. Consistency settles more bets than false precision."] },
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
        { id: "innocent-first", title: "Rule out the innocent explanations first", blocks: [{ kind: "cardGrid", items: [
          { title: "He is improving", body: "Lessons and more play can make an index stale before the next revision catches up." },
          { title: "The format suits him", body: "A volatile player can be excellent at skins while remaining an honest 18." },
          { title: "Small sample", body: "Two hot Saturdays are golf. A season of net 68s is a pattern." },
          { title: "Different tees or conditions", body: "Course handicaps and weather can make the same index look different." },
        ] }] },
        { id: "the-math", title: "The math that does the arguing for you", paragraphs: ["Handicaps make a checkable prediction about how often a player should beat his own number. Record net results rather than impressions."], blocks: [{ kind: "table", head: ["Saturday", "Net score", "Against par"], rows: [["1", "67", "−5"], ["2", "69", "−3"], ["3", "68", "−4"], ["4", "66", "−6"]] }, { kind: "quote", text: "Nobody called anybody a cheat. This is four Saturdays of arithmetic, and it makes its own case." }] },
        { id: "patterns", title: "The patterns worth noticing", blocks: [{ kind: "summary", title: "LOOK FOR REPEATED SIGNALS", items: ["Tournament or money rounds are consistently better than posted casual rounds.", "Bad scores appear in the handicap record, while good scores go missing.", "The index never moves despite a long run of net scores below par.", "The player knows exactly which holes receive strokes but cannot explain recent postings."] }] },
        { id: "four-fixes", title: "Four fixes that require no confrontation", paragraphs: ["Make each one a group rule, not a rule about one person."], blocks: [{ kind: "cardGrid", items: [
          { title: "Post before the next round", body: "Everyone posts every acceptable score by the same deadline." },
          { title: "Use a rolling group number", body: "Adjust an informal playing handicap from the group’s last five rounds." },
          { title: "Cap net wins", body: "Limit how far below net par one round can pay in the main bet." },
          { title: "Mix the formats", body: "Use gross side games and match play so one number cannot dominate every wager." },
        ] }] },
        { id: "say-something", title: "If you do have to say something", paragraphs: ["Say it privately, once, and about the bet rather than the man: “Your net has been beating par most weeks, so I think your number is stale — want to play off 14 and see?”", "Keep your own house clean. Post the 79 as promptly as the 94."] },
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
        { id: "different-questions", title: "They answer different questions", paragraphs: ["A rangefinder answers “how far is that, exactly?” A GPS watch answers “roughly where am I?” without taking your glove off.", "Both are legal for handicap purposes when measuring distance only. Switch slope off in competition.", "One is precise and slower, the other quick and approximate, and only one of those problems costs you shots."], blocks: [{ kind: "table", head: ["", "Laser", "GPS watch"], rows: [["Shows", "Exact target", "Front / middle / back"], ["Speed", "Aim and shoot", "Glance"], ["Best for", "Flags and hazards", "Most approach shots"], ["Weakness", "Pace and shaky hands", "Approximate targets"]] }] },
        { id: "saves-a-stroke", title: "What actually saves you a stroke", paragraphs: ["Not the third decimal place. Four habits do almost all the work, and three are free."], blocks: [{ kind: "cardGrid", items: [
          { title: "Know the back number", body: "The back edge prevents the short-sided long miss." },
          { title: "Club for the real carry", body: "Shoot the bunker or creek, not only the flag." },
          { title: "Use one number and hit", body: "The device cannot help if the routine adds forty seconds." },
          { title: "Track your common miss", body: "Front/middle/back is enough when dispersion is thirty yards." },
        ] }, { kind: "quote", text: "Precision you cannot use is just a heavier golf bag." }] },
        { id: "buying-advice", title: "Buying advice for the $10 crowd", blocks: [{ kind: "summary", title: "THE HONEST SHORTLIST", items: ["Buy a watch if pace and no-fuss yardages matter most.", "Buy a laser if hazards, doglegs, and exact flags change your club choice.", "Do not pay for features your group cannot use in competition.", "The best device is the one you consult before every approach without slowing anyone down."] }] },
        { id: "what-we-carry", title: "What we carry", paragraphs: ["Watch on the wrist for every shot, and one laser in the group for the few times somebody genuinely needs the flag. That covers about ninety-five percent of it and keeps the round moving.", "Keep the yardage device separate from the scoring device. A phone doing GPS all afternoon is a phone that may be dead when the bet needs settling."] },
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
        { id: "wind-multiplier", title: "Wind is a handicap multiplier", paragraphs: ["Hard wind does not add the same number of shots to everybody. It adds a few to the good player and a pile to everybody else.", "A low handicap flights the ball down and accepts 30 feet. A 20-handicap cannot do that on command, so misses get bigger and one hole into the teeth becomes a 9.", "The format does the real work. The same two cards can produce a blowout or a one-hole match depending on how you count them."] },
        { id: "four-ways", title: "One windy round, scored four ways", paragraphs: ["You play off 12, Rick plays off 20, and it blows all afternoon. You shoot 88. Rick shoots 104, with twelve of those shots on three holes."], blocks: [{ kind: "table", head: ["Format", "What the blow-ups cost", "Result"], rows: [["Gross stroke", "All 16 shots", "Blowout"], ["Net stroke", "Most of the damage", "Large gap"], ["Match play", "Three holes", "Close match"], ["Quota", "Three missed scoring chances", "Recoverable"]] }, { kind: "callout", title: "THE FORMAT IS THE HANDICAP", html: "Nothing changed except the counting. Rick’s three disasters cost twelve shots in stroke play and exactly three holes in match play." }] },
        { id: "formats", title: "Four formats that survive 30 miles an hour", blocks: [{ kind: "cardGrid", items: [
          { title: "Match play", body: "A 9 loses one hole, not the entire afternoon." },
          { title: "Stableford quota", body: "A zero-point disaster is contained and the next hole starts clean." },
          { title: "Skins", body: "Each hole resets and carryovers turn survival into opportunity." },
          { title: "Team best ball", body: "One player can absorb a bad hole while the partner keeps the match alive." },
        ] }, { kind: "quote", text: "Match play does not care how badly you lost the hole. In a gale, that is the most generous rule in golf." }] },
        { id: "first-tee", title: "Settle these on the first tee, not the sixth", blocks: [{ kind: "summary", title: "WIND-DAY HOUSE RULES", items: ["Which tees are in play if a hole becomes unsafe or absurd.", "Whether a lost ball in native grass uses a local drop.", "Whether unfinished holes cap at net double bogey.", "How morning and afternoon rounds roll into one day total."] }] },
        { id: "one-number", title: "Thirty-six holes, one number", paragraphs: ["Two rounds a day, a different game each time, and a scorecard that has been through the ocean make reconstruction impossible by dinner.", "GoLo keeps morning and afternoon on separate lines and rolls the day into one number. Let the wind be the only thing you argue about."] },
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
        { id: "one-ledger", title: "One ledger, four days", paragraphs: ["Stop settling every night and keep one number per player for the whole weekend. Nightly settling creates four unrelated afternoons; a trip ledger creates a tournament, and a tournament has a story.", "Over four formats the 19 handicap gets two days that suit him rather than trying to survive the 6 every morning."] },
        { id: "ladder", title: "The four-day ladder", blocks: [{ kind: "table", head: ["Day", "Format", "Stake"], rows: [["Thursday", "Team best ball", "$5 a side"], ["Friday", "Skins + greenies", "$5 each"], ["Saturday", "Two-man Nassau", "$10 / $10 / $10"], ["Sunday", "Adjusted quota", "$20 finish"]] }, { kind: "keyStat", value: "1", label: "Running number per player. Nobody pays until Sunday." }] },
        { id: "day-four", title: "Why Day 4 has to be different", paragraphs: ["By Sunday the ledger has a leader and a straggler. An adjusted quota gives both something to play for: the leader cannot hide and the player down $60 can still make a meaningful move."], blocks: [{ kind: "quote", text: "A trip where two guys stop caring on Saturday is a trip that got the last round wrong." }] },
        { id: "desert-rules", title: "Desert rules worth agreeing on Thursday", blocks: [{ kind: "cardGrid", items: [
          { title: "Native-area drop", body: "One stroke and a lateral drop, or stroke-and-distance? Pick one rule for all four rounds." },
          { title: "Rake-and-place", body: "Desert bunkers can be footprints by noon. Decide what counts as abnormal." },
          { title: "Tee selection", body: "Rotate or use a blended yardage so the same hitters do not own every day." },
          { title: "Daily cap", body: "Keep one bad round from making Sunday irrelevant." },
        ] }] },
        { id: "settle-once", title: "Settle once, and settle small", paragraphs: ["Eight players over four days create twenty-odd pairwise debts when settled naively and usually five or six payments after netting.", "GoLo carries the ledger across all four rounds, keeps every format on its own line, and reduces the trip to the fewest payments that clear it."] },
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
        { id: "only-question", title: "The only question that mattered", paragraphs: ["Would people still enter scores on the 14th hole, four hours in, one beer deep, when the bet had gotten complicated? Nothing else matters if the answer is no.", "We tracked how many rounds made it to a settled number and where the rest fell apart."], blocks: [{ kind: "keyStat", value: "31 / 40", label: "Rounds that reached a clean final settlement. The nine failures taught us more." }] },
        { id: "what-broke", title: "What broke", blocks: [{ kind: "cardGrid", items: [
          { title: "Setup took too long", body: "Every extra choice before the first tee made abandonment more likely." },
          { title: "Presses lost their start hole", body: "A press without a timestamp became a parking-lot argument." },
          { title: "One phone became a bottleneck", body: "The scorer needed a fast entry path while everybody else needed a glanceable state." },
          { title: "Debts looked like accounting", body: "Correct pairwise math still felt untrustworthy when nobody could see how it arrived." },
        ] }] },
        { id: "ignored", title: "What they ignored completely", paragraphs: ["Three things we were proud of got looked at once and never again."], blocks: [{ kind: "summary", title: "BUILT, THEN CUT", items: ["A detailed round recap with charts.", "Player profile badges and streaks.", "A pre-round strategy screen nobody opened on the tee."] }, { kind: "quote", text: "Nobody wants a golf app. They want the argument to be over." }] },
        { id: "three-features", title: "The three features we cut", blocks: [{ kind: "image", src: blogMedia.bunkerGreen, alt: "A golf green used during field testing", caption: "Real rounds made the product smaller and clearer.", position: "50% 58%" }] },
        { id: "what-we-kept", title: "What we kept", paragraphs: ["Three things got used every round: the live bet state, one-tap logging for a press or carry stamped to its hole, and a settle screen that turns four players’ debts into the fewest payments.", "That is the whole product, and it took forty rounds to become confident in it. Everything else was us being interested in golf rather than paying attention to golfers."] },
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
        { id: "math", title: "The math was the easy part", paragraphs: ["Adding a Nassau with two presses, skins with carryovers, and a birdie bounty is arithmetic. What it produces is a pile of pairwise debts — you owe Rick, Rick owes Mike, Mike owes you.", "Twelve separate debts are technically complete and practically useless. The real job is reducing the accounting to the smallest transfers that clear it."] },
        { id: "netted", title: "One round, netted down", paragraphs: ["Five players, three games running: net each player to one number, then match the biggest debtor to the biggest creditor until nothing is left."], blocks: [{ kind: "table", head: ["Player", "Net", "Transfer"], rows: [["You", "+$47", "Collect $35 + $12"], ["Mike", "+$18", "Collect $18"], ["Rick", "−$35", "Pay you $35"], ["Tom", "−$18", "Pay Mike $18"], ["Dave", "−$12", "Pay you $12"]] }, { kind: "callout", title: "CHECK THE TOTAL", html: "You collect $47, Mike collects $18, and the three debtors pay exactly $65. Nothing is approximated." }] },
        { id: "four-tries", title: "Four tries", paragraphs: ["The hard part was making somebody believe a number they had not watched arrive."], blocks: [{ kind: "cardGrid", items: [
          { eyebrow: "TRY 1", title: "The debt matrix", body: "Correct, complete, and unreadable with five people around one phone." },
          { eyebrow: "TRY 2", title: "One net number", body: "Simple, but nobody could see who should actually pay whom." },
          { eyebrow: "TRY 3", title: "Payment list", body: "Actionable, but the source bets disappeared and trust fell with them." },
          { eyebrow: "TRY 4", title: "Payments with receipts", body: "The fewest transfers, plus a drill-down to every bet behind each net." },
        ] }] },
        { id: "four-rules", title: "Four rules we ended up with", blocks: [{ kind: "summary", title: "THE FINAL SCREEN", items: ["Lead with a human sentence: who pays whom and how much.", "Show the net total before the transfer list.", "Keep every underlying bet available one tap away.", "Never celebrate a payment or make a friendly loss feel like a casino result."] }] },
        { id: "does-not-do", title: "What it deliberately does not do", paragraphs: ["GoLo does not move money, hold a balance, take a cut, or process a payment. It works out who owes what and gets out of the way — settle with whatever the group already uses, cash included.", "Four versions to land on something that reads like a friend saying “you get thirty-five from Rick.” That is the whole screen."] },
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
