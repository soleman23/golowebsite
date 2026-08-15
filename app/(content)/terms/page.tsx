import type { Metadata } from "next";
import { termsDoc } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { LegalPage } from "@/components/sections/legal/LegalPage";

/**
 * NOT APPROVED FOR PUBLICATION. The section text in lib/content/legal.ts is
 * the prototype's design copy, not a lawyer's. While siteConfig.termsPublished
 * is false the route builds and renders — so it can be reviewed at /terms —
 * but stays noindex, out of the sitemap, and unlinked from the footer.
 *
 * On sign-off: flip NEXT_PUBLIC_TERMS_PUBLISHED, and the robots block below,
 * the sitemap entry and the footer link all follow from that one switch.
 */

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules of the road for the GoLo app and golo.golf — written to be read, with a plain-English note beside every section.",
  alternates: { canonical: "/terms" },
  ...(siteConfig.termsPublished
    ? {}
    : { robots: { index: false, follow: false } }),
};

export default function TermsPage() {
  return <LegalPage doc={termsDoc} />;
}
