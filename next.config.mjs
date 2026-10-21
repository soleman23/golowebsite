/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output keeps the production server small and self-contained,
  // which is what Hostinger's Node.js hosting expects to run via `npm start`.
  output: "standalone",

  /**
   * Scripts the hPanel Node.js cron runs from the deployed build
   * (hbuilds/current/nodejs is the standalone output, with no npm and no
   * source tree). Copied in at their repo paths, so on the server
   * `scripts/reach-retry.mjs` sits beside `lib/` exactly as it does here.
   * The key only picks which route's trace carries them: /api/subscribe is a
   * Node.js, always-dynamic route, so it is always traced. The lib files are
   * the Reach sync (#121); until it lands they don't exist and the script
   * only ever reports that sync is off. Anything they import at runtime has
   * to be listed too: scripts/check-standalone-cron.mjs fails the build check
   * if an import is missing.
   */
  outputFileTracingIncludes: {
    "/api/subscribe": [
      "./scripts/reach-retry.mjs",
      "./scripts/register-ts.mjs",
      "./lib/reach.ts",
      "./lib/reachSync.ts",
      "./lib/reachStore.ts",
    ],
  },

  /**
   * Old and guessable URLs, folded into the canonical ones. All permanent
   * (308) — these paths are never coming back, so the redirect is the answer
   * forever and search engines should move the equity across.
   *
   * Hash links like /#features can't be redirected: the fragment never leaves
   * the browser, so the server never sees it. Those keep working because the
   * home page keeps its section ids (#features, #games, #how, #get) — verified
   * against components/sections/*.tsx.
   *
   * /terms is a redirect target even while unpublished. The page renders for
   * review either way, and pointing /tos at a noindex page is better than a
   * 404 that outlives the review.
   */
  /**
   * Baseline hardening on every response. HSTS deliberately omits
   * includeSubDomains and preload until every golo.golf subdomain is confirmed
   * to serve HTTPS — includeSubDomains would make browsers refuse any that
   * don't. No strict Content-Security-Policy yet: the hosting layer already
   * sends upgrade-insecure-requests, and a full policy needs testing against
   * GA and the forms first.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "golo.golf" }],
        destination: "https://www.golo.golf/:path*",
        permanent: true,
      },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/tos", destination: "/terms", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      // Ahead of the /game/:slug catch-all, so an old link to the renamed game
      // is one hop, not two.
      {
        source: "/game/stroke-purse",
        destination: "/games/best-score",
        permanent: true,
      },
      // The whole /game/* namespace, not just the one game that has a detail
      // page today. Everything else about games derives from the content layer
      // (the route, generateStaticParams, the sitemap), so hardcoding a slug
      // here would 404 the moment a second game is written.
      { source: "/game/:slug", destination: "/games/:slug", permanent: true },
      {
        source: "/games/nassau-explained",
        destination: "/games/nassau",
        permanent: true,
      },
      // Renamed to match the app, where Setup calls this game Best Score.
      {
        source: "/games/stroke-purse",
        destination: "/games/best-score",
        permanent: true,
      },
      {
        source: "/blog/who-pays",
        destination: "/blog/who-pays-first",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
