/**
 * Section trees for the public and review-gated legal documents.
 *
 * ── /privacy ─────────────────────────────────────────────────────────────
 * GOLO-379 (soleman23/golo#956): the app sections come from app-privacy.json,
 * mirrored byte-for-byte from the app repo's governing-app-privacy.md.
 * Android 1.2.0 (27) stays immutable; these words describe its actual flows.
 * Website analytics, Play campaign links, sign-up attribution and their
 * retention/choice disclosures remain separate below. No legal counsel
 * review is claimed. Update both source copies deliberately.
 *
 * ── /terms ───────────────────────────────────────────────────────────────
 * DESIGN COPY, NOT LEGAL COPY. Straight from the prototype and never reviewed
 * by a lawyer, which is why siteConfig.termsPublished gates the route out of
 * the sitemap, the nav and the search index. Where the prototype contradicted
 * the published privacy policy, the privacy policy won — those spots are
 * flagged inline so whoever reviews this can see what moved.
 */

import appPrivacy from "@/lib/content/app-privacy.json";
import type { TableData } from "@/components/ui/DataTable";
import { siteConfig } from "@/lib/siteConfig";

/** The day the Clarity removal deployed. Set it to the actual deploy date. */
const CLARITY_ENDED = "October 20, 2026";

/** GA4's session cookie is named after the measurement ID: _ga_ + the ID without "G-". */
const GA_SESSION_COOKIE = `_ga_${siteConfig.gaMeasurementId.replace(/^G-/, "")}`;

export type LegalBlock =
  | { kind: "p"; html: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "dl"; items: { term: string; text: string }[] }
  | ({ kind: "table" } & TableData)
  | { kind: "address"; lines: string[] };

export type LegalSection = {
  num: string;
  id: string;
  title: string;
  /**
   * Shorter chip label for the TOC strip below 1100px, where a long title
   * won't fit at 320px. Presentation, like `plain`; the link's accessible name
   * stays the full title. Keep it a run of words lifted from `title`, so a
   * voice-control user can say what's on screen.
   */
  tocLabel?: string;
  /** The "in plain English" gloss. Presentation — never load-bearing. */
  plain?: string;
  blocks: LegalBlock[];
};

export type LegalSlug =
  | "privacy"
  | "terms"
  | "cookies"
  | "acceptable-use";

export type LegalDoc = {
  slug: LegalSlug;
  published: boolean;
  title: string;
  kicker: string;
  /** Hero standfirst. Presentational summary, not part of the legal text. */
  lead: string;
  /**
   * How the document labels its own date. Privacy says "Last updated", as the
   * original page did; "Effective date" would be a different claim.
   */
  dateLabel: string;
  /** Policy copy — rendered as-is beside `dateLabel`. */
  effective: string;
  /**
   * The same date in ISO, for machines (the sitemap's `lastModified`).
   *
   * Both fields exist because `effective` is policy copy that has to read
   * exactly as published, while `new Date("July 16, 2026")` parses as *local*
   * midnight — so /sitemap.xml emitted a different <lastmod> depending on the
   * build machine's timezone. ISO parses as UTC, which makes the build
   * reproducible. Keep the two in sync.
   */
  effectiveISO: string;
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

const privacyIntro: LegalBlock[] = appPrivacy.intro as LegalBlock[];

const privacySections: LegalSection[] = [
  ...appPrivacy.sections as LegalSection[],

  {
    num: "11",
    id: "website-analytics",
    title: "Website Analytics",
    tocLabel: "Website Analytics",
    blocks: [
      { kind: "p", html: "This section applies to the public website at golo.golf. The website can use one optional tool, <strong>Google Analytics</strong>, provided by Google LLC. It loads only after you choose <strong>Allow analytics</strong>, either in the notice shown on your first visit or under <a href=\"#analytics-choices\">Privacy choices</a>. Until you allow it, and if you decline, it isn’t loaded and nothing is sent to Google for analytics. The website works the same either way." },
      { kind: "h3", text: "What Google Analytics collects" },
      {
        kind: "ul",
        items: [
          "<strong>Pages and navigation:</strong> the pages you view and in what order, when you view them, how long a visit lasts, and the website you came from (its address without the query string).",
          "<strong>Interactions:</strong> clicks and taps on links and buttons, how far you scroll, when you start or submit a form (not what you type), and use of features such as FAQ answers, filters, share buttons, and app-store buttons.",
          "<strong>Device and approximate location:</strong> browser, device type, operating system, screen size, and language, and an approximate location, such as country, region, or city, that Google estimates from your IP address.",
          "<strong>Performance and errors:</strong> page-loading and responsiveness measurements, and script errors on our pages, with anything that looks like an email address or phone number removed first.",
          "<strong>Identifiers:</strong> random identifiers stored in cookies, listed below, that let Google Analytics recognize the same browser across pages and later visits.",
        ],
      },
      { kind: "p", html: "What you type into the website’s forms is not sent to Google Analytics. Our events contain labels, such as which link or button was used or which contact topic was chosen, not anything you typed. As each page loads, whether or not you allow analytics, the website also removes from the page address any query parameter it doesn’t use and any campaign parameter whose value contains an @ or a long run of digits, as an email address or phone number would, or is over 100 characters; a part of the path that looks like one is replaced with “redacted”, and such a fragment is dropped." },
      { kind: "h3", text: "Why we use it" },
      { kind: "p", html: "To understand how the website is used, find pages or steps that confuse people, improve the website’s content and usability, and find and fix errors and slow pages. GoLo does not use Google Analytics to identify individual visitors or for advertising." },
      { kind: "h3", text: "Cookies and browser storage" },
      { kind: "p", html: "If you allow analytics, these first-party cookies are set on golo.golf. Google’s default lifetime for them is two years, which Chrome limits to 400 days. The <a href=\"/cookies\">Cookie Policy</a> lists the same storage." },
      { kind: "table", head: ["Name", "Set by", "Purpose", "Lifetime"], rows: [
        ["_ga", "Google Analytics", "Distinguishes one browser from another", "Up to 2 years (400 days in Chrome)"],
        [GA_SESSION_COOKIE, "Google Analytics", "Keeps track of the current visit (session)", "Up to 2 years (400 days in Chrome)"],
      ] },
      { kind: "p", html: "Your choice itself is saved in your browser’s local storage under the name <strong>golo.analytics.consent.v2</strong>, as “granted” or “denied,” whichever way you choose, so the website can respect it on your next visit. The same value is also saved under the older name <strong>golo.analytics.preference</strong>, so pages still open from an earlier version of the website respect a decline too. Both stay until you change your choice or clear your browser’s site data." },
      { kind: "h3", text: "What Google receives and how it may use it" },
      { kind: "p", html: "When Google Analytics is on, your browser sends the information above, with your IP address, directly to Google. The Google Analytics tag sends this measurement data to more than one Google web address (for example, google-analytics.com and google.com); your analytics choice controls all of them, and none are sent until you allow analytics. Google processes this data to provide the service to GoLo. On October 20, 2026, GoLo turned off all of the Google Analytics data-sharing settings, so Google does not use data collected since then to improve its own products and services, include it in benchmarking or modeling, give its technical support staff access to it, or make recommendations to GoLo. Before that date, those settings were on. GoLo has also turned off Google signals and ad-personalization signals in its tag, has turned off Google signals data collection in its Google Analytics property, and does not allow ads personalization for its Google Analytics data. Learn more in <a href=\"https://policies.google.com/technologies/partner-sites\" rel=\"noopener noreferrer\">How Google uses information from sites or apps that use our services</a>." },
      { kind: "h3", text: "Your choices" },
      {
        kind: "ul",
        items: [
          "Allow or decline at any time under <a href=\"#analytics-choices\">Privacy choices</a>, linked from the footer of every page. The choice is saved in this browser.",
          `If you decline after allowing, the page reloads without Google Analytics (other open tabs stop collecting at once and reload the next time you leave them), and the website deletes the Google Analytics cookies it can reach (_ga, ${GA_SESSION_COOKIE}). Cookies on Google’s own domains can only be removed in your browser’s settings. Declining stops new collection; it doesn’t delete what was already sent.`,
          "If your browser sends a <strong>Global Privacy Control</strong> signal, the website keeps Google Analytics off, even if you allowed it earlier. This is how GoLo has chosen to treat that signal on this website.",
          "If your browser won’t let the website store your choice, the website can’t remember it: an Allow lasts only until the page is closed or reloaded, and you will be asked again.",
          "Google offers a browser add-on that blocks Google Analytics on all websites: <a href=\"https://tools.google.com/dlpage/gaoptout\" rel=\"noopener noreferrer\">Google Analytics opt-out add-on</a>.",
        ],
      },
      { kind: "h3", text: "Links to Google Play" },
      { kind: "p", html: "If you reach the website through one of GoLo’s own campaign links, such as the QR code on a printed table tent or the link in one of our social profiles, and then tap the Google Play button, that button’s link carries the campaign link’s names: its source, medium, and campaign (for example, <strong>table_tent</strong>, <strong>print</strong>, and <strong>golo_launch_2026q4_sim_bay</strong>). They are fixed labels GoLo chose for its own links, not information about you. Google Play uses them as an install referrer, so GoLo can see which campaigns lead to installs of the app. Because they are part of the link you choose to follow, they are passed to Google Play whether or not you allowed Google Analytics. Google receives them when you open Google Play, under Google’s own privacy policy. If you reach the website any other way, the Google Play link carries no campaign names." },
      { kind: "h3", text: "How long the data is kept" },
      { kind: "p", html: "GoLo keeps Google Analytics event- and user-level data available for analysis for 14 months. Google’s aggregated standard reports are not limited by that setting. To ask about or request deletion of website analytics data, email <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong>. Google Analytics doesn’t identify visitors to GoLo by name, so we may need the identifier from your browser’s _ga cookie to find data about you." },
      { kind: "h3", text: "Before opt-in (October 19, 2026)" },
      { kind: "p", html: "On October 19, 2026, from about 6:07 PM to 9:12 PM Pacific, Google Analytics loaded for visitors who had not declined and whose browser did not send a Global Privacy Control signal. Since then it loads only after you allow it." },
      { kind: "h3", text: "Earlier session recordings (Microsoft Clarity)" },
      { kind: "p", html: `From October 19, 2026 to ${CLARITY_ENDED}, the website also offered Microsoft Clarity, provided by Microsoft Corporation, under the same choice. If you allowed analytics in that period, Clarity recorded how you used our pages (the page content you were shown and your clicks, taps, scrolling and mouse movement, with form entries masked) as session replays and heatmaps, and set the cookies _clck and _clsk, which the website now deletes on your next visit. On October 19, from about 7:04 PM to 9:12 PM Pacific, Clarity ran unless a visitor declined or their browser sent a Global Privacy Control signal. Microsoft collected or received that personal data through Clarity to provide Microsoft Advertising and its other products and services, and its Clarity Terms of Use let it use the data for any purpose described in the <a href=\"https://privacy.microsoft.com/en-us/privacystatement\" rel=\"noopener noreferrer\">Microsoft Privacy Statement</a>, including creating user profiles for purposes that include advertising. Microsoft states that recordings are kept for 30 days, and heatmaps, dashboard data and a sample of recordings for up to 9 months. Questions go to <strong><a href=\"mailto:info@golo.golf\">info@golo.golf</a></strong>.` },
    ],
  },
  {
    num: "12",
    id: "section-5",
    title: "Selling, Sharing, and Advertising",
    blocks: [
      { kind: "p", html: "GoLo does not sell personal information for money, does not show ads, and does not use personal information to target advertising to you. GoLo has not linked its website analytics to any advertising account, has turned off Google signals and ad-personalization signals in its Google Analytics tag, and no longer uses Microsoft Clarity." },
      { kind: "p", html: `Google can use some information it receives through Google Analytics under its own terms, within the account settings described in <a href="#website-analytics">Website Analytics</a>. From October 19, 2026 to ${CLARITY_ENDED}, the website also used Microsoft Clarity, whose terms allow Microsoft to use personal data it collects through Clarity for any purpose described in the Microsoft Privacy Statement, including Microsoft Advertising and building profiles for purposes that include advertising. Depending on where you live, a privacy law could treat a disclosure like that as a “sale” or “sharing” of personal information. GoLo has not concluded that it is. GoLo stopped using Clarity for that reason; Google Analytics loads only if you allow it and stays off when your browser sends a Global Privacy Control signal.` },
      { kind: "p", html: "If these practices change, we will update this policy and provide any notice, consent, or opt-out required by law before beginning the new practice." },
    ],
  },
  {
  "num": "13",
  "id": "website-data",
  "title": "Website Sign-ups and Retention",
  "blocks": [
    {
      "kind": "p",
      "html": "This section applies only to the public golo.golf website, not to the Android app. Website account-free forms and analytics do not add an SDK or data flow to Android 1.2.0 (27)."
    },
    {
      "kind": "ul",
      "items": [
        "<strong>Website download-link requests:</strong> the phone number you enter when you ask us to text you an app download link, together with delivery status and related technical records.",
        "<strong>Where a website sign-up came from:</strong> when you join the newsletter or ask for a download link on the website, we also keep where that visit started: the path of the first page you landed on (not the rest of its web address), the domain of the website that referred you, and up to four names from the link you followed, if it carried them: its source, medium, campaign, and placement. We store the source only if, once converted to lower case, it is at most 64 characters of letters, digits, dots, hyphens, and underscores, with no @ sign, no run of seven or more digits (even if separated by spaces, dots, hyphens, or underscores), no UUID, and no run of 16 or more characters made only of the letters a–f and digits. We store the medium, campaign, and placement only when, together with the source, they exactly match a combination from GoLo’s own list of tagged-link names; otherwise we store none of the three. Apart from the page path and these names, we keep nothing from the link. We use these details only to count, in aggregate, which pages, websites, and links bring sign-ups."
      ]
    },
    {
      "kind": "p",
      "html": "Website support, download-link, email and text-message records are generally retained for up to 24 months unless a longer period is needed to resolve the request or comply with law. Website analytics retention and controls are described above. For website privacy requests, email info@golo.golf. The app account deletion and retention rules are in the app sections above."
    }
  ]
},
];

export const privacyDoc: LegalDoc = {
  slug: "privacy",
  published: true,
  title: "Privacy Policy",
  kicker: "LEGAL",
  lead: "What the app collects, what happens when you delete your account, and the separate choices for website analytics.",
  dateLabel: "Last updated",
  // Set to the day this version deploys (the Google Play install-referrer
  // disclosure, after golowebsite#143; before it, golo#803, #120 and #122).
  effective: "October 27, 2026",
  effectiveISO: "2026-10-27",
  entity: siteConfig.addressShort,
  intro: privacyIntro,
  short: {
    tag: "THE SHORT VERSION",
    title: "We collect what the scorecard needs. Nothing else.",
    sub: "A summary, not a substitute — the full policy below is what governs.",
    lines: [
      {
        tag: "NO SALE",
        text: "We don't sell your personal information for money or use it to target ads. Website analytics runs only if you allow it.",
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
  sections: privacySections,
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
  published: siteConfig.termsPublished,
  title: "Terms of Service",
  kicker: "LEGAL",
  lead: "The rules of the road for using the GoLo app and golo.golf. Written to be read — every section has a plain-English note beside the legal language.",
  dateLabel: "Effective date",
  effective: "July 31, 2026",
  effectiveISO: "2026-07-31",
  entity: siteConfig.addressShort,
  intro: [
    {
      kind: "p",
      html: 'Welcome to GoLo. These Terms of Service ("Terms") govern your access to and use of the GoLo golf app and golo.golf website (together, the "Service"), operated by GoLo Golf LLC ("GoLo," "we," "us," "our"). By creating an account or using GoLo, you agree to these Terms.',
    },
  ],
  short: {
    tag: "READ THIS FIRST",
    title: "GoLo is a scoreboard. It is not a betting app.",  // vocab-ok: disclaimer, says what GoLo is not
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
        text: "Wager-style formats are your call — you are responsible for knowing what is lawful where you play.",  // vocab-ok: the Terms exception in SIDE-GAME-POSITION §3
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
          html: 'GoLo is a golf scoring and game-format tracking app. It allows users to record round scores, apply game formats (e.g., points, skins, or wager-style formats), and track a running "settlement status" ledger of who owes whom within a group — as a scoreboard feature only.',  // vocab-ok: disclaimer, says what GoLo is not
        },
      ],
    },
    {
      num: "03",
      id: "not-betting",
      title: "GoLo Is Not a Betting or Payments App",  // vocab-ok: disclaimer, says what GoLo is not
      tocLabel: "Not a Betting or Payments App",  // vocab-ok: disclaimer, says what GoLo is not
      plain:
        "GoLo never touches a dollar. If money changes hands, you handle it yourselves — and it is on you to know your local laws.",
      blocks: [
        {
          kind: "p",
          html: "GoLo does not process, transmit, hold, or facilitate money in any form. GoLo has no payment processor, wallet, or in-app currency. Any settlement status shown in the app is purely informational — a scoreboard, not a transaction.",
        },
        {
          kind: "p",
          html: "If you save a Venmo username or similar handle to your profile, GoLo simply displays it to the other players in your group; GoLo is not connected to Venmo or any payment service. If players choose to exchange money based on a game's outcome, that exchange happens entirely outside the app, directly between the players, at their own discretion and risk. GoLo:",
        },
        {
          kind: "ul",
          items: [
            "Does not verify, guarantee, collect, or distribute any money owed between users",
            "Does not take a fee, rake, or commission on any settlement",
            "Is not a licensed money transmitter, payment processor, or gambling operator",  // vocab-ok: disclaimer, says what GoLo is not
            "Disclaims all responsibility for any money-related dispute or exchange between users",
          ],
        },
        {
          kind: "p",
          html: "You are solely responsible for determining whether any wager-style game format you use with GoLo is lawful in your jurisdiction. GoLo does not endorse, encourage, or facilitate real-money wagering.",  // vocab-ok: disclaimer, says what GoLo is not
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
            "Use GoLo for any unlawful purpose, including operating illegal gambling",  // vocab-ok: disclaimer, says what GoLo is not
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
      // Prototype said "instant and permanent". /privacy §8 — the published
      // document — says in-app or by email, completed within 30 days, with
      // shared rounds de-identified. The published text wins.
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

export const cookiesDoc: LegalDoc = {
  slug: "cookies",
  // Final and accurate since October 2026: always published (indexed, in the
  // sitemap and linked). NEXT_PUBLIC_COOKIES_PUBLISHED no longer exists.
  published: true,
  title: "Cookie Policy",
  kicker: "LEGAL · WEBSITE PREFERENCES",
  lead:
    "What golo.golf stores in your browser, when Google Analytics is allowed to load, and how to change that choice.",
  dateLabel: "Last updated",
  // Set to the day this version deploys.
  effective: CLARITY_ENDED,
  effectiveISO: "2026-10-20",
  entity: siteConfig.legalName,
  intro: [
    {
      kind: "p",
      html: "This Cookie Policy describes browser storage used by the public marketing website at golo.golf. It does not describe cookies used by the GoLo mobile app or a future authenticated web application. The <a href=\"/privacy#website-analytics\">Privacy Policy</a> covers Google Analytics in more detail, including what it collects and how Google may use it.",
    },
    {
      kind: "p",
      html: "The website does not use Supabase authentication cookies, advertising pixels, or retargeting tags. The inventory below reflects the website behavior that is actually implemented.",
    },
  ],
  short: {
    tag: "THE SHORT VERSION",
    title: "Nothing optional loads until you say so.",
    sub: "The one optional tool is Google Analytics. Until you allow it, and whenever your browser sends Global Privacy Control, it doesn't load.",
    lines: [
      { tag: "NECESSARY", text: "Your analytics choice is saved in this browser so the site can respect it next time." },
      { tag: "OPTIONAL", text: "If you allow it, Google Analytics measures visits and clicks. What you type into a form is never sent." },
      { tag: "NO AD TAGS", text: "GoLo adds no advertising pixels or retargeting tags." },
      { tag: "YOUR CONTROL", text: "Change your choice below at any time. Declining reloads the page without Google Analytics and deletes the analytics cookies this site can reach." },
    ],
  },
  sections: [
    {
      num: "01",
      id: "scope",
      title: "Scope",
      plain: "This document is about the public website in this browser.",
      blocks: [
        { kind: "p", html: "Browser storage includes cookies and local storage. Cookies are small values a site may send with later requests. Local storage remains in your browser and is not sent automatically with each request." },
        { kind: "p", html: "The whole website, including its games, blog, FAQ, contact form, and legal pages, works with analytics declined." },
      ],
    },
    {
      num: "02",
      id: "preference-storage",
      title: "Your Saved Choice",
      plain: "We remember allowed or declined so you aren't asked on every page.",
      blocks: [
        { kind: "p", html: "When you choose, GoLo saves <strong>granted</strong> or <strong>denied</strong> in local storage under the name <strong>golo.analytics.consent.v2</strong>. It is used only to decide whether Google Analytics may load, and it stays until you change it or clear your browser’s site data." },
        { kind: "p", html: "With no saved choice, nothing loads and the website asks you. If your browser won’t let the website save the choice, it lasts only until the page is closed or reloaded. Your current choice is also written under the older name <strong>golo.analytics.preference</strong>, so pages still open from an earlier version of the website respect a decline." },
      ],
    },
    {
      num: "03",
      id: "analytics",
      title: "Google Analytics",
      plain: "Loads only after you allow it. It measures visits and clicks, never what you type.",
      blocks: [
        { kind: "p", html: "If you allow analytics, the website loads the Google Analytics 4 tag, which sends page views and interactions (described in the Privacy Policy) to Google and sets the first-party cookies below. The tag is configured with Google signals and ad-personalization signals turned off. GoLo does not send names, email addresses, phone numbers, messages, or anything typed into a form as analytics data." },
        { kind: "table", head: ["Name", "Purpose", "Lifetime"], rows: [
          ["_ga", "Distinguishes one browser from another", "Up to 2 years (400 days in Chrome)"],
          [GA_SESSION_COOKIE, "Keeps track of the current visit (session)", "Up to 2 years (400 days in Chrome)"],
        ] },
        { kind: "p", html: "Google’s own default lifetime for these cookies is two years; Chrome limits any cookie to 400 days. See <a href=\"https://policies.google.com/technologies/partner-sites\" rel=\"noopener noreferrer\">how Google uses information from sites that use its services</a>." },
      ],
    },
    {
      num: "04",
      id: "clarity",
      title: "Earlier Session Recordings",
      plain: "The website no longer uses Microsoft Clarity; its old cookies are deleted on your next visit.",
      blocks: [
        { kind: "p", html: `From October 19, 2026 to ${CLARITY_ENDED}, the website also offered Microsoft Clarity session recordings and heatmaps under the same choice. Clarity set the first-party cookies <strong>_clck</strong> (a Clarity identifier, about 1 year) and <strong>_clsk</strong> (joins one visit's pages, about 1 day), and its script could also set cookies on Microsoft’s own domains, such as MUID and CLID. The website now deletes _clck and _clsk on your next visit. Cookies on Microsoft’s domains can only be removed in your browser’s settings. See the <a href="https://privacy.microsoft.com/en-us/privacystatement" rel="noopener noreferrer">Microsoft Privacy Statement</a>.` },
      ],
    },
    {
      num: "05",
      id: "controls",
      title: "Your Controls",
      plain: "Change your choice below at any time. GPC keeps Google Analytics off.",
      blocks: [
        { kind: "p", html: `Use the control on this page (also under Privacy choices in the footer) to allow or decline. If you decline after allowing, GoLo tells Google Analytics to stop, deletes the first-party cookies named _ga and ${GA_SESSION_COOKIE}, and reloads the page so it isn’t running. Cookies on Google’s own domains can only be removed through your browser’s settings, and declining doesn’t delete data already sent.` },
        { kind: "p", html: "You can also clear site data in your browser. Browser extensions, network filters, and privacy settings may block analytics regardless of the GoLo control." },
        { kind: "h3", text: "Global Privacy Control" },
        { kind: "p", html: "If your browser sends a Global Privacy Control signal, GoLo keeps Google Analytics off on this website, even if this browser saved an allow. The saved value isn’t changed, so the choice applies again if the signal stops. This is how GoLo has chosen to treat the signal on this website." },
      ],
    },
    {
      num: "06",
      id: "changes-contact",
      title: "Changes and Contact",
      plain: "If the website adds another browser-storage purpose, this inventory changes first.",
      blocks: [
        { kind: "p", html: `We update this policy when the website’s behavior changes. Questions about browser storage or analytics may be sent to <strong><a href="mailto:${siteConfig.supportEmail}">${siteConfig.supportEmail}</a></strong>.` },
      ],
    },
  ],
  contact: {
    kicker: "COOKIE QUESTIONS",
    blurb: "Ask what the website stored, report behavior that does not match this inventory, or request help changing a preference.",
  },
  cta: { title: "Preferences set. Back to the first tee." },
};

export const acceptableUseDoc: LegalDoc = {
  slug: "acceptable-use",
  published: siteConfig.acceptableUsePublished,
  title: "Acceptable Use Policy",
  kicker: "LEGAL · COMMUNITY RULES",
  lead:
    "The line between a friendly golf scorekeeper and conduct that does not belong on GoLo.",
  dateLabel: "Draft updated",
  effective: "August 18, 2026",
  effectiveISO: "2026-08-18",
  entity: siteConfig.legalName,
  intro: [
    { kind: "p", html: "This Acceptable Use Policy applies to the GoLo Service and supplements the Terms of Service. It is a legal draft and remains subject to review before publication." },
    { kind: "p", html: "You are responsible for following applicable law, course rules, tournament rules, and the agreements you make with other players." },
  ],
  short: {
    tag: "THE SHORT VERSION",
    title: "Keep it friendly, honest, and legal.",
    sub: "Do not use GoLo to harm people, attack systems, manipulate records, or run unlawful wagering activity.",  // vocab-ok: disclaimer, says what GoLo is not
    lines: [
      { tag: "PLAY FAIR", text: "Enter honest scores and do not alter another player’s results without authorization." },
      { tag: "KEEP IT LEGAL", text: "You are responsible for local law and course or competition rules." },
      { tag: "NO ABUSE", text: "No harassment, threats, impersonation, spam, or exploitation." },
      { tag: "NO ATTACKS", text: "Do not probe, disrupt, scrape, reverse engineer, or bypass access controls." },
    ],
  },
  sections: [
    {
      num: "01",
      id: "permitted-use",
      title: "Permitted Use",
      plain: "Use GoLo to organize golf, keep score, track agreed games, and calculate settlements.",
      blocks: [
        { kind: "p", html: "You may use GoLo for lawful personal, recreational, club, league, or course activities consistent with the Service’s intended functions and the rights of other people." },
      ],
    },
    {
      num: "02",
      id: "prohibited-conduct",
      title: "Prohibited Conduct",
      plain: "Do not use the product to cheat, harass, deceive, or cause harm.",
      blocks: [
        { kind: "p", html: "You may not use the Service to:" },
        { kind: "ul", items: [
          "violate applicable law, regulation, court order, course rule, or competition rule;",
          "organize, promote, or facilitate unlawful gambling or payment activity;",  // vocab-ok: disclaimer, says what GoLo is not
          "submit scores, identities, account details, settlement status, or other records you know are false or misleading;",
          "harass, threaten, stalk, shame, discriminate against, or expose private information about another person;",
          "impersonate another person or misrepresent your authority to act for a player, club, course, or organization;",
          "send spam, unwanted promotions, malware, or deceptive links; or",
          "infringe intellectual-property, privacy, publicity, or other rights.",
        ] },
      ],
    },
    {
      num: "03",
      id: "system-integrity",
      title: "System Integrity",
      plain: "Do not attack, scrape, overload, or work around the service.",
      blocks: [
        { kind: "ul", items: [
          "probe, scan, or test vulnerabilities without written authorization;",
          "bypass authentication, rate limits, safety controls, or access restrictions;",
          "interfere with availability or use automated traffic that degrades the Service;",
          "scrape, harvest, or export information except through features GoLo provides or with written permission;",
          "reverse engineer or attempt to extract source code except where law expressly permits it; or",
          "use the Service to develop or train a competing product without written permission.",
        ] },
      ],
    },
    {
      num: "04",
      id: "enforcement",
      title: "Enforcement",
      plain: "We may remove content or restrict accounts when necessary to protect people or the service.",
      blocks: [
        { kind: "p", html: "GoLo may investigate suspected violations and may warn, limit, suspend, or terminate access; remove or preserve relevant content; and cooperate with affected people, service providers, or lawful authorities when appropriate." },
        { kind: "p", html: "We consider context, severity, repetition, risk, and whether immediate action is necessary. Nothing in this policy requires GoLo to monitor every round or communication." },
      ],
    },
    {
      num: "05",
      id: "reporting",
      title: "Reporting and Questions",
      plain: "Send enough detail for a person to locate and assess the issue.",
      blocks: [
        { kind: "p", html: `Report suspected abuse to <strong><a href="mailto:${siteConfig.supportEmail}">${siteConfig.supportEmail}</a></strong>. Include the account, round, approximate time, and screenshots or links when available. Do not send passwords, payment credentials, or unnecessary sensitive information.` },
      ],
    },
  ],
  contact: {
    kicker: "REPORT A PROBLEM",
    blurb: "Abuse, security concerns, impersonation, or conduct that puts a player or the Service at risk. A person reads it.",
  },
  cta: { title: "Rules agreed. Keep the game friendly." },
};

/** The legal shelf, for the sub-nav and the "more from" cards. */
export const legalDocs: LegalDoc[] = [
  termsDoc,
  privacyDoc,
  cookiesDoc,
  acceptableUseDoc,
];

export function findLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
