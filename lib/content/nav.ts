/**
 * Navigation and footer link data. Edit the data here, not the components —
 * Nav and Footer both render straight off these arrays.
 */

import { siteConfig } from "@/lib/siteConfig";

export type NavLink = { label: string; href: string };

/**
 * The label on every button that sends you to /#get — the nav pill and each
 * page's CTAs. Until siteConfig.appLive there's nothing to download there,
 * only the phone capture, so the button names what you'll actually get.
 */
export const appCtaLabel = siteConfig.appLive
  ? "Get the app"
  : "Get the launch link";

/**
 * The same thing, short enough for the mobile nav row, where the logo, this
 * pill and the menu button share a 320px screen. The full prelaunch label
 * pushed the menu button off the edge and widened the page.
 */
export const appCtaShortLabel = siteConfig.appLive
  ? "Get the app"
  : "Get the link";

/**
 * The closing band's default lead and fine print (FinalCTA). Both follow
 * appLive: before launch there's nothing to download, and the app runs in a
 * browser in private testing, so neither names a store, a platform or a price.
 * At launch, check the fine print against the pricing decision and the
 * "store-apps" entry in capabilities.ts before it says anything more.
 */
export const finalCtaLead = siteConfig.appLive
  ? "Download GoLo, set up your games before the first tee, and let the app keep the books. Your buddies’ excuses end here."
  : "Get the launch link, set up your games before the first tee, and let GoLo keep the books. Your buddies’ excuses end here.";

export const finalCtaFine = siteConfig.appLive
  ? // claim-ok: only rendered once appLive is set, at launch
    "On iPhone & Android"
  : "In testing with real groups · Free while we’re in beta";

/**
 * Every top-level entry is a real route. "How it works" goes to the full
 * walkthrough; the home page's #how teaser links there too.
 */
export const navLinks: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Games", href: "/games" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export type FooterColumn = "product" | "games" | "legal" | "company";

export const footerLinks: Record<FooterColumn, NavLink[]> = {
  product: [
    { label: "Features", href: "/features" },
    { label: "How it works", href: "/how-it-works" },
    { label: siteConfig.appLive ? "Download" : "Launch link", href: "/#get" },
  ],
  games: [
    { label: "All games", href: "/games" },
    { label: "Nassau", href: "/games/nassau" },
    { label: "Skins", href: "/games/skins" },
  ],
  legal: [
    // /terms is built but stays unlinked until it clears legal review.
    ...(siteConfig.termsPublished
      ? [{ label: "Terms of Service", href: "/terms" }]
      : []),
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Privacy choices", href: "/privacy#analytics-choices" },
    ...(siteConfig.cookiesPublished
      ? [{ label: "Cookie Policy", href: "/cookies" }]
      : []),
    ...(siteConfig.acceptableUsePublished
      ? [{ label: "Acceptable Use", href: "/acceptable-use" }]
      : []),
    { label: "Delete account", href: "/delete-account" },
  ],
  company: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Support", href: `mailto:${siteConfig.supportEmail}` },
  ],
};
