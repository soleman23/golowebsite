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

> GoLo Golf makes GoLo, a golf scorekeeping app for groups that play side games. One phone keeps the card; GoLo runs Nassau, skins, Wolf and the rest, applies handicap strokes, and works out who owes whom in a short list of payments. It does not hold, move or process money. GoLo Golf LLC is based in Bend, Oregon.

**Short (under 160 characters):**

> GoLo is a golf scorekeeping app that runs side games, applies handicaps and works out who owes whom. It never holds or moves money.

Before launch, add "In private testing" wherever a status field exists. Don't describe a feature the registry doesn't list as live, and don't give user counts, round counts or ratings unless there's a record behind them.

## Profiles

`sameAs` in `lib/siteConfig.ts` feeds the Organization's structured data: the company's own profiles, live and official, nothing else. The App Store and Google Play listings describe the app, not the company, so they belong to the home page's `SoftwareApplication` node instead. That node picks them up on its own: Google Play from `siteConfig.googlePlayUrl` (live), the App Store from `NEXT_PUBLIC_APP_STORE_URL` once `siteConfig.iosLive` is true.

| Profile | URL | Status | In `sameAs` |
|---|---|---|---|
| Instagram | https://www.instagram.com/gologolfapp/ | Live | Yes |
| Apple App Store | — | Coming soon (waits on Apple) | No: on the SoftwareApplication, from the env var, once `siteConfig.iosLive` is true |
| Google Play | https://play.google.com/store/apps/details?id=golf.golo.app | Live since 2026-10-26 | No: on the SoftwareApplication (`siteConfig.googlePlayUrl`) |
| Product Hunt | — | Optional, at launch | Only if a listing is made |
| Other social accounts | — | Only if someone will actually post there | Only when live |

Use this file's description for every profile, link back to https://www.golo.golf, and use the logo at `/images/brand/golo-logo-600.png`.

**Not wanted:** paid directory listings, link exchanges, review swaps, posts under personas, and accounts nobody maintains. An empty profile is a weaker signal than none.

## Launch-day checklist

**Split launch (2026-10-26):** Android went live on Google Play before iOS. The
download row, CTA labels, closing-band copy, FAQ availability answers, `/about`
status and the home `SoftwareApplication` were moved off `appLive` and onto the
`android-app` / `ios-app` capabilities, so steps 4 and 5 below now describe
only what `appLive` still controls (/features pricing and beta lines, the /blog
pill). For the App Store day: set `iosLive: true` in `lib/siteConfig.ts` and
`NEXT_PUBLIC_APP_STORE_URL` in hPanel in the same release. (`NEXT_PUBLIC_GOOGLE_PLAY_URL` is no longer read; the listing is in code.)

`NEXT_PUBLIC_*` values are inlined at build time. In hPanel, **Apply changes** immediately redeploys whatever `main` is at that moment. A merge to `main` also deploys on its own, a few minutes later, with the flags as they were.

1. **Preconditions.**
   - Both store listings are published, and their URLs are copied.
   - The Terms are approved or replaced by counsel. README and `app/(content)/terms/page.tsx` make this a condition of setting `NEXT_PUBLIC_APP_LIVE=true`.
2. **Merge the launch PR first** (copy, pricing, the `offers` block). It deploys with `appLive` still false, so gate everything in it on `siteConfig.appLive` or `capability("store-apps")`. If something can't be gated, run Apply as soon as the merge deploy finishes, so the ungated copy isn't live alone for long.
3. **Set the environment in hPanel** (Websites → golo.golf → Environment variables), then Apply once with all of these set:
   - `NEXT_PUBLIC_APP_LIVE=true`
   - `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_GOOGLE_PLAY_URL`
   - `NEXT_PUBLIC_DOWNLOAD_URL`: the URL the "text me the link" SMS sends. It falls back to the site URL, not a store. Check `SMS_MESSAGE_TEMPLATE` reads right for launch.
   - `NEXT_PUBLIC_TERMS_PUBLISHED=true`, if the approved Terms go public at the same time. This links /terms, indexes it and adds it to the sitemap.
4. **What changes on its own** when `appLive` is true. Check each on the live site:
   - **Hero:** store buttons appear above the phone capture. The capture stays, with the prompt "or text me the link:".
   - **Closing bands:** store buttons replace the phone capture. The lead says "Download GoLo…", and the fine print reads "On iPhone & Android".
   - **The /games closing-band lead** says to download it.
   - **CTA labels:** "Get the app", in the nav pill and its mobile version. The footer's "Launch link" becomes "Download".
   - **`capabilities.ts`:** `store-apps` becomes live, so the /features roadmap moves "iPhone and Android apps" into "In the app today".
   - **FAQ:** "Is GoLo available yet?" answers yes, and the tablet answer names the apps.
   - **/features:** the "When does it launch?" quick answer disappears, the roadmap heading drops "We're in beta", and the "Free while we're in beta" pill and pricing note disappear.
   - **/blog and /faq:** the prelaunch status pills disappear.
   - **Home `SoftwareApplication`:** `operatingSystem` gains "iOS, Android", and `sameAs` lists both store listings.
5. **What doesn't change on its own.** Do these in the launch PR:
   - Pricing: once it's decided, update the FAQ pricing answers and add an `offers` block to the home `SoftwareApplication` with the real price. Don't add `aggregateRating` until real ratings exist.
   - Check the fine print ("On iPhone & Android", `finalCtaFine` in `lib/content/nav.ts`) against the pricing decision.
   - Update `web-app` in `capabilities.ts` if the browser version is retired.
6. **The waiting list.** Every capture before launch promised "Text me the link when it's live". Decide whether and how the stored `PhoneLead` numbers get that text on launch day, and who sends it. Sending is outside this site. Check the consent wording on the capture form before anything goes out.
7. **Afterwards:**
   - Run `npm run lint:content` with `NEXT_PUBLIC_APP_LIVE=true`. It should pass.
   - Run URL Inspection on `/` in Search Console and request indexing.
   - Point the Instagram bio link at the home page.
   - Publish a short product-update post with the date and the platforms.
