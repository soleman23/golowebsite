/**
 * /contact content: the three route cards above the form, the direct-contact
 * channels beside it, and the six questions we answer every week.
 *
 * The topic ids and labels live in contactTopics.ts — see the note there for
 * why they're kept clear of this file's imports.
 */

import type { IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/siteConfig";
import { findFaqItem } from "./faq";
import type { ContactTopicId } from "./contactTopics";

export * from "./contactTopics";

/**
 * The three cards above the form. Each one preselects its topic and drops the
 * reader at the form, so the common paths don't require reading the picker.
 */
export type ContactRoute = {
  topic: ContactTopicId;
  icon: IconName;
  kicker: string;
  title: string;
  blurb: string;
  cta: string;
};

export const contactRoutes: ContactRoute[] = [
  {
    topic: "bug",
    icon: "warn",
    kicker: "SOMETHING'S WRONG",
    title: "Report a bug",
    blurb:
      "The skins didn’t carry, a press paid the wrong way, the app quit on 14. Tell us the round and the hole and we’ll chase it down.",
    cta: "REPORT IT",
  },
  {
    topic: "idea",
    icon: "star",
    kicker: "YOU'VE GOT A BETTER IDEA",
    title: "Request a feature",
    blurb:
      "A game we don’t score, a rule your group plays, a screen that should exist. Half the roster came in this way.",
    cta: "SEND THE IDEA",
  },
  {
    topic: "press",
    icon: "chat",
    kicker: "PRESS & PARTNERSHIPS",
    title: "Work with us",
    blurb:
      "Courses, leagues and clubs who want it running Saturday mornings — plus media, interviews and brand assets.",
    cta: "GET IN TOUCH",
  },
];

/** The aside beside the form: the ways in that aren't the form. */
export type ContactChannel = {
  id: string;
  icon: IconName;
  title: string;
  blurb: string;
  cta?: string;
  href?: string;
  /** Rendered as an <address> block instead of a link. */
  lines?: string[];
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    icon: "mail",
    title: siteConfig.supportEmail,
    blurb:
      "Bugs, account stuff, course fixes, or a rules argument you need settled. One inbox, no triage bot.",
    cta: "EMAIL US",
    href: `mailto:${siteConfig.supportEmail}`,
  },
  {
    id: "instagram",
    icon: "instagram",
    title: siteConfig.instagramHandle,
    blurb:
      "Best for quick questions, screenshots of an ugly scorecard, and general heckling.",
    cta: "OPEN INSTAGRAM",
    href: siteConfig.instagramUrl,
  },
  {
    id: "post",
    icon: "pin",
    title: "By post",
    blurb: "For anything that needs paper. It's a small office, so allow a week.",
    lines: [
      siteConfig.legalName,
      siteConfig.address.street,
      `${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`,
      siteConfig.address.country,
    ],
  },
];

/**
 * The fine print row. Draft legal documents remain omitted until publication,
 * while the account-deletion guide is always available.
 */
export type ContactLegalLink = { label: string; href: string };

export const contactLegalLinks: ContactLegalLink[] = [
  ...(siteConfig.termsPublished
    ? [{ label: "Terms", href: "/terms" }]
    : []),
  { label: "Privacy", href: "/privacy" },
  { label: "Delete account", href: "/delete-account" },
  { label: "Full FAQ", href: "/faq" },
];

/**
 * "Six things we answer every week." Deliberately not the same six as /faq's
 * most-asked panel — these are the ones that arrive by email. The deletion
 * answer is pulled from faq.ts rather than restated, since it's the same
 * question and the answer has to match /privacy §8 exactly.
 */
export type ContactFaqItem = { id: string; q: string; a: string };

const deleteAnswer = findFaqItem("q-delete");

export const contactFaqs: ContactFaqItem[] = [
  {
    id: "delete-account",
    q: "How do I delete my account?",
    a:
      deleteAnswer?.a ??
      `You → Account → Delete Account, in the app. Locked out? Email ${siteConfig.supportEmail} and we’ll do it for you.`,
  },
  {
    id: "export-rounds",
    q: "Can I get my rounds out?",
    // The handoff promised a "You → Download my data" screen. /privacy §7 lists
    // the in-app controls and that isn't one of them — a portable copy is a
    // request you make. Worded to match the policy.
    a: `Ask and you get one. Email ${siteConfig.supportEmail} and we’ll put together a portable copy of everything on your account — rounds, scores, settlements.`,
  },
  {
    id: "course-data",
    q: "The par or tees are wrong on my course.",
    a: "Send the course name and the hole. We fix those the same week — the whole scorecard leans on that data.",
  },
  {
    id: "touch-money",
    q: "Does GoLo touch the money?",
    a: "Never. The ledger is a scoreboard. Cash moves between you and your buddy in the parking lot, not through us.",
  },
  {
    id: "outside-us",
    q: "Can I use GoLo outside the U.S.?",
    a: "Not yet. U.S. only today — tell us where you play and we’ll add it to the list.",
  },
  {
    id: "response-time",
    q: "How fast do you write back?",
    a: "We read everything and answer as soon as we can. It’s a small team, not a call center — so no fake SLA.",
  },
];
