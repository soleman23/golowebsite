# GoLo Golf — Marketing Website

Production-ready marketing site for **GoLo**, the golf-betting scorekeeper app
(_"Bet it. Track it. Settle it."_). Built with **Next.js (App Router) +
TypeScript + CSS Modules**, with **Prisma + Postgres (Supabase)** for the
database and a real **SMS** endpoint for the hero "text me the link" form.

- Single long-scroll landing page + `/privacy` and `/contact` pages
- Working contact form and phone-lead capture (stored in Postgres)
- SMS via Twilio, with a safe **stub mode** when no credentials are set
- No hardcoded secrets, ports, or domains — everything is env-driven
- SEO: per-page metadata + Open Graph/Twitter tags, `robots.txt`, `sitemap.xml`
- Health-check route at `/api/health` for uptime monitors
- Accessible (semantic HTML, labels, keyboard nav, focus states, reduced-motion)

---

## Requirements

- **Node.js 24** (pinned in `.nvmrc`; CI builds on 24.x — Node 20 reached end of life in April 2026)
- For Hostinger Node.js hosting, set **24.x** in hPanel under **golo.golf → Settings** and redeploy; `.nvmrc` alone does not change the hosted runtime.
- A **Postgres** database (Supabase recommended; any Postgres works)
- _(Optional)_ a **Twilio** account to send real SMS

---

## 1. Install

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

## 2. Configure environment

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

Minimum to run locally: set `DATABASE_URL` and `DIRECT_URL`. Everything else
has safe fallbacks. See **Environment variables** below.

## 3. Set up the database

```bash
npm run db:push         # syncs prisma/schema.prisma to the database (creates tables)
```

## 4. Run locally (development)

```bash
npm run dev
```

Open <http://localhost:3000>.

## 5. Build & run (production)

```bash
npm run build           # prisma generate + next build (standalone output)
npm start               # next start -p ${PORT:-3000}
```

---

## Scripts

| Script              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload                    |
| `npm run build`     | Generate Prisma client, then build for production       |
| `npm start`         | Start the production server on `$PORT` (default 3000)   |
| `npm run lint`      | ESLint (`next lint`)                                     |
| `npm run typecheck` | TypeScript type-check, no emit                          |
| `npm run db:push`   | Sync `schema.prisma` to the database (creates/updates tables) |
| `npm run db:studio` | Open Prisma Studio to inspect data                      |

---

## Environment variables

Copy from [`.env.example`](.env.example). Never commit `.env`.

| Variable                       | Required | Exposure    | Purpose                                             |
| ------------------------------ | -------- | ----------- | --------------------------------------------------- |
| `DATABASE_URL`                 | **Yes**  | Server-only | Postgres **pooled** connection (app queries)        |
| `DIRECT_URL`                   | **Yes**  | Server-only | Postgres **direct** connection (migrations)         |
| `SMS_PROVIDER`                 | No       | Server-only | SMS provider (default `twilio`)                     |
| `TWILIO_ACCOUNT_SID`           | No\*     | Server-only | Twilio SID — needed to send real SMS                |
| `TWILIO_AUTH_TOKEN`            | No\*     | Server-only | Twilio auth token                                   |
| `TWILIO_FROM_NUMBER`           | No\*     | Server-only | Twilio sender number                                |
| `SMS_MESSAGE_TEMPLATE`         | No       | Server-only | Message body; `{url}` is replaced with the link     |
| `RESEND_API_KEY`               | No\*\*   | Server-only | Resend API key — needed to email contact-form notifications |
| `CONTACT_NOTIFY_EMAIL`         | No       | Server-only | Inbox that receives contact-form notifications (default `info@golo.golf`) |
| `CONTACT_FROM_EMAIL`           | No       | Server-only | Sender address Resend sends as                      |
| `NEXT_PUBLIC_APP_STORE_URL`    | No       | **Public**  | App Store link (falls back to `#get`)               |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL`  | No       | **Public**  | Google Play link (falls back to `#get`)             |
| `NEXT_PUBLIC_SITE_URL`         | No       | **Public**  | Canonical URL for SEO/OG tags                       |
| `NEXT_PUBLIC_DOWNLOAD_URL`     | No       | **Public**  | Link texted to users                                |
| `NEXT_PUBLIC_SHOW_STATS`       | No       | **Public**  | `true`/`false` — show the stats band                |
| `NEXT_PUBLIC_SHOW_TESTIMONIALS`| No       | **Public**  | `true`/`false` — show testimonials                  |
| `NEXT_PUBLIC_HERO_BACKDROP`    | No       | **Public**  | `sunset` \| `course` \| `turf`                      |
| `NEXT_PUBLIC_APP_LIVE`         | No       | **Public**  | `true`/`false` (default **false**) — see below      |
| `NEXT_PUBLIC_TERMS_PUBLISHED`  | No       | **Public**  | `true`/`false` (default **false**) — see below      |
| `NEXT_PUBLIC_ACCEPTABLE_USE_PUBLISHED` | No | **Public** | `true`/`false` (default **false**)                 |
| `NEXT_PUBLIC_ANALYTICS_ENABLED`| No       | **Public**  | GA + Clarity kill switch (default **false**); explicit opt-in when on |
| `NEXT_PUBLIC_GA_ID`            | No       | **Public**  | GA4 measurement ID                                  |
| `NEXT_PUBLIC_CLARITY_ID`       | No       | **Public**  | Microsoft Clarity project ID (default `z0fu5ddehq`) |

### Launch controls

`NEXT_PUBLIC_APP_LIVE` is what keeps the site honest before release. While it's
`false`, the hero and the closing CTA show the **"text me the link" capture
instead of the App Store / Google Play buttons**, the fine print reads "in
testing with real groups", and `/features` shows the beta-pricing note. Flipping
it to `true` — *and* setting the two store URLs — turns the store buttons back on
everywhere at once. Don't flip one without the other: `store_button_click` fires
`destination_configured: false` if you do.

`NEXT_PUBLIC_TERMS_PUBLISHED` gates `/terms`. The current copy is authorized as
interim website Terms but must be approved or replaced before
`NEXT_PUBLIC_APP_LIVE` becomes `true`. The Acceptable Use draft remains
directly reviewable while its flag is `false`, but carries `noindex,
nofollow`, stays out of the sitemap, and remains unlinked. The Cookie Policy
is always published.

### Analytics (Google Analytics 4 and Microsoft Clarity)

`NEXT_PUBLIC_ANALYTICS_ENABLED` is a site-wide kill switch and defaults to
`false`. When it's `true`, both tools are **explicit opt-in**, as one choice:

| State | What loads | What the visitor sees |
| --- | --- | --- |
| No choice yet | Nothing. No Google or Clarity script, request or cookie. | The analytics notice at the bottom of the screen, Allow and Decline at equal weight, nothing preselected |
| Allowed | GA4 (`gtag.js`) and Clarity, on every page | No notice |
| Declined | Nothing | No notice |
| Withdrawn (declined after allowing) | Stop signals, then a page reload without either script (other open tabs stop at once and reload the next time they're hidden; no reload when an unsaved decline sits over a saved grant that can't be removed); `_ga`, `_ga_*`, `_clck`, `_clsk` cleared | Privacy choices shows "Declined" |
| Global Privacy Control | Nothing, even with a saved grant | No notice; Privacy choices explains GPC and disables Allow |
| Storage blocked | Nothing until the visitor chooses; the choice lasts for the page only | The notice, every page load |

- The choice lives in localStorage as `golo.analytics.consent.v2` (`granted` /
  `denied`). The pre-Clarity key `golo.analytics.preference` is read, never
  deleted: a decline there carries over (and beats a v2 grant, since every
  choice is mirrored into the old key, so a "denied" there is newer), a grant
  there is asked again. The mirroring matters because pages from the earlier
  opt-out build read only that key and treat a missing value as allowed.
- "Privacy choices" in the footer links to `/privacy#analytics-choices`, the
  persistent control. The same control is on `/cookies`.
- Withdrawal reloads the page because neither vendor documents a full stop for
  an already-loaded tag: Google documents `ga-disable-<ID>` only when set before
  gtag runs, and Clarity's denied consent keeps a cookieless mode running.
- On every page load (whatever the choice, so the history entry itself is
  clean) and again before either script loads, `dropUnusedQueryParams()`
  rewrites the address bar so only these survive: GA4's campaign fields (`utm_id`, `utm_source`,
  `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`,
  `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`) whose
  value has no `@`, no long digit run and at most 100 characters, plus a slug
  `filter` on `/games` and `topic` on `/blog` and `/contact`. GA's
  `page_referrer` drops its query string, and its path too when the path
  looks personal. A path segment that looks personal becomes `redacted` (only
  404s can have one) and such a fragment is dropped. An inbound URL carrying an
  email address, or a token in a parameter the site doesn't use, never reaches GA's `page_location` or a Clarity recording.
- The GA tag is configured with `allow_google_signals: false` and
  `allow_ad_personalization_signals: false` (every hit carries `npa=1`).
  Clarity gets `consentv2` with `analytics_Storage: granted`,
  `ad_Storage: denied`.
- `track()` in `lib/analytics.ts` masks email- and number-shaped text in every
  string param and cuts values to GA4's 100-character limit. Never pass form
  values, names, emails or phone numbers to it anyway.
- The phone, newsletter and contact forms (with their error and confirmation
  messages) carry `data-clarity-mask="true"`. Clarity's project masking is
  "Balanced" (inputs plus email- and number-shaped text). Keep it at Balanced
  or Strict: the policies say form entries are masked.

Copy for the notice and the control is in `lib/content/analyticsConsent.ts`;
the disclosures are `/privacy#website-analytics` (published) and `/cookies`.
Both are published and linked: the footer has "Privacy choices" and "Cookie
Policy", and the control on `/privacy` and `/cookies` links to the other page.
(`NEXT_PUBLIC_COOKIES_PUBLISHED` was removed; an old value in hPanel is ignored.)
Keep the policies, this README and the consent copy in lockstep.
`docs/analytics-data-notes.md` records data that isn't normal opted-in traffic
(the October 19–20 opt-out window and test hits) and the options for it.

#### Events

Automatic (GA4 enhanced measurement, configured on the web stream):
`page_view` (initial load and every client-side URL change, including the
`/games` and `/blog` filter query), `scroll` (90%, once per page),
`click` (outbound links), `form_start` / `form_submit` (form id, name,
destination and field metadata, never values), `file_download`. Site search
(`view_search_results`) never fires: its query parameters are stripped.

Sent by the site:

| Event | Params | Fires when |
| --- | --- | --- |
| `generate_lead` | `method`, `placement` | A phone number was accepted for the download text (key event) |
| `lead_form_error` | `form`, `stage`, `placement` | That submission failed (validation, server, network) |
| `contact_submit` | `form`, `topic` | The contact form was sent |
| `newsletter_signup` / `newsletter_error` | `page` / `reason` | A newsletter address was accepted / failed |
| `store_button_click` | `store`, `placement`, `destination_configured` | An App Store / Google Play button was clicked |
| `cta_click` | `page`, `cta` | A hero or closing CTA was clicked |
| `faq_open` | `page`, `question_id` | An FAQ answer was opened |
| `game_filter` / `blog_filter` | `filter` / `category` | A filter chip was selected |
| `share_click` | `post`, `channel` | A blog share control was used |
| `scroll_depth` | `percent_scrolled` (25, 50, 75, 90) | Each mark, once per page view |
| `link_click` | `link_url` (path + hash), `link_text`, `location` (nav, footer, main) | An internal link was clicked |
| `contact_click` | `method` (email, phone), `location` | A `mailto:` / `tel:` link was clicked; the address is never sent |
| `page_not_found` | `page_path` | The 404 page rendered |
| `web_vitals` | `metric_name`, `metric_rating`, plus `metric_ms` (LCP, INP, FCP, TTFB) or `cls_score` (CLS) | Each page-speed reading. LCP, INP and CLS are the three Core Web Vitals; FCP and TTFB are supporting metrics |
| `exception` | `description` (100 chars, redacted), `fatal: false` | An uncaught error or rejection, max 5 per page |

New event names go in the `AnalyticsEvent` union first. A new parameter isn't
reportable until it's registered in GA4 (Admin → Custom definitions;
event-scoped; display names can't contain hyphens).

#### Where the dashboards live

| Tool | Property | Owner | Open it |
| --- | --- | --- | --- |
| Google Analytics 4 | Account "GoLo Golf" (402913756), property "GoLo Golf" (547817615), web stream "GoLo Golf Website", `G-36182P0H4D` | devin@golo.golf | [Admin](https://analytics.google.com/analytics/web/#/a402913756p547817615/admin) (the third signed-in Google account in the owner's Chrome, `authuser=2`) |
| Microsoft Clarity | Project "GoLo Golf Website", `z0fu5ddehq` | devin@golo.golf (Google sign-in) | [Dashboard](https://clarity.microsoft.com/projects/view/z0fu5ddehq/dashboard) |
| Search Console | Domain property `golo.golf` | devin@golo.golf | [Search Console](https://search.google.com/search-console?resource_id=sc-domain%3Agolo.golf) |

GA4 settings checked October 19–20, 2026: event and user data retention 14
months (Explorations only; standard reports are aggregated and unaffected);
Google signals off; user-provided data collection off; no Google Ads links;
granular location and device data on; property-level ads personalization
allowed (the tag sends `npa=1` regardless); email redaction on. Account
data-sharing: "Google products & services" turned off on October 20;
"Modeling contributions & business insights", "Technical support" and
"Recommendations for your business" still on. The Privacy Policy describes
exactly this. 20 event-scoped custom dimensions are registered for the
params above.

Custom metrics: "Web vital time" (`metric_ms`, Time → Milliseconds) and "CLS
score" (`cls_score`, Standard), created October 19, 2026. The earlier
mixed-unit "Web vital value" (`metric_value`) is archived.

Clarity settings checked the same day: Balanced masking; cookies on; bot
detection on; Microsoft Ads, Google Ads and Google Analytics integrations not
connected. Microsoft keeps recordings 30 days, and heatmaps, dashboard data,
labeled or favorited recordings and a random sample it selects 9 months.

**Change these together, or update the Privacy Policy:** the data-sharing
settings, masking mode, any Ads/GA integration, and retention.

#### After changing analytics code

Build with `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and, unless you mean to send
test data to production, `NEXT_PUBLIC_GA_ID=G-TESTONLY00` (a placeholder ID
still exercises the tag; enhanced-measurement events need the real ID). Then,
in a fresh browser profile: no Google or Clarity request before a choice;
one `page_view` per navigation after Allow; nothing after Decline; a reload
and cleared cookies after withdrawing. Localhost visits with the real IDs show
up in both dashboards (hostname `localhost`).

\* If the three Twilio values are absent, the SMS endpoint runs in **stub mode**:
it still validates the number and records the lead, returns success, but sends
no real text. Set all three to enable real sending.

\*\* If `RESEND_API_KEY` is absent, the contact endpoint runs in **stub mode**:
the message still saves to the database and the sender still sees success, but
no notification email is sent. Get a key at [resend.com](https://resend.com)
(free tier available) to enable real notifications.

> **Rule:** anything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle
> — never put a secret there. Database and Twilio values have no such prefix.

---

## Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → Database** → copy both connection strings:
   - **Pooled** (port `6543`, `?pgbouncer=true`) → `DATABASE_URL`
   - **Direct** (port `5432`) → `DIRECT_URL`
3. Run `npm run db:push` to create the tables from the schema.

Models:

| Model | Written by | Notes |
|---|---|---|
| `PhoneLead` | the "text me the link" capture (hero + closing CTA) | `source` names the placement |
| `NewsletterLead` | the newsletter band on `/blog` and each post | `email` is `@unique`, so a repeat signup upserts instead of duplicating. The route answers "you're on the list" either way — it never reveals whether an address was already subscribed |
| `ContactMessage` | the `/contact` form | `topic` is nullable: it holds one of the six contact topics, and messages predate the picker |

After changing `prisma/schema.prisma`, run `npx prisma generate` so the client
types match — `npm run typecheck` fails against a stale client. `npm run build`
and `postinstall` both run it for you.

To switch engines (e.g. to MySQL on Hostinger), change `provider` in
`prisma/schema.prisma` and update the connection strings.

---

## Deploying to a Hostinger VPS via GitHub

This project runs as a **Node.js server** (`npm start`) behind an Nginx reverse
proxy, kept alive by PM2. Run these over SSH on the VPS.

**1. Install Node 24 + git**
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs git nginx
npm install -g pm2
```

**2. Clone + configure**
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/soleman23/golowebsite.git
cd golowebsite
nano .env            # paste DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_* (see Env vars)
```

**3. Build, create tables, start**
```bash
npm ci
npm run build
npm run db:push                        # creates DB tables from schema
pm2 start ecosystem.config.js          # starts the app (name "golo", port 3000)
pm2 save && pm2 startup                # run the printed command to persist on reboot
curl http://localhost:3000/api/health  # -> {"status":"ok",...}
```

**4. Nginx reverse proxy** — put this in `/etc/nginx/sites-available/golo`
(replace the domain), then symlink to `sites-enabled/`, `nginx -t`, and
`systemctl reload nginx`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**5. DNS + SSL + firewall**
```bash
# Point A records @ and www at the VPS IP in your DNS first, then:
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

**Redeploys** — one command on the VPS (pull, install, build, zero-downtime reload):
```bash
cd /var/www/golowebsite && npm run deploy
npm run deploy -- --db       # same, but also runs db:push (only if the schema changed)
```

**Health check:** point any uptime monitor at `GET /api/health`.

> `next.config.mjs` uses `output: "standalone"`. On a VPS the simplest run is
> `npm start` (used above); the standalone bundle is also emitted under
> `.next/standalone/` if you later want a minimal-footprint run.

---

## Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | static | landing page; keeps section ids `#top` `#features` `#games` `#how` `#get` `#faq` |
| `/features` | static | |
| `/games` | dynamic | `?filter=` is resolved server-side so every card ships in the HTML |
| `/games/[slug]` | SSG | one page per key in `gameDetail.ts` |
| `/faq` | static | |
| `/contact` | static | |
| `/blog` | dynamic | `?topic=` resolved server-side, same reason as `/games` |
| `/blog/[slug]` | SSG | one page per **published** post |
| `/privacy` | static | |
| `/terms` | static | indexed only when `NEXT_PUBLIC_TERMS_PUBLISHED=true` |
| `/cookies` | static | reviewable draft; unpublished by default |
| `/acceptable-use` | static | reviewable draft; unpublished by default |
| `/delete-account` | static | public account-deletion guide |

Old URLs fold into these via `redirects()` in `next.config.mjs` (all 308):
`/privacy-policy` `/terms-of-service` `/tos` `/faqs` `/game/nassau`
`/games/nassau-explained` `/blog/who-pays`.

---

## Project structure

```
app/                     # App Router: layout, landing page, content pages, API
  (content)/             # /privacy, /terms, /contact (route group, no URL segment)
  blog/  faq/  features/  games/    # the rest of the routes
  api/                   # route handlers: text-link, contact, subscribe, health
  robots.ts              # generates /robots.txt
  sitemap.ts             # generates /sitemap.xml — driven entirely off lib/content
components/
  layout/                # Nav (+ mobile drawer, active-link state), Footer
  sections/              # landing-page sections, plus one folder per page:
                         #   blog/ contact/ faq/ features/ gameDetail/ games/ legal/
  mockups/               # marketing phone/card visuals — real HTML/CSS, not images
  ui/                    # PageHero, Breadcrumbs, Accordion, ChipFilter, StatusPill,
                         #   CalloutCard, CheckList, JsonLd, forms, Icon, Logo…
lib/
  content/               # all page copy as typed data — see below
  siteConfig · analytics · db · email · sms · validation · env · mockData
prisma/                  # schema.prisma
public/images/           # backdrops in 640/960/1600 avif+webp+png tiers
```

### `lib/content/`

Copy is typed data, never JSX. `@/lib/content` still resolves to the barrel, so
existing imports kept working through the split.

```
index.ts        re-exports everything
nav.ts          navLinks, footerLinks
home.ts         landing-page stats, features, games, steps, quotes, faqs
features.ts     the 8 feature blocks, roadmap columns, beta pricing, quick answers
games.ts        the game roster: slug, name, desc, players, format, tags
gameDetail.ts   per-game long-form content, keyed by slug — the source of truth
                for which slugs get a route and a sitemap entry
faq.ts          categories → questions, with ids for deep links
contact.ts      contact page copy · contactTopics.ts  the six topics
blog.ts         posts: slug, category, title, excerpt, date, hero, body blocks
legal.ts        section trees for /privacy and /terms
```

Adding a post or a game page is a data edit here — never a new page file.

---

## Notes

- **Images** in `public/images/` are placeholders from the design handoff. Swap
  them for the client's own course photography at the same crops; keep the scrim
  gradients so foreground text stays legible.
- **Social card** — `public/images/brand/og-card.png` is rendered from
  `scripts/og-image.html` (that file carries the render command). It is wired up
  as ordinary metadata via `defaultOgImage` in `lib/siteConfig`, not through
  Next's `app/opengraph-image` convention — see the comment there for why. A new
  route that declares its own `openGraph` must name `images` or it ships with no
  card.
- **Icons** — every raster icon (`app/favicon.ico`, `app/apple-icon.png`, the
  manifest icons in `public/icons/`, and the structured-data logo at
  `public/images/brand/golo-logo-600.png`) is generated from `app/icon.svg` by
  `node scripts/generate-icons.mjs`. Change the mark there, re-run it, and
  commit the output — don't hand-edit the PNGs.
- **Fonts:** system UI stack only — nothing to install.
- **Accent color** is a single CSS variable (`--accent`) in `app/globals.css`.

© 2026 GoLo Golf.
