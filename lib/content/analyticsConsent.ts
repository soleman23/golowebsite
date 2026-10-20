/**
 * Copy for the analytics choice: the first-visit prompt and the "Privacy
 * choices" control on /privacy and /cookies. One choice covers Google
 * Analytics and Microsoft Clarity together, so every string names both and
 * says that Clarity means session recordings and heatmaps.
 *
 * Client components import this module directly, not through the
 * @/lib/content barrel, so they don't ship every page's copy.
 */

/** Where the full disclosure lives. */
export const analyticsDisclosureHref = "/privacy#website-analytics";

export const analyticsConsentBanner = {
  label: "Analytics choice",
  kicker: "OPTIONAL ANALYTICS",
  title: "Can we see how this site gets used?",
  body:
    "If you allow it, Google Analytics measures visits and clicks, and Microsoft Clarity makes session recordings and heatmaps of how pages are used. Anything typed into a form is masked. Nothing loads until you choose, and the site works the same either way.",
  allow: "Allow analytics",
  decline: "Decline",
  details: "How this works",
  later: "Change it any time under Privacy choices in the footer.",
};

export const analyticsChoiceControl = {
  kicker: "PRIVACY CHOICES",
  title: "Analytics and session recordings",
  groupLabel: "Analytics choice",
  allow: "Allow analytics",
  decline: "Decline analytics",
  status: {
    siteOff:
      "Analytics is switched off for the whole site right now, so neither tool loads, whatever you choose here.",
    gpc:
      "Your browser sends Global Privacy Control, so Google Analytics and Microsoft Clarity stay off on this site, whatever is saved here.",
    none:
      "You haven't chosen yet. Google Analytics and Microsoft Clarity stay off until you allow them.",
    granted:
      "Allowed in this browser. Google Analytics and Microsoft Clarity, including session recordings and heatmaps, load on each page.",
    denied:
      "Declined in this browser. Neither Google Analytics nor Microsoft Clarity loads.",
  },
  unsaved:
    "This browser isn't letting the site save choices, so this one lasts until the page is closed or reloaded.",
  withdrawNote:
    "Declining after you've allowed analytics reloads the page so both tools stop, and clears the analytics cookies this site can reach.",
};
