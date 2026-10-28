# SEO implementation progress

## Implemented October 4, 2026

- Homepage search title and H1 name the golf scorecard / side-game category; the brand tagline (siteConfig.tagline) sits in the pill above the H1.
- Features, games, and blog titles describe search intent; games and blog H1s describe their topics.
- /games and /blog are static, so their title, description, canonical and Open Graph tags are in the initial <head> rather than streamed into the body.
- Every route sets its own canonical, og:url, og:title and og:description — through lib/pageMetadata.ts for the static pages, generateMetadata for game guides and articles. The root layout carries only site-wide defaults (site name, share card, card type), so nothing page-specific leaks to routes that don't override it.
- X / Twitter cards come from each page's Open Graph tags: the layout sets only the card type, and Next fills title, description and image from openGraph.
- Every "get the app" button — nav pill, page CTAs, closing bands — reads appCtaLabel (lib/content/nav.ts): "Get the app" since Google Play went live on 2026-10-26 (it was "Get the launch link" while appLive gated it). The /games closing-band lead says to download the app.
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
- Launch wording: since 2026-10-26 the default closing-band lead and the footer "Download" link no longer follow appLive; the store row shows with Google Play live.
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

- The /blog hero status pill renders only while appLive is false; the /faq pill follows the ios-app capability ("On Google Play · iPhone app coming soon"). Their labels live in lib/content.
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
- **Confirmed on the live host, October 21 (after #128 deployed, build 22:34:50 UTC; invalid `{}` POSTs only).**
  - From one machine, six requests with six made-up first `X-Forwarded-For` entries got 400 ×5, then 429; made-up `X-Real-IP` values were limited too.
  - From a second network (a GitHub Actions runner), the same request got 400 while the first machine's key was still at 429, so clients get separate keys.
  - A request carrying one made-up entry arrived with `xff_entries=3 ip_headers=x-forwarded-for,x-forwarded-host,x-forwarded-port,x-forwarded-proto`: Hostinger's proxies append, and the last entry is the connecting client.
- Origin: allowed when its host is the host the request was sent to (`X-Forwarded-Host`, else `Host`), so PR previews and proxy hostnames work without a rebuild; when it's `NEXT_PUBLIC_SITE_URL` (read as https if it has no scheme) or its www/apex twin (www.golo.golf and golo.golf); and, outside production, `http://localhost` or `http://127.0.0.1` on any port. A page on another site can't pass: its browser sets Origin to that site, and it can't add an `X-Forwarded-Host` header without a CORS preflight the route never answers. No Origin at all is allowed (curl and servers don't send one), and the rate limit covers those.
- Honeypot: the newsletter form has a hidden `hp_note` input (a meaningless name, so nothing autofills it), clipped out of view (not `display: none`), out of the tab order, `aria-hidden`, `autocomplete="off"`, and opted out of 1Password (`data-1p-ignore`) and LastPass (`data-lpignore`). If it holds anything the route answers `{ ok: true }` exactly like a sign-up, but saves nothing and sends nothing; it's checked before validation, so even an over-long value gets no field error. The field is in `subscribeSchema` so the form can send it; it's never written to the database (the insert names its columns one by one).
- Logs carry a reason code only (`[subscribe] blocked: origin`, `too_large`, `rate_limit_client`, `rate_limit_global`; `[subscribe] dropped: honeypot`) and the header shape above, never the address, IP, email or key. No cookie, script, CAPTCHA or new service; the cookie policy is unchanged.
- Assumes one Node process, as Hostinger runs today: the counters live in memory, so a restart clears them and a second process would double both limits.
- The global ceiling bounds the rate, not the month: hit continuously, 60 per 10 minutes is 8,640 a day, above the Reach quota. The month is bounded on the Reach side: #124 hands at most 50 addresses to Reach in any rolling 24 hours.
- Tests: `npm run test:guard` (part of `npm test` and a CI step) runs two files with no server, database or mail. `scripts/test-subscribe-guard.mjs`, 37 cases on an injected clock: both limits, their reset and the sliding window, Retry-After never below 1, the global ceiling not charged by `hit`, pruning, eviction at the key cap, hashed keys (the raw IP never stored, IPv6 case ignored), the last `X-Forwarded-For` entry as the client (`X-Real-IP` ignored) and the unknown key, the header shape and its hourly throttle, request host, site origins with and without a scheme, allowed and refused origins, a missing Origin, the honeypot empty and filled, the 4 KB cap and the reader cancelling an endless stream. `scripts/test-subscribe-route.mjs`, 22 cases through the real route handler with a fake database and mailer: a valid sign-up saves and notifies once without `hp_note`; a repeat doesn't notify; three overlapping sign-ups for one address make one lead and one notification; a failed save gives its global slot back; rotating fake `X-Real-IP` or first `X-Forwarded-For` entries still hits the client limit; a filled honeypot (300 characters, bad email) gets the same 200 with nothing saved or sent; foreign Origin 403; same-host preview Origin, apex Origin and no Origin allowed; the 6th request from one client 429 with `Retry-After`; 4 KB bodies 413 streamed and declared; invalid JSON and an invalid email 400; 180 honeypot and invalid requests leave the global ceiling uncharged; the ceiling then closes at exactly 60 charged sign-ups and refuses everyone; the header shape logged once; and no log line carries an address or email.
- Lint, typecheck and production build verified. Not deployed; no database touched.

## Prepared October 21, 2026 (soleman23/golowebsite#121): newsletter sync to Hostinger Reach, OFF

Owner decisions on soleman23/golo#791: double opt-in, no welcome automation, Reach is the unsubscribe authority, retries never re-add a suppressed address, explicit newsletter sign-ups only. **Reach is confirmed for golo.golf** (golo#791, October 21): Plan & Limits shows 1,000 unique recipients and 7,000 emails a month, unused, next reset November 1, 2026; it shows no plan name and doesn't show double opt-in. **Production sync stays off** until the reviewed fixes, abuse protection, the schema below, the retry schedule, double opt-in, the suppression checks and the final privacy wording are verified and the owner approves.

- **Off by default.** `lib/reach.ts` returns no client unless the server env has `REACH_SYNC_ENABLED` set to exactly `true` and both `REACH_API_TOKEN` and `REACH_PROFILE_UUID`. While off, `/api/subscribe` neither reads nor writes the Reach columns, and `npm run reach:retry` prints "Nothing done" before loading anything. None of the three is `NEXT_PUBLIC_`. `reachSyncAttempts` takes its default from the database (`@default(dbgenerated("0"))`): with a plain `@default(0)` Prisma writes the column into every INSERT, and a sign-up on a database without the columns fails (P2022, reproduced on PostgreSQL 16 against the pre-#121 schema; with the fix the same sign-up saves).
- **Who is eligible.** Only `NewsletterLead` rows from the newsletter band (`source` `blog` or `post`, which the band always sends). A request without a `source` is stored as `unspecified`, which is never eligible. Contact-form messages, `PhoneLead` rows and app accounts never reach the sync. A row with any other source is marked `skipped_ineligible` before any Reach call. The source is set by the page, not proven, so it isn't an abuse control: the guard on `/api/subscribe` and the daily limit below are.
- **On sign-up** (sync on): a new eligible row is saved as `pending` and the visitor gets `200`. An address saved while sync was off (never queued) is queued by a fresh eligible sign-up; a row that's pending, failed, synced or skipped is left alone. **Nothing calls Reach from the sign-up.** The scheduled retry job is the only sender, every 15 minutes, so the confirmation email usually follows a sign-up within about 15 minutes. It can take longer when the daily or 30-day limit defers it, or when Reach is failing and the row waits out its backoff. That way concurrent sign-ups can't race the limits below or burst Reach's API, and a repeat sign-up can't trigger a second confirmation email. "New address" is decided atomically (a `create`, with the unique index's `P2002` meaning repeat).
- **Suppression first** (`lib/reachSync.ts` `syncLead`, `lib/reach.ts` `findContact`). Reach is asked about the address before anything is added: one search of the list endpoint with no status filter (so every status comes back), `per_page=100`, every page up to 10 (1,000 matches), each row matched exactly on the address (trimmed, case-insensitive, since `search` is a search term rather than a filter) and its `subscription_status` read. Unsubscribed anywhere wins. Any other known status (`pending`, `subscribed`, `confirmed`) means present: nothing is created and the row is `synced`. Only an address Reach doesn't know is created (`POST …/contacts {email}`). The lookup is a **failure**, never "absent", when a page fails or can't be parsed, `meta.total` or `meta.current_page` is missing, a page isn't the one asked for, the total or page size changes mid-walk, a page is short of what the total promises, there are more than 10 pages, or a matching row's status is missing or unknown. A failed lookup fails the attempt and nothing is created.
- **Limits.** At most **25** rows go to Reach in any rolling 24 hours, and at most **500** in any rolling 30 days. Both count rows marked `synced`, which over-counts. The plan's 1,000 unique recipients a calendar month are shared with campaigns, so sign-ups get at most half, and a flood drains over weeks instead of using the month up. Over either limit a row waits, unclaimed and with its attempts intact. The job holds a Postgres advisory lock (`pg_try_advisory_lock`) on its own **direct** connection (`DIRECT_URL`; Supabase's transaction pooler could hand a session lock to another client), so two overlapping runs can't both pass the count. Without `DIRECT_URL` the job refuses to run; a second run prints "Another Reach run holds the lock. Nothing done." (checked on PostgreSQL 16). It also pauses 2 s after each lead that called Reach.
- **Retries.** `npm run reach:retry` (`scripts/reach-retry.mjs`) retries `pending` and `failed` rows with backoff, up to 11 attempts: waits of 5, 10, 20, 40, 80, 160 and 320 minutes, then 6 hours three times, about 28.6 hours from the first attempt to the last (plus up to one cron interval per wait). A run sends at most 25 rows to Reach and starts no new one after 4 minutes; rows still in their backoff cost nothing. Only due rows are listed (never attempted, or past their backoff), oldest sign-up first, so rows still waiting can't fill the scan and a backlog of fresh rows can't starve rows in their retries. Each request's 8-second timeout covers reading the response body too, so a stalled response can't hang a run while it holds the lock. Each attempt is claimed atomically, so two runs can't call Reach for the same row. After a longer outage, `npm run reach:retry -- --requeue-failed --confirm` puts rows that used every attempt (failed, or pending after a run died on its last attempt) back to `pending` with no attempts, skipping any attempted in the last 30 minutes (it may still be in flight), then runs the retry. It refuses unless `REACH_SYNC_ENABLED=true` and `--confirm` are both given, and each row is still looked up in Reach first. Only this run's failures fail the cron. Logs carry lead ids and short error codes, never an address or the token.
- **On Hostinger** the deployed site is the standalone build, so the script ships inside it (`next.config.mjs` `outputFileTracingIncludes`) and hPanel's Node.js cron runs `scripts/reach-retry.mjs` with the site's own environment file (see "scheduled jobs on Hostinger" above).
- **Backfill.** `npm run reach:backfill` is a dry run: it counts never-queued rows that meet the consent rule and prints counts only (it doesn't read addresses). Consent rule: source `blog`/`post`, created on or after **2026-08-15 22:17:54 UTC**, the committer date of 3004c51, which added the band, `/api/subscribe` and `NewsletterLead` together. The band's consent copy is unchanged in every later revision (703a236, d036669). `--apply` refuses unless `REACH_SYNC_ENABLED=true` and `--confirm` are both given, and only queues rows for the retry job. On a database without the columns it says so and changes nothing. Not run under #121: only after the owner reviews the dry-run counts.
- **No welcome automation** anywhere in the code. Reach's own confirmation email is the only automatic message, provided double opt-in is on in the Reach profile.
- **Deletion requests (owner decision A).** `npm run newsletter:delete -- --confirm` (`scripts/newsletter-delete.mjs`) reads the address from standard input (never the command line) and takes the retry job's lock on `DIRECT_URL`, waiting up to five minutes. It deletes the website's `NewsletterLead` row(s) for the address first (case-insensitive), so no queued retry or backfill can ever send it again, and `syncLead` re-checks the row exists right before any create. Then it deletes the Reach contact if `REACH_API_TOKEN` and `REACH_PROFILE_UUID` are set; if not, it says to delete the contact in Reach by hand (Audience → Contacts → the contact → Actions → Delete). Deleting the Reach contact also deletes Reach's record that the address unsubscribed (verified October 21), so a later sign-up is a new one and has to confirm through double opt-in again. It also holds the sign-up lock (`DELETION_LOCK`) exclusively, and every sign-up insert holds it shared for its own transaction, so a sign-up in flight either lands first and is deleted, or waits and is then a new, explicit sign-up. Output is counts only. **The same request also covers the team's sign-up notification email:** after the script, delete the "[GoLo] Newsletter signup" message for that address from the team mailbox (info@golo.golf). The email provider's (Resend's) own log retention isn't promised in the wording. Both locks are taken by polling on one pinned connection (`connection_limit=1`), and the sign-up lock is released as soon as the website rows are deleted, before the Reach calls. Checked on PostgreSQL 16 at this head: refused without `--confirm`; deleted both case variants of the address and nothing else; waited for a held retry lock (about 5 s); gave up after 30 s, changing nothing, while a stuck sign-up held its lock; a sign-up started during a deletion succeeded (about 2 s); an overlapping retry run was refused.
- **Privacy wording and band copy:** final drafts in `reachPrivacyDraft` (`lib/content/legal.ts`), not rendered, with no markers. The band (`NewsletterBand.tsx`) now shows "Almost there. If this address is new to us…" when the server answers `confirmByEmail: true`. That depends only on the switch and the source, never on whether the address was already on the list. Its fine print ("Unsubscribe from any email.") is unchanged here. The confirmation email has no unsubscribe link, so a corrected line is proposed in `reachPrivacyDraft.newsletterBand.proposedFine`, to be applied with the change that turns sync on.
- **Verified with Reach (golowebsite#121, October 21–22):**
  - An API-created contact gets the double-opt-in confirmation email within seconds ("Confirm you want to hear from us", from noreply@golo.golf; its only link is the confirm button, and it has no unsubscribe link).
  - The contact is `pending` until the link is clicked, then `confirmed`.
  - A repeat create sends nothing and changes nothing.
  - Unsubscribed stays unsubscribed (Reach itself and this code).
  - Deletion removes the contact and its unsubscribed mark.
  - Confirmation emails don't count toward the plan.
  - **Open:** three `qa+…@golo.golf` addresses were accepted and held pending but never received the email. Whether Reach skips `+` addresses or the alias doesn't reach this mailbox isn't established; it's raised with Hostinger support.
- **Tests:** `npm run test:reach` (`scripts/test-reach-sync.mjs`, also a CI step; part of `npm test`), 43 cases: also the controlled-test list (`REACH_SYNC_ONLY`), the 30-day limit, pacing, a stalled response body timing out, oldest-first retry order, the deletion procedure (row and contact, the no-token path, stale queued work never recreating a deleted contact) the response's `confirmByEmail`, due-only scanning, and queueing a never-queued row on a fresh sign-up. Stub client, in-memory leads, global `fetch` that throws. Beyond the sign-up, retry, suppression, eligibility, switch and backfill cases: a match on page 2 is found (also when Reach serves 15 a page instead of 100), a failed, short, wrong or changed page is a failure, more than 10 pages is a failure, a near-miss address such as `xgone@…` doesn't match, unsubscribed wins over another status for the same address, an unknown or missing status is ambiguous and blocks the add, `--requeue-failed` leaves rows still in their retries or attempted in the last 30 minutes, a requeue during an in-flight last attempt still makes one create, the daily limit defers without spending attempts, a run stops at its per-run limit and time budget, a request without `source` is never queued, and the switch-off Prisma store mentions no Reach column (plus a check that `reachSyncAttempts` keeps its database default).

**Deploy order:** apply the columns to the website's Supabase database ("golowebsite") **before** merging, since Hostinger builds `main` automatically. With the switch off the sign-up route doesn't touch the new columns, but the retry and backfill scripts and any sign-up with the switch on do. Existing rows get `reachSyncStatus` null (never queued), so nothing old is synced by adding them:

```sql
ALTER TABLE "NewsletterLead" ADD COLUMN "reachLastAttemptAt" TIMESTAMP(3),
ADD COLUMN "reachSyncAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "reachSyncStatus" TEXT;
CREATE INDEX "NewsletterLead_reachSyncStatus_idx" ON "NewsletterLead"("reachSyncStatus");
```

(From `prisma migrate diff` against the schema before #121; no database used. The `dbgenerated("0")` default produces the same `DEFAULT 0`.) Then confirm the three columns and the index exist and record it in the PR. Not yet applied.

**Go-live in three stages, each behind the owner's explicit approval** (so the PR never waits on a production test that needs the PR):

*Stage 1: code and schema with sync OFF.*
1. Apply the SQL above to the golowebsite production database, then confirm the three columns and the index in `information_schema`.
2. Merge #124. Hostinger builds `main`; the environment is unchanged (`REACH_SYNC_ENABLED` unset).
3. Verify without a sign-up:
   - the deployed `scripts/reach-retry.mjs` matches `main`;
   - the next cron run prints "Nothing done";
   - /blog and /privacy render unchanged.
   A sign-up check needs its own approval, using a throwaway address that isn't the stage 2 address. Its row and team email are deleted afterwards.
4. Rollback: revert the PR (Hostinger rebuilds). The new columns are nullable or defaulted, so they can stay.

*Stage 2: controlled production test with one owner-designated address.*
- **The address:** an owner-controlled address with **no existing `NewsletterLead` row**. A `+` alias of a real mailbox is fine: on 2026-10-22 `devin+reach124@golo.golf` got its confirmation email within seconds and its own link confirmed exactly that address (golo#791). The earlier `qa+…` contacts got nothing, and it's not known whether `qa@` is a mailbox, so don't use it (check with a read-only `SELECT`). If a row exists, delete it first through `newsletter:delete`.
- **Preconditions:**
  - the Reach token is installed and its scope verified (golo#791);
  - `REACH_PROFILE_UUID` is set and `DIRECT_URL` is already set;
  - set `REACH_SYNC_ONLY=<address>` first, then `REACH_SYNC_ENABLED=true`, then redeploy so the server reads them.
  - The cron reads `hbuilds/config/.env` directly, so it may see each change as soon as it's saved.
- **While `REACH_SYNC_ONLY` is set** (an empty value matches no one):
  - every other sign-up is saved exactly as with sync off;
  - the retry job sends no row for any other address, whoever queued it;
  - backfill `--apply` refuses when run with the site environment.
- **Steps and expected results:**
  1. **Sign up** with the designated address on www.golo.golf/blog. Expect `200` and "Almost there…". The row is `pending`, and one internal notification arrives.
  2. **Next cron run** (≤ 15 min). It prints the controlled-test line and `Reach retry: {… "created":1, "failed":0 …}`. Reach shows the contact `pending`, and one confirmation email arrives.
  3. **Click the link.** Reach shows `confirmed`; the row is `synced`.
  4. **Sign up again.** Expect `200`, no new email, Reach unchanged, and the next run lists nothing new.
  5. **Suppression.**
     - Unsubscribe (Reach → Actions → Unsubscribe). Reach shows `unsubscribed`.
     - **Reactivation guard:** follow step 2's confirmation link again. Reach shows `confirmed` again, with `unsubscribed_at` still set. The next run must report `"reactivated":1, "reverted":1`, Reach shows `unsubscribed`, and no email arrives. The run after that reports `"reactivated":0`.
     - Then delete only the website row (read-only check first, then a scoped `DELETE` by id, with approval), and sign up again.
     - The next run must report `suppressed: 1`, `created: 0`, and no email arrives.
  6. **Delete:** `printf '%s\n' "<address>" | npm run newsletter:delete -- --confirm`, with the production `DIRECT_URL` and the token. Expect `Website sign-up rows deleted: 1` (a 0 means the wrong database: stop), then `Reach contacts deleted: 1`, and Reach shows 0. Then delete the team's notification email.
- **Rollback and cleanup** at any failure:
  1. Unset `REACH_SYNC_ENABLED` and redeploy.
  2. Only then remove `REACH_SYNC_ONLY`.
  3. Delete the test row and contact.
  4. If the token may have leaked, revoke it.

*Stage 3: public activation (separate approval). In order:*
1. Before the band's new fine print can ship, send one test campaign to the designated address (needs approval). Check its unsubscribe link and `List-Unsubscribe` header.
2. Ship the approved privacy wording and the band's fine print in their own PR, with the date set to that day. Merge it and check /privacy and /blog live.
3. Then remove `REACH_SYNC_ONLY` and redeploy. Sign-ups are now queued for everyone, and the reactivation guard now covers every contact in the golo.golf profile. Its first run reverts any contact already re-subscribed by an old link, including the owner's QA contacts (e.g. `devin@golo.golf`, left `confirmed` with `unsubscribed_at` set on 2026-10-23).
4. The owner reviews the backfill dry-run counts before any `--apply`.
5. Rollback: unset `REACH_SYNC_ENABLED` and redeploy (or restore `REACH_SYNC_ONLY`). The wording PR can stay or be reverted.
6. The welcome automation (golo#874) stays inactive; enabling it is its own decision.

**Before enabling** (each verified, then the owner's approval):

1. ~~Reach account~~: confirmed October 21 (golo#791).
2. ~~**Scheduled retries**~~: done. The hPanel Node.js cron runs `scripts/reach-retry.mjs` every 15 minutes (#125); its first scheduled run, 2026-10-21 22:00:08 UTC, printed "Reach sync is off … Nothing done."
3. ~~**Abuse guard on `/api/subscribe`**~~: done. #126 added the Origin check, per-client and global limits, honeypot and 4 KB cap; #128 made the key the proxy-appended `X-Forwarded-For` entry. Live-checked October 21: spoofed headers no longer dodge the client limit, and two networks get separate limits. With sync on, the global ceiling only charges sign-ups that save a new address, and the daily limit above caps what reaches Reach.
4. ~~**Double opt-in**~~: done. It was off; turned on October 21 and verified after a reload (subject "Confirm you want to hear from us", sender noreply@golo.golf). The profile has no automations.
5. **Token:** in the server environment only (`REACH_API_TOKEN`, `REACH_PROFILE_UUID`; never `NEXT_PUBLIC_`, the repo or chat). `REACH_SYNC_ENABLED` stays unset in production until the approval.
   - **Decided 2026-10-23 (owner, golo#791 brief 6368681393):** the token comes from a **dedicated Hostinger account that holds only Reach**, never from the owner account.
     - Hostinger tokens have no scopes ("same permissions as the owning user"), and a Collaborator token was refused for the shared profile.
     - The dedicated account keeps no saved payment method.
     - The token expires in 3 months, never "Never expires", with a rotation reminder.
   - Before rollout, `scripts/ops/reach-credential-check.mjs` must show that token reading the new golo.golf profile and refused for the owner account's services.
6. **Live check** with designated test addresses (golowebsite#121, parts 1–2, October 21). It ran through the owner's Hostinger Connector, with no token; Reach's real responses were replayed through this code.
   - Verified: the contact is pending; no welcome email and no automations; search is a substring match; pagination and the 422 limit; unsubscribed contacts stay out (Reach itself and this code); deletion leaves no trace.
   - **Resolved 2026-10-22 (golo#791):**
     - API-created contacts do get the confirmation email: `devin@golo.golf` within 3 s, and a `+` alias within seconds.
     - A one-recipient QA campaign's unsubscribe link worked. A later API create for that address left it `unsubscribed` and sent nothing. This code's suppression path was replayed against Reach's live response: `suppressed`, 0 creates.
   - **Found:** Reach still honours a confirmation link sent *before* an unsubscribe. Clicking it re-subscribes the contact (23:23:35, golo#791). Hostinger has no expiry, invalidation or "final unsubscribe" setting (chat, 2026-10-23).
   - **Reactivation guard (owner-approved Option 1, live-tested 2026-10-23, golo#791):** every retry run sets back to `unsubscribed` any contact Reach shows `confirmed` or `subscribed` with an `unsubscribed_at` (`revertReactivated`, lib/reachSync.ts).
     - Live: the PATCH sent no email in 5 minutes, and Reach refused to send a campaign to that contact's segment (0 recipients).
     - An old link still re-subscribes the contact after a PATCH, and a 16-hour-old link worked. So the guard runs every time, not once.
     - Tradeoffs:
       - The exposure window is one cron interval (15 min).
       - A deliberate re-subscribe through an old link is reverted too. So is a contact restored any other way in Reach (a manual edit, a Reach form, an import) if it keeps its `unsubscribed_at`. To restore someone, delete the contact with `newsletter:delete`, which clears the mark, and have them sign up again (fresh double opt-in). There is no exemption list; adding one is the owner's call.
       - Hostinger would not confirm that a PATCH equals a contact's own unsubscribe. The live results are our observation.
       - Automations weren't tested (there are none).
     - It respects `REACH_SYNC_ONLY`. A list failure or a failed revert fails the cron, and the next run retries.
7. **Privacy wording:** the final words, from verified behaviour only, approved and shipped together with the change that turns sync on, with "Last updated" revised.
8. **Backfill:** only after the owner reviews the dry-run counts.

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
