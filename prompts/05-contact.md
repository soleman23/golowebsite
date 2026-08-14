# Prompt 05 — `/contact` (rebuild)

**Reference:** `design_handoff/reference/Golo Golf - Contact.dc.html`

---

`/contact` already exists at `app/(content)/contact/page.tsx` with a working `ContactForm` → `POST /api/contact` → Prisma `ContactMessage` → Resend notification (stub mode when `RESEND_API_KEY` is absent). **Keep that pipeline.** This is a redesign of the page plus one new field — not a rewrite of the backend.

Read first: `app/(content)/contact/page.tsx`, `components/ui/ContactForm.tsx`, `app/api/contact/route.ts`, `lib/validation.ts`, `lib/email.ts`, `prisma/schema.prisma`.

## Sections

1. **Hero** — breadcrumbs `Home / Contact`, H1 "Talk to the people who built it.", the lead paragraph verbatim, and three inline contact chips: the support email, `@gologolf on Instagram`, `GoLo Golf LLC · Bend, Oregon`.

2. **Route cards** — three cards above the form (kicker, title, blurb, CTA) for the common paths: support/bug, feature request, press/partnerships. Clicking one **preselects the matching topic** in the form and scrolls to `#form`.

3. **The form** (`#form`, `scroll-margin-top: 110px`) — `SEND IT OVER` + H2 "What's going on?" + lead, then:
   - **Topic picker** — `WHAT'S IT ABOUT`, a 2×3 grid of selectable tiles (label + hint), single-select, keyboard-operable as a radio group (`role="radiogroup"`, arrow keys, `aria-checked`). Six topics: Support / bug · Feature request · Course data · Account & data · Partnerships · Press — hints verbatim from the reference.
   - **Name**, **Email**, **Message** (with a live character count), each in the glass field treatment: `--glass-chrome` fill, `--radius-tile`, lime border on `:focus-within`.
   - Inline validation on submit: name required, email must match the reference's pattern with two distinct messages (empty vs malformed), message ≥ a sentence. Errors are `role="alert"`, `aria-invalid` + `aria-describedby`, and focus moves to the first invalid field.
   - Submit button `Send message`, then the reassurance line "Goes straight to <support email>. We read every one and write back."
   - Success state replaces the form with a confirmation (keep whatever the existing `ContactForm` does, restyled).

4. **Reach us directly** — `OR REACH US DIRECTLY` cards: email, Instagram, mailing address.

5. **The fine print** — small link row: Terms `/terms`, Privacy `/privacy`, plus delete-account if that page exists (README decision #7).

6. **Before you write** — `BEFORE YOU WRITE` + H2 "Six things we answer every week" + `Full FAQ` link to `/faq`, then a compact `Accordion` of six questions verbatim.

7. **Closing CTA** — `FinalCTA`, H2 "Message sent. Now go take their money."

## Backend changes (minimal)

- `prisma/schema.prisma`: add `topic String?` to `ContactMessage`. Run `npm run db:push`.
- `lib/validation.ts`: add `topic` to the contact zod schema as an enum of the six ids, optional-but-preferred; reject unknown values.
- `app/api/contact/route.ts`: persist `topic`, include it in the notification email subject (`[GoLo] <topic> — <name>`). Keep stub mode intact.
- `ContactForm.tsx`: add the topic state + `?topic=` query-param preselect (`/contact?topic=idea` from `/games`). Keep the existing `contact_submit` event; add `{ topic }` as a param. **No PII in event params.**

## Responsive

Wide ≥1100px: form column `minmax(0,1fr)` + aside `minmax(0,372px)` (the direct-contact cards) — the reference's "split" layout. Mid/narrow: single column, form max 820px centered, aside content moves below the form as full-width cards. Topic tiles 3×2 → 2×3 → 1 column, each tile ≥44px tall.

## SEO

Title `Contact`, description from BUILD-SPEC §6, canonical `/contact`. No FAQ schema (the six here are a subset of `/faq` — avoid duplicate FAQPage markup). Sitemap 0.6.

## Acceptance checks

- A real submission still lands in Postgres and (with a key set) emails; stub mode still returns success
- `topic` is stored and appears in the notification subject
- `/contact?topic=press` loads with Press preselected
- Route cards preselect + scroll to the form
- Topic group operable by keyboard alone; errors announced; focus moves to the first invalid field
- No layout shift when an error message appears (reserve the line)
- `npm run lint && npm run typecheck && npm run build` pass
