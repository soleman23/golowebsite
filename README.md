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
| `NEXT_PUBLIC_APP_STORE_URL`    | No       | **Public**  | App Store link (falls back to `#get`)               |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL`  | No       | **Public**  | Google Play link (falls back to `#get`)             |
| `NEXT_PUBLIC_SITE_URL`         | No       | **Public**  | Canonical URL for SEO/OG tags                       |
| `NEXT_PUBLIC_DOWNLOAD_URL`     | No       | **Public**  | Link texted to users                                |
| `NEXT_PUBLIC_SHOW_STATS`       | No       | **Public**  | `true`/`false` — show the stats band                |
| `NEXT_PUBLIC_SHOW_TESTIMONIALS`| No       | **Public**  | `true`/`false` — show testimonials                  |
| `NEXT_PUBLIC_HERO_BACKDROP`    | No       | **Public**  | `sunset` \| `course` \| `turf`                      |

\* If the three Twilio values are absent, the SMS endpoint runs in **stub mode**:
it still validates the number and records the lead, returns success, but sends
no real text. Set all three to enable real sending.

> **Rule:** anything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle
> — never put a secret there. Database and Twilio values have no such prefix.

---

## Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → Database** → copy both connection strings:
   - **Pooled** (port `6543`, `?pgbouncer=true`) → `DATABASE_URL`
   - **Direct** (port `5432`) → `DIRECT_URL`
3. Run `npm run db:push` to create the tables from the schema.

Models: `PhoneLead` (hero text-link submissions) and `ContactMessage`
(contact form). To switch engines (e.g. to MySQL on Hostinger), change
`provider` in `prisma/schema.prisma` and update the connection strings.

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
PORT=3000 pm2 start npm --name golo -- start
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

**Redeploys** (after each `git push`):
```bash
cd /var/www/golowebsite && git pull && npm ci && npm run build && pm2 reload golo
# add `npm run db:push` before the reload only if the schema changed
```

**Health check:** point any uptime monitor at `GET /api/health`.

> `next.config.mjs` uses `output: "standalone"`. On a VPS the simplest run is
> `npm start` (used above); the standalone bundle is also emitted under
> `.next/standalone/` if you later want a minimal-footprint run.

---

## Project structure

```
app/                     # App Router: layout, landing page, content pages, API
  (content)/             # /privacy and /contact (route group, no URL segment)
  api/                   # route handlers: text-link, contact
  api/                   #   ...plus health (/api/health)
  robots.ts              # generates /robots.txt
  sitemap.ts             # generates /sitemap.xml
components/
  layout/                # Nav (+ mobile drawer), Footer
  sections/              # the 10 landing-page sections
  mockups/               # marketing phone/card visuals
  ui/                    # Icon, Logo, StoreButtons, FeatureRow, forms, etc.
lib/                     # content data, mock data, config, db, env, sms, validation
prisma/                  # schema.prisma
public/images/           # background photos (placeholders — swap for real art)
```

---

## Notes

- **Images** in `public/images/` are placeholders from the design handoff. Swap
  them for the client's own course photography at the same crops; keep the scrim
  gradients so foreground text stays legible.
- **Fonts:** system UI stack only — nothing to install.
- **Accent color** is a single CSS variable (`--accent`) in `app/globals.css`.

© 2026 GoLo Golf.
