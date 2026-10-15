/**
 * /about copy. Every fact here comes from the owner (soleman23/golowebsite#71,
 * 2026-10-15) or from lib/content/capabilities.ts; nothing is inferred. Don't
 * add a credential, a user or round count, an award or a reviewer unless the
 * owner supplies it.
 */

import { siteConfig } from "@/lib/siteConfig";
import { capability } from "./capabilities";

const launched = capability("store-apps").status === "live";

export const aboutContent = {
  kicker: "ABOUT GOLO GOLF",
  title: "A scorekeeper for the games your group already plays.",
  lead: `${siteConfig.legalName} makes GoLo, a golf scorekeeping app that runs side games, applies handicaps and works out who owes whom. It started in ${siteConfig.foundingYear} in ${siteConfig.address.city}, ${siteConfig.address.region}.`,

  why: {
    kicker: "WHY IT EXISTS",
    title: "Two problems any group playing for a few dollars knows.",
    paragraphs: [
      "During the round, the games get hard to keep straight. A Nassau, skins with carryovers and a press on the back nine are separate tallies, and nobody can hold all of them in their head by the 14th tee.",
      "After the round, settling up turns into an argument about who owes whom and how much. GoLo handles both: it keeps every game’s score as you play, then nets everything into the fewest payments.",
    ],
  },

  who: {
    kicker: "WHO BUILDS IT",
    name: siteConfig.founder.name,
    title: siteConfig.founder.title,
    body: "GoLo is built by golfers who play these games.",
  },

  status: {
    kicker: "WHERE IT IS TODAY",
    body: launched
      ? // claim-ok: only once the store-apps entry is live
        "GoLo is on iPhone and Android."
      : "In private testing with real groups. GoLo runs in a phone browser today, there’s no public sign-up yet, and iPhone and Android apps are on the list.",
    link: { label: "What it does today →", href: "/features" },
  },

  money: {
    kicker: "WHAT IT DOESN’T DO",
    body: `${capability("settle-up").limits?.find((l) => /money/i.test(l)) ?? ""} It doesn’t hold a balance, take a cut or run a payment. Your group settles in cash, Venmo or whatever it already uses.`,
  },

  honesty: {
    kicker: "HOW THIS SITE STAYS HONEST",
    title: "If the app doesn’t do it, the site doesn’t say it does.",
    paragraphs: [
      "Every claim on this site about what the app does is checked against one record of what’s in the current build, and the site won’t build if a page says otherwise. Where something isn’t finished, the page says so.",
      "The worked example on How it works is a real round played through the app, on its own screens.",
    ],
    link: { label: "See the round →", href: "/how-it-works" },
  },

  contact: {
    kicker: "GET IN TOUCH",
    line: siteConfig.addressShort,
    email: siteConfig.supportEmail,
    instagram: { handle: siteConfig.instagramHandle, url: siteConfig.instagramUrl },
    formLink: { label: "Use the contact form →", href: "/contact" },
  },
};
