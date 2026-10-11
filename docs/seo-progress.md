# SEO implementation progress

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

## Deployed October 8, 2026

Production is Hostinger's managed Node.js hosting (hPanel → golo.golf → Deployments), which builds `main` from GitHub on Node 20. It had lost GitHub repository access, so nothing deployed between August 25 and October 8. Access was restored and `main` at 43171cd (PR #14) deployed October 8; everything above is live. Checked on the live site: new titles and canonicals on /, /games, /blog and the game guides; GA enabled; HSTS and X-Frame-Options headers; robots.txt and a 22-URL sitemap; /cookies and /acceptable-use noindex. The "Deploy to VPS" GitHub workflow is unused; it skips every run ("VPS secrets not configured yet").

## Search Console baseline, October 8, 2026

Domain property `sc-domain:golo.golf`, already verified. Taken while production still runs the August 25 build, so it measures the old titles.

- Sitemap `https://www.golo.golf/sitemap.xml`: first submitted August 25, resubmitted October 8. Last read September 25: Success, 22 discovered pages.
- Performance, last 3 months (data through October 5): 2 clicks, 347 impressions, 0.6% CTR, average position 45.8, 92 queries.
- Top queries by impressions: nassau golf bet (14, pos 40.8), what is a nassau in golf (10, pos 73.2), golo golf (9, pos 6.6), nassau golf game (8, pos 41.6), nassau golf format (8, pos 61.0), golf nassau bet (7), go lo golf (6, pos 33.5), golo board (6), mongolian reversal (6), what is a nassau bet in golf (5).
- Page indexing: 16 indexed, 11 not indexed — 6 discovered-not-indexed, 3 page with redirect, 1 alternate with proper canonical, 1 crawled-not-indexed.

## Implemented October 10, 2026 (branch seo/phase-2)

- The /blog and /faq hero status pills ("isn't live yet", "Not live yet") render only while appLive is false; their labels moved to lib/content.
- Leads record where the visit started. PhoneLead and NewsletterLead gain nullable `landingPath` (first path of the visit, no query string) and `referrerHost` (outside referrer's host only; empty for direct visits and in-site reloads). Captured once per page load by LandingCapture in the root layout and held in memory only, so the cookie policy's storage inventory is unchanged. The API drops a malformed value instead of rejecting the lead.
- PhoneLead `source` is now the form's placement (`hero`, `final_cta_<page>`). Before this, every phone lead was saved as `hero`, closing-band ones included.
- Web app noindex confirmed live: soleman23/golo PR #499 merged October 8 and gologolf.netlify.app serves `<meta name="robots" content="noindex">`.
- /how-it-works (PR #22) checked: own title, description and canonical, in the sitemap, linked from the nav, footer and home teaser. It uses the default share card until it has a hero photo.
- Lint, typecheck and production build verified; form payloads checked in the dev server with fetch stubbed, so no rows were written.

**Deploy order:** add the four columns to the production database before this branch reaches `main`. Hostinger's build runs `prisma generate`, not `db push`, and the new code returns the new columns on insert, so a deploy ahead of the schema change fails every lead submission. The columns are nullable, so adding them first doesn't affect the build that's live now. Run `npm run db:push` with production's DATABASE_URL and DIRECT_URL, or apply the equivalent SQL:

```sql
ALTER TABLE "PhoneLead" ADD COLUMN "landingPath" TEXT, ADD COLUMN "referrerHost" TEXT;
ALTER TABLE "NewsletterLead" ADD COLUMN "landingPath" TEXT, ADD COLUMN "referrerHost" TEXT;
```

Applied October 10 to the website's Supabase database; all four columns confirmed present and nullable. The branch is safe to merge.

## Published October 10, 2026 (branch content/press-handicap-drafts)

Owner decisions: publish both drafts now, on the stock backdrop heroes; dedicated photos can follow through scripts/generate-blog-images.mjs.

- /blog/pressing and /blog/index-vs-course-handicap published, dated the day of publication rather than their May and June draft dates.
- Corrections from review. Pressing: the auto-press example table contradicted itself (a press won 2 up inside a nine lost 1 down); rebuilt as a hole-by-hole sequence that reconciles, with a settle row. "Vulture press" is presented as our nickname, not a recognized term, and auto-presses "can double" the money instead of "roughly double". Handicaps: a net par halves an unaided par (the draft said it wins); slope rating is defined against scratch, not as bogey difficulty alone; the index revises daily rather than "as soon as you post"; the excerpt said two courses where the example uses two tee boxes; read time 5 minutes, not 8.
- Alt text on both heroes described people, tee boxes and a scorecard the photos don't show; rewritten to match. The two mid-article figures reused the hero photo under the same mismatched captions and were removed (pressing gains a step-by-step sequence instead, handicaps a callout).
- Search: pressing's title front-loads "Pressing in golf"; both have meta descriptions under 155 characters without "betting".
- Internal links: pressing → Nassau guide; handicaps → Nassau and Skins guides; the Nassau post's presses section → pressing; the Bingo Bango Bongo post → handicaps.

## Remaining

- Search Console: re-check index coverage, selected canonicals and field Core Web Vitals against the October 8 baseline. Due between October 22 and November 5 (two to four weeks after the deploy).
- GA4 is live as of the October 8 build (NEXT_PUBLIC_ANALYTICS_ENABLED=true in hPanel; measurement ID G-36182P0H4D, the siteConfig default). Still to do in GA: mark generate_lead as a key event.
- GA4 will undercount, by design. Analytics is opt-in: no data until a visitor grants it in the "Privacy choices" control (footer link → /privacy#analytics-choices). There is no banner, and Global Privacy Control or no choice keeps it off. Read GA as a small opted-in sample, not traffic; use Search Console clicks and the lead table (now with landing page and referrer) for volume. A consent banner would raise the sample, but that is a product and counsel decision, not an SEO task.
- Privacy policy: the download-link bullet mentions "related technical records", and the usage section lists "referring pages". Counsel to confirm that covers landing page and referrer host on lead rows, or add them explicitly.
- Verifiable authorship / reviewer information; do not invent credentials or people.
- Dedicated hero and mid-article photos for /blog/pressing and /blog/index-vs-course-handicap (source PNGs into tmp/img-src/, then scripts/generate-blog-images.mjs).
- Add maintained article revision dates when substantively editing content.
- Evaluate performance opportunities after content and discovery work.
