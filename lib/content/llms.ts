/**
 * The words in /llms.txt that aren't already a page's title or description
 * (app/llms.txt/route.ts builds the rest from the content layer).
 */

import { siteConfig } from "@/lib/siteConfig";
import { capability } from "./capabilities";

export const llmsCopy = {
  /** Follows the ios-app entry, which follows siteConfig.iosLive. */
  status:
    capability("ios-app").status === "live"
      ? // claim-ok: only once the ios-app entry is live
        "GoLo is available on iPhone and Android."
      : `GoLo is on Google Play for Android and runs in a phone browser (${siteConfig.webAppUrl}). The iPhone app is coming to the App Store.`,
  /** The settle-up entry's money limit, word for word. */
  money: capability("settle-up").limits?.find((l) => /money/i.test(l)) ?? "",
  contact: `${siteConfig.legalName} · ${siteConfig.address.city}, ${siteConfig.address.region} · ${siteConfig.supportEmail}`,
  capabilitiesIntro: "What the app does today:",
  sections: {
    pages: "Pages",
    guides: "Game guides",
    articles: "Articles",
    glossary: "Glossary",
    rules: "Rules of Golf",
  },
  glossary:
    "Golf terms, scoring, handicaps, side games and slang, defined. Each term has an anchor on the hub page.",
  /** The Rules Center's line, once it's live with published records (#243). */
  rulesTitle: "Golf Rules Explained",
  rules:
    "Plain answers to common Rules of Golf situations, from a lost ball to a cart path, and what each of the 25 Rules covers, with the official text linked on randa.org. Each answer and rule has an anchor on the hub page. Independent of The R&A and the USGA.",
};
