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
  },
  glossary:
    "Golf terms, scoring, handicaps, side games and slang, defined. Each term has an anchor on the hub page.",
};
