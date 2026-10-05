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

## Remaining

- Search Console property access: sitemap submission, index coverage, selected canonicals, baseline search metrics, and field Core Web Vitals.
- Contextual links between the Nassau, Skins, Wolf, and Bingo Bango Bongo guides and articles; preserve their distinct search intents.
- The closing band's default lead ("Download GoLo…", components/sections/FinalCTA.tsx) still assumes a live app on the home page and game guides; the /blog "app isn't live yet" status pill doesn't follow appLive.
- Verifiable authorship / reviewer information; do not invent credentials or people.
- Finish and review pressing and handicap draft articles before publication.
- Add maintained article revision dates when substantively editing content.
- Evaluate performance opportunities after content and discovery work.
