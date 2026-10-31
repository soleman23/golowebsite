/**
 * Navigation and footer link data. Edit the data here, not the components —
 * Nav and Footer both render straight off these arrays.
 */

import { siteConfig } from "@/lib/siteConfig";

export type NavLink = { label: string; href: string };

/**
 * The label on every button that sends you to /#get — the nav pill and each
 * page's CTAs. The download row is there: Google Play, the App Store's
 * "coming soon" and the web app.
 */
export const appCtaLabel = "Get the app";

/**
 * The same thing, short enough for the mobile nav row, where the logo, this
 * pill and the menu button share a 320px screen.
 */
export const appCtaShortLabel = "Get the app";

/**
 * The closing band's default lead and fine print (FinalCTA). The Android app
 * is on Google Play; the iPhone app follows siteConfig.iosLive. Neither names
 * a price: pricing isn't set (see the FAQ).
 */
export const finalCtaLead =
  "Download GoLo, set up your games before the first tee, and let the app keep the books. Your buddies’ excuses end here.";

export const finalCtaFine = siteConfig.iosLive
  ? // claim-ok: only once siteConfig.iosLive is set, with the App Store listing public
    "On iPhone & Android"
  : "Android on Google Play today";

/**
 * The words in the download row (components/ui/StoreButtons.tsx). Until
 * siteConfig.iosLive, the App Store slot says "coming soon" and isn't a link.
 */
export const storeButtonsCopy = {
  appStore: {
    top: "Download on the",
    main: "App Store",
    // claim-ok: rendered only once siteConfig.iosLive is set
    label: "Download GoLo on the App Store",
  },
  appStoreSoon: { top: "Coming soon to the", main: "App Store" },
  googlePlay: { top: "Get it on", main: "Google Play", label: "Get GoLo on Google Play" },
};

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
    { label: "Download", href: "/#get" },
  ],
  games: [
    { label: "All games", href: "/games" },
    { label: "Nassau", href: "/games/nassau" },
    { label: "Skins", href: "/games/skins" },
    { label: "Golf glossary", href: "/glossary" },
  ],
  legal: [
    // /terms is built but stays unlinked until it clears legal review.
    ...(siteConfig.termsPublished
      ? [{ label: "Terms of Service", href: "/terms" }]
      : []),
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Privacy choices", href: "/privacy#analytics-choices" },
    { label: "Cookie Policy", href: "/cookies" },
    ...(siteConfig.acceptableUsePublished
      ? [{ label: "Acceptable Use", href: "/acceptable-use" }]
      : []),
    { label: "Delete account", href: "/delete-account" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Blog RSS feed", href: "/blog/feed.xml" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Support", href: `mailto:${siteConfig.supportEmail}` },
  ],
};

export type SocialPlatform = "instagram" | "facebook" | "youtube" | "tiktok";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

/**
 * The footer's social row, in display order. It shows icons only, so a link's
 * accessible name comes from socialLinkName rather than visible text.
 */
export const socialLinks: SocialLink[] = [
  { platform: "instagram", label: "Instagram", href: siteConfig.instagramUrl },
  { platform: "facebook", label: "Facebook", href: siteConfig.facebookUrl },
  { platform: "youtube", label: "YouTube", href: siteConfig.youtubeUrl },
  { platform: "tiktok", label: "TikTok", href: siteConfig.tiktokUrl },
];

export const socialLinksLabel = `${siteConfig.brandName} on social media`;

export const socialLinkName = (link: SocialLink) =>
  `${siteConfig.brandName} on ${link.label} (opens in a new tab)`;
