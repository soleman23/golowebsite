/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output keeps the production server small and self-contained,
  // which is what Hostinger's Node.js hosting expects to run via `npm start`.
  output: "standalone",

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
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/tos", destination: "/terms", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/game/nassau", destination: "/games/nassau", permanent: true },
      {
        source: "/games/nassau-explained",
        destination: "/games/nassau",
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
