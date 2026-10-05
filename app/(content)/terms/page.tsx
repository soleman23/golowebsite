import type { Metadata } from "next";
import { termsDoc } from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import { LegalPage } from "@/components/sections/legal/LegalPage";

/**
 * The owner authorized this copy as interim website Terms. It still requires
 * legal approval or replacement before NEXT_PUBLIC_APP_LIVE can become true.
 * The publication flag controls robots, sitemap inclusion, and navigation.
 */

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/terms",
    title: "Terms of Service",
    description:
      "The rules of the road for the GoLo app and golo.golf — written to be read, with a plain-English note beside every section.",
  }),
  ...(siteConfig.termsPublished
    ? {}
    : { robots: { index: false, follow: false } }),
};

export default function TermsPage() {
  return <LegalPage doc={termsDoc} />;
}
