# SEO implementation progress

Source: root SEO-REPORT.md (September 23 audit) and GOLO SEO - 9-24 references.

## Implemented October 4, 2026

- Homepage search title and H1 name the golf scorecard / side-game category; the brand tagline (siteConfig.tagline) sits in the pill above the H1.
- Features, games, and blog titles describe search intent; games and blog H1s describe their topics.
- /games and /blog are static, so their title, description, canonical and Open Graph tags are in the initial <head> rather than streamed into the body.
- Every route sets its own canonical, og:url, og:title and og:description — through lib/pageMetadata.ts for the static pages, generateMetadata for game guides and articles. The root layout carries only site-wide defaults (site name, share card, card type), so nothing page-specific leaks to routes that don't override it.
- X / Twitter cards come from each page's Open Graph tags: the layout sets only the card type, and Next fills title, description and image from openGraph.
- Every "get the app" button — nav pill, page CTAs, closing bands — reads appCtaLabel (lib/content/nav.ts): "Get the launch link" while appLive is false, "Get the app" after. The /games closing-band lead follows appLive too.
- Sitemap omits lastModified on undated static pages and game guides. The blog index uses its newest post's date; article publication dates and legal effective dates remain.
- Lint, typecheck and production build verified. No deployment performed.

## Implemented October 8, 2026 (branch seo/phase-1)

Owner decisions this round: the web app is not public yet; Instagram is @gologolfapp; the homepage and /features quotes were placeholders; the street address is a residence; "betting" stays out of search titles until counsel approves ("friendly wager" in descriptions instead).

- Placeholder testimonials removed (home `quotes`, /features `betaQuotes`). Both sections render only when the flag is on and the list holds real, consented quotes; the flag now defaults off, and .env.example says so.
- Instagram handle and schema sameAs point to @gologolfapp.
- Organization schema is named "GoLo Golf" with legalName "GoLo Golf LLC"; the address stops at Bend, Oregon. A WebSite node carries the site name. /privacy keeps the full mailing address.
- "Betting" out of search titles and descriptions: home, /games, /blog titles; /games and /blog H1s; siteConfig.description. Body copy and the tagline are unchanged pending counsel.
- Game guides have keyword titles (GameDetail.seoTitle); the H1 stays the game's name. Closest to Pin and Birdies descriptions expanded.
- Guide/article overlap: /blog/nassau and /blog/skins-carryover retitled to their own angle, with short meta descriptions (Post.metaDescription). All four paired posts link their guide in the intro; the four guides link back ("Deeper reading", under the tips).
- Home game cards link to all eight guides.
- Prelaunch wording: the default closing-band lead and the footer "Download" link follow appLive.
- Footer column labels are no longer h2s.
- Baseline security headers (HSTS without includeSubDomains, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy) in next.config.mjs.
- Lint, typecheck and production build verified; pages checked in the dev server at 320 px and desktop.

## Blocking: nothing merged since August 25 is live

Production is Hostinger's managed Node.js hosting (hPanel → golo.golf → Deployments), which builds `main` from GitHub. Its Deployments page shows "Repository access missing" and Redeploy is disabled, so the live build is still commit 7c1aa075 from August 25 and PR #11 and everything above are not in production. Fix: Manage access → re-authorize Hostinger's GitHub app for this repo, then Redeploy. The "Deploy to VPS" GitHub workflow is unused; it skips every run ("VPS secrets not configured yet").

## Search Console baseline, October 8, 2026

Domain property `sc-domain:golo.golf`, already verified. Taken while production still runs the August 25 build, so it measures the old titles.

- Sitemap `https://www.golo.golf/sitemap.xml`: first submitted August 25, resubmitted October 8. Last read September 25: Success, 22 discovered pages.
- Performance, last 3 months (data through October 5): 2 clicks, 347 impressions, 0.6% CTR, average position 45.8, 92 queries.
- Top queries by impressions: nassau golf bet (14, pos 40.8), what is a nassau in golf (10, pos 73.2), golo golf (9, pos 6.6), nassau golf game (8, pos 41.6), nassau golf format (8, pos 61.0), golf nassau bet (7), go lo golf (6, pos 33.5), golo board (6), mongolian reversal (6), what is a nassau bet in golf (5).
- Page indexing: 16 indexed, 11 not indexed — 6 discovered-not-indexed, 3 page with redirect, 1 alternate with proper canonical, 1 crawled-not-indexed.

## Remaining

- Search Console: re-check index coverage, selected canonicals and field Core Web Vitals once the current build is live.
- The /blog "app isn't live yet" status pill doesn't follow appLive.
- Web app noindex: soleman23/golo PR #499 (into staging). Reaches gologolf.netlify.app only after the staging → main release and a Publish in Netlify.
- GA4: NEXT_PUBLIC_ANALYTICS_ENABLED=true is set in hPanel (October 8; the measurement ID G-36182P0H4D is the siteConfig default). It is baked in at build time, so it takes effect on the first build after repository access is restored (see Blocking). After that, mark generate_lead as a key event in GA.
- GA4 will undercount, by design. Analytics is opt-in: no data until a visitor grants it in the "Privacy choices" control (footer link → /privacy#analytics-choices). There is no banner, and Global Privacy Control or no choice keeps it off. Read GA as a small opted-in sample, not traffic; use Search Console clicks and the lead table for volume. A consent banner would raise the sample, but that is a product and counsel decision, not an SEO task.
- Store landing page and referrer host on leads (Prisma migration).
- Verifiable authorship / reviewer information; do not invent credentials or people.
- Finish and review pressing and handicap draft articles before publication.
- Add maintained article revision dates when substantively editing content.
- Evaluate performance opportunities after content and discovery work.
