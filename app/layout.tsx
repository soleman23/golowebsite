import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { socialDefaults } from "@/lib/pageMetadata";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsLoader } from "@/components/analytics/AnalyticsLoader";
import { LandingCapture } from "@/components/layout/LandingCapture";
import "./globals.css";

// Google Analytics 4 measurement ID. Override per-environment with NEXT_PUBLIC_GA_ID.
const GA_MEASUREMENT_ID = siteConfig.gaMeasurementId;
// Launch-safe kill switch plus a production-only guard.
const GA_ENABLED =
  process.env.NODE_ENV === "production" &&
  siteConfig.analyticsEnabled &&
  !!GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // No canonical, URL or social title here: every route sets its own (through
  // pageMetadata or generateMetadata), and a page-specific value at this level
  // is inherited by any route that forgets to — a 404 included.
  ...socialDefaults,
  // Icons are file-convention routes Next.js picks up on its own:
  // app/icon.svg (modern browsers), app/favicon.ico (crawlers and older
  // clients that request the path directly) and app/apple-icon.png (iOS
  // home screen). app/manifest.ts adds the rest. All regenerate from the
  // one mark via scripts/generate-icons.mjs.
};

export const viewport: Viewport = {
  themeColor: "#0a0d10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: FilterBoot (components/ui/FilterBoot.tsx) writes
    // data-filter onto <html> during parse on /games and /blog, before React
    // hydrates. This silences attribute diffs on <html> itself only — the
    // rest of the tree is still checked.
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <LandingCapture />
        <AnalyticsLoader
          enabled={GA_ENABLED}
          measurementId={GA_MEASUREMENT_ID}
        />
      </body>
    </html>
  );
}
