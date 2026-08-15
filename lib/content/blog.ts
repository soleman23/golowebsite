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

export type Block =
  | { kind: "p"; html: string }
  | { kind: "h2"; text: string; id: string }
  | { kind: "atAGlance"; items: { label: string; value: string }[] }
  | { kind: "callout"; title: string; html: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "steps"; items: { title: string; body: string }[] }
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
  excerpt: string;
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
    date: "2026-07-28",
    readMins: 7,
    published: true,
    featured: true,
    // Body lands in prompt 07.
    body: [],
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
