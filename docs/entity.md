# GoLo Golf: entity reference and launch checklist

"GoLo" collides with GOLO (the diet company), a GOLO dice game and GOLO putters. Search engines and AI systems tell entities apart by consistent names, descriptions and links to official profiles. This file holds the wording every profile should use, the list of profiles, and the launch-day steps that change what the site says about availability.

## Names

- **GoLo Golf**: the company and the website. Use it for the Organization and WebSite in structured data, `og:site_name`, profile names, directory listings and press mentions.
- **GoLo Golf LLC**: the legal name. Use it only where a legal name is asked for.
- **GoLo**: the app. Use it in copy about what the app does ("GoLo nets every game…") and as the SoftwareApplication's name.
- Never "Golo", "GOLO" or "Go-Lo".

## Description

Use this wording everywhere a profile or listing asks for a description. It matches `lib/content/capabilities.ts`, so it changes only when that file does.

**Long (about 60 words):**

> GoLo Golf makes GoLo, a golf scorekeeping app for groups that play side games. One phone keeps the card; GoLo runs Nassau, skins, Wolf and the rest, applies handicap strokes, and works out who owes whom in the fewest payments. It does not hold, move or process money. GoLo Golf LLC is based in Bend, Oregon.

**Short (under 160 characters):**

> GoLo is a golf scorekeeping app that runs side games, applies handicaps and works out who owes whom. It never holds or moves money.

Before launch, add "In private testing" wherever a status field exists. Don't describe a feature the registry doesn't list as live, and don't give user counts, round counts or ratings unless there's a record behind them.

## Profiles

`sameAs` in `lib/siteConfig.ts` feeds the Organization's structured data. A profile goes into `sameAs` only when it's live, official and controlled by GoLo Golf.

| Profile | URL | Status | In `sameAs` |
|---|---|---|---|
| Instagram | https://www.instagram.com/gologolfapp/ | Live | Yes |
| Apple App Store | — | At launch | Add on launch day |
| Google Play | — | At launch | Add on launch day |
| Product Hunt | — | Optional, at launch | Only if a listing is made |
| Other social accounts | — | Only if someone will actually post there | Only when live |

Use this file's description for every profile, link back to https://www.golo.golf, and use the logo at `/images/brand/golo-logo-600.png`.

**Not wanted:** paid directory listings, link exchanges, review swaps, posts under personas, and accounts nobody maintains. An empty profile is a weaker signal than none.

## Launch-day checklist

`NEXT_PUBLIC_*` values are inlined at build time. In hPanel, **Apply changes** immediately redeploys whatever `main` is at that moment. So merge any code a flag depends on first, then set the flag and apply.

1. **Store listings live.** Both listings are published and their URLs copied.
2. **Merge first.** Any launch PR (copy, pricing, store URLs in `sameAs`) is on `main`.
3. **Set the environment in hPanel** (Websites → golo.golf → Environment variables):
   - `NEXT_PUBLIC_APP_LIVE=true`
   - `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_GOOGLE_PLAY_URL`
   - Apply changes once, with all three set.
4. **What changes on its own** when `appLive` is true. Check each on the live site:
   - Store buttons replace the phone capture: hero, closing bands, footer "Download".
   - CTA labels: "Get the app".
   - `capabilities.ts`: `store-apps` becomes live, so the /features roadmap moves "iPhone and Android apps" into "In the app today".
   - FAQ: "Is GoLo available yet?" answers yes, and the tablet answer names the apps.
   - /features: the "When does it launch?" quick answer disappears, the roadmap heading drops "We're in beta", and the "Free while we're in beta" pill and pricing note disappear.
   - Prelaunch status pills disappear from /blog and /faq.
   - Home `SoftwareApplication`: `operatingSystem` gains "iOS, Android".
5. **What doesn't change on its own.** Do these in the launch PR:
   - Add both store URLs to `sameAs` in `lib/siteConfig.ts`.
   - Pricing: once it's decided, update the FAQ pricing answers and add an `offers` block to the home `SoftwareApplication` with the real price. Don't add `aggregateRating` until real ratings exist.
   - Check the closing-band fine print in `lib/content/nav.ts` ("On iPhone & Android") against the pricing decision.
   - Update `web-app` in `capabilities.ts` if the browser version is retired.
6. **Afterwards:**
   - Run `npm run lint:content` with `NEXT_PUBLIC_APP_LIVE=true`. It should pass.
   - Run URL Inspection on `/` in Search Console and request indexing.
   - Point the Instagram bio link at the home page.
   - Publish a short product-update post with the date and the platforms.
