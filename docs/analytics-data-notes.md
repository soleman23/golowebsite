# Analytics data notes

What's in the GA4 property ("GoLo Golf", `G-36182P0H4D`) and the Clarity
project ("GoLo Golf Website", `z0fu5ddehq`) that shouldn't be read as normal
opted-in traffic, and what can be done about it. Nothing listed here has been
deleted or filtered. Every deletion option below is irreversible.

## Collection without opt-in, October 19–20, 2026

Production deploys a couple of minutes after a merge to `main`. Times are
merge time plus the deploy delay we measured; a visitor who already had a page
open kept the old code until they reloaded, so the edges are approximate.

| From (UTC) | To (UTC) | Pacific (Oct 19) | What ran without asking |
| --- | --- | --- | --- |
| ~01:07 Oct 20 (#113, merged 01:05:47) | ~04:12 Oct 20 (#115, merged 04:10:17) | ~6:07 PM – 9:12 PM PDT | GA4 for every visitor unless they declined or sent GPC |
| ~02:04 Oct 20 (#114, merged 02:02:14) | ~04:12 Oct 20 | ~7:04 PM – 9:12 PM PDT | Microsoft Clarity recordings for every visitor unless they declined or sent GPC |

Before ~01:07 UTC the site was opt-in with no notice (effectively only the
owner). From ~04:12 UTC it is explicit opt-in (#115). Treat GA and Clarity data
inside the window as collected without consent, and report it separately.

## Test traffic

Created while building and verifying #114 and #115 (October 19–20), and by later
verification runs for the marketing work in soleman23/golo#789 and #790
(October 21–23). None of it is a real visitor. Where an entry says requests were
*sent*, that was observed in the browser; whether GA4 processed them into
reports is stated separately.

**GA4**
- Hostname `localhost`: local production builds that used the real
  measurement ID, roughly 01:15–02:05 UTC and around 03:50 UTC on October 20.
  Recognizable by the hostname, and by `exception` events whose description
  starts "Uncaught Error: test error from verification" or is a run of "x".
- Production (`www.golo.golf`) test visits from the owner's Mac (city Bend):
  around 02:05, 04:15 and 15:00 UTC on October 20.
- **October 21, 18:11, 18:15 and 18:19 UTC (11:11–11:20 AM PDT): three
  consent-check runs.** These were automated runs of the consent check for
  soleman23/golo#789, in headless Chromium on the owner's Mac, each landing
  on `/` with no campaign tags and choosing "Allow analytics".
  - **What leaked:** the check blocked the copy of each hit sent to
    `www.google-analytics.com/g/collect`. It didn't watch the second copy
    gtag.js sends to `www.google.com/g/collect`, so that copy went out. Each
    run may have sent a `page_view` and possibly a `web_vitals` hit that way.
  - **Unverified:** whether GA4 counts hits arriving through that endpoint
    in the property's reports.
  - **Worst case in reports:** up to 3 extra desktop users and sessions on
    October 21, landing page `/`, source `(direct)`.
  - **Not filtered or deleted.**
  - **The fix:** the check now blocks every off-site request except gtag.js
    itself (soleman23/golo#868, `marketing/social/scripts/ga4-consent-check.mjs`).
    Its later runs sent no hits; an independent check behind a logging proxy
    confirmed it.
- **October 21, 18:57:28–18:57:47 UTC (11:57 AM PDT): one approved
  attribution diagnostic.** This is soleman23/golo#790's diagnostic, approved
  by the owner. It was one headless Chromium visit through the planned
  Instagram-bio link:
  - It landed on `/` with `utm_source=instagram`, `utm_medium=organic_social`,
    `utm_campaign=golo_prelaunch_2026q4` and `utm_content=bio`, chose "Allow
    analytics", went to `/blog` through the nav, and submitted the newsletter
    form once with a designated `qa+` test address on golo.golf.
  - **Requests the browser sent (observed):** `page_view` for `/` and
    `/blog`, `form_start` and `web_vitals`, plus batched requests whose event
    names travel in the request body and weren't recorded. `newsletter_signup`
    is expected among them but wasn't observed. A few requests also went to
    `www.google.com/g/collect`. Processed events in GA4 reports haven't been
    checked yet; they take 24 to 48 hours.
  - **Expected effect on reports (unverified):** 1 user and session
    attributed to `instagram / organic_social`, campaign
    `golo_prelaunch_2026q4`, on October 21, and possibly one
    `newsletter_signup` event if GA4 received and processed it (`seo-progress.md`
    still records that event as not yet seen). Nothing else used that campaign
    yet, so any count for it on that day is this test.
  - **Not filtered.**
  - **Elsewhere:** one internal sign-up notification email was sent, and one
    test `NewsletterLead` row was created at 18:57:40 UTC (`cmvih5f580000863usxb5rsfl`,
    deleted 2026-10-22 00:21 UTC along with the post-deploy diagnostic row
    `cmvikw6v60000b4xl2qb7y4q6`, which declined analytics and sent no GA4 hits).
    Because this run used Playwright's default headless user agent, GA4's
    known-bot filter most likely dropped the session (see the October 22 entry
    below).
- **October 22, 21:26–21:28 UTC (2:26–2:28 PM PDT): the golowebsite#119
  fallback test, owner-approved.** These were controlled visits tagged
  `utm_medium=qa`, `utm_campaign=golowebsite-119`, each choosing "Allow
  analytics":
  - **21:26 UTC (Playwright's headless user agent):** `qa119-ga-only`
    (/about), `qa119-google-only` (/contact) and `qa119-both` (/faq). GA4
    Realtime showed none of them, most likely because of known-bot filtering.
  - **21:27:57–21:28:27 UTC (normal Chrome user agent):** `qa119-ga-only-2`
    (/about), `qa119-google-only-2` (/contact) and `qa119-both-2` (/faq). GA4
    Realtime showed 3 users, one view each of About, Contact and FAQ, and
    `web_vitals` ×12.
  - **Reporting rule (raw data kept, no GA4 filter or deletion):** leave out
    sessions whose session source starts with `qa119`, or whose session
    medium is `qa`.
  - **Observed so far:**
    - At 2026-10-23 01:0x UTC, Traffic acquisition for Oct 22 ("mostly
      complete data") listed `qa119-google-only-2` with 1 session and 8 events.
    - The other two hadn't appeared yet.
    - GA4 showed an Oct 22 total of 3 sessions, with rows `(direct)` 2,
      `(not set)` 1 and `qa119-google-only-2` 1. The rows overlap, as GA4's own
      percentages show, so they don't add up to the total.
  - **Not yet reconciled:** final totals with and without the rule, once all
    three are processed. The scheduled task `golo-ga4-qa119-verify` (2026-10-24
    09:00 PDT) checks that and updates this entry.
- **October 23, 02:33:00–02:33:22 UTC (October 22, 7:33 PM PDT): one approved
  live-profile Instagram acceptance run (soleman23/golo#790).** Started on the
  signed-out public profile `https://www.instagram.com/gologolfapp/` in a clean
  browser context with a normal Chrome user agent and GPC off:
  - It clicked the live bio link (`l.instagram.com` → `https://www.golo.golf/?utm_source=instagram&utm_medium=organic_social&utm_campaign=golo_prelaunch_2026q4&utm_content=bio`),
    chose "Allow analytics" on `/`, navigated to `/blog` through the top nav,
    and submitted the newsletter form once with the designated test address
    `qa+utm-ig-web-20261022@golo.golf`.
  - **Requests the browser sent (observed):** `page_view` on `/` (02:33:08 UTC,
    `dl` carrying all four `utm_*` parameters and `dr=https://l.instagram.com/`),
    `link_click` (`/blog`, nav), `page_view` on `/blog` (02:33:13 UTC),
    `scroll_depth`, `form_start` (02:33:15 UTC), `newsletter_signup`
    (02:33:20 UTC), `user_engagement` and `web_vitals`.
  - **Expected effect on reports:** 1 desktop user and session on October 22
    (Pacific) attributed to `instagram / organic_social`, campaign
    `golo_prelaunch_2026q4`, and 1 `newsletter_signup` event.
  - **Not filtered.**
  - **Elsewhere:** one internal sign-up notification email was sent. The
    `NewsletterLead` row (`cmvkcv5kj0000k10h1xu3iu0m`, created 02:33:14.996 UTC)
    was verified with `source=blog`, `landingPath=/`,
    `referrerHost=l.instagram.com`, `landingSource=instagram`,
    `landingMedium=organic_social`, `landingCampaign=golo_prelaunch_2026q4` and
    `landingContent=bio`, then deleted at 02:34 UTC (`0` `qa+` rows remain).

**Clarity**
- Sessions whose entry URL is on `localhost`, about 02:20–05:30 UTC on
  October 20 (Clarity shows them as "Entry: localhost").
- Production test sessions: 02:03 UTC October 20 (`/games`), around 04:15 UTC,
  and 15:03–15:05 UTC October 20 (`/contact`, synthetic form entries, replay
  check).
- Clarity user ID `1mllpb1` is the owner's own Chrome. Its 02:37 UTC
  October 20 session (7:37 PM PDT October 19, 39 minutes on the home page),
  inside the no-consent window, is the owner's, not an outside visitor's.

## Options

### GA4

| Option | What it does | Reversible | Consequences |
| --- | --- | --- | --- |
| Leave it, filter in reports | Add a report filter or comparison "Hostname does not exactly match localhost"; compare date ranges around the window | Yes | No data loss; has to be applied per report or saved |
| Annotation | Mark Oct 19–20 in GA so anyone reading reports sees why | Yes | None |
| Web hostname data filter | Admin → Data filters → exclude hostname `localhost` | The filter can be turned off | Only affects data collected after it's active, and excluded data is never available later. Doesn't touch the existing test hits |
| Data deletion request | Admin → Data deletion requests: erase parameter values (optionally only values containing given text) for a date range | No, after a 7-day grace period | Erased text becomes "(data deleted)" but the events still count in report totals; can't target a hostname directly; data must be more than 12 days old (not before ~November 1); takes 7–63 days |
| Delete specific users | Explorations → User explorer → delete a user (by client ID) | No | Removes that browser's data from explorations within 24 hours and permanently within 63 days; the test browsers' client IDs would have to be found first; effect on aggregated reports isn't documented |

Recommendation: annotate the window, filter `localhost` in reports, and add the
hostname data filter for future builds. Don't use deletion requests for this:
they leave the counts in place and can't target the test hits cleanly.

### Microsoft Clarity

| Option | What it does | Reversible | Consequences |
| --- | --- | --- | --- |
| Let it expire | Recordings are kept 30 days (window data gone around November 19); heatmaps, dashboard data, saved recordings and a random sample Microsoft keeps last 9 months | — | No action; data stays visible until then |
| Filter dashboards | Filter by URL or entry page to hide `localhost` | Yes | Per view only |
| IP blocking | Settings → IP blocking: exclude the owner's IP | Yes | Future sessions only |
| Delete the project | Settings → delete project | No | Deletes everything in the project, including real sessions; Microsoft documents no other way to delete data. A new project means a new ID in `lib/siteConfig.ts`. Microsoft's handling of its own copies under its controller terms isn't documented |

Clarity was turned off on October 20, 2026. Deleting the project is the
cleanest way to end the window's data, at the cost of losing everything in it;
otherwise recordings expire around November 19 and the rest within 9 months.
