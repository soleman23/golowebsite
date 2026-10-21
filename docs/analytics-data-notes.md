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

Created while building and verifying #114 and #115. None of it is a real visitor.

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
  - **GA4 received:** `page_view` for `/` and `/blog`, `form_start`,
    `web_vitals`, and the sign-up's batched events, where `newsletter_signup`
    is expected. A few of these were also sent to `www.google.com/g/collect`.
  - **Effect on reports:** 1 user and session attributed to
    `instagram / organic_social`, campaign `golo_prelaunch_2026q4`, with one
    newsletter sign-up, on October 21. Nothing else used that campaign yet,
    so every count for it on that day is this test.
  - **Not filtered.**
  - **Elsewhere:** one internal sign-up notification email was sent, and one
    test `NewsletterLead` row was created at 18:57:40 UTC. The owner deletes
    the row; this note doesn't claim it's gone.

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
