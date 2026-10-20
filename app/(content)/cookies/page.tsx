import type { Metadata } from "next";
import { cookiesDoc } from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import { AnalyticsPreferenceControl } from "@/components/analytics/AnalyticsPreferenceControl";
import { LegalPage } from "@/components/sections/legal/LegalPage";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/cookies",
    title: "Cookie Policy",
    description:
      "Browser storage and analytics controls for the GoLo public website.",
  }),
};

export default function CookiesPage() {
  return (
    <LegalPage
      doc={cookiesDoc}
      afterBody={
        <AnalyticsPreferenceControl
          measurementId={siteConfig.gaMeasurementId}
        />
      }
    />
  );
}
