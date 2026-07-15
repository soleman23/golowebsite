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
npm run db:migrate      # creates tables from prisma/schema.prisma (dev)
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
| `npm run db:migrate`| Create/apply a migration in development                 |
| `npm run db:deploy` | Apply committed migrations in production (`migrate deploy`) |
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
3. Run `npm run db:migrate` (dev) or `npm run db:deploy` (prod) to create tables.

Models: `PhoneLead` (hero text-link submissions) and `ContactMessage`
(contact form). To switch engines (e.g. to MySQL on Hostinger), change
`provider` in `prisma/schema.prisma` and update the connection strings.

---

## Deploying to Hostinger (Node.js hosting) via GitHub

This project runs as a **Node.js server** (`npm start`).

1. **Push to GitHub.** `.env`, `node_modules`, `.next`, and logs are
   git-ignored; `package-lock.json` is committed for reproducible installs.
2. **In hPanel → Websites → your site → Node.js app** (or "Git" deploy):
   - **Repository:** connect this GitHub repo and branch.
   - **Node version:** 18.18+ (20 recommended — matches `.nvmrc`).
   - **Install command:** `npm ci`
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Application entry / port:** the app reads `PORT` from the environment,
     which Hostinger sets automatically. Do not hardcode a port.
3. **Set environment variables** in Hostinger's env panel: at minimum
   `DATABASE_URL` and `DIRECT_URL`, plus the `NEXT_PUBLIC_*` links and (when
   ready) the Twilio values.
4. **Run migrations against production** once the DB is reachable:
   `npm run db:deploy` (run as a one-off command, or add it to your release
   step).
5. **Redeploys:** push to the connected branch; Hostinger re-runs install →
   build → start.
6. **Health check:** point any uptime monitor (or Hostinger's health check, if
   offered) at `GET /api/health` — it returns `{ "status": "ok", ... }` with a
   200 as long as the process is up.

> `next.config.mjs` uses `output: "standalone"`, so the production server is
> self-contained and small. If your Hostinger plan is **static hosting only**
> (no Node process), this app needs the Node.js plan because the SMS/contact
> API routes and database require a server.

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
