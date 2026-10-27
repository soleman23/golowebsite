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
- /how-it-works (PR #22) checked: own title, description and canonical, in the sitemap, linked from the nav, footer and home teaser. Since October 10 it has its own hero photo and share card (`how-it-works-og.jpg`), and its worked example is a real round played through the app.
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

## Implemented October 15, 2026 (soleman23/golowebsite#95, SEO-09)

- Leads also record `landingSource`: the landing URL's `utm_source`, lower-cased, kept only if it matches `^[a-z0-9._-]{1,64}$` (anything else is dropped, never rejected). AI answer engines often strip the referrer but tag links (ChatGPT search adds `utm_source=chatgpt.com`), so this separates them from direct visits. Same rules as the other attribution fields: memory only on the client, one value from the query string, no cookie or storage.

**Deploy order:** applied to the website's Supabase database ("golowebsite") on October 15 before merge, and both columns confirmed present and nullable:

```sql
ALTER TABLE "PhoneLead" ADD COLUMN "landingSource" TEXT;
ALTER TABLE "NewsletterLead" ADD COLUMN "landingSource" TEXT;
```

Counsel: the open privacy-policy question about landing page and referrer host on lead rows covers this field too.

## GA4 set up, October 16–18, 2026 (soleman23/golowebsite#66, SEO-08)

GA4 is the "GoLo Golf" property, G-36182P0H4D. It received nothing before October 16: the gtag shim pushed arrays, which gtag.js ignores, and #100 fixed it. Treat any GA4 number dated before October 16 as no data, not zero.

- **Channel group.** "AI assistants" (Admin → Data display → Channel groups, created October 16) is the default channels plus an AI assistants channel above Referral, matching session source `(.*\.)?(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)`. On October 18, the Traffic acquisition report offers it as "Session AI assistants"; its one session so far is Direct.
- **Exploration.** "Landing page × channel × key events" (Explore, created October 16).
- **First data.** On October 17, the owner allowed analytics on /privacy in Chrome (no Global Privacy Control, no blocker) and submitted their own number in the home hero's "Text me the link when it's live". `/api/text-link` returned 200. gtag sent `generate_lead` with `method=text_me_link` and `placement=hero`, no other parameters, and Realtime showed it within a minute. The processed Events report for September 20 – October 17 lists 18 events from 1 user: `page_view` 5, `session_start` 5, `user_engagement` 4, and `first_visit`, `form_start`, `generate_lead` and `scroll` 1 each.
- **Key event.** `generate_lead` was marked as a key event on October 18, from the Events report's row menu. Admin → Events → Recent events was still empty 24 hours after the event arrived. Admin → Events → Key events now lists it as active on the "GoLo Golf Website" stream.
  - Key events don't apply to past data, so the October 17 lead isn't counted as one. The next opted-in lead is the first.
  - `newsletter_signup` hasn't arrived yet. Mark it as a secondary key event once it does.
- **Contact form.** The contact form sends `contact_submit`, not `generate_lead`. It isn't a key event.

## Implemented October 21, 2026 (soleman23/golowebsite#120)

Approved by the owner on October 21 under soleman23/golo#790; the link design is soleman23/golo `marketing/social/MEASUREMENT.md` §2.

- Leads also record `landingMedium`, `landingCampaign` and `landingContent`: the landing URL's `utm_medium`, `utm_campaign` and `utm_content`, read from the same first landing as `landingSource`. Same rules as the other attribution fields: memory only on the client, no cookie or storage, so the cookie policy is unchanged.
- The three are kept only as a complete combination from the link dictionary (`lib/campaigns.ts`) for the landing's source: `instagram` / `organic_social` / a social campaign / `bio` or `story_` + `^[a-z]{2}[0-9]{2}_[a-z]$`; `tiktok` / `organic_social` / a social campaign / `bio`; `youtube` / `organic_social` / a social campaign / `channel`; `hostinger_reach` / `email` / an email campaign / `header` or `cta_button`; `table_tent` / `print` / a print campaign / `qr` (added October 26, 2026 for the sim-bay table tent). Anything else stores all three as null; a failed check never rejects the lead. Values are trimmed and lower-cased first.
- Campaign IDs are a list in `lib/campaigns.ts`, each marked social, email or print. Today they are `golo_prelaunch_2026q4` (social) and `golo_launch_2026q4_sim_bay` (print: the QR on the printed sim-bay table tent, whose full query string is `utm_source=table_tent&utm_medium=print&utm_campaign=golo_launch_2026q4_sim_bay&utm_content=qr`). Add a new ID in the same change that first uses it in a link; until then it's stored as null.
- `landingSource` keeps its pattern and is also dropped when it looks personal (an `@` or a run of seven or more digits, `looksPersonal` in `lib/analytics.ts`) or like an identifier (a UUID or a run of 16+ hex characters), so a phone-shaped or ID-shaped `utm_source` is no longer stored. `landingPath` is kept only as a path: the server drops a value containing `?` or `#`. The browser applies the same checks before sending (`lib/attribution.ts`); the server's (`lib/validation.ts`) are the ones that count.
- A repeat newsletter sign-up still leaves the row alone (`update: {}`), new fields included.
- Privacy Policy, "Information you provide": new item "Where a website sign-up came from", which names landing page, referrer domain and the four link names explicitly (this also settles the "related technical records" question below for those fields). "Data Retention": new item "Newsletter sign-up records": kept until the subscriber asks for deletion (via Your Choices and Privacy Rights); unsubscribing stops emails but doesn't delete the record; attribution details are kept and deleted with the sign-up or download-link record. "Last updated" is October 21, 2026, the deploy date (the same day as #122).
- Tests: `npm run test:attribution` (`scripts/test-attribution.mjs`, also a CI step) parses payloads through both routes' schemas, with no server or database. It covers the full Instagram bio set kept; unknown medium, unlisted campaign, `john_smith`, a 10-digit value, a UUID, `<script>`, over-long values and impossible combinations stored as null; `utm_source=5415551234`, a UUID source and a long hex source dropped; `utm_source=chatgpt.com` kept; a `landingPath` with `?` or `#` dropped without rejecting the submission.
- Lint, typecheck and production build verified. No database touched.

**Deploy order:** apply the six columns to the website's Supabase database ("golowebsite") **before** merging, since Hostinger builds `main` automatically and the new code writes the new columns on insert. The columns are nullable, so adding them first doesn't affect the live build:

```sql
ALTER TABLE "PhoneLead" ADD COLUMN "landingMedium" TEXT, ADD COLUMN "landingCampaign" TEXT, ADD COLUMN "landingContent" TEXT;
ALTER TABLE "NewsletterLead" ADD COLUMN "landingMedium" TEXT, ADD COLUMN "landingCampaign" TEXT, ADD COLUMN "landingContent" TEXT;
```

Then confirm all six exist and are nullable and record it in the PR. After deploy, run the diagnostic sign-up from MEASUREMENT §2 with a new designated test address, record it on golo#790, and delete the row. Not yet applied.

Counsel: the new privacy item and the newsletter retention item join the open privacy-policy question below.

## Implemented October 21, 2026 (newsletter abuse guard, branch feat/subscribe-abuse-guard)

Groundwork for #124, which will make each new newsletter sign-up send a Hostinger Reach confirmation to the submitted address (plan: 1,000 unique recipients and 7,000 emails a month). Today each new sign-up already sends an internal notification through Resend. Without a guard, a script could post arbitrary addresses and burn either. This has to be live before the Reach sync is.

- `POST /api/subscribe` runs four checks before it parses or saves anything (`lib/subscribeGuard.ts`): a 4 KB body cap (413, enforced while reading, so a chunked body without Content-Length can't get around it); an Origin check (403, "This sign-up form only works on golo.golf."); a rate limit (429, "Too many sign-up attempts. Please try again in a few minutes.", with `Retry-After`); and a honeypot.
- Rate limit, two sliding 10-minute windows. Per client: 5 requests, and every request that passes the Origin and size checks counts, honeypot drops and failed validations included. Global: 60 sign-ups for the whole process, and only a sign-up that passes the honeypot and validation and is about to be saved counts, so junk can't close it. The global ceiling is also checked (not counted) before the body is read, so once it's full a flood gets a cheap 429. A refused request isn't counted, so the wait never grows. At most 10,000 client keys are held, least recently seen evicted first, and expired ones are pruned on every request.
- The global ceiling is an off-switch: a flood of valid-looking sign-ups closes it, and it stays closed for as long as the flood lasts, so real visitors get the 429 message for that time. That's the trade for a bounded send count.
- The client is the **last** `X-Forwarded-For` entry, the one the nearest proxy appended, else one shared "unknown" key. **Live check, October 21 (after #126 deployed):** seven POSTs from one machine, each with a different made-up `X-Real-IP`, all got 400 (none limited), and so did seven with made-up first `X-Forwarded-For` entries; the same machine with no made-up headers got 429 on its 6th request. So Hostinger's proxy passes a client-sent `X-Real-IP` and first `X-Forwarded-For` entry through unchanged, and keying on either let one machine dodge the per-client limit. `X-Real-IP` is no longer read. Next 15 fills in `X-Forwarded-For` with the socket address when no proxy sent one, so if the proxy appended nothing every visitor would share one key; the header-shape line (below) shows which IP headers arrive, by name only.
- **Owed: confirm on the live host after this deploys.** Repeat the spoof check: from one machine, six POSTs with no Origin and a `{}` body (invalid, so they don't charge the global ceiling), each with a different made-up `X-Forwarded-For` first entry. The sixth must get 429. Then read the header-shape line in `hbuilds/current/nodejs/console.log` (first request after each start, then at most hourly; names and counts only): `[subscribe] client-ip headers: x-real-ip=no xff_entries=N ip_headers=…`. One entry on an unspoofed request means the proxy supplied it (or Next's socket fill, if the proxy appended nothing); confirm that two different networks get different limits before #124 sends anything.
- Origin: allowed when its host is the host the request was sent to (`X-Forwarded-Host`, else `Host`), so PR previews and proxy hostnames work without a rebuild; when it's `NEXT_PUBLIC_SITE_URL` (read as https if it has no scheme) or its www/apex twin (www.golo.golf and golo.golf); and, outside production, `http://localhost` or `http://127.0.0.1` on any port. A page on another site can't pass: its browser sets Origin to that site, and it can't add an `X-Forwarded-Host` header without a CORS preflight the route never answers. No Origin at all is allowed (curl and servers don't send one), and the rate limit covers those.
- Honeypot: the newsletter form has a hidden `hp_note` input (a meaningless name, so nothing autofills it), clipped out of view (not `display: none`), out of the tab order, `aria-hidden`, `autocomplete="off"`, and opted out of 1Password (`data-1p-ignore`) and LastPass (`data-lpignore`). If it holds anything the route answers `{ ok: true }` exactly like a sign-up, but saves nothing and sends nothing; it's checked before validation, so even an over-long value gets no field error. The field is in `subscribeSchema` so the form can send it; it's never written to the database (the insert names its columns one by one).
- Logs carry a reason code only (`[subscribe] blocked: origin`, `too_large`, `rate_limit_client`, `rate_limit_global`; `[subscribe] dropped: honeypot`) and the header shape above, never the address, IP, email or key. No cookie, script, CAPTCHA or new service; the cookie policy is unchanged.
- Assumes one Node process, as Hostinger runs today: the counters live in memory, so a restart clears them and a second process would double both limits.
- The global ceiling bounds the rate, not the month: hit continuously, 60 per 10 minutes is 8,640 a day, above the Reach quota. The month is bounded on the Reach side: #124 hands at most 50 addresses to Reach in any rolling 24 hours.
- Tests: `npm run test:guard` (part of `npm test` and a CI step) runs two files with no server, database or mail. `scripts/test-subscribe-guard.mjs`, 37 cases on an injected clock: both limits, their reset and the sliding window, Retry-After never below 1, the global ceiling not charged by `hit`, pruning, eviction at the key cap, hashed keys (the raw IP never stored, IPv6 case ignored), the last `X-Forwarded-For` entry as the client (`X-Real-IP` ignored) and the unknown key, the header shape and its hourly throttle, request host, site origins with and without a scheme, allowed and refused origins, a missing Origin, the honeypot empty and filled, the 4 KB cap and the reader cancelling an endless stream. `scripts/test-subscribe-route.mjs`, 22 cases through the real route handler with a fake database and mailer: a valid sign-up saves and notifies once without `hp_note`; a repeat doesn't notify; three overlapping sign-ups for one address make one lead and one notification; a failed save gives its global slot back; rotating fake `X-Real-IP` or first `X-Forwarded-For` entries still hits the client limit; a filled honeypot (300 characters, bad email) gets the same 200 with nothing saved or sent; foreign Origin 403; same-host preview Origin, apex Origin and no Origin allowed; the 6th request from one client 429 with `Retry-After`; 4 KB bodies 413 streamed and declared; invalid JSON and an invalid email 400; 180 honeypot and invalid requests leave the global ceiling uncharged; the ceiling then closes at exactly 60 charged sign-ups and refuses everyone; the header shape logged once; and no log line carries an address or email.
- Lint, typecheck and production build verified. Not deployed; no database touched.

## Remaining

- Search Console: re-check index coverage, selected canonicals and field Core Web Vitals against the October 8 baseline. Due between October 22 and November 5 (two to four weeks after the deploy).
- GA4 has been on since the October 8 build (NEXT_PUBLIC_ANALYTICS_ENABLED=true in hPanel; measurement ID G-36182P0H4D, the siteConfig default), but it only receives data since the October 16 fix (#100). `generate_lead` is a key event as of October 18; see above. Still to do: mark `newsletter_signup` as a secondary key event once it first arrives.
- GA4 is explicit opt-in (notice on first visit, Privacy choices in the footer), back from the brief October 19 opt-out. Microsoft Clarity was turned off on October 20 (#116). Read GA as an opted-in sample, not total traffic: visitors who decline or ignore the notice, send Global Privacy Control, or block trackers aren't counted. Search Console clicks and the lead table (landing page and referrer) remain the volume cross-check. October 19–20 data includes the opt-out period and localhost test visits; `docs/analytics-data-notes.md` has the exact window, the test traffic and the exclusion options.
- Privacy policy: the download-link bullet mentions "related technical records", and the usage section lists "referring pages". Counsel to confirm that covers landing page and referrer host on lead rows, or add them explicitly. Since #120 the "Where a website sign-up came from" item lists them explicitly, with the campaign fields; counsel to review that item and the new newsletter retention item (kept until the subscriber asks for deletion; unsubscribing doesn't delete the record).
- Verifiable authorship / reviewer information; do not invent credentials or people.
- Dedicated hero and mid-article photos for /blog/pressing and /blog/index-vs-course-handicap (source PNGs into tmp/img-src/, then scripts/generate-blog-images.mjs).
- Add maintained article revision dates when substantively editing content.
- Evaluate performance opportunities after content and discovery work.

## October 21, 2026: scheduled jobs on Hostinger (for #121)

The deployed site is the standalone build (`hbuilds/current/nodejs`: `server.js`, `.next`, a trimmed `node_modules`, `public`), with no source tree and no npm, so `npm run reach:retry` can't run there as-is. hPanel's **Node.js cron** runs `node --env-file=<site>/hbuilds/config/.env <site>/hbuilds/current/nodejs/<script>`, which gives a script the site's own server environment and nothing else. `next.config.mjs` `outputFileTracingIncludes` now copies `scripts/reach-retry.mjs`, `scripts/register-ts.mjs` and the Reach sync files (`lib/reach.ts`, `lib/reachSync.ts`, `lib/reachStore.ts`) into the standalone build, so the cron's script path is `scripts/reach-retry.mjs`. The script checks `REACH_SYNC_ENABLED` before loading anything: while it isn't exactly `true` it prints "Nothing done" and exits 0, without touching Prisma or the database. `npm run check:cron` (a CI step after the build) runs it from `.next/standalone` with plain node, switch off and, once the sync files exist, switch on against an unreachable database, so a missing runtime import fails CI instead of the production cron.
