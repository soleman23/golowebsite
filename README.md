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

- **Node.js ≥ 18.18** (see `.nvmrc` → Node 20 recommended)
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
| `NEXT_PUBLIC_COOKIES_PUBLISHED`| No       | **Public**  | `true`/`false` (default **false**)                   |
| `NEXT_PUBLIC_ACCEPTABLE_USE_PUBLISHED` | No | **Public** | `true`/`false` (default **false**)                 |
| `NEXT_PUBLIC_ANALYTICS_ENABLED`| No       | **Public**  | GA kill switch (default **false**); consent is still required |
| `NEXT_PUBLIC_GA_ID`            | No       | **Public**  | GA4 measurement ID                                  |

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
`NEXT_PUBLIC_APP_LIVE` becomes `true`. Cookie and Acceptable Use drafts remain
directly reviewable while their flags are `false`, but carry `noindex,
nofollow`, stay out of the sitemap, and remain unlinked.

`NEXT_PUBLIC_ANALYTICS_ENABLED` is an explicit kill switch and defaults to
`false`. Even when enabled, analytics requires a visitor's explicit grant at
`/privacy#analytics-choices`; an unset preference or Global Privacy Control
keeps analytics off. Withdrawing consent clears accessible `_ga*` cookies.

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

**1. Install Node 20 + git**
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
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

**Automatic deploys on push (optional):** `.github/workflows/deploy.yml` SSHes
into the VPS and runs `scripts/deploy.sh` on every push to `main`. Enable it by
adding these repo secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH user (e.g. `root`) |
| `VPS_SSH_KEY` | a private SSH key whose public key is in the VPS `~/.ssh/authorized_keys` |
| `VPS_PORT` | (optional) SSH port, defaults to `22` |

Until `VPS_HOST` is set, the workflow safely skips instead of failing.

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
- **Fonts:** system UI stack only — nothing to install.
- **Accent color** is a single CSS variable (`--accent`) in `app/globals.css`.

© 2026 GoLo Golf.
