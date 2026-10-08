/**
 * GoLo landing page — composes the sections top to bottom. Stats and
 * testimonials are gated behind content flags from siteConfig.
 */

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { organizationLogo, siteConfig } from "@/lib/siteConfig";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { Features } from "@/components/sections/Features";
import { GamesGrid } from "@/components/sections/GamesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FAQ } from "@/components/sections/FAQ";
import { JsonLd } from "@/components/ui/JsonLd";
import { quotes } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Golf Side-Game Scorecard App for Skins, Nassau & More",
  description: siteConfig.description,
});

/**
 * The app itself, plus the company behind it. One graph rather than two script
 * tags: `publisher` points at the Organization node by @id, so the two are
 * linked instead of floating as unrelated entities.
 *
 * No `aggregateRating` and no `datePublished` — the app isn't released and has
 * no ratings, and inventing either is the kind of thing that gets structured
 * data ignored site-wide. `price: "0"` is true today and stays true while
 * siteConfig.appLive is false; revisit it with the pricing page at launch.
 *
 * Organization is named "GoLo Golf" — the name searchers use, and the one that
 * separates this company from the GOLO dice game, putters and diet — with the
 * LLC as legalName. WebSite carries the same name: it's what Google reads to
 * pick the site name shown above a result. The address stops at the city: the
 * street address is a residence, and an app company has no storefront to find.
 * /privacy keeps the full mailing address of record.
 *
 * The home page carries no FAQPage even though it ends with an FAQ section —
 * those same questions are the canonical /faq block, and the same Q/A marked
 * up on two URLs is a demotion risk.
 */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.brandName,
      legalName: siteConfig.legalName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.supportEmail,
      logo: organizationLogo,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.country,
      },
      sameAs: [siteConfig.instagramUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.brandName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#app`,
      name: siteConfig.name,
      description: siteConfig.description,
      applicationCategory: "SportsApplication",
      operatingSystem: "iOS, Android",
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
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
