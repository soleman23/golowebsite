/**
 * Blog content. Post bodies are a typed block union rather than markup, so
 * ProseBlocks can render them and adding a post is a data edit — never a new
 * page file. The index, the topic counts, the JSON-LD and the sitemap are all
 * generated from `posts`, so publishing is a one-line change.
 *
 * Publication is controlled per record. An unpublished post appears nowhere:
 * no index card, no route, no metadata, no related rail, no sitemap entry. Its
 * title and excerpt are claims the site would be making in public, so a draft
 * stays out of sight until every one of them has been checked.
 */

import type { TableData } from "@/components/ui/DataTable";
import { siteConfig } from "@/lib/siteConfig";

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
  | ({ kind: "table" } & TableData)
  | { kind: "keyStat"; value: string; label: string }
  | { kind: "image"; src: string; alt: string; caption?: string; position?: string }
  | {
      kind: "cardGrid";
      title?: string;
      items: { title: string; body: string; eyebrow?: string }[];
    }
  | { kind: "summary"; title: string; items: string[] }
  /**
   * Governing-body pages behind a post's rule statements (handicap formula,
   * allowances, maximum hole score). Only for rules, not for opinion or house
   * customs, and only pages that say what the post says.
   */
  | { kind: "sources"; items: { label: string; href: string }[] };

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
  /** Search snippet, when the dek runs past ~155 characters. Falls back to the dek. */
  metaDescription?: string;
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
  /**
   * ISO date of the last substantive change — facts, rules, product claims or
   * a worked example — never typos, photos or layout. Drives the visible
   * "Updated" date, Article dateModified, article:modified_time and the
   * sitemap's lastmod. Leave it off a post that hasn't changed since `date`.
   */
  updated?: string;
  readMins: number;
  /**
   * Undefined until the photo is actually in public/images/blog/. The card
   * renders a flat panel in its place rather than a broken <img>.
   */
  hero?: {
    src: string;
    alt: string;
    /**
     * object-position wherever the frame is narrower than the photo — the card
     * thumbnail and, without a `mobile` frame, the phone hero. Wide heroes
     * always anchor right, where the 21:9 photos keep their subject.
     */
    position?: string;
    /**
     * 4:5 frame for the hero below 768px, where the copy sits at the foot: the
     * same scene with the subject in its top 40%. Without one, phones crop the
     * 21:9 photo to `position` and the subject can end up behind the title.
     */
    mobile?: string;
    /** 1200x630 share card cut from the hero. Without one the hero is shared. */
    og?: string;
  };
  /**
   * Slugs for the "Keep reading" rail, in order, ahead of the same-topic and
   * newest fill. For posts the default would pass over: the newest-first fill
   * otherwise keeps sending readers to the same recent posts. Unpublished
   * slugs are skipped.
   */
  related?: string[];
  /** false = absent from /blog and every rail, 404 on the detail route. */
  published: boolean;
  featured?: boolean;
  body: Block[];
};

export type BlogCategory = { id: BlogCategoryId; label: string };

export const blogCategories: BlogCategory[] = [
  { id: "rules", label: "Game rules & how-to" },
  { id: "etiquette", label: "Side-game etiquette" },
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
  turf: "/images/turf-1600.webp",
  bunkerFairway: "/images/blog/bunker-fairway.webp",
  bunkerGreen: "/images/blog/bunker-green.webp",
} as const;

export const posts: Post[] = [
  {
    slug: "golf-games-for-3-players",
    category: "rules",
    title: "Golf games for 3 players: when your fourth bails",
    metaDescription:
      "The fourth cancelled and Wolf is off. Which games work for three: Best Score, skins, a head-to-head Nassau or Bingo Bango Bongo, and what the money games can cost.",
    excerpt:
      "The fourth texts at 6:40 a.m. Wolf needs four. Here is what three players can play instead, and what it costs each of them.",
    dek: "Three players breaks the usual foursome games. Choose by how far apart the handicaps are, how much counting you want, and how much the afternoon should be able to cost.",
    crumb: "Games for three",
    author: "From the GoLo team",
    // Pair 3 of the 16-idea list. GoLo facts: capabilities.ts game-library
    // (Wolf takes exactly four) and team-play is four only; golo main 2237c1d
    // SetupWizard.jsx GAME_DEFS (every other game takes two or more; Best
    // Score's Winner takes all / Top 2 / Top 3 split), skins.js, nassau.js
    // calculateNassauGroup, strokePurse.js distributePot.
    date: "2026-10-31",
    readMins: 6,
    hero: {
      src: "/images/blog/golf-games-for-3-players-hero.webp",
      mobile: "/images/blog/golf-games-for-3-players-mobile.webp",
      og: "/images/blog/golf-games-for-3-players-og.jpg",
      alt: "Three golfers walking off a tee box together in early morning light, seen from behind",
      position: "80% 50%",
    },
    related: ["golf-games-for-2-players", "bingo-bango-bongo", "skins-carryover"],
    published: true,
    body: article(
      "The fourth texts at 6:40 a.m.: kid’s sick, sorry, next week. The tee time is at 7:30 and the plan was Wolf. Wolf, as most groups play it, needs four. So does any game built on two pairs. Three players can still have a good game; it just has to be one that works with an odd number, and somebody has to pick it in the parking lot.",
      [
        {
          id: "what-changes",
          title: "What changes with three",
          paragraphs: [
            "Partner games stop working. Nobody can play two against two, and a game that rotates partners needs a fourth to rotate through. In GoLo, Wolf takes exactly four players and Team Play takes exactly four, so both are off.",
            "Most other games are fine with three, and some get better. Skins has one fewer score on each hole that can tie the low one, so a hole is a little more likely to be won outright. And every player has only two opponents, so each hole moves less money than it would in a foursome.",
          ],
          blocks: [
            {
              kind: "atAGlance",
              title: "THREE PLAYERS, AT A GLANCE",
              items: [
                { label: "OFF THE LIST", value: "Wolf and two-against-two games" },
                { label: "SIMPLEST", value: "Best Score: one total, one amount" },
                { label: "EVERY HOLE COUNTS", value: "Skins, two opponents a hole" },
                { label: "HEAD TO HEAD", value: "A Nassau: three pairings" },
              ],
            },
          ],
        },
        {
          id: "choose",
          title: "Pick by the group you actually have",
          blocks: [
            { kind: "cardGrid", items: [
              { eyebrow: "BEST SCORE", title: "Three similar players who want it simple", body: "Everyone puts in the same amount and the lowest total takes it. One number to agree on, one result at the end, nothing to track along the way." },
              { eyebrow: "SKINS", title: "You want every hole to be worth something", body: "Each hole is its own prize, and a bad hole costs only that hole. With carryovers on, a few ties build a hole worth playing for." },
              { eyebrow: "NASSAU", title: "You’d rather play matches than a total", body: "Played head to head, three players make three pairings. Each player plays two Nassaus, one against each opponent: front, back and overall." },
              { eyebrow: "BINGO BANGO BONGO", title: "The handicaps are far apart", body: "First on the green, closest once everyone is on, first in the hole. Order of play does more than length, so a high handicap wins points." },
            ] },
            { kind: "p", html: "The <a href=\"/blog/bingo-bango-bongo\">Bingo Bango Bongo post</a> explains why the order of play matters more than length. If the handicaps are far apart and you choose Best Score, skins or a Nassau, play it net. GoLo gives each player their full course handicap and places the strokes by the card’s stroke index, so a 6, a 14 and a 24 can share a game that is still decided on the course." },
          ],
        },
        {
          id: "cost",
          title: "What each one can cost",
          paragraphs: [
            "Three players means two opponents each, which changes the numbers. Here is the most one player can lose at some ordinary amounts, as GoLo scores each game.",
          ],
          blocks: [
            {
              kind: "table",
              head: ["Game", "Amount", "Most you can lose"],
              rows: [
                ["Best Score", "$5 each", "$5"],
                ["Skins", "$2 a skin", "$36"],
                ["Nassau", "$2 a match", "$12"],
              ],
            },
            { kind: "p", html: "Best Score here pays one place. The skins are standard skins with carryovers on: each of the other two pays the winner $2, so a skin is worth $4 to whoever takes it, and losing all eighteen costs $36. Extra skin types add to that. The Nassau is head to head: each player has two opponents and three matches against each, so losing all six costs $12, and GoLo’s Nassau doesn’t take presses, so that is its ceiling in the app. Best Score can only cost the amount you put in. Bingo Bango Bongo depends on how your group pays its points, so it isn’t in the table." },
          ],
        },
        {
          id: "best-score-split",
          title: "The split that only works with three",
          paragraphs: [
            "<a href=\"/games/best-score\">Best Score</a> in GoLo can pay one place, or split between the top two or three. With three players, the top-two split does something useful: first and second share the total equally, so the round comes down to not finishing last.",
            "At $5 each, the total is $15. Winner takes all: the lowest score finishes $10 up and the other two $5 down. Top two split: first and second each get $7.50, so both finish $2.50 up and last place is $5 down. GoLo splits tied places evenly: if the two players behind the leader tie under the top-two split, they share second place’s $7.50, $3.75 each, so each finishes $1.25 down and the leader $2.50 up. A top-three split with three players just hands everyone their $5 back.",
          ],
          blocks: [
            { kind: "quote", text: "With three players, “don’t finish last” is a perfectly good game." },
          ],
        },
        {
          id: "one-round",
          title: "One round, from setup to settled",
          paragraphs: [
            "Here is an invented threesome in GoLo. Mike sets up the round, picks the course and tees, adds Jess and Tom, and chooses two games: $2 net standard skins with carryovers on, and $5 Best Score, net, top two split. One scorer enters the gross scores after each hole, and GoLo applies the strokes for both games.",
            "By the 18th all eighteen skins have been won: Mike seven, Jess six, Tom five. On net totals Jess is lowest, Tom second and Mike last.",
          ],
          blocks: [
            {
              kind: "table",
              head: ["Player", "Skins", "Best Score", "Net"],
              rows: [
                ["Mike", "+$6.00", "−$5.00", "+$1.00"],
                ["Jess", "$0.00", "+$2.50", "+$2.50"],
                ["Tom", "−$6.00", "+$2.50", "−$3.50"],
                ["Total", "$0.00", "$0.00", "$0.00"],
              ],
            },
            { kind: "p", html: "Mike’s seven skins are worth $28 and he pays $2 for each of the other eleven, so he’s $6 up in skins. Jess’s six skins and Tom’s five work the same way. Mike also finished last in Best Score, so the two games nearly cancel for him. Tom pays Jess $2.50 and Mike $1.00, and the round is settled. GoLo shows that list at the end; the money moves outside the app." },
          ],
        },
        {
          id: "not-in-golo",
          title: "Nines, the threesome game GoLo doesn’t score",
          paragraphs: [
            "Nines, also called 5-3-1, was made for three. Each hole is worth nine points: five to the low score, three to the middle, one to the high. Ties share: two tied for low take four each and the third gets one; two tied for high take two each behind the five; all three tied take three each. At the end, players settle the difference in points at an agreed amount a point.",
            "It’s a good game, and GoLo doesn’t score it. If your group wants Nines, keep it on paper and run Best Score or skins in GoLo beside it, or keep the whole round on paper. Don’t expect the settle-up list to include a game the app didn’t score.",
          ],
        },
        {
          id: "next-week",
          title: "When the fourth comes back",
          paragraphs: [
            "Next week the foursome is back, and Wolf is available again. Until then, pick one game, say the amount and the scoring basis out loud, and play. <a href=\"/blog/golf-games-for-2-players\">Games for two</a> covers the regular twosome, and the <a href=\"/games\">game guides</a> have the rules for each format.",
            "When you’ve chosen, <a href=\"/how-it-works\">see one round from setup to settle-up</a> or <a href=\"/#get\">get GoLo for the next one</a>.",
          ],
          blocks: [
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Wolf and two-against-two games need four. In GoLo, Wolf and Team Play take exactly four players.",
              "Best Score, skins, a head-to-head Nassau and Bingo Bango Bongo all work with three.",
              "With two opponents each, $2 skins can cost $36 and a $2 Nassau $12. Best Score costs only the amount put in.",
              "Best Score’s top-two split makes the round about not finishing last. Nines works well for three, but GoLo doesn’t score it.",
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "side-games-for-beginners",
    category: "etiquette",
    title: "Golf side games for beginners: start with one bet, not five", // vocab-ok: exact article headline requested by the owner on 2026-10-30 (16-idea list); the body uses house vocabulary.
    metaDescription:
      "A first side game for a group with new golfers: one format, a small amount, net or gross, a tie rule. What to leave off, and when to add a second game.",
    excerpt:
      "Somebody suggests a Nassau with presses, skins with carries and a birdie on top. Half the group has played six rounds. Start smaller.",
    dek: "A new golfer can enjoy a game with something on it. Five at once is a different matter. Agree on one, make it small, and add the next only when everyone can explain the first.",
    crumb: "Your first side game",
    author: "From the GoLo team",
    // Pair 3 of the 16-idea list. GoLo facts: capabilities.ts handicap-strokes,
    // guests, game-library; golo main 2237c1d SetupWizard.jsx GAME_DEFS (Best
    // Score splits) and strokePurse.js distributePot (equal places, even ties).
    date: "2026-10-31",
    readMins: 6,
    hero: {
      src: "/images/blog/side-games-for-beginners-hero.webp",
      mobile: "/images/blog/side-games-for-beginners-mobile.webp",
      og: "/images/blog/side-games-for-beginners-og.jpg",
      alt: "Four golfers chatting on a first tee beside a bag stand in soft morning light",
      position: "80% 50%",
    },
    related: ["golf-games-for-2-players", "first-tee-checklist", "who-pays-first"],
    published: true,
    body: article(
      "Two of your foursome have played golf for years. The other two started this spring. On the first tee, one of the regulars suggests the usual: a Nassau, presses, skins with carryovers, a dollar a birdie and greenies on the par 3s. The two new players nod, because nodding is easier than asking what a press is. By the 6th they have no idea what they owe, and by the 12th they have stopped asking.",
      [
        {
          id: "one-game",
          title: "Start with one game",
          paragraphs: [
            "The problem with five games at once isn’t the arithmetic. An app can do that. It’s the agreement. Every extra game is another set of rules that every player has to understand before the first tee shot, and a new player is the least likely to say they don’t.",
            "One game means one thing to understand, one amount to agree on and one result at the end. It also means that when somebody asks “what’s going on?” on the 9th, there is a one-sentence answer.",
          ],
          blocks: [
            {
              kind: "atAGlance",
              title: "A FIRST GAME, AT A GLANCE",
              items: [
                { label: "HOW MANY GAMES", value: "One" },
                { label: "AMOUNT", value: "Small enough that nobody minds losing it" },
                { label: "SCORING", value: "Net if handicaps differ, agreed first" },
                { label: "TIES", value: "A rule chosen before anyone ties" },
              ],
            },
          ],
        },
        {
          id: "four-decisions",
          title: "Five decisions, made before the first tee shot",
          blocks: [
            { kind: "steps", items: [
              { title: "The format", body: "Best Score is the easiest to explain: everyone puts in the same amount and the lowest total takes it. Nothing to track hole by hole, nothing to call on the course." },
              { title: "The amount", body: "Pick a number the newest player would happily lose. Five dollars is plenty, and the amount is the same for everyone." },
              { title: "Net or gross", body: "With new players in the group, play net, so handicap strokes are part of the score. Gross between a 9 and a 32 isn’t a game, it’s a forecast." },
              { title: "Ties", body: "Say what happens to a tie before there is one. In GoLo, Best Score splits a tied place evenly, which is the simplest rule there is." },
              { title: "Picking up", body: "New players pick up, and they should. Agree what goes on the card when they do, say double par, so every player has a number on every hole. Best Score compares totals, and GoLo won’t settle it while one card is missing holes." },
            ] },
            { kind: "callout", title: "SAY IT OUT LOUD", html: "“Five dollars each, Best Score, net, ties split.” If the newest player in the group can repeat it back, the game is ready." },
          ],
        },
        {
          id: "split",
          title: "Two winners is friendlier than one",
          paragraphs: [
            "GoLo’s <a href=\"/games/best-score\">Best Score</a> can pay one place or split between the top two or three. For a foursome with new players, the top-two split is worth a look.",
            "At $5 each the total is $20. Winner takes all: the low net score finishes $15 up and the other three are $5 down. Top two split: first and second each get $10, so both finish $5 up and third and fourth are $5 down. Nobody can lose more than $5 either way. Two people win, and a new player who has a decent back nine has a real chance of being one of them.",
          ],
        },
        {
          id: "handicaps",
          title: "Handicaps for players who don’t have one yet",
          paragraphs: [
            "Net scoring needs a number for everyone. A player with a Handicap Index enters it, and GoLo works out the course handicap for the tees and places the strokes by stroke index. A guest can be added with a name and an index, no account needed.",
            "A new player often has no index yet. The group can agree on an index for the day, entered like any other, and GoLo turns it into strokes for the tees. Agree on it before the round, not after the front nine. If nobody wants to guess, play the first round gross and for nothing, and start the game once the new player has a number. In GoLo everyone plays from the same set of tees, so a new player moving up to the forward tees isn’t something the app handles yet. The <a href=\"/blog/index-vs-course-handicap\">index-versus-course-handicap guide</a> explains what the number means, and <a href=\"/blog/net-vs-gross-scoring\">net against gross</a> shows how much the choice can change.",
          ],
          blocks: [
            { kind: "quote", text: "The number you agree on the first tee is fair. The number you argue about on the 10th tee isn’t." },
          ],
        },
        {
          id: "leave-off",
          title: "What to leave off for now",
          blocks: [
            { kind: "cardGrid", items: [
              { title: "Presses", body: "A press adds a new match partway through. It’s the quickest way for a small game to become a confusing one." },
              { title: "Skins carryovers", body: "Carries turn quiet holes into big ones, which is the fun of them and the trouble with them." },
              { title: "Birdie and greenie skins", body: "Extra skin types pay for things a new player rarely does. That’s a reason to wait, not a reason to add them." },
              { title: "A second game", body: "Two games means two sets of rules and two amounts to add together. Play the first one a few times before you stack another on it." },
            ] },
            { kind: "p", html: "When the group is ready for them, <a href=\"/blog/pressing\">the pressing post</a> and <a href=\"/blog/skins-carryover\">how a $5 skin becomes a $60 hole</a> explain the two that cause the most confusion." },
          ],
        },
        {
          id: "next",
          title: "When to add the next game",
          paragraphs: [
            "Add a second game when every player can explain the first without help, usually after a few rounds. A sensible second step is $1 standard skins with carryovers off: each hole is its own prize, a tied hole goes to nobody, and a hole won by someone else costs you $1. In a foursome, a hole you win is worth $3.",
            "After that, try carryovers on, or a Nassau without presses. The <a href=\"/blog/golf-games-for-2-players\">games-for-two post</a> walks through skins and a Nassau at small amounts, and <a href=\"/blog/first-tee-checklist\">the first-tee checklist</a> lists everything worth agreeing once the games stack up.",
          ],
          blocks: [
            { kind: "p", html: "Whatever you play, settle it before anyone leaves, and be generous with a new player’s money: <a href=\"/blog/who-pays-first\">the unwritten rules of settling up</a> cover that. GoLo keeps the card, applies the strokes and nets the games into a short who-owes-whom list; the money moves outside the app. <a href=\"/how-it-works\">See one round from setup to settle-up</a>, or <a href=\"/#get\">get GoLo for the next one</a>." },
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Start with one game. Best Score is the easiest to explain: same amount each, lowest total takes it.",
              "Keep the amount small, play net when handicaps differ, and agree what a tie does before there is one.",
              "In a foursome, Best Score’s top-two split means two winners and nobody losing more than the amount put in.",
              "Leave presses, carryovers and extra skin types for later. Add a second game when everyone can explain the first.",
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "golf-games-for-2-players",
    category: "rules",
    title: "Golf games for 2 players: make your usual match worth something",
    metaDescription:
      "Choose a golf game for two players: Best Score, skins or a Nassau. Simple example amounts, clear tie rules, and one scorecard to keep the round straight.",
    excerpt:
      "Same partner, same Saturday tee time. Start with one small game, then decide whether you want the whole round or every hole to matter.",
    dek: "One round-long contest, a fresh chance on each hole, or three matches in a Nassau. Pick the game that fits the way you and your regular partner actually play.",
    crumb: "Games for two",
    author: "From the GoLo team",
    date: "2026-10-30",
    readMins: 5,
    hero: {
      src: "/images/blog/golf-games-for-2-players-hero.webp",
      mobile: "/images/blog/golf-games-for-2-players-mobile.webp",
      og: "/images/blog/golf-games-for-2-players-og.jpg",
      alt: "Two golf partners carrying putters as they walk off a green beside a flagstick in late afternoon light",
      position: "85% 50%",
    },
    related: ["net-vs-gross-scoring", "nassau", "skins-carryover"],
    published: true,
    body: article(
      "You already have the tee time, the regular partner, and a reliable disagreement about whose turn it is to book. What you don't have is a game that survives the first bad hole. One of you says “five dollars on the round,” the other hears something about the back nine, and by the turn neither is entirely sure what's still alive. Two players should make this easier.",
      [
        {
          id: "start-simple",
          title: "Start with $5-each Best Score",
          paragraphs: [
            "For your first round with something on it, choose <a href=\"/games/best-score\">Best Score</a>: each player agrees the same $5 amount, one finishing place, and the lowest total wins. With two players, the winner finishes $5 up and the other player $5 down. You don't need to collect anything before the round; settle the difference afterwards.",
            "Play net if you want handicap strokes to count, or gross if you both want the unadjusted total to decide it. Our <a href=\"/blog/net-vs-gross-scoring\">net-versus-gross example</a> shows why choosing that before the first tee matters. For this starter game, a tied total splits the combined amount equally: each player gets their own share back and neither owes anything.",
            "These amounts and tie rules are editorial examples for a friendly round. They aren't a standard your partner somehow should have known. Say them out loud. If five dollars would spoil the afternoon, make the contest for bragging rights and keep exactly the same scoring.",
          ],
          blocks: [
            { kind: "atAGlance", title: "THREE GAMES, TWO PLAYERS", items: [
              { label: "ONE FINAL TOTAL", value: "Best Score — start here" },
              { label: "A RESULT EACH HOLE", value: "Skins, with carries off" },
              { label: "THREE CHANCES", value: "Nassau — front, back, overall" },
              { label: "FIRST DECISION", value: "Net or gross, then the amount" },
            ] },
          ],
        },
        {
          id: "choose",
          title: "Choose by what keeps both of you interested",
          paragraphs: [
            "All three formats below support two players in GoLo. The difference is what a bad hole costs you. In Best Score, every stroke stays in the total. In skins, it costs you that hole's skin. In a Nassau, it costs you one hole in whichever matches are running, however ugly the number was.",
          ],
          blocks: [
            { kind: "table", head: ["Game", "Example amount", "What decides it", "Suggested tie rule"], rows: [
              ["Best Score", "$5 each", "Lowest 18-hole total", "Equal split; neither owes"],
              ["Skins, no carries", "$1 from the other player per skin", "Outright low score on each hole", "No skin; next hole starts fresh"],
              ["Nassau, no presses", "$2 for each of three matches", "Holes won on front, back and overall", "A tied match pushes"],
            ] },
            { kind: "p", html: "Pick one row for the next round. Being able to explain the whole arrangement before somebody starts a practice swing is a useful test." },
          ],
        },
        {
          id: "skins",
          title: "Choose skins when you want a fresh chance every hole",
          paragraphs: [
            "If one of you can shoot 81 and still include a nine, <a href=\"/games/skins\">skins</a> gives that round somewhere to go. The lower score on a hole wins its skin. Lose the 3rd by four shots and you can still win the 4th. You are counting skins, not the margin in strokes.",
            "For a simple two-player version, use $1 per skin from the other player, turn carryover off, and leave tied holes unclaimed. Win seven holes, lose five and tie six, and you finish $2 up: seven dollars coming your way, five going back. A tied 18th adds nothing. The maximum either player can lose in this plain 18-hole version is $18.",
            "Keep the extra skin types off for this example. Carryovers are a good second conversation, because they change the feel of a hole. With carries on, several quiet ties can leave you putting for several skins at once. If that's the point, read the <a href=\"/blog/skins-carryover\">carryover guide</a> together and agree how an unfinished carry ends before you start.",
          ],
        },
        {
          id: "nassau",
          title: "Choose a Nassau when the turn should mean a new start",
          paragraphs: [
            "A <a href=\"/games/nassau\">Nassau</a> is three match-play contests: front nine, back nine and overall eighteen. Each hole is won, lost or tied. Losing a hole by five shots still counts as losing one hole, so a blow-up doesn't drag five extra strokes through the afternoon.",
            "Try $2 for each match, with no presses. Lose the front, win the back and tie the overall, and the two dollars cancel: neither player owes anything. Win all three and you collect $6. That is also the most either player can lose in this example, because no extra matches or other games are running.",
            "The back-nine match starts level on 10 even if the overall match is going badly. That is the reason to choose a Nassau over one final score. For these suggested rules, tied holes don't change the standing, and a tied match pushes. GoLo's Nassau doesn't take presses, so this simple version also fits what the app scores today. The <a href=\"/blog/nassau\">full Nassau post</a> covers the house-rule conversation.",
          ],
          blocks: [
            { kind: "quote", text: "The best two-player game is the one you're both still playing on the back nine." },
          ],
        },
        {
          id: "one-card",
          title: "One scorecard feeds whichever game you chose",
          paragraphs: [
            "Set the course and tees in GoLo, add the two players, choose the game and amount, and agree the scoring basis. One scorer enters both gross scores after each hole. GoLo keeps gross and net, applies the handicap strokes, and uses the card to work out the supported game. A guest can be added with a name and an index, without an account.",
            "The score entry is the same whether you chose Best Score, skins or Nassau. What changes is the question being asked of it: lowest total, lowest score on a hole, or which player won more holes in each match. You don't enter an extra set of scores just because you chose a different format.",
            "GoLo uses one set of tees for the group and full course handicaps for individual play. It doesn't support mixed tees. It doesn't offer handicap allowances or playing off the low player. Check the <a href=\"/features\">current settings</a> before agreeing a game that depends on those options. At the end, GoLo shows who owes whom; you settle outside the app.",
          ],
        },
        {
          id: "add-later",
          title: "Add a second game after the first one works",
          paragraphs: [
            "There is no prize for filling every line in setup. Play one format for a round or two. If Best Score keeps both of you interested, you have already solved the problem. If the total starts feeling settled by lunch, try skins or a Nassau next time before adding anything on top.",
            "When you do want two games, agree both amounts and their combined exposure. A $5-each Best Score game plus the plain $1 skins example above can cost one player $23 if everything goes the wrong way. “Only a dollar a hole” does not include the five dollars you already agreed to.",
            "GoLo can run several supported games from the same card and net their results together. That makes the tally easier, but the extra games still add to what the afternoon can cost. Start with one, see how it plays, then <a href=\"/how-it-works\">watch how one card handles a full round</a> or <a href=\"/#get\">get GoLo for your next tee time</a>.",
          ],
          blocks: [
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Start with $5-each Best Score, one finishing place, and an equal split on a tie.",
              "Choose $1 skins without carries for a fresh chance on each hole, or a $2 Nassau for front, back and overall matches.",
              "Agree net or gross, the exact amounts and tie rules before either player has a score to defend.",
              "One GoLo scorecard feeds the chosen game. Add a second format only after the first one works for both of you.",
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "net-vs-gross-scoring",
    category: "handicaps",
    title: "Net vs. gross golf scoring: which one should decide the money?",
    metaDescription:
      "Compare net and gross golf scoring on one hypothetical scorecard. See different winners, then choose the scoring basis before setting the amount.",
    excerpt:
      "Alex shoots 80. Jamie shoots 90. Either can win the same round — depending on the scoring basis they agreed before the first tee.",
    dek: "The lowest number on the gross card and the lowest number after strokes can belong to different people. Decide which contest you're playing before deciding what it's worth.",
    crumb: "Net or gross?",
    author: "From the GoLo team",
    date: "2026-10-30",
    readMins: 6,
    hero: {
      src: "/images/blog/net-vs-gross-scoring-hero.webp",
      mobile: "/images/blog/net-vs-gross-scoring-mobile.webp",
      og: "/images/blog/net-vs-gross-scoring-og.jpg",
      alt: "One golf scorecard and pencil beside a white ball and a yellow ball on the seat of a parked golf cart at dusk",
      position: "85% 50%",
    },
    related: ["golf-games-for-2-players", "index-vs-course-handicap", "sandbagging"],
    published: true,
    body: article(
      "Alex comes off 18 with an 80 and expects to collect. Jamie has shot 90 and is equally certain the five dollars belongs the other way round. Both have added the card correctly. One is looking at gross, the other at net, and neither remembers saying which one would decide the game. A calculator cannot settle a conversation you never had.",
      [
        {
          id: "choose-first",
          title: "Choose the contest before choosing the amount",
          paragraphs: [
            "Gross asks who took the fewest strokes, including penalties. Net asks who had the lowest score after the agreed handicap strokes were applied. Both are legitimate ways to score; the <a href=\"https://www.randa.org/en/rog/the-rules-of-golf/rule-3\">Rules of Golf distinguish gross and net competition</a>. They answer different questions about the same round.",
            "If you and your regular partner want the unadjusted total to decide it, choose gross. If you want handicap strokes to count in a contest between different abilities, choose net. Then agree the amount and the tie rule. Knowing that it is a five-dollar game tells you very little until you know which number wins it.",
          ],
          blocks: [
            { kind: "atAGlance", title: "SAME CARD, DIFFERENT QUESTION", items: [
              { label: "GROSS", value: "Lowest total before handicap strokes" },
              { label: "NET", value: "Lowest total after handicap strokes" },
              { label: "AGREE FIRST", value: "The scoring basis, then the amount" },
              { label: "ON A TIE", value: "A rule chosen before the result" },
            ] },
          ],
        },
        {
          id: "hypothetical-card",
          title: "One hypothetical scorecard, two possible winners",
          paragraphs: [
            "This is an invented 18-hole example, not a real course, an app screenshot or a player's recorded round. Alex has a course handicap of 6 and Jamie has 18 for the same tees. We are using their full course handicaps, with no percentage allowance. Those numbers have already been established; they are not Handicap Indexes typed straight onto the card.",
            "Alex receives one stroke on the six holes with stroke index 1–6. Jamie receives one on every hole. Each net cell below is that hole's gross score minus the stroke received. The stroke-index column tells you where a stroke belongs, not the order in which the holes are played.",
          ],
          blocks: [
            { kind: "table", head: ["Hole", "Stroke index", "Alex gross", "Alex net", "Jamie gross", "Jamie net"], rows: [
              ["1", "3", "5", "4", "6", "5"],
              ["2", "15", "4", "4", "5", "4"],
              ["3", "7", "4", "4", "4", "3"],
              ["4", "1", "4", "3", "5", "4"],
              ["5", "11", "5", "5", "6", "5"],
              ["6", "17", "3", "3", "4", "3"],
              ["7", "5", "5", "4", "5", "4"],
              ["8", "13", "5", "5", "5", "4"],
              ["9", "9", "5", "5", "5", "4"],
              ["Front 9", "—", "40", "37", "45", "36"],
              ["10", "4", "5", "4", "6", "5"],
              ["11", "16", "4", "4", "5", "4"],
              ["12", "8", "4", "4", "4", "3"],
              ["13", "2", "4", "3", "5", "4"],
              ["14", "12", "5", "5", "6", "5"],
              ["15", "18", "3", "3", "4", "3"],
              ["16", "6", "5", "4", "5", "4"],
              ["17", "14", "5", "5", "5", "4"],
              ["18", "10", "5", "5", "5", "4"],
              ["Back 9", "—", "40", "37", "45", "36"],
              ["Total", "—", "80", "74", "90", "72"],
            ] },
            { kind: "p", html: "Gross: Alex wins, 80 to 90. Net: Jamie wins, 72 to 74. Alex's calculation is 80 − 6 = 74; Jamie's is 90 − 18 = 72. The eighteen scores never changed. The handicap adjustment changed which total was lower." },
            { kind: "callout", title: "A DIFFERENT WINNER IS NOT A MISTAKE", html: "On this card, Alex took fewer actual strokes. Jamie finished lower after the strokes agreed for the contest. Neither result cancels the other; only one needs to decide the game you agreed to play." },
          ],
        },
        {
          id: "hole-and-round",
          title: "The difference can show up before you add the totals",
          paragraphs: [
            "Look at the 3rd. Both players take four strokes. Alex gets no stroke there, so Alex's net is four. Jamie gets one, so Jamie's net is three. A gross comparison ties that hole; a net comparison gives Jamie the lower score.",
            "That doesn't mean one hole decides a lowest-total game. It shows why you need to know which scores you're comparing as the round unfolds. Best Score adds the chosen scores across the round; a hole-by-hole format asks a different question. Don't settle a total-score contest by counting who won more holes.",
          ],
          blocks: [
            { kind: "quote", text: "“I shot the lower round” and “I won the game” need the same scoring agreement behind them." },
          ],
        },
        {
          id: "which-basis",
          title: "Which basis should your group choose?",
          blocks: [
            { kind: "cardGrid", items: [
              { title: "Choose gross for the unadjusted contest", body: "You both want the actual stroke total to decide it. Similar ability can make that a close game; a wide gap can make the same player the favorite every Saturday. Choose it because that is the contest you want, not because nobody mentioned strokes." },
              { title: "Choose net when the handicap adjustment matters", body: "You want different abilities to compete with handicap strokes included. Use current, credible handicaps and confirm them before play. Net gives you an agreed adjustment; it doesn't guarantee a close finish or prove that the winner's handicap is perfect." },
            ] },
            { kind: "p", html: "The mechanics of converting an index for the tees have their own <a href=\"/blog/index-vs-course-handicap\">index-versus-course-handicap guide</a>. Here the decision is what to do with the strokes once you know them. Don't reopen that decision because the result looks different from the gross card." },
          ],
        },
        {
          id: "best-score",
          title: "Tell Best Score which number should decide it",
          paragraphs: [
            "In GoLo, one scorer enters the gross scores hole by hole. GoLo applies the handicap strokes and keeps net and gross on the same card. For <a href=\"/games/best-score\">Best Score</a>, agree net or gross in setup before the round, along with the equal amount per player and how many finishing places share it. You don't enter another card to get the other view.",
            "Use the hypothetical card above with a $5 amount per player and one finishing place. If the agreed basis is gross, Alex finishes $5 up and Jamie $5 down. If it is net, Jamie finishes $5 up and Alex $5 down. Those are alternative agreements for the same example, not two games running together or permission to pick the result afterwards.",
            "GoLo splits Best Score ties evenly. With two players tied for the only finishing place, each gets an equal share and neither finishes up or down on that game. A back-nine countback would be a separate house rule, not a Best Score setting in GoLo.",
            "GoLo uses full course handicaps for individual play and one set of tees for the group. GoLo doesn't support handicap allowances or playing off the low player. Confirm that those settings fit your agreement on the <a href=\"/features\">features page</a>. The app keeps the tally; players settle outside it.",
          ],
        },
        {
          id: "say-it",
          title: "Say the basis in the same sentence as the amount",
          paragraphs: [
            "“Five dollars each, Best Score, net, full course handicaps, one finishing place; ties split.” Or the same sentence with gross. Either is clear enough to put in a group text before the tee time. “Same as last week” is less useful when one of you remembers winning last week for an entirely different reason.",
            "Settle that sentence first, then <a href=\"/how-it-works\">see how one scorecard feeds the round</a> or <a href=\"/#get\">get GoLo for the next game</a>. You can admire the low gross round and settle on net. You just have to have agreed to it while the card was still blank.",
          ],
          blocks: [
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Gross compares actual stroke totals. Net compares scores after handicap strokes.",
              "On our hypothetical card, Alex's 80 wins gross; Jamie's 90 less 18 strokes is 72 and wins net.",
              "Choose the basis before the amount, confirm the handicaps, and agree how ties end.",
              "GoLo keeps both views from one scorecard; Best Score settles using the basis agreed for the game.",
            ] },
            { kind: "sources", items: [
              { label: "The R&A — Rule 3: gross and net competition", href: "https://www.randa.org/en/rog/the-rules-of-golf/rule-3" },
              { label: "USGA — Playing Handicap and stroke-index allocation", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs.html" },
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "first-tee-checklist",
    category: "etiquette",
    title: "Golf side-bet rules: settle these before somebody loses $40", // vocab-ok: exact article headline explicitly requested by the owner on 2026-10-30; the article describes house agreements and GoLo as a scorekeeper.
    metaDescription:
      "A first-tee checklist for golf side games: agree amounts, handicaps, presses, ties and loss limits before “we never agreed to that” ends the round.",
    excerpt:
      "The five things to agree while everyone is still even — before a $5 game becomes a $40 argument.",
    dek: "Amounts, strokes, presses, ties, and what the afternoon can actually cost. Five first-tee decisions that keep “we never agreed to that” out of the parking lot.",
    crumb: "The first-tee checklist",
    author: "From the GoLo team",
    date: "2026-10-30",
    readMins: 6,
    hero: {
      src: "/images/blog/first-tee-checklist-hero.webp",
      mobile: "/images/blog/first-tee-checklist-mobile.webp",
      og: "/images/blog/first-tee-checklist-og.jpg",
      alt: "Four golfers gathered around a scorecard beside their bags on the first tee in morning light",
      position: "83% 50%",
    },
    related: ["nassau", "pressing", "who-pays-first"],
    published: true,
    body: article(
      "“We never agreed to that” usually arrives after the last putt, from the person who is down forty dollars. The person holding the card remembers a very clear conversation. The other two remember somebody saying “the usual” while they were looking for a tee. All four have just spent eighteen holes playing slightly different games.",
      [
        {
          id: "amounts",
          title: "1. Put a number beside every game",
          paragraphs: [
            "A friendly game needs terms, not a negotiation over every green. The useful conversation happens once, before anyone has a score worth defending. These are house agreements for your group, not a universal rulebook for side games.",
            "Start with who's playing, who the partners are, and the amount for each game. “Five-dollar Nassau” usually means $5 for the front nine, $5 for the back, and $5 for the overall match. That is $15 before a single extra match opens. The <a href=\"/blog/nassau\">Nassau breakdown</a> covers the three matches.",
            "Then say what the number buys. A dollar a skin from each opponent is different from a dollar for the whole group to share. In a foursome, one version costs each losing player a dollar; the winner collects three. Per player, per team, per hole, per match: say the unit. A bare dollar sign leaves plenty of room for an argument.",
          ],
          blocks: [
            {
              kind: "atAGlance",
              title: "THE FIRST-TEE CHECKLIST",
              items: [
                { label: "AMOUNTS", value: "Each game, each player, each side" },
                { label: "HANDICAPS", value: "Tees, strokes, net or gross" },
                { label: "PRESSES", value: "Who, when, how much, how many" },
                { label: "TIES", value: "Push, carry, and the final hole" },
                { label: "LIMITS", value: "Per opponent or for the whole round?" },
                { label: "THE RECORD", value: "One card everyone has agreed to" },
              ],
            },
          ],
        },
        {
          id: "handicaps",
          title: "2. Agree the strokes before somebody needs one",
          paragraphs: [
            "“I'm a twelve” is the beginning of the conversation. A Handicap Index travels with the player; a course handicap depends on the tees. A playing handicap accounts for the allowance used for the format. The <a href=\"https://www.usga.org/content/usga/home-page/articles/2024/04/course-handicap-vs-playing-handicap.html\">USGA explains the distinction</a>; our <a href=\"/blog/index-vs-course-handicap\">index-to-course-handicap guide</a> walks through an example.",
            "Confirm each player's number, the tees, whether each game is net or gross, and where the strokes fall on the card. If your group uses an allowance or plays off the low player, say so now. If a guest has no index, agree the number together before the guest makes three pars. Being surprised by someone's good start is not a handicap adjustment.",
          ],
        },
        {
          id: "presses",
          title: "3. Write the press rule while nobody is losing",
          paragraphs: [
            "A press can add another match to the afternoon. It does not, by itself, erase what somebody already owes. Before you allow one, agree which match can be pressed, who may call it, the starting hole, and the amount. Then decide whether it needs the other side's acceptance or opens automatically under a rule everyone has already accepted.",
            "“Two down” is not the whole policy. Can a press itself be pressed? How many can run at once? Is a one-hole press on 18 allowed? No presses is a complete answer, and often a useful one when the group includes a new player. The <a href=\"/blog/pressing\">pressing etiquette guide</a> covers the conversation after somebody asks.",
          ],
          blocks: [
            { kind: "callout", title: "A PRESS LIMIT IS NOT A LOSS LIMIT", html: "Allowing only two extra matches limits the count. It does not tell anyone the most they can owe unless the amount of each match, and every other game running beside it, is also fixed." },
          ],
        },
        {
          id: "ties",
          title: "4. Give ties an ending",
          paragraphs: [
            "A tied Nassau match can push, with nothing owed for that match. A tied skins hole can carry its value forward if that's how you're playing. Those are different answers to different questions. “Ties carry” written beside the skins does not settle an all-square back nine.",
            "Agree what happens to any skin still riding after the final hole: split it under an agreed method, leave it unclaimed, or use a playoff everyone has time for. These are choices for the group, not a promise that every scoring tool offers every option. The <a href=\"/blog/skins-carryover\">skins carryover guide</a> explains why the ending matters.",
            "While you're there, decide what a conceded putt means for the other games running alongside the match. “That's good” should not leave one player claiming a skin and another waiting to see the putt. If rain stops the round, decide which completed matches count and what happens to unfinished ones. An ending agreed in advance beats a vote by whoever is ahead.",
          ],
        },
        {
          id: "limits",
          title: "5. Say what the whole afternoon can cost",
          paragraphs: [
            "A small starting amount is not a ceiling. Here is an illustrative two-player round: a $5 Nassau, three additional $5 presses, and $1 skins with no carries. One player loses all three original matches, all three presses, and ten skins; the other eight holes are tied for skins. Nothing doubled. It still costs forty dollars.",
          ],
          blocks: [
            {
              kind: "table",
              head: ["What was lost", "Calculation", "Amount owed"],
              rows: [
                ["Front, back and overall", "3 × $5", "$15"],
                ["Three additional presses", "3 × $5", "$15"],
                ["Ten skins, no carries", "10 × $1", "$10"],
                ["Whole round", "$15 + $15 + $10", "$40"],
              ],
            },
            { kind: "p", html: "This is a house-rule example of how the amounts add up, not a GoLo press setup. If the group wants a hard limit, define it as carefully as the game: per opponent or across everyone, per game or across all games, before or after netting. Twenty dollars to each of three opponents can still mean sixty dollars for the round." },
            { kind: "p", html: "For two players, a clear version is: “Combine both games first; neither player can owe the other more than $20 for the round. Anything above that is not collectible.” A $28 combined result then settles at $20. The limit was part of the agreement before play, not a discount requested by the loser." },
            { kind: "p", html: "A foursome needs more care. Clipping each player's net loss without adjusting what the winners collect leaves a tally that doesn't balance. Either agree how the reduction is shared, or keep the structure simple enough that its maximum possible loss already fits the group's limit. Nobody should discover they were guaranteeing the other three players' afternoon." },
            { kind: "quote", text: "If the rule only sounds obvious after you know who won, it needed saying on the first tee." },
          ],
        },
        {
          id: "agreement",
          title: "A first-tee agreement you can put in the group text",
          paragraphs: [
            "This example is for two players. Adjust the numbers and the rules together; don't just forward it and assume silence means yes.",
          ],
          blocks: [
            { kind: "summary", title: "TODAY'S GAME — TWO PLAYERS", items: [
              "White tees. Net scoring, full course handicaps for each player, strokes marked on the card before we start.",
              "$5 Nassau: $5 front, $5 back, $5 overall. Tied matches push. No presses.",
              "$1 per skin, paid by the other player. Tied holes pay nothing and do not carry. That includes 18.",
              "Combine Nassau and skins at the end. Maximum net amount owed by either player: $20 for the entire round, with any excess waived.",
              "If we stop early, only a completed front-nine match and skins from completed holes count; unfinished Nassau matches are void. The same $20 combined limit applies.",
              "One card, scores confirmed after each hole, settle before leaving. Any change needs both players' agreement before the affected play.",
            ] },
          ],
        },
        {
          id: "golo",
          title: "Let GoLo keep the card after the group agrees",
          paragraphs: [
            "Once everyone has said yes, set the supported games and amounts in GoLo and let one scorer enter the holes. GoLo runs the tallies from the same card and nets the recorded results into a short who-owes-whom list. Keep any extra house agreement, including a loss cap, alongside that record and apply it together before settling outside the app.",
            "Check the fit first. GoLo uses one set of tees for the group and full course handicaps in individual play. GoLo doesn't support handicap allowances or playing off the low player. Its presses run on Overall Match, entered by the scorer once a side is at least two down, starting on the next hole; GoLo doesn't open them automatically or take presses on Nassau. The <a href=\"/features\">current feature list</a> lays out the settings.",
            "The app can keep the numbers straight. The first-tee conversation gives those numbers meaning. <a href=\"/how-it-works\">See a round from setup to settle-up</a>, then <a href=\"/#get\">get GoLo for the next one</a>. The best time to agree what forty dollars means is while everybody still has it.",
          ],
          blocks: [
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Name the games, participants and units: per player, per team, per hole or per match.",
              "Confirm tees, handicaps, stroke holes, and net or gross before the first shot.",
              "Agree press amounts and limits, tied results, final carries, and an early finish.",
              "Define the whole-round loss limit, record the agreement, and settle from one shared card.",
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "group-accountant",
    category: "etiquette",
    title: "How to track golf bets without becoming the group accountant", // vocab-ok: exact article headline explicitly requested by the owner on 2026-10-30; GoLo is described as a scorekeeper throughout.
    metaDescription:
      "Keep golf side games straight without doing everyone's math. Agree the terms, keep one card, and let GoLo turn the results into a short settle-up list.",
    excerpt:
      "You volunteered to keep score. Somehow that came with three tallies, a disputed press, and a Tuesday collection round.",
    dek: "You agreed to keep score, not reconcile four people's Saturday. One card, clear terms, and a tally you don't have to carry in your head.",
    crumb: "The group accountant",
    author: "From the GoLo team",
    date: "2026-10-30",
    readMins: 5,
    hero: {
      src: "/images/blog/group-accountant-hero.webp",
      mobile: "/images/blog/group-accountant-mobile.webp",
      og: "/images/blog/group-accountant-og.jpg",
      alt: "An open golf scorecard, a pencil and a dark glove on a wooden bench beside the final green at sunset",
      position: "82% 50%",
    },
    related: ["who-pays-first", "nassau", "pressing"],
    published: true,
    body: article(
      "You took the pencil because nobody else reached for it. By the turn you're keeping the Nassau, counting skins, and answering whether Jess gets a stroke on 10. By the parking lot you're doing subtraction while three people change their shoes. On Tuesday somebody texts, “What did I owe again?” The round took four hours. Your shift is still going.",
      [
        {
          id: "the-job",
          title: "Keeping score should not come with a second job",
          paragraphs: [
            "The scores are usually the easy part. Four numbers after a hole. The work is remembering what those numbers mean in three different games, which amount everyone agreed to, and whether the thing somebody called from the next fairway was an actual press.",
            "A paper card can hold all of that. So can a spreadsheet. The catch is that somebody has to maintain the system, explain it, and defend the answer at the end. If that somebody is always you, the group has quietly hired an accountant and is paying in unsolicited swing advice.",
            "The way out is to give the round one record everyone agrees on, then let the arithmetic follow that record. GoLo is built for exactly that job. Before the phone can help, though, the group has to agree what it is playing.",
          ],
          blocks: [
            {
              kind: "atAGlance",
              title: "LESS BOOKKEEPING, AT A GLANCE",
              items: [
                { label: "BEFORE THE ROUND", value: "Games, amounts, strokes, house rules" },
                { label: "DURING THE ROUND", value: "One card, confirmed hole by hole" },
                { label: "AFTER THE ROUND", value: "One net number per player" },
                { label: "WHO PAYS", value: "The players, outside GoLo" },
              ],
            },
          ],
        },
        {
          id: "first-tee",
          title: "Spend a minute on the first tee",
          paragraphs: [
            "“Same as last week” is fine until someone wasn't there last week. Say the terms while everyone can still decline them without looking like they're protecting a lead.",
          ],
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Name every game and who's in it", body: "A team Nassau and an individual skins game are two separate arrangements. Say the partners out loud. A late arrival is not automatically in everything because somebody wrote his name on the card." },
                { title: "Put an amount beside each one", body: "Five dollars a Nassau side, a dollar a skin, whatever your group chose. Be specific about whether an amount is per player or per team. “Just a small game” is a mood, not a number." },
                { title: "Set the strokes and the exceptions", body: "Net or gross? Which tees? Do tied skins carry? Are presses allowed, and on which match? If one of those answers would change someone's decision to play, it belongs in the conversation now." },
              ],
            },
            { kind: "callout", title: "THE SCOREKEEPER DOESN'T SET THE TERMS", html: "Everyone agrees to the games. One person records them. Handing somebody the card does not make that person responsible for a rule the group never discussed." },
          ],
        },
        {
          id: "one-card",
          title: "Keep one card. Let GoLo keep the tallies.",
          paragraphs: [
            "In GoLo, pick the course and tees, add the players, then choose the games and amounts. A guest can be added with a name and an index, without an account. You don't need to hold up the first tee while the fourth player finds a password.",
            "For an ordinary individual round, one scorer enters everyone's gross score after each hole. GoLo applies the handicap strokes and works out the supported side games from the same card. Nassau, skins and Best Score can run together without three sets of pencil marks. Signed-in players can join the round and follow it on their own phones; score entry stays with the scorer.",
            "Have each player say the score before you move on. Four, five, five, six. Fix a wrong number while the hole is still fresh. The app can do the subtraction; it cannot know that the six you entered was actually a seven.",
            "Check that your group's rules fit before you start. GoLo uses one set of tees for the group and full course handicaps for individual play. GoLo doesn't support mixed tees or playing off the low handicap today. The <a href=\"/features\">features page</a> has the current list.",
          ],
          blocks: [
            { kind: "quote", text: "You should have to remember your score, not everybody's balance." },
          ],
        },
        {
          id: "changes",
          title: "Record the change while everyone remembers it",
          paragraphs: [
            "The fastest way to lose the tally is to leave a change in somebody's memory. If the group agrees to a press, record it when it is called. If you're keeping anything on paper, mark the starting hole and amount beside the match it belongs to. A diagonal line and “ask Dave” will not improve with age.",
            "In GoLo, the scorer enters presses on the Overall Match game once a side is at least two down, and they start on the next hole. GoLo does not open presses automatically or support presses on the Nassau game. If your Saturday depends on pressing that game, keep those separately and account for them before paying anyone.",
            "The same habit applies to a side contest the app doesn't score: write down the agreed result immediately. A half-tracked extra game is how the scorekeeper gets the second job back.",
          ],
        },
        {
          id: "settle",
          title: "Finish with what each player owes",
          paragraphs: [
            "Winning one game and losing another does not require two people to pass the same money back and forth. Net the games into one balance per player, then work out who owes whom. Here is an illustrative foursome's completed Nassau and skins tally; the plus signs mean a player is up, the minus signs mean a player is down.",
          ],
          blocks: [
            {
              kind: "table",
              head: ["Player", "Nassau", "Skins", "Net"],
              rows: [
                ["Mike", "+$10", "+$12", "+$22"],
                ["Sarah", "+$10", "−$4", "+$6"],
                ["Jess", "−$10", "+$4", "−$6"],
                ["Tom", "−$10", "−$12", "−$22"],
                ["Total", "$0", "$0", "$0"],
              ],
            },
            { kind: "p", html: "Tom pays Mike $22. Jess pays Sarah $6. Two settle-ups clear the example, and nobody needs to collect the Nassau and pay back the skins separately. Each game's column adds to zero, and so does the net. If a hand-kept tally doesn't balance, find the mistake before anyone pays." },
            { kind: "p", html: "GoLo does that netting and gives the group a short who-owes-whom list, with the games behind the numbers available to check. Read it out while everyone is still there. If someone questions the total, look at the card together. The scorekeeper shouldn't have to deliver a closing argument over six dollars. See <a href=\"/how-it-works\">one round from setup to settle-up</a> for the same process on the app's screens." },
          ],
        },
        {
          id: "hand-it-back",
          title: "Put the result in the group chat. Then put the phone away.",
          paragraphs: [
            "Share GoLo's card with the final scores, results and who owes whom in the thread your group already uses. Everyone has the same record, including the person who left early. Save the thread for the photograph of the approach shot, not a reconstruction of the back nine.",
            "GoLo never holds, moves or processes the money. Players settle outside the app however they already pay each other. Do it before everyone leaves, then mark it settled. The <a href=\"/blog/who-pays-first\">unwritten rules of settling up</a> cover the part no scorecard can enforce.",
            "Next Saturday, you can still be the person who keeps score. Set up the games in GoLo, enter the holes, and share the result. <a href=\"/how-it-works\">See one round from setup to settle-up</a>, or <a href=\"/#get\">get GoLo for your next round</a>. Taking the pencil should not mean taking the work home.",
          ],
          blocks: [
            { kind: "summary", title: "THE SHORT VERSION", items: [
              "Agree the games, amounts, strokes and house rules before the first tee shot.",
              "Keep one card, confirm scores hole by hole, and record changes when they happen.",
              "Let GoLo tally the supported games and turn the results into a short who-owes-whom list.",
              "Share the result, settle outside the app, and leave the bookkeeping at the course.",
            ] },
          ],
        },
      ],
    ),
  },
  {
    slug: "who-pays-first",
    category: "etiquette",
    title: "Who pays first? The unwritten rules of settling up",
    excerpt:
      "Nine rules, ranked by how often your group breaks them — starting with: if you lost, you pay first.",
    dek: "Nine rules, ranked by how often your group breaks them. Number one is not negotiable: if you lost, you pay, and you pay first.",
    crumb: "Settling up",
    author: "From the GoLo team",
    date: "2026-08-11",
    readMins: 5,
    hero: { src: "/images/blog/who-pays-first-hero.webp", alt: "An open SUV tailgate in a wet clubhouse parking lot at dusk, a golf bag leaning on the bumper and golf shoes and a cap in the trunk", position: "87% 50%", mobile: "/images/blog/who-pays-first-mobile.webp", og: "/images/blog/who-pays-first-og.jpg" },
    related: ["settle-up-screen", "nassau", "pressing"],
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
          { label: "HOW", value: "Folding money under $20, app over it" },
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
            body: "You lost, so the money is your errand. Nobody should have to ask, because asking is the moment a friendly game turns into an invoice. The man already sat through your account of the drive on 14. Making him also request his ten dollars is a lot to put on one afternoon.",
          },
          {
            id: "rule-2",
            title: "\"Catch you next week\" is not settling up.",
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
            title: "Settle players, not games.",
            body: "Four players have six relationships. Settle them one game at a time and you'll stand there handing the same twenty around a circle until someone's wife calls. Net everything — Nassau, skins, junk — into one number per person, then move the fewest dollars that make everybody whole. It's usually two or three settle-ups instead of six, and it ends the arithmetic before the beer gets warm.",
          },
          {
            id: "rule-6",
            title: "Round against yourself.",
            body: "Split skins and half-strokes produce numbers like $7.50, and nobody is making change on a cart path. Pay the extra dollar; collect the lesser one. If that dollar changes how you feel about the day, the amount was wrong — and that's a first-tee problem, not a settle-up problem.",
          },
          {
            id: "rule-7",
            title: "Folding money if it's small, app if it isn't — and send it while you're standing there.",
            body: "Folding money is undefeated: instant, unforgettable, impossible to renegotiate. Keep a couple of twenties in the bag and you'll never be the holdup. Above roughly twenty bucks, Venmo or Zelle is perfectly fine on one condition — you send it in the lot, not from your couch. \"I'll send it when I get home\" has never once been true. Add a note (\"back nine + greenie\"), because a bare $14 in somebody's feed three weeks later is a riddle.",
          },
          {
            id: "rule-8",
            title: "If the number ran away, the winner brings it back.",
            body: "Presses compound, and every so often a man walks off 18 owing four times what he thought he was risking. That's the group's fault, not his. Collect the number he expected to lose and forgive the runaway. A number that actually stings stops being a game, and the guy who felt it will develop a standing Saturday conflict. This isn't charity — it's foursome maintenance.",
          },
          {
            id: "rule-9",
            title: "Be careful with the new guy's money.",
            body: "Take it if he insisted on playing — refusing has its own sting. But don't run the full press ladder at somebody who hasn't learned your house rules yet, and tell him the amounts on the first tee instead of the ninth green. The fastest way to turn a guest into a permanent fourth is to let him leave roughly even and slightly curious.",
          },
        ],
      },
      {
        kind: "callout",
        title: "THE ONE HABIT THAT FIXES EIGHT OF THESE",
        html: "Say the numbers out loud on the 18th green, while everyone is still standing there. Not \"I think you got me\" — actual figures, one per player, agreed in sixty seconds. Nearly all settle-up friction is a number two people never said to each other's faces.",
      },
      { kind: "image", src: "/images/blog/who-pays-first-mid.webp", alt: "Four golfers silhouetted on the final green at sunset, two of them shaking hands by the flag", caption: "Sixty seconds on the last green saves a week of group texts.", position: "50% 45%" },
      { kind: "quote", text: "Nobody minds losing ten dollars. Everybody minds asking for it twice." },
      { kind: "h2", id: "why-it-matters", text: "Why any of this matters over eleven dollars" },
      { kind: "p", html: "Because the money was never the point. The game exists to make a twilight round on a Tuesday feel like it counts — to give the eight-footer on 12 a reason to matter. Settling is what keeps that device working. Pay fast, pay first, round against yourself, and the match stays a game instead of becoming a small unspoken thing between two guys who used to enjoy playing together." },
      { kind: "p", html: "And if remembering all nine sounds like work: the honest reason groups break these rules isn't character, it's arithmetic. Nobody wants to do six-way netting in a parking lot with a beer in his hand. So don't. Let something else keep the tally and just move the money. (GoLo doesn’t score junk, so that part stays on the card.) Here is <a href=\"/how-it-works\">one foursome’s round, first tee to settled</a>." },
    ],
  },
  {
    slug: "nassau",
    category: "rules",
    title: "The $2 Nassau: three matches, presses and house rules",
    // The guide (/games/nassau) owns "how to play a Nassau"; this post owns the
    // amounts, the presses and the arguments.
    metaDescription:
      "Why the $2 Nassau is golf's default side game: three matches, how presses work, the house rules groups disagree on, and settling up after 18.",
    excerpt: "Front nine, back nine, total match — plus presses. The whole format in five minutes.",
    dek: "Front nine, back nine, total match — plus presses. The whole format in five minutes, including the three rules your group is definitely playing differently than the next one.",
    crumb: "Nassau",
    author: "From the GoLo team",
    date: "2026-07-28",
    updated: "2026-10-11",
    readMins: 5,
    hero: { src: "/images/blog/nassau-hero.webp", alt: "A ball teed up on the first tee beside three wooden tees, with the fairway opening ahead", position: "90% 50%", mobile: "/images/blog/nassau-mobile.webp", og: "/images/blog/nassau-og.jpg" },
    published: true,
    body: article(
      "A Nassau is the default side game in American golf, and almost nobody explains it before the first tee. Somebody says “five-five-five?”, everyone nods, and eighteen holes later there is an argument in the parking lot about whether the back nine was still alive. Here is the whole format, start to settle. If you only want the rules card, the <a href=\"/games/nassau\">Nassau guide</a> has it in five steps.",
      [
        { id: "three-bets", title: "It is three matches, not one", paragraphs: ["That is the only idea you need. A Nassau splits the round into three separate <a href=\"/glossary#match-play\">match-play</a> contests of equal value: the front nine, the back nine, and the overall eighteen. Each one is won by whoever is up when that segment ends. Ties push, and nobody pays.", "Match play means you are counting holes won, not strokes. Lose the 4th by six shots and it costs you exactly one hole, the same as losing it by one. That is why the format survives a blow-up: a triple bogey ends the hole, not the afternoon."], blocks: [{ kind: "atAGlance", title: "NASSAU AT A GLANCE", items: [{ label: "PLAYERS", value: "2, or two teams of two" }, { label: "SCORING", value: "Match play, hole by hole" }, { label: "THE MATCHES", value: "Front 9, back 9, total 18" }, { label: "TYPICAL AMOUNT", value: "$2 / $5 / $10 a side" }] }] },
        { id: "five-dollar-example", title: "A $5 Nassau, played out", paragraphs: ["Two players, $5 a side, one press. You win the front nine comfortably, get run over on the back, and still walk off the 18th collecting money. Here is how that happens."], blocks: [
          { kind: "steps", items: [
            { title: "Front nine: 2 up", body: "You win holes 2, 5, and 7, and lose the 6th. The first match is in the bank." },
            { title: "Three down with five to play", body: "Your opponent birdies 10 and 11 and wins 13, so you press on the 14th tee." },
            { title: "A new match begins", body: "The press is a new $5 match covering holes 14 through 18. The back-nine match keeps running underneath it." },
            { title: "The press wins; the total pushes", body: "You win 15 and 18, lose 17. The press finishes 1 up, the back nine 2 down, and the total eighteen all square." },
          ] },
          { kind: "table", head: ["Match", "Result", "Pays"], rows: [["Front nine", "You win, 2 up", "+$5"], ["Back nine", "You lose, 2 down", "−$5"], ["The press · 14–18", "You win, 1 up", "+$5"], ["Total 18", "All square", "Push"], ["Settle", "Net for the day", "+$5"]] },
          { kind: "p", html: "Four matches, one number. Lose the back nine, win the press, and the day still goes your way." },
          { kind: "keyStat", value: "$15", label: "The most you can lose in a straight $5 Nassau before anybody presses. That ceiling is the whole appeal — small enough that nobody plays scared, big enough that a five-footer on 18 still means something." },
          { kind: "image", src: "/images/blog/nassau-mid.webp", alt: "Two golfers shaking hands on the first tee before the round", caption: "Three matches get agreed on the first tee in about four seconds. The trouble always starts later.", position: "50% 50%" },
        ] },
        { id: "presses", title: "Presses: the part that gets people in trouble", paragraphs: ["A press is a brand-new match, for the same amount, covering only the holes left in that segment. It is how the player who is losing buys a way back in, and it is also how a $5 Nassau quietly becomes a $40 afternoon. <a href=\"/glossary#re-press\">Presses can be pressed</a>, which is where groups lose the thread entirely. The etiquette of <a href=\"/blog/pressing\">when to press, and when not to</a>, gets its own post."], blocks: [{ kind: "callout", title: "SETTLE THIS ON THE FIRST TEE", html: "Automatic presses at 2 down, or press only when somebody asks? Auto-presses roughly double the money in play over eighteen holes. Both are fine. Finding out on the 14th which one you are playing is not." }, { kind: "quote", text: "Nobody argues about the golf. They argue about what the terms were." }] },
        { id: "house-rules", title: "The three rules your group plays differently", paragraphs: ["There is no governing body for the Nassau. Every group has house rules and every group assumes theirs are the standard ones. These three cause the parking-lot conversation."], blocks: [{ kind: "cardGrid", items: [
          { title: "Do strokes count?", body: "A Nassau with handicaps is a different game than one without. Most groups play the low handicap off scratch and give everybody else their difference, allocated by the stroke index printed on the card. If a 6 and a 22 are playing straight up, the 22 is making a donation." },
          { title: "When does the total 18 close?", body: "Some groups close the overall match the moment it is mathematically decided — 3 up with 2 to play, done. Others play all eighteen because the back-nine match is live anyway. Pick one, because it decides whether 17 and 18 mean anything." },
          { title: "Can you press on the 18th tee?", body: "A one-hole press on the last tee is either a fair last chance or a shameless double-or-nothing, depending entirely on who is asking for it. Decide before somebody needs it." },
        ] }] },
        { id: "settling", title: "Settling up without the parking-lot math", paragraphs: ["With two players it is one number. With four, in a two-on-two Nassau with a couple of presses in it, you have six or eight small matches closing in different directions and somebody doing arithmetic with a beer in his hand. That is the part that goes wrong — not the golf, not even the rules. The tally.", "The fix is boring: say the format out loud, write the amount down before the first tee shot, and mark each press when it is called instead of reconstructing it on the drive home. Do that and the Nassau is the best game in golf — three chances to win, a ceiling you can live with, and every hole still mattering to somebody.", "Or let GoLo hold the card. It runs the three matches at once and nets the whole group down to one number when you walk off 18. It does not take presses on a Nassau, so those still go on the scorecard."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Three equal matches: front nine, back nine, total 18. Match play. Ties push.", "A press is a new match on the holes that are left, for the same amount.", "Decide strokes, automatic presses, and the 18th-tee press before you tee off.", "Straight $5 Nassau: $15 is the most anyone can lose. Presses change that."] }] },
      ],
    ),
  },
  {
    slug: "skins-carryover",
    category: "rules",
    title: "Skins carryovers: how a $5 skin becomes a $60 hole",
    // The guide (/games/skins) owns "how to play skins"; this post owns the carryover.
    metaDescription:
      "What happens to the skin when a hole ties, how carryovers change what each hole is worth, and the house rules to agree on before the first tee.",
    excerpt:
      "How a $5 skin turns into a $60 hole, and the one setting that decides whether your group loves the format or bans it.",
    date: "2026-07-14",
    readMins: 6,
    dek: "How a $5 skin turns into a $60 hole, why a tied hole is the most important thing that can happen, and the setting that decides whether your group loves the format or bans it.",
    crumb: "Skins",
    author: "From the GoLo team",
    hero: { src: "/images/blog/skins-carryover-hero.webp", alt: "A stack of four ball markers beside the cup as a ball rolls toward the hole", position: "80% 50%", mobile: "/images/blog/skins-carryover-mobile.webp", og: "/images/blog/skins-carryover-og.jpg" },
    published: true,
    body: article(
      "Skins is the simplest game in golf to explain and the easiest one to underestimate. One skin per hole, low score takes it, nothing complicated. Then four holes get halved in a row, somebody rolls in a twelve-footer on the 8th, and the hole is suddenly worth sixty dollars. The basic rules are in the <a href=\"/games/skins\">Skins guide</a>; this is about the carryover.",
      [
        { id: "outright", title: "One skin per hole, won outright", paragraphs: ["Every hole is worth one skin. The lowest score on the hole wins it, and the emphasis is on outright — if two players tie for low, nobody wins. That single word is what separates skins from every other format. In a Nassau a halved hole is a non-event. In skins it is the engine.", "Unlike match play, skins does not care who is second. Make a 4 when the winner makes a 3 and it costs you exactly what a 9 would have. That is why it plays well in a bigger group and why one wild hole never ruins your day."], blocks: [{ kind: "atAGlance", title: "SKINS AT A GLANCE", items: [{ label: "PLAYERS", value: "3 to 6, four is ideal" }, { label: "SCORING", value: "Low score wins the hole outright" }, { label: "THE GAME", value: "One skin per hole, 18 total" }, { label: "TYPICAL AMOUNT", value: "$5 a skin, per player" }] }] },
        { id: "carryover", title: "The carryover is the whole game", paragraphs: ["When a hole is tied, the skin does not disappear — it rides to the next hole and stacks on top of it. Four players, $5 a skin, and a quiet stretch of halved holes is how a small game turns into a big one."], blocks: [
          { kind: "steps", items: [
            { title: "Three skins carry", body: "Holes 1, 2, and 3 are all halved. The 4th hole is now worth four skins." },
            { title: "Birdie wins the stack", body: "You make birdie on the 4th and nobody matches it, so you take all four skins." },
            { title: "That one hole pays $60", body: "Four skins at $5, collected from three other players." },
            { title: "The count resets", body: "The 5th is worth one skin again, and everybody who just paid is now playing a little harder." },
          ] },
          { kind: "table", head: ["Hole", "What happened", "You"], rows: [["Holes 1–3", "All halved, 3 skins carry", "—"], ["Hole 4", "Your birdie takes 4 skins", "+$60"], ["Hole 9", "Tom wins 1 with a par", "−$5"], ["Holes 12–15", "Three halved, Mike takes 4", "−$20"], ["Full 18", "You 7, Tom 6, Mike 5, Dave 0", "+$50"]] },
          { kind: "p", html: "A $5 skins game between four players, all 18 skins claimed. Every skin moves $5 from each of the three losers to the winner." },
          { kind: "keyStat", value: "$90", label: "What a “$5 skins game” actually costs the player who never wins a hole: 18 skins at $5. Run the number before you set the amount, because nobody in the group has done that math either." },
          { kind: "image", src: "/images/blog/skins-carryover-mid.webp", alt: "A golfer standing over a twelve-foot putt while three playing partners watch", caption: "Nothing changes the mood of a round faster than a twelve-footer that four people are watching for money.", position: "50% 45%" },
        ] },
        { id: "settings", title: "The settings that change everything", paragraphs: ["Skins looks like one game but plays like four, depending on how you answer these. Groups that love the format and groups that banned it are usually running different settings, not different golf."], blocks: [{ kind: "cardGrid", items: [
          { title: "Carryovers on, or off?", body: "Off means every hole is worth exactly one skin and the money stays flat and predictable. On is where the format gets its teeth. If your group has one player who tilts, carryovers are the setting that finds him." },
          { title: "Gross or net skins?", body: "Gross rewards the best player, full stop. Net skins hand strokes out by the card’s stroke index, which is the only version where a 20 handicap can realistically win one. In a mixed group, net is the difference between a game and a spectator sport." },
          { title: "What happens to skins left over on 18?", body: "If the last hole is halved, split the carried skins evenly, settle it with a chip-off from the back of the green, or roll them into next week. All three are common. Pick one before it is worth $40." },
        ] }, { kind: "quote", text: "Skins is quiet for an hour, and then somebody makes a birdie worth sixty dollars." }] },
        { id: "validation", title: "Validation, and the two-putt rule", paragraphs: ["Some groups add a validation rule: to win a skin you have to make par or better, or you have to two-putt rather than chip in from off the green. It cuts down on flukes and it makes the closing holes tighter, because a scrambled bogey no longer takes a $40 carry. It also slows things down and gives you one more thing to argue about, which is why plenty of groups skip it."] },
        { id: "tracking", title: "Keeping track without losing the thread", paragraphs: ["The failure mode is always the same: everybody remembers the $60 hole and nobody remembers holes 6 through 11. By the parking lot there are two versions of the carry count, and the guy who is down is the one arguing hardest.", "GoLo keeps the carry count live on the scoring screen, applies net strokes if you are playing them, and nets four players’ skins into one number at the end. You still get the twelve-footer. You just stop doing the multiplication."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["One skin per hole. Low score wins it outright — a tie means nobody does.", "Tied holes carry, so a quiet stretch turns the next hole into real money.", "Decide carryovers, gross or net, and what happens to leftovers on 18.", "A $5 skins game is a $90 ceiling per player. Set the amount with that in mind."] }] },
      ],
    ),
  },
  {
    slug: "wolf",
    category: "rules",
    title: "Wolf, for foursomes that can’t agree on anything",
    excerpt:
      "Pick a partner or go it alone, hole by hole. The rotation, the lone-wolf multiplier, and when the risk is actually worth it.",
    date: "2026-07-02",
    updated: "2026-10-29",
    readMins: 6,
    dek: "Pick a partner or go it alone, hole by hole. The rotation, the timing rule most groups get wrong, and when the lone-wolf risk is worth taking.",
    crumb: "Wolf",
    author: "From the GoLo team",
    hero: { src: "/images/blog/wolf-hero.webp", alt: "A single ball teed up at the front of the tee box with three more waiting behind it", position: "77% 50%", mobile: "/images/blog/wolf-mobile.webp", og: "/images/blog/wolf-og.jpg" },
    published: true,
    body: article(
      "Wolf is the format for a foursome that cannot agree on a game. Nobody has a fixed partner, the teams change every hole, and one player each hole decides whether he wants help or wants all the money. It takes one hole to learn and about four to get genuinely competitive. The rotation and scoring are in the <a href=\"/games/wolf\">Wolf guide</a>; this is about the decisions.",
      [
        { id: "rotation", title: "Everybody gets to be the wolf", paragraphs: ["The tee order rotates. On the 1st hole player one is the wolf, on the 2nd it is player two, and so on, which means each player is the wolf on holes 1, 5, 9, and 13 — four turns each over sixteen holes. The last two holes are a house rule, and we will get to those.", "Being the wolf is the whole job: after the tee shots you either take a partner for that hole or play the hole alone against the other three. Everything else is a two-on-two best-ball hole, decided the way you would expect."], blocks: [{ kind: "atAGlance", title: "WOLF AT A GLANCE", items: [{ label: "PLAYERS", value: "4 — the format is built for it" }, { label: "SCORING", value: "Best ball vs. best ball, per hole" }, { label: "THE GAME", value: "New teams every hole" }, { label: "TYPICAL AMOUNT", value: "$5 a hole, lone wolf doubles" }] }] },
        { id: "partner-timing", title: "Picking a partner, and the timing rule that matters", paragraphs: ["This is the part groups get wrong. The wolf tees off last, so he sees every drive, but he does not get to watch all three and then shop around — he has to decide immediately after each one."], blocks: [{ kind: "steps", items: [
          { title: "The wolf tees off last", body: "The other three hit first, so he sees each drive before his own." },
          { title: "He decides after each drive", body: "As each ball stops, before the next player tees off, the wolf either takes that player or passes on him for good." },
          { title: "Pass on all three", body: "You are the lone wolf by default — you against the other three, for double." },
          { title: "The partnership lasts one hole", body: "On the next tee everybody is on their own again." },
        ] },
        { kind: "table", head: ["Hole", "What happened", "You"], rows: [["Hole 5", "You take Mike; your side wins", "+$5"], ["Hole 9", "Tom declares lone wolf and birdies", "−$10"], ["Hole 13", "You go alone; par beats all three", "+$30"], ["Hole 17", "Dave picks you; your side wins", "+$5"], ["Settle", "One good risk carried the round", "+$30"]] },
        { kind: "p", html: "A $5 Wolf game. Partnered holes pay $5 a man; a winning lone wolf takes $10 from each of the other three." },
        { kind: "keyStat", value: "6×", label: "How much more a lone-wolf hole moves than a partnered one: $30 against $5. Four turns as the wolf is four chances to make that call, and the round is usually decided by whoever read them right." },
        { kind: "image", src: "/images/blog/wolf-mid.webp", alt: "A golfer finishing his drive while the other three in his group wait on the tee", caption: "The wolf hits last and sees every drive, which is the elegant cruelty of the format — you still have to choose before you have seen them all.", position: "50% 45%" },
        ] },
        { id: "lone-wolf", title: "When going alone is actually the right call", paragraphs: ["Lone wolf is not bravado, it is arithmetic. You need to beat the best score of three players, so the question is only ever how likely a good score is to be enough on this specific hole."], blocks: [{ kind: "cardGrid", items: [
          { title: "Go alone on the short holes", body: "A par 3 you can hit and a drivable par 4 are where three opponents are most likely to all make par. If a birdie wins outright and a par often ties, the chances are with you." },
          { title: "Go alone after three bad drives", body: "The best information you get is the three tee shots in front of you. Two in the trees and one laid up with an iron is the cheapest lone wolf you will ever have." },
          { title: "Never go alone into trouble", body: "Water, out of bounds, or a hole where your miss is a lost ball. A double bogey as the lone wolf costs you with all three players, at double the rate, and that is how a good round turns into a bad settle." },
        ] }, { kind: "quote", text: "The wolf tees off last. He sees every drive, and still has to choose before he has seen them all." }] },
        { id: "last-two", title: "The last two holes, and the blind wolf", paragraphs: ["Sixteen holes divide evenly by four, and eighteen do not, so every group patches the ending differently. The three common answers: the two players furthest down get holes 17 and 18 as the wolf, the overall leader is wolf on both so he has to defend it, or you simply run the rotation twice more and let it be uneven. Any of them work. Deciding on the 17th tee does not.", "The other addition worth knowing is the blind wolf: declaring you are going alone before anybody hits, including yourself. It pays triple. It is also the fastest way to be down $45 on one hole, which is exactly why somebody in your group will call it on the 18th."] },
        { id: "tracking", title: "Keeping the rotation straight", paragraphs: ["Wolf has more moving parts than any other common side game: whose turn it is, who partnered with whom, which holes were doubled, and what the running total looks like four holes later. Groups usually lose the rotation somewhere around the turn and reconstruct it from memory, which always favors whoever remembers loudest.", "GoLo holds the rotation, records the partner the moment you pick one, applies the double or the triple, and nets four players down to one number. You get to spend the round deciding whether to go alone instead of doing bookkeeping."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["The wolf rotates every hole and tees off last. Four turns each over sixteen holes.", "Take a partner immediately after his drive, or pass and lose the option.", "Lone wolf pays double, blind wolf triple, and both cut in either direction.", "Agree how holes 17 and 18 work before you get to the 17th tee."] }] },
      ],
    ),
  },
  {
    slug: "bingo-bango-bongo",
    category: "rules",
    title: "Bingo Bango Bongo keeps the 22-handicap interested",
    excerpt:
      "Three points a hole, no strokes required. The fairest game in golf for a group with a 6 and a 22 in it.",
    date: "2026-06-18",
    readMins: 5,
    dek: "Three points a hole, no strokes required. The fairest game in golf for a group with a 6 and a 22 — and why order of play does all the work.",
    crumb: "Bingo Bango Bongo",
    author: "From the GoLo team",
    hero: { src: "/images/blog/bingo-bango-bongo-hero.webp", alt: "A golf ball rolling onto the front edge of the green while three others wait back in the fairway", position: "83% 50%", mobile: "/images/blog/bingo-bango-bongo-mobile.webp", og: "/images/blog/bingo-bango-bongo-og.jpg" },
    related: ["sandbagging", "wolf", "index-vs-course-handicap"],
    published: true,
    body: article(
      "Every group has one: a 22-handicap who is out of the game by the 5th hole and spends the back nine watching three other people play for money. Bingo Bango Bongo fixes that without a single stroke changing hands. Three points a hole, and two have almost nothing to do with how far you hit it. The scoring rules are in the <a href=\"/games/bingo-bango-bongo\">Bingo Bango Bongo guide</a>; this is about why it works for an uneven group.",
      [
        { id: "three-points", title: "Three points, three different skills", blocks: [{ kind: "atAGlance", title: "BINGO BANGO BONGO AT A GLANCE", items: [{ label: "PLAYERS", value: "3 or 4 — four is the sweet spot" }, { label: "SCORING", value: "3 points every hole, 54 total" }, { label: "THE GAME", value: "A price per point" }, { label: "HANDICAPS", value: "Not required" }] }, { kind: "cardGrid", items: [
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
          { kind: "image", src: "/images/blog/bingo-bango-bongo-mid.webp", alt: "Four golf balls on the green at different distances from the hole, the closest just chipped on from the rough", caption: "Bango is measured once every ball is on the green, which is why a chip-on can beat three good approach shots.", position: "50% 60%" },
        ] },
        { id: "why-it-works", title: "Why it works with a 6 and a 22 in the group", paragraphs: ["Most side games need <a href=\"/blog/index-vs-course-handicap\">handicaps</a> to be fair, and handicaps are where arguments live. Bingo Bango Bongo is fair by construction: two of the three points are decided by order of play, and order of play favors the player who is behind.", "The better player still wins more often. He is closer more often, which is bango, and he holes more putts, which is bongo. But he cannot run away with a hole, and he certainly cannot run away with the round. A four-point spread over 54 is a normal result, and a four-point spread is a game everybody is still in on the 18th tee."], blocks: [{ kind: "quote", text: "Being 60 yards behind everybody is not a disadvantage here. It is a head start on bingo." }] },
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
    title: "Pressing in golf: when it’s fair game and when it’s just rude",
    metaDescription:
      "What a press is in golf, when calling one is fair, what automatic 2-down presses do to a $5 Nassau, and when to accept or decline one.",
    excerpt:
      "The automatic 2-down press, the 18th-tee press, and the one press that gets you left off next week’s text.",
    date: "2026-10-10",
    readMins: 6,
    dek: "The automatic 2-down press, the 18th-tee press, and the one press that gets you left off next week’s text — plus what auto-presses do to the amount in play.",
    crumb: "Pressing",
    author: "From the GoLo team",
    hero: { src: "/images/blog/pressing-hero.webp", alt: "Two golf balls teed up side by side on a tee box at sunset, a driver resting beside them", position: "87% 50%", mobile: "/images/blog/pressing-mobile.webp", og: "/images/blog/pressing-og.jpg" },
    published: true,
    body: article(
      "A press is the most useful tool in a friendly match and the fastest way to sour one. Called at the right moment it keeps a beaten player in the round; called at the wrong one it tells three people exactly what you think of them. The mechanics take a paragraph. The etiquette is the actual subject. If you need the format underneath first, the <a href=\"/games/nassau\">Nassau guide</a> has the rules.",
      [
        { id: "what-is-a-press", title: "What a press actually is", paragraphs: ["It is a second match, not an adjustment to the first one. The original match keeps running to the end of its segment; the press runs alongside it, for the same amount, over whatever holes are left. Win the press and you have clawed back the segment without ever winning the original match.", "That is the whole appeal. A player who is 3 down on the back nine has nothing to play for over the last five holes, and a match nobody is playing for is worse than no match. The press gives him a live match again."], blocks: [{ kind: "atAGlance", title: "A PRESS AT A GLANCE", items: [{ label: "WHAT IT IS", value: "A new match, same amount" }, { label: "WHAT IT COVERS", value: "Only the holes remaining" }, { label: "WHO CALLS IT", value: "The side that is down" }, { label: "WHEN", value: "On the tee, before anybody hits" }] }] },
        { id: "four-presses", title: "The four presses you will meet", blocks: [{ kind: "cardGrid", items: [
          { title: "The automatic 2-down", body: "No conversation required: any time a side goes 2 down, a press opens on the spot. It is the cleanest version because nobody has to ask, and it is also the one that can quietly double the money in play over eighteen holes." },
          { title: "The requested press", body: "You are down, you want another crack, you ask on the tee. Standard and perfectly fair. The only rule is that the answer is allowed to be no." },
          { title: "The press from in front", body: "Pressing when you are the one up, usually against somebody who has visibly stopped playing well. Call it the vulture press. Nothing in the rules stops you, and it is the press that gets you left off next week’s text." },
          { title: "The 18th-tee press", body: "A one-hole press on the last tee. Either a fair last chance or a shameless double-or-nothing, depending entirely on who needs it. Groups that allow it always allow it; groups that do not should say so on the first tee." },
        ] }] },
        { id: "auto-presses", title: "What auto-presses do to a $5 Nassau", paragraphs: ["Here is one round, two players, $5 a side, a press opening automatically whenever a side goes 2 down on either nine. Nobody did anything unusual and nobody pressed out of spite."], blocks: [{ kind: "steps", items: [
          { title: "You are 2 down after 4", body: "Your press opens for holes 5 through 9. You win it 1 up and still lose the front nine 1 down." },
          { title: "He is 2 down after 12", body: "His press opens for holes 13 through 18, running underneath the back-nine match." },
          { title: "You are 2 down in his press after 15", body: "Now you press his press, for holes 16 through 18. You win two of the last three and lose one." },
          { title: "Four matches close on 18", body: "You take the back nine 1 up, he takes his press 1 up, you take yours 1 up, and the total eighteen finishes all square." },
        ] }, { kind: "table", head: ["Match", "Result", "Pays"], rows: [["Front nine", "You lose, 1 down", "−$5"], ["Your press · 5–9", "You win, 1 up", "+$5"], ["Back nine", "You win, 1 up", "+$5"], ["His press · 13–18", "He wins, 1 up", "−$5"], ["Press on his · 16–18", "You win, 1 up", "+$5"], ["Total 18", "All square", "Push"], ["Settle", "Net for the day", "+$5"]] }, { kind: "p", html: "A quiet round of golf with three presses in it. The final number is small; the exposure was not." }, { kind: "keyStat", value: "$30", label: "Total money in play in that “$5 Nassau”: six matches at $5, double the $15 a straight one can cost. Automatic presses are not a small setting. Agree on them before the first tee, not on the 14th." }] },
        { id: "friendly-rules", title: "Three rules that keep it friendly", blocks: [{ kind: "cardGrid", items: [
          { title: "Only the side that is down gets to press", body: "This is the one that separates a match from a shakedown. If you are up and want to raise the amount, you are not pressing, you are pushing. Wait until the situation reverses." },
          { title: "Call it on the tee, not after your drive", body: "A press called from the middle of the fairway after you have striped one is a different match than a press called on the tee, and everybody knows it. Before anybody hits, or not at all." },
        ] }, { kind: "image", src: "/images/blog/pressing-mid.webp", alt: "Two golfers talking on an elevated tee box at sunset before either one hits, a cart parked beside them", caption: "Before anybody hits, or not at all.", position: "50% 50%" }, { kind: "cardGrid", items: [
          { title: "Read the room", body: "If somebody is having a genuinely rough day, the correct move is often not to press at all. The money is not the point, and everybody can tell when you have forgotten that." },
        ] }, { kind: "quote", text: "A press should give a beaten player something to play for. If it is doing anything else, do not call it." }] },
        { id: "accept-or-decline", title: "When to say yes, and when to decline", paragraphs: ["If your group plays presses on request rather than automatically, accepting is the default. Declining a press from a player who is 3 down with four to play is technically your right and socially expensive — you are choosing to protect $5 at the cost of the next hour being awkward.", "The exception is the amount. If a press would take the round past what somebody in the group can comfortably lose, say so out loud and cap it. “Happy to press, but that is the last one” is a completely normal sentence and it protects everybody, including the guy asking."] },
        { id: "write-it-down", title: "If it is not written down, it did not happen", paragraphs: ["Presses are where friendly matches go wrong, and almost never because somebody cheated. It is because a press called on the 13th tee is remembered on the 18th green as starting on the 14th, and now two people are describing different matches with equal confidence.", "Mark it when it is called. On GoLo’s Overall Match game, each press is stamped to the hole it opened on, runs alongside the original match or settles it where it stands, and nets into one number at the end. The app does not do automatic presses yet, and its Nassau takes none. The etiquette is still your job. The bookkeeping is not."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["A press is a new match for the same amount over the holes that are left.", "Only the losing side presses, and only from the tee before anybody hits.", "Automatic 2-down presses can double the money in play. Decide up front.", "Mark each press to the hole it was called on, or you are settling from memory."] }] },
      ],
    ),
  },
  {
    slug: "index-vs-course-handicap",
    category: "handicaps",
    title: "Handicap index vs. course handicap: what goes on the card",
    metaDescription:
      "How a handicap index becomes a course handicap: the slope and course rating formula worked for two tee boxes, and how strokes land hole by hole.",
    excerpt:
      "Why a 12.4 becomes 14 strokes at one tee box and 11 at another — and how those strokes land hole by hole.",
    date: "2026-10-10",
    updated: "2026-10-15",
    readMins: 5,
    dek: "Why a 12.4 becomes 14 strokes at one tee box and 11 at another, how those strokes land hole by hole, and which number belongs on the card.",
    crumb: "Handicaps",
    author: "From the GoLo team",
    hero: { src: "/images/blog/index-vs-course-handicap-hero.webp", alt: "A blue tee marker on the back tee box, with the white tee markers on the forward tee further down the same hole", position: "100% 50%", mobile: "/images/blog/index-vs-course-handicap-mobile.webp", og: "/images/blog/index-vs-course-handicap-og.jpg" },
    published: true,
    body: [
      ...article(
      "Somebody in your group says “I’m a twelve.” That is a handicap index, and it is not the number he plays off today. Move him back one set of tees and it changes. Take him to a harder course and it changes again. Here is the difference, the formula, and which number belongs on the card when the hole is worth something.",
      [
        { id: "index-vs-course", title: "The index is the number you own. The course handicap is the number you play.", paragraphs: ["Your handicap index measures your demonstrated ability on a course of average difficulty. It travels with you and it has a decimal, because it is a calculation, not a scorecard entry. Nobody gets strokes equal to their index.", "Your course handicap converts that ability into strokes for the exact tees you are playing, on the exact course you are playing. It is a whole number, it changes when the tees change, and it is the one that decides who gives what."], blocks: [{ kind: "atAGlance", title: "THE THREE NUMBERS", items: [{ label: "HANDICAP INDEX", value: "Portable, one decimal, e.g. 12.4" }, { label: "COURSE HANDICAP", value: "Whole number, per tee set" }, { label: "PLAYING HANDICAP", value: "Course handicap × format allowance" }, { label: "STROKE INDEX", value: "Which holes the strokes land on" }] }] },
        { id: "formula", title: "The formula, run twice", paragraphs: ["Course handicap = index × (slope rating ÷ 113) + (course rating − par). Slope rating measures how much harder a course plays for a bogey golfer than for a scratch golfer, with 113 as the standard. Course rating is what a scratch golfer is expected to shoot, so the rating-minus-par term accounts for a course that plays harder or easier than its par.", "Here is a 12.4 on two sets of tees at the same club: the blues (slope 131, course rating 71.8) and the whites (slope 122, course rating 69.6), par 72 from both."], blocks: [{ kind: "table", head: ["Step", "Blues", "Whites"], rows: [["Handicap index", "12.4", "12.4"], ["× slope ÷ 113", "14.4", "13.4"], ["+ (rating − par)", "−0.2", "−2.4"], ["Unrounded", "14.2", "11.0"], ["Course handicap", "14", "11"]] }, { kind: "p", html: "Same player, same afternoon, same golf swing. Three strokes’ difference depending on which tee box he walks to." }, { kind: "keyStat", value: "3", label: "Strokes between one player’s course handicaps on two tee boxes at the same club. If your group splits across tees, settle the tees before you settle the strokes." }, { kind: "callout", title: "IT’S ALL ON THE CARD", html: "Slope, course rating and par are printed on the scorecard for every set of tees. Everything else is arithmetic." }] },
        { id: "stroke-allocation", title: "Where the strokes actually land", paragraphs: ["A course handicap of 14 does not mean you subtract 14 at the end. In any hole-by-hole game, the strokes are allocated to specific holes by the <a href=\"/glossary#stroke-index\">stroke index</a> printed on the card. It is how a <a href=\"/games/nassau\">Nassau</a> with strokes is scored, and net <a href=\"/games/skins\">skins</a>, and every other net game."], blocks: [{ kind: "steps", items: [
          { title: "Find the stroke index row", body: "The scorecard ranks the holes 1 through 18 by difficulty." },
          { title: "A 14 gets one stroke on indexes 1 through 14", body: "Those are the holes where the player’s net score is adjusted." },
          { title: "Above 18, strokes double up", body: "A 22 gets two strokes on the four hardest holes and one everywhere else." },
          { title: "The net score settles the hole", body: "With a stroke on stroke index 3, a bogey 5 is a net 4. It halves the other player’s unaided par; a par 4 with the stroke would have won the hole." },
        ] }, { kind: "image", src: "/images/blog/index-vs-course-handicap-mid.webp", alt: "A pencil resting on a scorecard clipped to a golf cart steering wheel, the fairway soft in the background", caption: "The stroke index row decides where the strokes land, not the total at the bottom.", position: "50% 50%" }, { kind: "quote", text: "“I’m a twelve” is a fact about the player. It is not the number that settles the hole." }] },
        { id: "playing-handicap", title: "In a match, nobody plays their full number", paragraphs: ["Two more conventions sit between the course handicap and what your group actually plays, and both exist for the same reason: to stop the format from doing something silly."], blocks: [{ kind: "cardGrid", items: [
          { title: "Play the differences, not the totals", body: "In a match, the lowest course handicap plays off scratch and everybody else gets the difference. If you are 14 and your opponent is 11, he plays even and you get three strokes — on stroke index 1, 2, and 3." },
          { title: "Formats have allowances", body: "Handicap allowances exist because some formats amplify a high handicap. Four-ball match play is commonly played at 90%; individual match play at 100%. Casual groups can skip them if everybody knows that is the choice." },
          { title: "Cap the hole, not the round", body: "Net double bogey is the standard maximum for posting purposes, and it works as a house rule. It keeps one lost ball from distorting every game on the card." },
        ] }] },
        { id: "why-index-moves", title: "Why the index moves", paragraphs: ["Your index is the average of the best 8 <a href=\"/glossary#score-differential\">score differentials</a> out of your most recent 20 rounds, and it updates the day after each new score is posted. That is why it drifts down after a good week and why one bad round rarely moves it: a score only counts if it lands among your best eight of twenty, so a single 92 usually changes nothing.", "If nobody in your group carries an official index, agree on informal numbers and write them down. Consistency matters more than accuracy: a made-up 15 that everybody agrees on settles more matches than a real 12.4 that only one person remembers. And if somebody’s number stops matching his golf, <a href=\"/blog/sandbagging\">here is how to fix it without accusing anybody</a>."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Index is portable and has a decimal. Course handicap is per tee set and is a whole number.", "Course handicap = index × (slope ÷ 113) + (course rating − par).", "Strokes land on specific holes by stroke index, not at the end of the round.", "In a match, the low handicap plays off scratch and everybody else gets the difference."] }] },
      ],
      ),
      {
        kind: "sources",
        items: [
          { label: "USGA: how to calculate a Course Handicap and Playing Handicap", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---calculate-course-handicap-and-playing-handicap.html" },
          { label: "Rules of Handicapping, Appendix G: Course Rating and Slope Rating", href: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20G%20Golf%20Course%20CourseRatingSlopeRating.htm" },
          { label: "USGA: how a Handicap Index is calculated from the best 8 of 20", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---my-handicap-did-not-change.html" },
          { label: "USGA: the World Handicap System, including daily revisions", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/World-Handicap-System-5-Things-You-Need-to-Know.html" },
          { label: "Rules of Handicapping, Appendix C: Handicap Allowances", href: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm" },
          { label: "Rules of Handicapping, Rule 3.1b: net double bogey", href: "https://www.usga.org/handicapping/roh/Content/rules/3%201b%20After%20a%20Handicap%20Index%20Has%20Been%20Established.htm" },
        ],
      },
    ],
  },
  {
    slug: "sandbagging",
    category: "handicaps",
    title: "Sandbagging: how to spot it without starting a fight",
    excerpt: "The patterns that give it away, the math that makes the case, and four fixes that get an honest game back without an accusation.",
    dek: "The patterns that give it away, the math that makes the case for you, and four fixes that get an honest game back without ever accusing anybody.",
    crumb: "Sandbagging",
    author: "From the GoLo team",
    date: "2026-10-10",
    updated: "2026-10-15",
    readMins: 6,
    hero: { src: "/images/blog/sandbagging-hero.webp", alt: "A golf bag propped at the edge of a freshly raked greenside bunker, a rake lying in the sand", position: "89% 50%", mobile: "/images/blog/sandbagging-mobile.webp", og: "/images/blog/sandbagging-og.jpg" },
    published: true,
    body: [
      ...article(
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
        { id: "the-math", title: "The math that does the arguing for you", paragraphs: ["Here is what makes this solvable without an accusation: <a href=\"/blog/index-vs-course-handicap\">handicaps</a> make a specific, checkable prediction about how often a player should beat his own number."], blocks: [
          { kind: "steps", items: [
            { title: "Best 8 of 20", body: "Your index is built from your best 8 of 20 rounds, so it describes something close to your potential, not your average day." },
            { title: "One round in five", body: "Because of that, a player with an honest index plays to his course handicap or better in roughly one round out of five." },
            { title: "Three or more better: one in twenty", body: "As a rule of thumb, beating it by three or more shots is closer to one round in twenty." },
            { title: "Four in a row: 1 in 160,000", body: "Doing that four Saturdays in a row is about a 1-in-160,000 afternoon. At that point the index is the thing that is wrong, not the golf." },
          ] },
          // May 10 reads 85 gross in the design, which nets −5 off 18 strokes,
          // not the −3 beside it. 87 keeps the design's net column.
          { kind: "table", head: ["Saturday game · 18 strokes", "Gross", "Net vs. par 72"], rows: [["April 12", "85", "−5"], ["April 26", "84", "−6"], ["May 10", "87", "−3"], ["May 24", "83", "−7"], ["Rounds he posted this spring", "0", "index still 18.2"], ["The pattern", "Four straight, each by three or more", "1 in 160,000"]] },
          { kind: "p", html: "Nobody here called anybody a cheat. This is four Saturdays of arithmetic, and it makes its own case." },
          { kind: "keyStat", value: "1 in 5", label: "Roughly how often an honest handicap plays to his number. If somebody in your group is doing it most weeks, you do not have a golf problem or a character problem. You have a data problem, and data problems have fixes." },
          { kind: "image", src: "/images/blog/sandbagging-mid-1.webp", alt: "Four golf balls lined up in a perfectly even row just short of the cup", caption: "The index is the argument. Nobody needs to raise their voice about a spreadsheet.", position: "50% 60%" },
        ] },
        { id: "patterns", title: "The patterns worth noticing", blocks: [
          { kind: "cardGrid", items: [
            { title: "The index that never moves", body: "Everybody’s number drifts. One that has read 18.2 since last summer, through a winter of lessons and a new driver, is a number being managed rather than measured." },
            { title: "The quiet bogeys after the match is over", body: "Watch what happens once his match is decided. A player who makes three straight bogeys after closing you out on 15 is protecting something, and it is not his score." },
            { title: "Net scores that cluster just under the line", body: "A real player’s net results scatter — some blowups, some good days. A managed handicap produces suspiciously tidy results: net 70, 71, 69, week after week, never a 78." },
            { title: "Strong opinions about the format", body: "If one player always wants net skins over gross, always wants full strokes rather than an allowance, and gets uncomfortable when somebody suggests Bingo Bango Bongo, he is telling you where his edge lives." },
          ] },
          { kind: "quote", text: "You do not have to accuse anybody. You just have to make the round expensive for the number and cheap for the golf." },
        ] },
        { id: "four-fixes", title: "Four fixes that require no confrontation", paragraphs: ["Every one of these is a rule about the group, not about a person. That is the entire trick — the sandbagger has to agree to them, because arguing against fairness in public is worse than losing the edge."], blocks: [
          { kind: "cardGrid", items: [
            { title: "Everybody posts every round", body: "Announce it as a group habit, not a policy aimed at anyone. If all four of you enter every score, the indexes converge on reality within a month and the problem quietly disappears." },
            { title: "Cap the strokes you give", body: "Play an allowance — 90% in four-ball, or simply cap the maximum strokes anybody can receive at, say, eight. A capped game limits what a bad number can cost you without ever naming it." },
            { title: "Rotate formats toward the stroke-free ones", body: "Bingo Bango Bongo, gross skins, and match play with a hard cap all reduce the value of an inflated index. Keep them in the rotation and nobody has to explain why." },
            { title: "Use the lowest index of the last twelve months", body: "If a player was a 12 in September, he plays as a 12 in April. It is the single most effective rule you can adopt, and it sounds like housekeeping rather than an accusation." },
          ] },
          { kind: "callout", title: "BEFORE YOU SAY ANYTHING", html: "An accusation costs more than the money. If you are wrong you have insulted a friend over $20; if you are right, you have made the next twenty rounds awkward for four people. Change the structure first and see whether the results change with it. They usually do." },
          { kind: "image", src: "/images/blog/sandbagging-mid-2.webp", alt: "Four golfers walking up a misty fairway together at sunrise, carrying their bags", caption: "The group that posts every round together never has this conversation.", position: "50% 55%" },
        ] },
        { id: "say-something", title: "If you do have to say something", paragraphs: ["Say it privately, once, and about the game rather than the man. “Your net has been beating par most weeks, so I think your number is stale — want to play off 14 and see how it goes?” gives him a way to fix it without admitting anything. That is the point. You are not trying to win an argument, you are trying to get an honest game back.", "And keep your own house clean. Post the 79 as promptly as you post the 94. The player who does that has standing in this conversation. The one who does not is just complaining about a better sandbagger."], blocks: [
          { kind: "summary", title: "THE SHORT VERSION", items: ["An honest handicap plays to its number about one round in five. Track that.", "Rule out improvement, laziness, slope, and home-course knowledge first.", "Fix it structurally: post every round, cap the strokes, rotate stroke-free formats, and play off the lowest index of the last twelve months.", "If you must raise it, do it privately, about the game, and offer a number instead of a verdict."] },
        ] },
      ],
      ),
      {
        kind: "sources",
        items: [
          { label: "USGA: how a Handicap Index is calculated from the best 8 of 20", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---my-handicap-did-not-change.html" },
          { label: "USGA: Course Handicap, and how often a player plays to it", href: "https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/topics/course-handicap.html" },
        ],
      },
    ],
  },
  {
    slug: "rangefinder",
    category: "gear",
    title: "Rangefinder or GPS watch? An honest answer for the $10 crowd",
    metaDescription:
      "Laser or GPS watch: what actually saves a stroke over 18 holes, what only looks prepared, and which one suits a fast group playing for small money.",
    excerpt: "What actually saves you a stroke over 18, and what just makes you look prepared on the first tee.",
    dek: "What actually saves you a stroke over 18 holes, what just makes you look prepared on the first tee, and which one belongs in a group that plays fast for small money.",
    crumb: "Rangefinders",
    author: "From the GoLo team",
    date: "2026-10-07",
    readMins: 5,
    // TODO photo: the two inline figures are still stock frames: a rangefinder
    // in use or an approach shot for the first, and a GPS watch or a wrist
    // glance for the second.
    hero: { src: "/images/blog/rangefinder-hero.webp", alt: "A laser rangefinder, a golf ball and a GPS watch lying on the fairway, a flag soft in the distance", position: "85% 50%", mobile: "/images/blog/rangefinder-mobile.webp", og: "/images/blog/rangefinder-og.jpg" },
    related: ["bandon", "scottsdale-trip-structure", "skins-carryover"],
    // Hidden for now at the owner's request (2026-10-30).
    published: false,
    body: article(
      "If you play for ten dollars a side with the same three guys, this decision is smaller than the internet makes it. A laser gives you one exact number. A watch gives you three approximate ones without you doing anything. The honest answer depends on how you miss, how fast your group plays, and whether you will actually use the thing.",
      [
        { id: "different-questions", title: "They answer different questions", paragraphs: ["A rangefinder answers “how far is that, exactly?” — the flag, the front bunker, the tree you keep hitting. A GPS watch answers “roughly where am I?” — front, middle, and back of the green, without taking your glove off or asking anybody to stand still.", "Both are legal for handicap purposes as long as they are measuring distance only. Slope-adjusted readings are the exception: switch slope off in competition, and know that most tournaments treat a slope-capable laser as fine only when the feature is visibly disabled."], blocks: [{ kind: "atAGlance", title: "THE SHORT ANSWER", items: [{ label: "BUY A LASER IF", value: "You flag-hunt and play good courses" }, { label: "BUY A WATCH IF", value: "You just need front, middle, back" }, { label: "BUY NEITHER IF", value: "You are not yet clubbing consistently" }, { label: "WHAT SAVES SHOTS", value: "Knowing the number to the back" }] }, { kind: "table", head: ["On the course", "Laser", "GPS watch"], rows: [["Distance to the flag", "Exact, wherever it is cut", "Middle only — could be 12 yards off"], ["Time per shot", "15 to 30 seconds, both hands", "Glance at your wrist"], ["Blind tee shot", "Useless without a target", "Its best moment"], ["Layup and hazard numbers", "One at a time", "All of them, instantly"], ["Rain, wind, cold hands", "Fogged lens, shaky hold", "Unbothered"], ["Battery over 36 holes", "Months on one cell", "Charge it the night before"], ["Where it pays", "Approach shots inside 175", "Everything else, faster"]] }, { kind: "p", html: "Neither one is better. One is precise and slow, the other is quick and approximate, and only one of those problems costs you shots." }, { kind: "keyStat", value: "30 yds", label: "Front to back on a big green. If you are playing to the middle number and the pin is at the back, you are one full club short before you swing — and that is the actual mistake either device is there to prevent." }, { kind: "image", src: blogMedia.bunkerGreen, alt: "A raked bunker short of the green, the flag beyond it", caption: "The number is only worth what you do with it, and most players use it to confirm the club they already pulled.", position: "50% 40%" }] },
        { id: "saves-a-stroke", title: "What actually saves you a stroke", paragraphs: ["Not the third decimal place. Four habits do almost all the work, and three of them are free."], blocks: [{ kind: "steps", items: [
          { title: "Play to the back number, not the flag", body: "Long is usually fine and short is usually a bunker. Knowing you have 168 to the back and 152 to the front is worth more than knowing it is 159 to the stick." },
          { title: "Know your real carry numbers", body: "Not your best-ever 7-iron. The one you hit when you are tired on the 15th. Most amateurs are a club and a half optimistic, and no device fixes that." },
          { title: "Get the number before it is your turn", body: "This is the entire pace-of-play argument, and it is why the watch wins for most groups: shoot the laser while somebody else is hitting, or glance at your wrist while you walk." },
          { title: "Use it to say no", body: "The best use of an exact yardage is talking yourself out of a shot you cannot hit — the 3-wood over water from 235 that needs to be your 7-iron laid up." },
        ] }, { kind: "quote", text: "Precision you cannot use is just a heavier golf bag." }] },
        { id: "buying-advice", title: "Buying advice for the $10 crowd", blocks: [{ kind: "cardGrid", items: [
          { title: "Cheap laser, good laser", body: "The gap between a budget rangefinder and a premium one is mostly how fast it locks on and how well it handles a shaky hand in the cold. Both give the same yardage. If you play twenty rounds a year, buy the cheap one and put the difference into green fees." },
          { title: "The watch you will actually wear", body: "A golf watch you leave in a drawer is worth nothing. If you already wear a smartwatch, start with a free golf app on it for a season before buying dedicated hardware — that is enough to find out whether you use yardages at all." },
          { title: "Your phone is a fine third option", body: "Every course app gives front-middle-back for free. It is slower to pull out than a watch and it eats the battery you need for scoring, but if you are deciding between a phone app and nothing, the app wins." },
          { title: "Skip both if you are not clubbing consistently", body: "If your 7-iron ranges from 130 to 165, an exact number has nothing to attach to. Spend that money on a lesson and a launch monitor session, get your carry distances, and then buy the device." },
        ] }, { kind: "callout", title: "THE ONE THING TO CHECK BEFORE COMPETITION", html: "Distance-measuring devices are generally allowed under the Rules of Golf, but the committee for your event can prohibit them entirely, and slope functions must be switched off. Two minutes on the entry sheet beats a conversation on the first tee." }, { kind: "image", src: blogMedia.bunkerFairway, alt: "A raked bunker in the foreground, with a flag on a tree-lined green beyond", caption: "The best device is the one that gives you a number without slowing the group down.", position: "50% 50%" }] },
        { id: "what-we-carry", title: "What we carry", paragraphs: ["Watch on the wrist for every shot, and one laser in the group for the times somebody genuinely needs an exact number — a <a href=\"/games/closest-to-pin\">closest-to-the-pin</a> game on a par 3, or a measured <a href=\"/games/longest-drive\">longest drive</a>. That covers about ninety-five percent of it, keeps the round moving, and means nobody is standing on a tee box waiting for four people to shoot the same bunker.", "And keep the yardage device separate from the scoring device. A phone doing GPS all afternoon is a phone that is dead when the round needs settling, which is the one moment of the round where the battery actually matters."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Laser for exact flag yardages, watch for front-middle-back without breaking stride.", "Play the back number, know your tired carry distances, and get the number early.", "Buy the cheap laser or the watch you will wear. Skip both if your clubbing is not settled.", "Do not let a GPS app drain the phone you are keeping the tally on."] }] },
      ],
    ),
  },
  {
    slug: "bandon",
    category: "trips",
    title: "Bandon on foot: what to play when the wind decides everything",
    excerpt: "Match play, quota, and why net stroke play falls apart when it blows 30 out of the southwest.",
    dek: "Match play, quota, and why a net stroke-play game falls apart the moment it blows 30 out of the southwest — with one windy round scored four different ways.",
    crumb: "Bandon",
    author: "From the GoLo team",
    date: "2026-10-09",
    readMins: 5,
    hero: { src: "/images/blog/bandon-hero.webp", alt: "A golfer and caddie walking toward a clifftop links green as a rain squall rolls in off the ocean, the flag blowing straight out", position: "94% 50%", mobile: "/images/blog/bandon-mobile.webp", og: "/images/blog/bandon-og.jpg" },
    related: ["skins-carryover", "nassau", "index-vs-course-handicap"],
    published: true,
    body: article(
      "You booked a links trip, you are walking every hole, and on the second morning it is blowing 30 out of the southwest with rain in it. Your golf will be fine — that is what you came for. Your side game will not. Stroke play does not survive weather like this, and the group usually finds that out somewhere around the 12th, when two of the four have stopped keeping score.",
      [
        { id: "wind-multiplier", title: "Wind is a handicap multiplier", paragraphs: ["Here is the thing nobody accounts for when they set the game in the hotel bar the night before: hard wind does not add the same number of shots to everybody. It adds a few to the good player and a pile to everybody else.", "A low handicap flights the ball down, takes more club, and accepts 30 feet. A 20-handicap cannot do that on command, so his misses get bigger, his three-putts multiply, and one hole into the teeth of it becomes a 9. His handicap was built on calm afternoons at home; it is not a wind handicap, and no allowance in the system pretends otherwise.", "So the format does the real work out here. The same two scorecards can produce a blowout or a one-hole match, depending entirely on how you agreed to count them."], blocks: [{ kind: "atAGlance", title: "LINKS SIDE GAMES AT A GLANCE", items: [{ label: "THE GOLF", value: "Walking, caddies, 36 a day" }, { label: "THE VARIABLE", value: "Wind, and it changes mid-round" }, { label: "WHAT WORKS", value: "Match play, quota, nine-hole matches" }, { label: "WHAT BREAKS", value: "Net stroke play and big totals" }] }] },
        { id: "four-ways", title: "One windy round, scored four ways", paragraphs: ["A real pairing: you play off 12, Rick plays off 20, and it blows all afternoon. You shoot 88. Rick shoots 104, and twelve of those shots live on three holes — a 9, an 8, and another 9, all into the wind."], blocks: [{ kind: "table", head: ["How you counted it", "Result", "When it was over"], rows: [["Net stroke play", "You win by 8 shots", "the 12th"], ["Net match play", "You win, 1 up", "the 18th green"], ["Quota points", "You +1, Rick −1", "the 17th"], ["Two nine-hole matches", "Front to Rick, back to you", "both went the distance"], ["Same two cards", "88 and 104", "four different afternoons"]] }, { kind: "p", html: "Nothing changed except the counting. Rick’s three disaster holes cost him twelve shots in stroke play and exactly three holes in <a href=\"/games/nassau\">match play</a>." }, { kind: "keyStat", value: "16", label: "Shots between the two gross scores. Match play compressed that into a one-hole match, because it does not care how badly you lose a hole — only that you lost it. In wind, that is not a technicality. It is the whole game." }, { kind: "image", src: "/images/blog/bandon-mid-1.webp", alt: "A flag whipping in the wind on a links green ringed by dunes and gorse, the ocean beyond under storm clouds", caption: "A links hole plays two clubs different depending on which way you walk off the green.", position: "50% 50%" }] },
        { id: "formats", title: "Four formats that survive 30 miles an hour", blocks: [{ kind: "cardGrid", items: [
          { title: "Match play, everything", body: "A hole is a hole. The 9 you made on the par 3 into the wind costs one hole, not six shots, so nobody is out of the game before lunch. If you only change one thing about your links side games, change this." },
          { title: "Quota, with a floor at zero", body: "Stableford scoring with no negatives — a wipe is simply zero points and you walk to the next tee. It keeps a card alive through two blowups and it is far easier to total on a wet scorecard than a running net." },
          { title: "Gross skins get cheap and good", body: "In hard wind a par wins most holes outright, which means skins carry less and get claimed by whoever is grinding best that hour. Play them gross and even the 20 can steal one with a bogey when everybody else makes doubles." },
          { title: "Two-man best ball on the worst day", body: "If the forecast is genuinely ugly, put everybody in pairs. Either ball counting means one player can take a hole off, which is exactly what happens when a squall comes through on the 7th." },
        ] }, { kind: "quote", text: "Match play does not care how badly you lost the hole. In a gale, that is the most generous rule in golf." }] },
        { id: "first-tee", title: "Settle these on the first tee, not the sixth", blocks: [{ kind: "cardGrid", items: [
          { title: "Gorse is a drop, not a search", body: "One look each, then drop at the edge for a shot and keep moving. Four people beating gorse with wedges in the rain is how a round becomes six hours." },
          { title: "If the wind moves your ball, play it from there", body: "Worth knowing rather than debating on the green: when natural forces move a ball at rest, there is no penalty and you play it from its new position. The exception is a ball on the green you have already marked and replaced, which goes back to its spot. On firm greens in 30 miles an hour, that will come up. Know it before it does." },
          { title: "Give the card to your caddie", body: "Best scorekeeper you will ever have: nothing riding on the match, dry hands, and he will remember the press you called on the 13th. Keeping your own score instead? Keep it in a phone, in a zipped pocket." },
          { title: "Cap the day, not the round", body: "Thirty-six holes means two games, and two games at the same amount is double what you agreed to risk. Set a number for the day — the afternoon round plays for whatever is left of it." },
        ] }, { kind: "callout", title: "PLAY THE NINE, NOT THE EIGHTEEN", html: "Links weather changes inside a round. A front nine downwind and a back nine into it are two different golf courses, so make them two different matches. Anyone who gets buried in the first half starts even after the turn, and the group stays honest about the fact that the wind, not the golf, did most of it." }, { kind: "image", src: "/images/blog/bandon-mid-2.webp", alt: "A hooded caddie in the rain holding a scorecard sealed in a plastic sleeve, a golf bag on his shoulder", caption: "On foot, in weather, the scorecard is the first thing to fail. Give it to somebody with dry hands.", position: "50% 5%" }] },
        // The design says GoLo scores quota and rolls the day into one number.
        // It does neither yet (47f2b8c), so this paragraph keeps the draft.
        { id: "one-number", title: "Thirty-six holes, one number", paragraphs: ["The practical problem out here is not the formats, it is the bookkeeping. Two rounds a day, a different game each time, and a scorecard that has been through the ocean. By dinner nobody can reconstruct the morning, so the group defaults to “call it even” — a quiet way of saying the game did not matter.", "GoLo scores match play and <a href=\"/games/skins\">skins</a> off the same card and nets each round to one number. It does not score quota, and it does not add the morning and the afternoon together yet, so a 36-hole day is two settle-ups. Write down each player’s number after the morning round and net the two by hand at dinner. You still keep your hands in your pockets and let the wind be the only thing you argue about."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Wind adds more shots to high handicaps than low ones. Net stroke play cannot absorb that.", "Match play caps a disaster at one hole. Quota with a floor at zero does the same thing.", "Split the round into two nine-hole matches, because the weather already did.", "Cap the day rather than the round, and let the caddie keep the card."] }] },
      ],
    ),
  },
  {
    slug: "scottsdale-trip-structure",
    category: "trips",
    title: "The Scottsdale buddies trip: a four-day side-game structure that works",
    excerpt:
      "One running tally, amounts that escalate, and a Day 4 format that keeps the guy down $60 in the fight.",
    date: "2026-10-08",
    updated: "2026-10-16",
    readMins: 5,
    dek: "One running tally, amounts that escalate, and a Sunday format that keeps the guy down $60 in the fight — plus the desert rules to settle before anybody flies.",
    crumb: "Scottsdale",
    author: "From the GoLo team",
    // TODO photo: the two inline figures are still stock frames: a desert course
    // or the group on the first tee for the first, and the clubhouse or the
    // settle-up for the second.
    hero: { src: "/images/blog/scottsdale-trip-structure-hero.webp", alt: "Four golf bags standing at the edge of a desert tee box, saguaros and a rocky ridge behind them in the low sun", position: "85% 50%", mobile: "/images/blog/scottsdale-trip-structure-mobile.webp", og: "/images/blog/scottsdale-trip-structure-og.jpg" },
    related: ["bandon", "nassau", "who-pays-first"],
    // Hidden for now at the owner's request (2026-10-30).
    published: false,
    body: article(
      "Eight guys, four rounds, one desert. The golf takes care of itself. What ruins buddies trips is the side games: a different game every morning, nobody sure what the running total is, and by Sunday two players have quietly stopped caring because they are down $80 with no way back. Here is a four-day structure that fixes both problems.",
      [
        { id: "one-ledger", title: "One ledger, four days", paragraphs: ["The single best decision a trip can make is to stop settling every night and start keeping one number per player for the whole weekend. Nightly settling turns four rounds into four unrelated afternoons; a trip ledger turns them into a tournament, and a tournament has a story.", "It also solves the mixed-ability problem: over one round the 6 beats the 19 most of the time, but over four formats the 19 gets two days that suit him. The four days below run a <a href=\"/games/best-score\">Best Score game</a> and <a href=\"/games/skins\">skins</a> on Thursday, a <a href=\"/games/nassau\">four-ball Nassau</a> on Friday, then a shamble and an adjusted quota."], blocks: [{ kind: "atAGlance", title: "THE TRIP AT A GLANCE", items: [{ label: "GROUP", value: "8 players, two foursomes" }, { label: "ROUNDS", value: "4, one format each" }, { label: "THE LEDGER", value: "One running total, all trip" }, { label: "AMOUNTS", value: "$10 → $20 → $30 → adjusted" }] }] },
        { id: "ladder", title: "The four-day ladder", blocks: [
          { kind: "steps", items: [
            { title: "Day 1 — Calibration day", body: "A $10 Best Score game plus $2 skins, individual. Cheap on purpose. You are here to find out whose index is real before the amounts go up." },
            { title: "Day 2 — Teams", body: "Draw partners by handicap (1 with 8, 2 with 7) and play a $20 four-ball Nassau. Presses on request only, and the draw means nobody chooses their way to an easy day." },
            { title: "Day 3 — The marquee round", body: "The expensive tee time, so put a team format on it: a shamble, $30 a man, two teams of four. Everybody hits a drive, everybody plays their own ball from the best one, best two net scores count." },
            { title: "Day 4 — The equalizer", body: "Individual quota, with each player’s target adjusted by where he sits on the ledger. The leader needs more points to collect; the guy who is buried gets a cushion." },
          ] },
          { kind: "table", head: ["Day", "Format", "Your ledger"], rows: [["Thursday", "$10 Best Score + $2 skins", "−$14"], ["Friday", "$20 four-ball Nassau", "+$40"], ["Saturday", "$30 shamble, two teams", "−$30"], ["Sunday", "Adjusted quota", "+$54"], ["Trip settle", "One transfer, Sunday night", "+$50"]] },
          { kind: "p", html: "Four formats, four results, one number at the end. Nobody paid anybody until Sunday." },
          // The design says a four-point cushion, but one point per $20 makes
          // $60 down worth three.
          { kind: "keyStat", value: "$60", label: "What Rick was down walking to the first tee on Sunday. His adjusted quota gave him a three-point cushion, he shot the round of his trip, and he flew home even. That is the entire argument for Day 4." },
          { kind: "image", src: blogMedia.bunkerFairway, alt: "A raked bunker curving along the edge of the green, the flag beyond it", caption: "Two foursomes, four days, and one number that nobody argues about because everybody watched it move.", position: "50% 50%" },
        ] },
        { id: "day-four", title: "Why Day 4 has to be different", paragraphs: ["By Sunday morning the ledger has a leader and a straggler, and both of them are a problem. The leader wants to protect his number; the straggler has nothing to protect. An adjusted quota gives them both something to play for."], blocks: [{ kind: "cardGrid", items: [
          { title: "How the adjustment works", body: "Start everybody at their normal quota — 36 points minus course handicap, or whatever your group uses. Then move it one point for every $20 on the ledger: up for the leader, down for everybody in the red. Cap it at four points either way so it stays a golf game." },
          { title: "Why doubling the amounts is the wrong fix", body: "The obvious move is to make Sunday worth double. It does keep the straggler mathematically alive, and it also means the worst player on the trip can lose his whole weekend in one round. Adjust the target, not the money." },
          { title: "The bounty alternative", body: "If quota is a stretch for your group, run bounties instead: everybody who is down puts a price on the leader’s head, payable for any hole where you beat him straight up. Same effect, easier to explain on the range." },
          { title: "Close the ledger on 18, not at dinner", body: "Whatever Sunday’s format is, it ends when the last putt drops. No last-minute chip-offs in the parking lot, no double-or-nothing on the way to the airport. The ledger closes on the 18th green." },
        ] }, { kind: "quote", text: "A trip where two guys stop caring on Saturday is a trip that got the last round wrong." }] },
        { id: "desert-rules", title: "Desert rules worth agreeing on Thursday", paragraphs: ["Scottsdale golf has its own physics, and every one of these turns into a settle-up argument if you have not agreed it in advance. (Links golf has different physics; <a href=\"/blog/bandon\">the Bandon guide</a> covers what wind does to a side game.)"], blocks: [{ kind: "cardGrid", items: [
          { title: "One look in the desert, then drop", body: "Target golf punishes a pull, and a group of eight cannot afford four people searching cactus for three minutes. Agree on a one-minute look, then drop at the edge for a stroke. Pace of play is a side-game rule out here." },
          { title: "Heat is a handicap", body: "Peak season is February to April for a reason. If you are booking a summer trip, tee off at dawn, play nine-hole matches, and settle at the turn — nobody makes good decisions at 108 degrees, including about money." },
          { title: "Play the tees that make the match close", body: "The single biggest lever on a trip is tee selection. Desert courses stretch out fast; a group with a 6 and a 19 in it has a far better week from 6,400 yards than from 6,900." },
        ] }, { kind: "callout", title: "THE ONE RULE THAT SAVES TRIPS", html: "Announce the whole four-day structure before anybody books a flight, in the group text, in writing. Formats, amounts, and how Sunday is adjusted. Everything that goes wrong on a buddies trip goes wrong because the terms arrived after the deposits did." }, { kind: "image", src: blogMedia.course, alt: "A flagstick on a green at sunrise, with the clubhouse behind it", caption: "One settle, Sunday night. Eight players, four rounds, and nobody doing arithmetic at the airport.", position: "50% 45%" }] },
        // The design says GoLo carries the ledger across all four rounds. It
        // doesn't yet (47f2b8c), so this paragraph keeps the draft.
        { id: "settle-once", title: "Settle once, and settle small", paragraphs: ["Eight players over four days is a lot of small debts pointing in every direction. Settled naively it is twenty-odd settle-ups; netted properly it is usually five or six, because most of it cancels out — and nobody wants to work that out by hand at 10 p.m. with a flight in the morning.", "GoLo does not carry a ledger across rounds yet; a trip tally is on the list, not built. Today it nets each round into a short settle-up list on its own, so four days end with four short lists, and adding them into one number is still somebody’s job on Sunday night."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["One ledger for the whole trip. Do not settle nightly — it kills the story.", "Escalate the amounts and change the format daily: Best Score, four-ball, shamble, quota.", "Adjust Sunday’s target by the ledger, one point per $20, capped at four.", "Agree formats, amounts, and desert rules in the group text before anybody flies."] }] },
      ],
    ),
  },
  {
    slug: "what-we-got-wrong",
    category: "building",
    title: "What we got wrong building GoLo, from the commit log",
    metaDescription:
      "Fixes from GoLo's history, June to October 2026: money in floating point, presses lost on a re-save, skins settled early, and what each one taught us.",
    excerpt:
      "The app's own history, not our memory: what broke between June and October, how we found it, and what each fix changed.",
    dek: "The app’s own history, not our memory: what broke between the first commit in June and the 1.0.0 build in October, and what each fix taught us.",
    crumb: "Build notes",
    author: "From the GoLo team",
    // soleman23/golowebsite#75. Every fact here is in
    // docs/research/testing-summary.md, from soleman23/golo's history.
    date: "2026-10-16",
    updated: "2026-10-26",
    readMins: 6,
    hero: {
      src: "/images/blog/what-we-got-wrong-hero.webp",
      mobile: "/images/blog/what-we-got-wrong-mobile.webp",
      og: "/images/blog/what-we-got-wrong-og.jpg",
      alt: "A flag on a green beside a raked bunker, at sunset",
      position: "50% 55%",
    },
    // Hidden for now at the owner's request (2026-10-30).
    published: false,
    body: article(
      "GoLo’s commit history is more honest than our memory, so this is built from it. It covers what broke between the first commit on June 18, 2026 and the 1.0.0 build prepared as a Google Play candidate on October 15, and what each fix changed. That build wasn’t in the store yet when we wrote this; GoLo went live on Google Play on October 26, 2026. You won’t find tester counts here. We didn’t keep records good enough to publish numbers, so there aren’t any.",
      [
        { id: "money", title: "Money in floating point", paragraphs: ["Every game started out computing its results in dollars, as floating-point numbers, and rounding each player’s line at the end. Any split left residue: a total divided into equal shares, a team amount shared between partners, a carried skin split between tied leaders. A $10 total split across three players came to $3.33 each and added back to $9.99. The table no longer added up to zero, and a half-cent tolerance hid it.", "On August 1 every game moved to whole cents. Dollars become cents once, every addition and split is integer math, and a split hands out the leftover cents so the pieces add back to the total exactly. Whatever a player sees on the settle screen is what was computed."], blocks: [{ kind: "keyStat", value: "$9.99", label: "What a $10 total split three ways added back to before August 1. Since then every game settles in whole cents, and every split adds back to the total." }] },
        { id: "presses", title: "Re-saving Setup deleted the presses", paragraphs: ["On September 26, reading the code during a review, we found that saving Setup again on a round already in play rebuilt every game from scratch and cleared the presses. The closures those presses had made went with them. Fix a typo in a player’s name mid-round, and settle-up would add up as if nobody had ever pressed.", "It was fixed the same day. Saving Setup mid-round now keeps every press and closure, and a game with presses in play can’t be switched off or have its players or amount changed. Setup says so, and the round stays as it was."], blocks: [{ kind: "callout", title: "THE RULE WE TOOK FROM IT", html: "What a group did on the course isn’t setup. Fixing a name or a tee mustn’t touch anything that happened since the first hole." }] },
        { id: "skins", title: "A skins carry that settled early", paragraphs: ["The live money view used to split a carry among the players tied on the latest hole, even in the middle of the round. After a tied 3rd it showed two players up $1.50 each; then the 4th went to someone else outright, and the numbers moved. All the while the label said the skin was riding.", "Since September 28 a carry rides until the card’s last hole, and only a tie there splits it. The card says who split it and for how much. A live number has to be one the next hole can’t take back, so the screen now shows what’s riding, not what’s been won."] },
        { id: "smaller", title: "The smaller ones", blocks: [{ kind: "steps", items: [
          { title: "June 29: par as the default, counted only on Next", body: "Each hole opens at par so the scorer only adjusts. Before this, opening or just looking at a hole stamped par for every player. Now par counts when the scorer moves on or finishes, and stepping back never writes anything." },
          { title: "October 6: no pressing from an old hole", body: "A press starts on the hole after the one on screen. Step back to an earlier hole and you could still call one, so it covered holes already played, and with a close it froze the original match at the wrong score. Presses can’t be undone. The Press control now says to go to the latest hole first." },
          { title: "October 7: re-agree only when the terms change", body: "Every save of Setup used to ask every player to agree to the side games again. Now that happens only when the terms actually change: an amount, a game, a player’s name or handicap, the card. A player’s colour doesn’t count, and neither do presses called during play." },
          { title: "October 7: money to the cent", body: "Settled amounts read “$12.50”, not “$12.5”. A small thing, until it’s the number someone is about to send." },
        ] }] },
        // Unlinked while settle-up-screen is hidden; restore the <a href="/blog/settle-up-screen"> on republish.
        // claim-ok: quotes the site's old "fewest payments" claim in order to correct it (#103).
        { id: "website", title: "And one on our own website", paragraphs: ["Until October 16 this site said GoLo settles a group “in the fewest payments.” The app doesn’t promise that. It lines up who owes and who is owed, biggest first, and works down both lists. That never needs more than n − 1 settle-ups for n players, but it isn’t always the minimum: balances of +4, +3, −2, −2, −3 come out as four settle-ups where three would do. We corrected fifteen claims and the share card, and added a check that stops the claim coming back. The method, with a worked example you can check, is in our post on building the settle-up screen."] },
        { id: "today", title: "Where that leaves the app", paragraphs: ["Setup is five steps, with every game starting at a $1 amount. One scorer enters the card, and any hole already played can be changed from the card view. Presses are called from a short sheet on the Overall Match and start on the next hole. Skins carries are automatic when carryover is on, which it is by default. The organizer can change a game’s amount mid-round in Setup: everyone agrees again, the new amount applies to the whole game, and a game with presses in play can’t be changed. A round that has ended settles into a short settle-up list; GoLo never holds, moves or processes the money.", "Some things aren’t in the app at all: GPS yardages, scorecard scanning, a chat, a feed of other groups’ rounds, shot stats. Everyone entering their own scores isn’t built yet. The full list of what works today and what doesn’t is on <a href=\"/features\">features</a>, and one real round, start to settle, is on <a href=\"/how-it-works\">how it works</a>."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["Money adds up to the cent, or nobody trusts the rest of the screen. GoLo has settled in whole cents since August 1.", "Anything that happened on the course has to survive a fix in Setup. Presses were being deleted until September 26.", "A live number must be one the next hole can’t take back. Skins carries ride to the last hole since September 28.", "Check the claims as hard as the code. Our own site promised more than the settle-up does; it now says what the app does."] }] },
      ],
    ),
  },
  {
    slug: "settle-up-screen",
    category: "product",
    title: "Building the settle-up screen: from a ledger to who owes whom",
    metaDescription:
      "How GoLo turns a round of side games into a short settle-up list: net each player to one number, square the group, and show where each number came from.",
    excerpt: "The math was easy. Turning five players’ debts into a few legible settle-ups in a parking lot was not.",
    dek: "The math was the easy part. Turning five players’ debts into a handful of settle-ups — legibly, in a parking lot, in ninety seconds — was not.",
    crumb: "Settle-up screen",
    author: "From the GoLo team",
    date: "2026-10-15",
    // soleman23/golowebsite#103: the method is described as it is (greedy),
    // and "fewest" is kept only for this worked example, which is minimal.
    updated: "2026-10-16",
    readMins: 5,
    hero: { src: blogMedia.turf, alt: "Close-up of close-mown turf in low sun, a flagstick soft in the distance", position: "50% 46%" },
    // Hidden for now at the owner's request (2026-10-30).
    published: false,
    body: article(
      "The settle-up screen is the only screen in GoLo that has to be perfect. Everything before it happens while people are playing golf and forgiving. This one happens in a parking lot, with five people looking at one phone, and it either ends the round cleanly or starts the conversation we built the app to prevent. It took several versions to get right.",
      [
        { id: "math", title: "The math was the easy part", paragraphs: ["Adding up a Nassau, a skins game with carryovers and a Best Score is arithmetic. Any computer does it instantly and correctly. What it produces, though, is a pile of debts between pairs of players, game by game — you owe Rick for the front nine, Rick owes Mike two skins, Mike owes you on Best Score — and a five-player round with three games running can generate a dozen of them.", "Handing a group twelve separate debts is technically a complete answer and practically useless. Nobody is making twelve settle-ups. So the real job is not the accounting, it is reducing the accounting to a short list of transfers that clears it."], blocks: [{ kind: "atAGlance", title: "THE PROBLEM, SIZED", items: [{ label: "PLAYERS", value: "5" }, { label: "GAMES RUNNING", value: "Nassau, skins, Best Score" }, { label: "SEPARATE DEBTS", value: "12" }, { label: "SETTLE-UPS NEEDED", value: "4" }] }] },
        { id: "netted", title: "How GoLo works out who owes whom", paragraphs: ["Three steps. First, total every game for every player. Second, net those totals into one number per player — what they are up or down across everything — and those numbers always add up to zero, because every dollar someone is up, someone else is down. Third, line both sides up biggest first and work down: the top debtor pays the top creditor the smaller of their two balances, whoever is squared drops off the list, and so on until every balance is zero.", "Here is one five-player round with three games running, netted and squared. With ties in the numbers, the same round can square up through a different set of settle-ups of the same size:"], blocks: [{ kind: "table", head: ["Player", "Net", "Who owes whom"], rows: [["You", "+$47", "Owed $35 by Rick, $12 by Dave"], ["Mike", "+$18", "Owed $9 by Dave, $9 by Tom"], ["Tom", "−$9", "Owes Mike $9"], ["Dave", "−$21", "Owes you $12, owes Mike $9"], ["Rick", "−$35", "Owes you $35"], ["Settled", "$0", "Four settle-ups, twelve debts cleared"]] }, { kind: "p", html: "Check it: you are owed $47, Mike is owed $18, and the three players who are down settle exactly what they owe. The nets add up to zero, and nothing is approximated. Four is also the fewest this round allows: no smaller group of players’ numbers adds up to zero on its own, so there is no shortcut." }, { kind: "keyStat", value: "n − 1", label: "The most settle-ups a netted group ever needs: one fewer than the number of players. Every settle-up clears at least one balance, and because the nets add up to zero, the last one clears two. Five players, four settle-ups at most, no matter how many games were running. It is a ceiling, not a promise of the minimum: when a few players’ numbers happen to cancel among themselves, they could settle on their own and save a settle-up, and pairing biggest with biggest doesn’t always spot that." }] },
        { id: "what-we-tried", title: "What we tried before the settle-up list", blocks: [{ kind: "steps", items: [
          { title: "The ledger", body: "Every game, every hole, in order. Completely accurate and far too long. Groups scrolled it, gave up, and asked somebody to say the number out loud." },
          { title: "The matrix", body: "A who-owes-whom grid. Elegant on a whiteboard, unreadable on a phone, and easy to read in the wrong direction." },
          { title: "Net per player", body: "One plus or minus number each. Everybody understood it and immediately asked: so who owes who? It skipped the actual task." },
          { title: "The settle-up list", body: "One line per transfer, names and amounts in plain order, with the games behind each number a tap away. That is the version in the app." },
        ] }, { kind: "quote", text: "The hard part was never the math. It was making somebody believe a number they had not watched arrive." }] },
        { id: "rules", title: "The rules we ended up with", blocks: [{ kind: "cardGrid", items: [
          { title: "A short list beats full accounting", body: "Both are correct. Only one gets done in a parking lot. The itemized version is still there, one tap down, for whoever wants it." },
          { title: "Show where every number came from", body: "Netting creates settle-ups between players who had no game against each other. So every player’s number opens to the games behind it, and the surprise settle-up explains itself." },
          { title: "Mark it sent or received", body: "Tick each settle-up off as the money changes hands, so it’s clear what is still open." },
          { title: "Send it where the group already talks", body: "The share card puts the final scores, the amounts and who owes whom into the text thread the group already uses." },
        ] }, { kind: "callout", title: "THE RULE WE WILL NOT BREAK", html: "No number appears without its reason one tap away. A settle screen that cannot show its work is just a bill, and a bill from an app is exactly the thing a friendly game does not need." }] },
        { id: "does-not-do", title: "What it deliberately does not do", paragraphs: ["GoLo does not move money. It does not hold a balance, take a cut, or process a payment. It works out who owes what and then gets out of the way — you settle up outside the app, in whatever your group already uses. That was a product decision before it was a legal one: the app trusted with the tally is not automatically the app you want holding the money.", "It took several versions to land on something that reads like a friend saying “you get thirty-five from Rick.” That is the whole screen. It just took us a while to stop showing off the accounting. For the human side of the same moment, read <a href=\"/blog/who-pays-first\">the unwritten rules of settling up</a>, or watch one foursome’s round end in two settle-ups on <a href=\"/how-it-works\">how it works</a>."], blocks: [{ kind: "summary", title: "THE SHORT VERSION", items: ["A five-player round with three games running can produce a dozen debts — and never needs more than four settle-ups.", "Net every player to one number, then line debts and credits up biggest first and work down both lists until every balance is zero.", "Write the screen as instructions to a person, not as a table of results.", "Show where every number came from, and hand the summary to the group text."] }] },
      ],
    ),
  },
];

/** Newest first. The index and the "next post" links both read this order. */
export const postsByDate: Post[] = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const publishedPosts: Post[] = postsByDate.filter((p) => p.published);

/** One description for a post's meta tag, share card, Article node and llms.txt. */
export function postDescription(post: Post): string {
  return post.metaDescription ?? post.dek ?? post.excerpt;
}

/** When a post last changed: its revision date, else its publication date. */
export function postLastModified(post: Post): string {
  return post.updated ?? post.date;
}

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
  publishedPosts.find((p) => p.featured) ?? publishedPosts[0];

/**
 * Topics holding at least one of `list`. The rail only offers topics with a
 * card in the grid — and the featured post isn't in the grid — so a topic whose
 * only post is featured gets no chip and isn't a valid ?topic= value either
 * (FilterBoot falls back to "all"). Nobody is offered a filter that empties the
 * grid. Its CSS lines stay: the filter check reads blogCategoryIds, and the
 * chip returns when a post does.
 */
function topicsOf(list: Post[]): BlogCategory[] {
  return blogCategories.filter((c) => list.some((p) => p.category === c.id));
}

export type BlogFilter = { id: string; label: string; count: number };

/**
 * Chip data for the topic rail. Counts have to be of the cards the grid will
 * actually render, which means excluding whichever post is featured above it —
 * otherwise "Side-game etiquette 2" sits over a grid holding one card.
 */
export function blogFilters(excludeSlug?: string): BlogFilter[] {
  const inGrid = publishedPosts.filter((p) => p.slug !== excludeSlug);
  return [
    { id: "all", label: "All posts", count: inGrid.length },
    ...topicsOf(inGrid).map((c) => ({
      id: c.id,
      label: c.label,
      count: inGrid.filter((p) => p.category === c.id).length,
    })),
  ];
}

/** Every topic id the URL accepts, "all" included: the chips /blog renders. */
export const blogTopicIds: string[] = blogFilters(featuredPost?.slug).map(
  (f) => f.id,
);

export const blogCountLine = `${publishedPosts.length} posts · ${topicsOf(publishedPosts).length} topics`;

/** Hero status pill. The page renders it only while siteConfig.appLive is false. */
/** Follows siteConfig.iosLive, like the store buttons and the /faq pill. */
export const blogPrelaunchStatus = siteConfig.iosLive
  ? "Live on the web, Google Play and the App Store"
  : "Live on the web and Google Play — the iPhone app is coming to the App Store";

/** The /blog hero. The H1 names the topic a searcher types. */
export const blogHero = {
  kicker: "NOTES FROM THE CART PATH",
  title: "Golf game rules and side-game guides.",
  lead: "Format breakdowns, settling etiquette, and the arguments your group keeps having — written by people who keep score for money on a Saturday.",
};

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
