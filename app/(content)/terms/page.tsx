import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

/**
 * The prototype's terms copy is design copy — it needs a lawyer's read before
 * this page goes public. Until siteConfig.termsPublished flips, the route
 * exists and builds but stays noindex, out of the sitemap, and unlinked from
 * the footer. Prompt 08 fills in the sections.
 */
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules of the road for the GoLo app and golo.golf — written to be read, with a plain-English note beside every section.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <PageHero
      kicker="LEGAL"
      title="Terms of Service"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
    />
  );
}
