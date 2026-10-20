/**
 * Copy for the analytics choice: the first-visit prompt and the "Privacy
 * choices" control on /privacy and /cookies. The one optional tool is Google
 * Analytics (Microsoft Clarity was removed; see lib/siteConfig.ts).
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
    "If you allow it, Google Analytics measures visits and clicks on this site. What you type into a form is never sent. Nothing loads unless you allow it, and the site works the same either way.",
  allow: "Allow analytics",
  decline: "Decline",
  details: "How this works",
  later: "Change it any time under Privacy choices in the footer.",
};

export const analyticsChoiceControl = {
  kicker: "PRIVACY CHOICES",
  title: "Website analytics",
  groupLabel: "Analytics choice",
  allow: "Allow analytics",
  decline: "Decline analytics",
  status: {
    siteOff:
      "Analytics is switched off for the whole site right now, so Google Analytics doesn't load, whatever you choose here.",
    gpc:
      "Your browser sends Global Privacy Control, so Google Analytics stays off on this site, whatever is saved here.",
    none:
      "You haven't chosen yet. Google Analytics stays off until you allow it.",
    granted:
      "Allowed in this browser. Google Analytics loads on each page.",
    denied:
      "Declined in this browser. Google Analytics doesn't load.",
  },
  unsaved:
    "This browser isn't letting the site save choices, so this one lasts until the page is closed or reloaded.",
  policyLinks: [
    { label: "Privacy Policy: website analytics", href: "/privacy#website-analytics" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  withdrawNote:
    "Declining after you've allowed analytics reloads the page so Google Analytics stops, and clears the analytics cookies this site can reach.",
};
