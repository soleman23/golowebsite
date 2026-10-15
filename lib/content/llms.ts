/**
 * The words in /llms.txt that aren't already a page's title or description
 * (app/llms.txt/route.ts builds the rest from the content layer).
 */

import { siteConfig } from "@/lib/siteConfig";
import { capability } from "./capabilities";

export const llmsCopy = {
  /** Follows the store-apps entry, which follows siteConfig.appLive. */
  status:
    capability("store-apps").status === "live"
      ? // claim-ok: only once the store-apps entry is live
        "GoLo is available on iPhone and Android."
      : "GoLo is in private testing; it runs in a phone browser and isn’t publicly available yet.",
  /** The settle-up entry's money limit, word for word. */
  money: capability("settle-up").limits?.find((l) => /money/i.test(l)) ?? "",
  contact: `${siteConfig.legalName} · ${siteConfig.address.city}, ${siteConfig.address.region} · ${siteConfig.supportEmail}`,
  capabilitiesIntro: "What the app does today:",
  sections: { pages: "Pages", guides: "Game guides", articles: "Articles" },
};
