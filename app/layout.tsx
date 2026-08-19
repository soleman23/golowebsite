import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsLoader } from "@/components/analytics/AnalyticsLoader";
import "./globals.css";

// Google Analytics 4 measurement ID. Override per-environment with NEXT_PUBLIC_GA_ID.
const GA_MEASUREMENT_ID = siteConfig.gaMeasurementId;
// Don't pollute analytics with local dev traffic.
const GA_ENABLED = process.env.NODE_ENV === "production" && !!GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // The home page's own canonical. Inner pages override this with their route;
  // without it, "/" was the only page shipping no canonical at all.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  // Favicon is provided by app/icon.svg (auto-detected by Next.js).
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
    <html lang="en">
      <head />
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <AnalyticsLoader
          enabled={GA_ENABLED}
          measurementId={GA_MEASUREMENT_ID}
        />
      </body>
    </html>
  );
}
