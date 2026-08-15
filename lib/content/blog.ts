/**
 * Blog content. Post bodies are a typed block union rather than markup, so
 * ProseBlocks can render them and adding a post is a data edit — never a new
 * page file. The index, the topic counts, the JSON-LD and the sitemap are all
 * generated from `posts`, so publishing is a one-line change.
 *
 * Eight posts are designed and one is written. The other seven ship as
 * `published: false` — they render as unlinked "coming soon" cards, keeping
 * the roadmap honest without pointing anyone at an empty page (handoff README
 * decision 4).
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
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "summary"; title: string; items: string[] };

export const blogCategoryIds = [
  "rules",
  "etiquette",
  "handicaps",
  "trips",
  "building",
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
  hero?: { src: string; alt: string };
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
];

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
    slug: "skins-carryover",
    category: "rules",
    title: "Skins, explained: the carryover is where the money is",
    excerpt:
      "How a $1 skin turns into a $9 hole, and the one setting that decides whether your group loves the format or bans it.",
    date: "2026-07-14",
    readMins: 6,
    published: false,
    body: [],
  },
  {
    slug: "wolf",
    category: "rules",
    title: "Wolf, for foursomes that can’t agree on anything",
    excerpt:
      "Pick a partner or go it alone, hole by hole. The rotation, the lone-wolf multiplier, and when the gamble is actually worth it.",
    date: "2026-07-02",
    readMins: 6,
    published: false,
    body: [],
  },
  {
    slug: "bingo-bango-bongo",
    category: "rules",
    title: "Bingo Bango Bongo keeps the 22-handicap interested",
    excerpt:
      "Three points a hole, no strokes required. The fairest game in golf for a group with a 6 and a 26 in it.",
    date: "2026-06-18",
    readMins: 5,
    published: false,
    body: [],
  },
  {
    slug: "pressing",
    category: "etiquette",
    title: "Pressing: when it’s fair game and when it’s just rude",
    excerpt:
      "The automatic 2-down press, the vulture press, and the one press that gets you left off next week’s text.",
    date: "2026-06-04",
    readMins: 6,
    published: false,
    body: [],
  },
  {
    slug: "index-vs-course-handicap",
    category: "handicaps",
    title: "Handicap index vs. course handicap: what goes on the card",
    excerpt:
      "Why a 12.4 becomes 14 strokes at one course and 11 at another — and how those strokes land hole by hole.",
    date: "2026-05-21",
    readMins: 8,
    published: false,
    body: [],
  },
  {
    slug: "scottsdale-trip-structure",
    category: "trips",
    title: "The Scottsdale buddies trip: a four-day betting structure that works",
    excerpt:
      "One running tally, stakes that escalate, and a Day 4 format that keeps the guy down $60 in the fight.",
    date: "2026-05-07",
    readMins: 9,
    published: false,
    body: [],
  },
  {
    slug: "forty-rounds",
    category: "building",
    title: "We tested GoLo on 40 rounds before writing any marketing",
    excerpt:
      "What real groups broke, what they ignored completely, and the three features we cut because nobody used them.",
    date: "2026-04-23",
    readMins: 7,
    published: false,
    body: [],
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
