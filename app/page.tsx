/**
 * GoLo landing page — composes the sections top to bottom. Stats and
 * testimonials are gated behind content flags from siteConfig.
 */

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import {
  APP_ID,
  organizationNode,
  organizationRef,
  websiteNode,
} from "@/lib/schema";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { Features } from "@/components/sections/Features";
import { GamesGrid } from "@/components/sections/GamesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FAQ } from "@/components/sections/FAQ";
import { JsonLd } from "@/components/ui/JsonLd";
import { capability, quotes } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Golf Side-Game Scorecard App for Skins, Nassau & More",
  description: siteConfig.description,
});

/**
 * The app itself, plus the company behind it. One graph rather than three
 * script tags: `publisher` points at the Organization node by @id, so they are
 * linked instead of floating as unrelated entities. The Organization and
 * WebSite nodes come from lib/schema.ts, which every other page's JSON-LD
 * refers to.
 *
 * No `aggregateRating` and no `datePublished`: there are no ratings to
 * report, and inventing either is the kind of thing that gets structured data
 * ignored site-wide. No `offers` either: pricing isn't set (see the FAQ), and
 * an Offer would state a price. Add one from the pricing decision, not before.
 *
 * `operatingSystem` comes from the capability registry: "Web browser" and
 * "Android" while those are live, and "iOS" only once the ios-app entry is
 * (siteConfig.iosLive).
 *
 * The home page carries no FAQPage even though it ends with an FAQ section —
 * those same questions are the canonical /faq block, and the same Q/A marked
 * up on two URLs is a demotion risk.
 */
const platforms = [
  capability("web-app").status === "live" ? "Web browser" : null,
  capability("android-app").status === "live" ? "Android" : null,
  capability("ios-app").status === "live" ? "iOS" : null,
].filter(Boolean);

/**
 * The store listings are the app's other identities, so they go on the
 * SoftwareApplication, not the Organization: each once its app is live and
 * its URL is a real listing (the App Store one falls back to "#get").
 */
const storeListings = [
  capability("android-app").status === "live" ? siteConfig.googlePlayUrl : "",
  capability("ios-app").status === "live" ? siteConfig.appStoreUrl : "",
].filter((url) => url.startsWith("https://"));

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    organizationNode(),
    websiteNode(),
    {
      "@type": "SoftwareApplication",
      "@id": APP_ID,
      name: siteConfig.name,
      description: siteConfig.description,
      applicationCategory: "SportsApplication",
      ...(platforms.length ? { operatingSystem: platforms.join(", ") } : {}),
      url: siteConfig.url,
      publisher: organizationRef,
      ...(storeListings.length ? { sameAs: storeListings } : {}),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {siteConfig.showStats ? <StatsBand /> : null}
      <Features />
      <GamesGrid />
      <HowItWorks />
      {siteConfig.showTestimonials && quotes.length > 0 ? <Testimonials /> : null}
      <FinalCTA />
      <FAQ />

      <JsonLd data={homeJsonLd} />
    </>
  );
}
