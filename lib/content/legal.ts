/**
 * Section trees for /privacy and /terms.
 *
 * ── /privacy ─────────────────────────────────────────────────────────────
 * The policy text below is the repo's authoritative, reviewed copy. It was
 * migrated out of the old JSX page mechanically — extracted from the rendered
 * HTML, not retyped — and the rendered result was diffed against the previous
 * page to confirm not a word changed. If you edit it, edit the words a lawyer
 * approved, and diff again.
 *
 * The `plain` notes and the `short` panel are NOT policy. They're presentation:
 * a gloss beside the legal text, never instead of it. They are written against
 * the sections below, not against the design prototype — the prototype's notes
 * describe a shorter, different policy and get several facts wrong for this one
 * (it claims no analytics provider and immediate deletion; §1, §4 and §8 say
 * otherwise).
 *
 * ── /terms ───────────────────────────────────────────────────────────────
 * DESIGN COPY, NOT LEGAL COPY. Straight from the prototype and never reviewed
 * by a lawyer, which is why siteConfig.termsPublished gates the route out of
 * the sitemap, the nav and the search index. Where the prototype contradicted
 * the reviewed privacy policy, the privacy policy won — those spots are
 * flagged inline so whoever reviews this can see what moved.
 */

import { siteConfig } from "@/lib/siteConfig";

export type LegalBlock =
  | { kind: "p"; html: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "dl"; items: { term: string; text: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "address"; lines: string[] };

export type LegalSection = {
  num: string;
  id: string;
  title: string;
  /** The "in plain English" gloss. Presentation — never load-bearing. */
  plain?: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  slug: "privacy" | "terms";
  title: string;
  kicker: string;
  /** Hero standfirst. Presentational summary, not part of the legal text. */
  lead: string;
  /**
   * How the document labels its own date. Privacy says "Last updated" because
   * that is what the reviewed page said; changing it to "Effective date" would
   * assert something the lawyer did not.
   */
  dateLabel: string;
  effective: string;
  entity: string;
  /** Paragraphs before section 1, verbatim and in order. */
  intro: LegalBlock[];
  short: {
    tag: string;
    title: string;
    sub: string;
    lines: { tag: string; text: string }[];
  };
  sections: LegalSection[];
  contact: { kicker: string; blurb: string };
  cta: { title: string };
};

/** Rough reading time from the document's own word count — never typed by hand. */
export function legalReadMinutes(doc: LegalDoc): number {
  const text = [...doc.intro, ...doc.sections.flatMap((s) => s.blocks)]
    .map((b) => {
      if (b.kind === "p") return b.html;
      if (b.kind === "h3") return b.text;
      if (b.kind === "ul") return b.items.join(" ");
      if (b.kind === "dl") return b.items.map((i) => `${i.term} ${i.text}`).join(" ");
      if (b.kind === "table") return [...b.head, ...b.rows.flat()].join(" ");
      return b.lines.join(" ");
    })
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

const privacyIntro: LegalBlock[] = [
  { kind: "p", html: "GoLo Golf LLC (“GoLo,” “we,” “us,” or “our”) provides the GoLo Golf mobile application, web application, website, and related services (collectively, the “Service”). GoLo helps golfers organize rounds, enter and share scores, track side games and agreed dollar stakes, calculate who owes whom, and record whether participants mark a settlement as sent or received." },
  { kind: "p", html: "GoLo does <strong>not</strong> accept deposits, hold funds, transfer money, charge payment cards, provide a wallet, set betting odds, take a percentage of a wager, or verify that an off-platform payment occurred. Any settlement takes place directly between the participants outside GoLo." },
  { kind: "p", html: "This Privacy Policy explains what information we collect, how we use and disclose it, how long we retain it, and the choices available to you." },
];

const privacySections: LegalSection[] = [
  {
    num: "01",
    id: "section-1",
    title: "Information We Collect",
    blocks: [
      { kind: "h3", text: "Information you provide" },
      { kind: "p", html: "We may collect the following information when you create an account, set up your profile, use the Service, or contact us:" },
      {
        kind: "ul",
        items: [
          "<strong>Account and contact information:</strong> email address, password or authentication credentials, phone number, account identifier, and authentication status. Passwords are processed through our authentication provider and are not visible to GoLo in readable form.",
          "<strong>Profile information:</strong> name, nickname or handle, profile photo, home golf club, handicap index, notification preferences, and saved game preferences.",
          "<strong>Golf association information:</strong> if you choose to connect an authorized golf-association service, information such as your GHIN number, handicap index, connection status, authorization tokens, synchronization dates, and eligible scores submitted at your direction.",
          "<strong>Round and scoring information:</strong> courses, tees, dates, formats, players, teams, handicaps, hole-by-hole scores, pars, stroke indexes, side-game selections, game events, invitations, leaderboards, round history, and shared round summaries.",
          "<strong>Side-game and settlement information:</strong> game rules, agreed dollar stakes, participant acceptance or rejection of game terms, calculated winnings and losses, who owes whom, settlement amounts, payment handles such as a Venmo username, payment-request status, and participant-entered sent or received confirmations and timestamps.",
          "<strong>Participant information entered by another user:</strong> a round organizer may enter another participant’s name, email address, phone number, handicap, or payment handle to organize a round and match that participant to an account. Users should provide another person’s information only when they have permission to do so.",
          "<strong>Communications:</strong> information included in support requests, emails, feedback, or other messages sent to us.",
          "<strong>Website download-link requests:</strong> the phone number you enter when you ask us to text you an app download link, together with delivery status and related technical records.",
        ],
      },
      { kind: "h3", text: "Location and course-search information" },
      { kind: "p", html: "If you choose <strong>Nearby Courses</strong>, GoLo may request access to your device location and collect precise or approximate latitude and longitude to identify your city or region and find nearby golf courses. GoLo does not need location access for manual course search, and we do not use location for background tracking." },
      { kind: "p", html: "The current app may cache location coordinates and the resulting city or state on your device for up to 24 hours. Coordinates or location search terms may be sent through GoLo’s server provider to a geocoding service and course-data provider to return nearby results. Those providers may receive the coordinates, city or state, search query, IP address, and routine request metadata under their own privacy terms." },
      { kind: "h3", text: "Device, usage, and diagnostic information" },
      { kind: "p", html: "We and our service providers may automatically collect:" },
      {
        kind: "ul",
        items: [
          "IP address, device type, operating system, browser type, app version, language, and time zone;",
          "session, account, installation, and push-notification tokens or identifiers;",
          "app interactions, feature usage, notification delivery and interaction information, referring pages, and approximate timestamps;",
          "crash reports, error messages, performance information, server logs, and other diagnostic data; and",
          "information stored through cookies, browser storage, app storage, or similar technologies needed to keep you signed in, restore an active round, remember settings, cache course or location results, and prevent duplicate notifications.",
        ],
      },
      { kind: "p", html: "We do not use this information to track you across unaffiliated companies’ apps or websites for targeted advertising." },
      { kind: "h3", text: "Information from third parties" },
      { kind: "p", html: "We may receive information from:" },
      {
        kind: "ul",
        items: [
          "other players who add you to a round or submit information about the round;",
          "authentication, hosting, storage, notification, analytics, crash-reporting, email, and text-message providers;",
          "golf-course databases, geocoding services, and authorized golf-association services; and",
          "app stores and operating-system providers, such as Apple, when they provide installation, subscription, crash, or notification information.",
        ],
      },
    ],
  },
  {
    num: "02",
    id: "section-2",
    title: "How We Use Information",
    blocks: [
      { kind: "p", html: "We use information to:" },
      {
        kind: "ul",
        items: [
          "create, secure, and manage accounts;",
          "identify players across rounds and devices;",
          "organize rounds and match players to invitations;",
          "calculate scores, handicaps, leaderboards, side-game results, and settlements;",
          "record participant acceptance of side-game terms and participant-entered payment statuses;",
          "synchronize live rounds, scores, events, and history across authorized devices;",
          "provide nearby-course search, course details, tees, ratings, slopes, pars, and stroke indexes;",
          "send account, live-scoring, agreement, settlement, support, and other requested notifications;",
          "send a download link or respond to a support request you initiated;",
          "provide optional golf-association connections and submit an eligible score only when you direct us to do so;",
          "personalize settings and restore unfinished activity;",
          "analyze performance, troubleshoot problems, prevent fraud or misuse, and improve the Service;",
          "enforce our agreements and protect GoLo, our users, and others; and",
          "comply with legal obligations and respond to lawful requests.",
        ],
      },
    ],
  },
  {
    num: "03",
    id: "section-3",
    title: "Side Games, Dollar Stakes, and Payments",
    blocks: [
      { kind: "p", html: "GoLo is a scorekeeping and recordkeeping tool. Users may enter private side-game terms and dollar stakes, and GoLo may calculate a suggested settlement and record participant-entered sent or received statuses." },
      { kind: "p", html: "GoLo does not:" },
      {
        kind: "ul",
        items: [
          "accept, store, custody, or transfer money;",
          "process debit cards, credit cards, bank accounts, or payment credentials;",
          "sell wagering credits or virtual currency;",
          "set odds, match bettors, take a rake, or award prizes; or",
          "guarantee, verify, collect, or enforce any payment.",
        ],
      },
      { kind: "p", html: "Payment handles are displayed or copied only to help participants settle directly using a service they choose. A “sent,” “received,” or “settled” status reflects information entered by users and is not independent confirmation from a bank or payment service." },
    ],
  },
  {
    num: "04",
    id: "section-4",
    title: "When We Disclose Information",
    blocks: [
      { kind: "h3", text: "Other round participants" },
      { kind: "p", html: "People participating in or invited to a round may see information needed for the shared experience, including your display name, profile photo, handicap, team, scores, game selections, agreed stakes, acceptance status, calculated results, settlement amount, and participant-entered sent or received status." },
      { kind: "p", html: "GoLo is not intended to expose your account email address, phone number, authentication credentials, or private golf-association tokens to other players. A payment handle may be displayed to relevant settlement participants when you choose to add one." },
      { kind: "h3", text: "Service providers" },
      { kind: "p", html: "We disclose information to vendors that perform services for us, such as:" },
      {
        kind: "ul",
        items: [
          "<strong>Supabase</strong>, for authentication, database hosting, file storage, real-time synchronization, and server functions;",
          "<strong>Apple and operating-system providers</strong>, for app distribution, device permissions, and native push notifications;",
          "<strong>Netlify or other hosting providers</strong>, for website or web-app hosting and delivery;",
          "<strong>OpenStreetMap’s Nominatim service or another geocoding provider</strong>, for converting a location or search term into a city, region, or coordinates;",
          "<strong>golf-course and golf-association data providers</strong>, including authorized USGA/GHIN services when enabled, for course, tee, rating, handicap, and score-posting functions;",
          "<strong>email, text-message, and push-delivery providers</strong>, for messages requested by you or needed to operate the Service; and",
          "<strong>analytics, logging, and crash-reporting providers</strong>, for performance measurement, diagnostics, security, and troubleshooting.",
        ],
      },
      { kind: "p", html: "These providers may process information only for the services they provide to GoLo or as otherwise permitted by their own terms and applicable law." },
      { kind: "h3", text: "Legal, safety, and business disclosures" },
      { kind: "p", html: "We may disclose information when reasonably necessary to comply with law, legal process, or government requests; investigate fraud, security issues, or violations; protect rights, safety, or property; or complete a merger, financing, acquisition, reorganization, or sale of assets. If ownership changes, the recipient may continue to use information as described in this policy unless you are notified otherwise." },
    ],
  },
  {
    num: "05",
    id: "section-5",
    title: "Selling, Sharing, and Advertising",
    blocks: [
      { kind: "p", html: "GoLo does not sell personal information. GoLo does not share personal information for cross-context behavioral advertising and does not use personal information to track you across unaffiliated apps or websites for targeted advertising." },
      { kind: "p", html: "If these practices change, we will update this policy and provide any notice, consent, or opt-out required by law before beginning the new practice." },
    ],
  },
  {
    num: "06",
    id: "section-6",
    title: "Data Retention",
    blocks: [
      { kind: "p", html: "We retain information only for as long as reasonably necessary for the purposes described in this policy:" },
      {
        kind: "ul",
        items: [
          "<strong>Account, profile, round, scoring, side-game, agreement, settlement, and notification records:</strong> <!-- -->generally until you delete the information or your account, subject to shared-round records and legal obligations described below.",
          "<strong>Precise device location:</strong> cached by the current app on the device for up to 24 hours. GoLo does not intentionally build a long-term precise-location history. Routine server or provider logs may retain request data for a limited period.",
          "<strong>Push tokens:</strong> while notifications are enabled or until the token is revoked, expires, or the account is deleted.",
          "<strong>Support, download-link, email, and text-message records:</strong> <!-- -->generally up to 24 months after the communication, unless a longer period is needed to resolve an issue or comply with law.",
          "<strong>Analytics, logs, and crash diagnostics:</strong> generally up to 24 months, unless a shorter provider setting is available and appropriate.",
          "<strong>Backups:</strong> deleted information may remain in encrypted or access-restricted backups for up to 90 days before it is overwritten.",
        ],
      },
      { kind: "p", html: "We may retain information longer when reasonably necessary for security, fraud prevention, dispute resolution, enforcing agreements, or legal compliance. When full deletion would affect another user’s legitimate round history, GoLo may retain a de-identified version of shared scoring or settlement records after removing your account identifiers, contact details, profile photo, payment handle, and golf-association information." },
    ],
  },
  {
    num: "07",
    id: "section-7",
    title: "Your Choices and Privacy Rights",
    blocks: [
      { kind: "p", html: "Depending on where you live and subject to applicable law, you may have the right to request access to, correction of, deletion of, or a portable copy of personal information, and to appeal a denied privacy request. You may also have the right to obtain information about the categories of personal information we collect and disclose." },
      { kind: "p", html: "You can exercise many choices directly in the Service:" },
      {
        kind: "ul",
        items: [
          "update profile and payment-handle information;",
          "disable location access in device settings and use manual course search;",
          "change notification preferences or disable notifications in device settings;",
          "disconnect an optional golf-association connection;",
          "delete individual round-history items where available; and",
          "initiate account deletion under<!-- --> <strong>You → Account → Delete Account</strong>.",
        ],
      },
      { kind: "p", html: "If you cannot access your account, or to make another privacy request, email<!-- --> <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong>. We may need to verify your identity before completing a request. We will not discriminate against you for exercising a privacy right." },
    ],
  },
  {
    num: "08",
    id: "section-8",
    title: "Account Deletion",
    blocks: [
      { kind: "p", html: "You may initiate deletion in the app under<!-- --> <strong>You → Account → Delete Account</strong>. You may also request deletion by emailing<!-- --> <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong> <!-- -->if you cannot access the app." },
      { kind: "p", html: "Unless a longer period is required by law or needed to prevent fraud or resolve a dispute, GoLo will complete deletion from active systems within 30 days. Account deletion is intended to remove or de-identify:" },
      {
        kind: "ul",
        items: [
          "your authentication account and profile;",
          "contact information, profile photo, payment handle, and notification devices;",
          "private notification and agreement records associated only with your account;",
          "rounds you own, where deletion does not unlawfully impair another person’s rights; and",
          "your personal identifiers contained in rounds created by other users.",
        ],
      },
      { kind: "p", html: "Shared scores, game results, or settlement totals may remain in de-identified form so other participants can retain an accurate round history. Residual copies may remain in backups for up to 90 days and will not be restored to active use except for disaster recovery, security, or legal purposes." },
    ],
  },
  {
    num: "09",
    id: "section-9",
    title: "Security",
    blocks: [
      { kind: "p", html: "We use administrative, technical, and organizational safeguards designed to protect information, including authenticated access, encrypted network connections, database access controls, and restricted server credentials. No system is completely secure, and we cannot guarantee that unauthorized access, loss, or misuse will never occur." },
      { kind: "p", html: "You are responsible for protecting your password, device, invitation codes, and account access. Contact us promptly if you believe your account has been compromised." },
    ],
  },
  {
    num: "10",
    id: "section-10",
    title: "Children’s Privacy",
    blocks: [
      { kind: "p", html: "The Service is not directed to children under 13, and GoLo does not knowingly collect personal information from a child under 13. Dollar-stakes and settlement features may be used only by people legally permitted to participate in that activity in their location." },
      { kind: "p", html: "If you believe a child provided personal information to GoLo, contact<!-- --> <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong> <!-- -->so we can investigate and delete it as required." },
    ],
  },
  {
    num: "11",
    id: "section-11",
    title: "United States Service",
    blocks: [
      { kind: "p", html: "GoLo is currently offered in the United States. Information may be stored and processed in the United States and in other locations where our service providers operate, subject to appropriate protections and applicable law." },
    ],
  },
  {
    num: "12",
    id: "section-12",
    title: "Third-Party Services and Links",
    blocks: [
      { kind: "p", html: "The Service may link to or interoperate with services not controlled by GoLo, such as a payment app, golf association, app store, or course-data provider. Your use of those services is governed by their own terms and privacy policies. GoLo is not responsible for the independent privacy practices of third parties." },
    ],
  },
  {
    num: "13",
    id: "section-13",
    title: "Changes to This Policy",
    blocks: [
      { kind: "p", html: "We may update this policy as the Service, providers, or legal requirements change. We will post the updated policy at this page and revise the “Last updated” date. If a change materially affects your privacy, we will provide additional notice when required." },
    ],
  },
  {
    num: "14",
    id: "section-14",
    title: "Contact Us",
    blocks: [
      { kind: "address", lines: ["<strong>GoLo Golf LLC</strong>", "21196 Anne Lane", "Bend, Oregon 97702", "United States", "Email:<!-- --> <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong>"] },
    ],
  },
];
/**
 * Plain-English glosses, keyed by section id. Kept apart from the policy text
 * so it's obvious which words are the lawyer's and which are ours — and so
 * nobody edits a note and a clause in the same breath.
 */
const privacyPlain: Record<string, string> = {
  "section-1":
    "Your account basics, your profile, the rounds and scores you enter, the stakes your group agreed, and location only while you search for a course.",
  "section-2":
    "To run your account, score your rounds, keep the app working and answer you when you write in.",
  "section-3":
    "The settlement ledger is a scoreboard. Money never moves through GoLo, and we never verify that anyone actually paid.",
  "section-4":
    "Your group sees what you share with them. Beyond that it's the providers who run the app, plus the legal cases nobody gets a choice about.",
  "section-5":
    "We don't sell your personal information and we don't share it for cross-context advertising.",
  "section-6":
    "We keep things while your account is live, then delete them — with the specific windows spelled out below.",
  "section-7":
    "Edit your profile, turn location and notifications off, delete rounds, or delete the account outright. Email us if you can't get in.",
  "section-8":
    "You → Account → Delete Account. Shared rounds stay for the other players in de-identified form, and backups age out within 90 days.",
  "section-9":
    "Encrypted in transit and access-controlled — but no system is perfectly secure.",
  "section-10": "GoLo isn't for under-13s, and we don't knowingly collect from them.",
  "section-11":
    "A U.S. product, run on U.S. infrastructure, not built for non-U.S. privacy regimes.",
  "section-12":
    "Links and services we don't run come with their own privacy terms.",
  "section-13":
    "Changes get posted here with a new date, and material ones get real notice.",
  "section-14": `Everything privacy goes to ${siteConfig.supportEmail}.`,
};

export const privacyDoc: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  kicker: "LEGAL",
  lead: "What GoLo collects, how it gets used, and exactly what happens when you delete your account. Every section has a plain-English note beside the legal language.",
  dateLabel: "Last updated",
  effective: "July 16, 2026",
  entity: siteConfig.addressShort,
  intro: privacyIntro,
  short: {
    tag: "THE SHORT VERSION",
    title: "We collect what the scorecard needs. Nothing else.",
    sub: "A summary, not a substitute — the full policy below is what governs.",
    lines: [
      {
        tag: "NO SALE",
        text: "We never sell your personal information, and we don't share it for cross-context advertising.",
      },
      {
        tag: "NO ADS",
        text: "GoLo runs no ads and sends no marketing pushes. Notifications are round activity, and they're switchable.",
      },
      {
        tag: "YOUR CALL",
        text: "Delete your account from the app at any time; active systems are cleared within 30 days.",
      },
    ],
  },
  sections: privacySections.map((section) => ({
    ...section,
    plain: privacyPlain[section.id],
  })),
  contact: {
    kicker: "PRIVACY QUESTIONS",
    blurb:
      "Requests about your data, or anything in this policy you'd like explained in fewer words.",
  },
  cta: { title: "That's the whole policy. Now go win the back nine." },
};

/* ─────────────────────────── /terms ─────────────────────────── */

export const termsDoc: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  kicker: "LEGAL",
  lead: "The rules of the road for using the GoLo app and golo.golf. Written to be read — every section has a plain-English note beside the legal language.",
  dateLabel: "Effective date",
  effective: "July 31, 2026",
  entity: siteConfig.addressShort,
  intro: [
    {
      kind: "p",
      html: 'Welcome to GoLo. These Terms of Service ("Terms") govern your access to and use of the GoLo golf app and golo.golf website (together, the "Service"), operated by GoLo Golf LLC ("GoLo," "we," "us," "our"). By creating an account or using GoLo, you agree to these Terms.',
    },
  ],
  short: {
    tag: "READ THIS FIRST",
    title: "GoLo is a scoreboard. It is not a betting app.",
    sub: "A summary, not a substitute — the full terms below are what govern.",
    lines: [
      {
        tag: "18+",
        text: "You must be 18 or older (or your state's age of majority) to use GoLo.",
      },
      {
        tag: "US",
        text: "GoLo is currently available only to users located in the United States.",
      },
      {
        tag: "§",
        text: "Wager-style formats are your call — you are responsible for knowing what is lawful where you play.",
      },
    ],
  },
  sections: [
    {
      num: "01",
      id: "eligibility",
      title: "Eligibility and Availability",
      plain: "You need to be 18+ and in the United States.",
      blocks: [
        {
          kind: "p",
          html: "GoLo is currently available only to users located in the United States and is intended for users 18 years of age or older (or the age of majority in your state). By using GoLo, you represent that you meet these requirements.",
        },
      ],
    },
    {
      num: "02",
      id: "the-service",
      title: "The Service",
      plain:
        "GoLo is a scorekeeper for golf games — it tracks who owes whom, and nothing more.",
      blocks: [
        {
          kind: "p",
          html: 'GoLo is a golf scoring and game-format tracking app. It allows users to record round scores, apply game formats (e.g., points, skins, or wager-style formats), and track a running "settlement status" ledger of who owes whom within a group — as a scoreboard feature only.',
        },
      ],
    },
    {
      num: "03",
      id: "not-betting",
      title: "GoLo Is Not a Betting or Payments App",
      plain:
        "GoLo never touches a dollar. If money changes hands, you handle it yourselves — and it is on you to know your local laws.",
      blocks: [
        {
          kind: "p",
          html: "GoLo does not process, transmit, hold, or facilitate money in any form. GoLo has no payment processor, wallet, or in-app currency. Any settlement status shown in the app is purely informational — a scoreboard, not a transaction.",
        },
        {
          kind: "p",
          html: "If you save a Venmo or other payout handle to your profile, GoLo simply displays it to the other players in your group; GoLo is not connected to Venmo or any payment service. If players choose to exchange money based on a game's outcome, that exchange happens entirely outside the app, directly between the players, at their own discretion and risk. GoLo:",
        },
        {
          kind: "ul",
          items: [
            "Does not verify, guarantee, collect, or distribute any money owed between users",
            "Does not take a fee, rake, or commission on any settlement",
            "Is not a licensed money transmitter, payment processor, or gambling operator",
            "Disclaims all responsibility for any money-related dispute or exchange between users",
          ],
        },
        {
          kind: "p",
          html: "You are solely responsible for determining whether any wager-style game format you use with GoLo is lawful in your jurisdiction. GoLo does not endorse, encourage, or facilitate real-money wagering.",
        },
      ],
    },
    {
      num: "04",
      id: "accounts",
      title: "Accounts",
      plain: "Keep your login private, and tell us fast if something looks off.",
      blocks: [
        {
          kind: "p",
          // Prototype hardcoded support@gologolf.app; the address of record
          // lives in siteConfig and is what /privacy uses.
          html: `You must provide accurate information to create an account and are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Contact ${siteConfig.supportEmail} if you suspect unauthorized use.`,
        },
      ],
    },
    {
      num: "05",
      id: "acceptable-use",
      title: "Acceptable Use",
      plain: "Don't break the law, don't break the app, and don't fake scores.",
      blocks: [
        { kind: "p", html: "You agree not to:" },
        {
          kind: "ul",
          items: [
            "Use GoLo for any unlawful purpose, including operating illegal gambling",
            "Attempt to reverse-engineer, disrupt, or gain unauthorized access to the Service",
            "Upload content that is infringing, abusive, or unlawful",
            "Misrepresent scores or data in a way intended to defraud another user",
          ],
        },
      ],
    },
    {
      num: "06",
      id: "user-content",
      title: "User Content",
      plain: "Your photo and your scores stay yours. We only use them to run the app.",
      blocks: [
        {
          kind: "p",
          html: "You retain ownership of content you submit (e.g., your profile photo, scores). By submitting content, you grant GoLo a limited, non-exclusive license to store, display, and process that content solely to operate the Service, as described in our Privacy Policy.",
        },
      ],
    },
    {
      num: "07",
      id: "course-data",
      title: "Course Data",
      plain:
        "Course info comes from outside databases, so it can be wrong — and we are not affiliated with the courses listed.",
      blocks: [
        {
          kind: "p",
          html: "Golf course names, locations, and related data displayed in GoLo are provided for convenience and may be sourced from public or licensed third-party databases. GoLo does not guarantee the accuracy of course data and is not affiliated with the golf courses listed unless stated otherwise.",
        },
      ],
    },
    {
      num: "08",
      id: "ip",
      title: "Intellectual Property",
      plain: "The GoLo name, app and site are ours. Please don't copy them.",
      blocks: [
        {
          kind: "p",
          html: "The GoLo name, app, website, and associated content are owned by GoLo Golf LLC and protected by applicable intellectual property laws. You may not copy, modify, or distribute the Service without our written permission.",
        },
      ],
    },
    {
      num: "09",
      id: "disclaimers",
      title: "Disclaimers",
      plain: "GoLo comes as-is. We can't promise it never breaks.",
      blocks: [
        {
          kind: "p",
          html: 'GoLo is provided "as is" and "as available," without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee the Service will be uninterrupted, error-free, or secure.',
        },
      ],
    },
    {
      num: "10",
      id: "liability",
      title: "Limitation of Liability",
      plain:
        "If money changes hands offline and it goes sideways, that is between you and your group.",
      blocks: [
        {
          kind: "p",
          html: "To the maximum extent permitted by law, GoLo Golf LLC and its officers, employees, and service providers are not liable for any indirect, incidental, special, or consequential damages, or for any loss arising from money exchanged between users outside the Service, arising out of or related to your use of GoLo.",
        },
      ],
    },
    {
      num: "11",
      id: "termination",
      title: "Termination and Account Deletion",
      // Prototype said "instant and permanent". /privacy §8 — the reviewed
      // document — says in-app or by email, completed within 30 days, with
      // shared rounds de-identified. The reviewed text wins.
      plain:
        "Delete your account from the app any time. Shared rounds stay for the other players with your name removed.",
      blocks: [
        {
          kind: "p",
          html: "We may suspend or terminate your access to GoLo at any time for violation of these Terms or unlawful use.",
        },
        {
          kind: "p",
          html: "You may delete your account at any time using either of these paths:",
        },
        {
          kind: "ul",
          items: [
            "In the app: You → Account → Delete Account",
            // The prototype's third path was a /delete-account web page. That
            // page does not exist (handoff README decision 7), so it is not
            // offered here.
            `By email: if you cannot access your account, write to ${siteConfig.supportEmail} from the address on the account with "Delete My Account" in the subject line`,
          ],
        },
        {
          kind: "p",
          html: "Unless a longer period is required by law, deletion from active systems is completed within 30 days, and residual copies may remain in backups for up to 90 days.",
        },
        {
          kind: "p",
          html: "Rounds you played with other people, and any settlement records between you and another player, are retained for those players in de-identified form; see our Privacy Policy for exactly what is deleted, de-identified, and retained.",
        },
      ],
    },
    {
      num: "12",
      id: "governing-law",
      title: "Governing Law",
      plain: "Oregon law applies.",
      blocks: [
        {
          kind: "p",
          html: "These Terms are governed by the laws of the State of Oregon, United States, without regard to conflict-of-law principles.",
        },
      ],
    },
    {
      num: "13",
      id: "changes",
      title: "Changes to These Terms",
      plain:
        "We may update these Terms. Keep using GoLo after a change and you accept the new version.",
      blocks: [
        {
          kind: "p",
          html: "We may update these Terms from time to time. Continued use of GoLo after changes are posted at /terms constitutes acceptance of the revised Terms.",
        },
      ],
    },
    {
      num: "14",
      id: "contact",
      title: "Contact",
      plain: `One inbox for everything legal: ${siteConfig.supportEmail}.`,
      blocks: [
        {
          kind: "address",
          lines: [
            siteConfig.legalName,
            siteConfig.address.street,
            `${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`,
            siteConfig.address.country,
            `Email: ${siteConfig.supportEmail}`,
          ],
        },
      ],
    },
  ],
  contact: {
    kicker: "LEGAL QUESTIONS",
    blurb:
      "Anything about these terms, acceptable use, or a takedown. A person reads it.",
  },
  cta: { title: "Terms read. Now go win the back nine." },
};

/** The legal shelf, for the sub-nav and the "more from" cards. */
export const legalDocs: LegalDoc[] = [termsDoc, privacyDoc];

export function findLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
