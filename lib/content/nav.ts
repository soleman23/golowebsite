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
