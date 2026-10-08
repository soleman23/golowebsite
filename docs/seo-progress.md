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

The "Deploy to VPS" workflow skips every run ("VPS secrets not configured yet"). The live build is from August 25, so PR #11 and everything above are not in production. Whatever published the August 25 build (Hostinger's own Git deployment, or a manual `npm run deploy`) has to run again.

## Remaining

- Search Console property access: sitemap submission, index coverage, selected canonicals, baseline search metrics, and field Core Web Vitals.
- The /blog "app isn't live yet" status pill doesn't follow appLive.
- Add `<meta name="robots" content="noindex">` to the web app's index.html (gologolf.netlify.app, separate repo) until it opens to the public.
- Turn on GA4 in production (NEXT_PUBLIC_ANALYTICS_ENABLED=true on the server, then rebuild) and mark generate_lead as a key event.
- Store landing page and referrer host on leads (Prisma migration).
- Verifiable authorship / reviewer information; do not invent credentials or people.
- Finish and review pressing and handicap draft articles before publication.
- Add maintained article revision dates when substantively editing content.
- Evaluate performance opportunities after content and discovery work.
