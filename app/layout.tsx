import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteConfig, heroBackdropPreload } from "@/lib/siteConfig";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Google Analytics 4 measurement ID. Override per-environment with NEXT_PUBLIC_GA_ID.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-36182P0H4D";
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
  const heroPreload = heroBackdropPreload[siteConfig.heroBackdrop];

  return (
    <html lang="en">
      <head>
        {/* The hero backdrop is the LCP element. It's painted as a CSS
            background, which can't carry fetchpriority on its own, so preload
            it explicitly. One link per breakpoint, matching the media queries
            on .golo-bd-* in globals.css exactly — only one can ever match, so
            the browser fetches precisely the file the stylesheet will use. */}
        {heroPreload.map((link) => (
          <link
            key={link.href}
            rel="preload"
            as="image"
            fetchPriority="high"
            type="image/avif"
            href={link.href}
            media={link.media}
          />
        ))}
        {/* GA/GTM loads lazily, but warming the connection costs nothing. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {GA_ENABLED && (
          <>
            {/* Google tag (gtag.js).
                lazyOnload keeps GTM's ~160 KiB and ~200 ms of main-thread work
                off the critical path. Trade-off: the pageview fires after the
                load event, so very fast bounces may go uncounted. */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
