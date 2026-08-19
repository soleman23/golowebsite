/**
 * Navigation and footer link data. Edit the data here, not the components —
 * Nav and Footer both render straight off these arrays.
 */

import { siteConfig } from "@/lib/siteConfig";

export type NavLink = { label: string; href: string };

/**
 * "How it works" stays an anchor: that section lives on the home page only.
 * Everything else is now a real route.
 */
export const navLinks: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Games", href: "/games" },
  { label: "How it works", href: "/#how" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export type FooterColumn = "product" | "games" | "legal" | "company";

export const footerLinks: Record<FooterColumn, NavLink[]> = {
  product: [
    { label: "Features", href: "/features" },
    { label: "How it works", href: "/#how" },
    { label: "Download", href: "/#get" },
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
