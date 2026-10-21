#!/usr/bin/env node
/**
 * Lead attribution checks (soleman23/golowebsite#120). `npm run test:attribution`
 * runs this, and CI runs it as its own step.
 *
 * Hermetic: it parses payloads with the same zod schemas /api/subscribe and
 * /api/text-link use (lib/validation.ts) and checks what each route would
 * store. No server, no database, no network.
 *
 * Exit 1 with one line per failed case.
 */

import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("..", import.meta.url);

/**
 * Node (>= 24) runs the lib modules' TypeScript as-is by stripping the types.
 * Map the project's "@/" alias and extensionless "./sibling" imports to the
 * .ts file, as scripts/check-content.mjs does.
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    const base = specifier.startsWith("@/")
      ? new URL(specifier.slice(2), rootUrl)
      : specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)
        ? new URL(specifier, context.parentURL)
        : null;
    if (base) {
      for (const ext of [".ts", "/index.ts"]) {
        const url = new URL(base.href + ext);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const { subscribeSchema, textLinkSchema } = await import(
  new URL("../lib/validation.ts", import.meta.url).href
);

const NONE = { landingMedium: null, landingCampaign: null, landingContent: null };
const INSTAGRAM_BIO = {
  landingSource: "instagram",
  landingMedium: "organic_social",
  landingCampaign: "golo_prelaunch_2026q4",
  landingContent: "bio",
};

/** [name, attribution payload, expected stored values] */
const cases = [
  [
    "full Instagram bio set is kept",
    INSTAGRAM_BIO,
    { ...INSTAGRAM_BIO },
  ],
  [
    "values are trimmed and lower-cased",
    {
      landingSource: " Instagram ",
      landingMedium: "Organic_Social",
      landingCampaign: " GOLO_PRELAUNCH_2026Q4",
      landingContent: "BIO ",
    },
    { ...INSTAGRAM_BIO },
  ],
  [
    "Instagram story placement is kept",
    { ...INSTAGRAM_BIO, landingContent: "story_ab12_c" },
    { ...INSTAGRAM_BIO, landingContent: "story_ab12_c" },
  ],
  [
    "TikTok bio is kept",
    { ...INSTAGRAM_BIO, landingSource: "tiktok" },
    { ...INSTAGRAM_BIO, landingSource: "tiktok" },
  ],
  [
    "YouTube channel is kept",
    { ...INSTAGRAM_BIO, landingSource: "youtube", landingContent: "channel" },
    { ...INSTAGRAM_BIO, landingSource: "youtube", landingContent: "channel" },
  ],
  [
    "unknown medium gives null",
    { ...INSTAGRAM_BIO, landingMedium: "paid_social" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "unlisted campaign gives null",
    { ...INSTAGRAM_BIO, landingCampaign: "golo_spring_2027" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "content john_smith gives null",
    { ...INSTAGRAM_BIO, landingContent: "john_smith" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "10-digit medium gives null",
    { ...INSTAGRAM_BIO, landingMedium: "5415551234" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "10-digit campaign gives null",
    { ...INSTAGRAM_BIO, landingCampaign: "5415551234" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "10-digit content gives null",
    { ...INSTAGRAM_BIO, landingContent: "5415551234" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "UUID content gives null",
    { ...INSTAGRAM_BIO, landingContent: "3f2c8a1e-9b4d-4c6e-8f7a-2d1b0c9e8a7f" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "UUID campaign gives null",
    { ...INSTAGRAM_BIO, landingCampaign: "3f2c8a1e-9b4d-4c6e-8f7a-2d1b0c9e8a7f" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    // An identifier isn't a source name: the source is dropped too (#120).
    "UUID source gives null",
    { ...INSTAGRAM_BIO, landingSource: "3f2c8a1e-9b4d-4c6e-8f7a-2d1b0c9e8a7f" },
    { landingSource: undefined, ...NONE },
  ],
  [
    "underscore-separated phone source gives null",
    { ...INSTAGRAM_BIO, landingSource: "541_555_1234" },
    { landingSource: undefined, ...NONE },
  ],
  [
    "long hex source gives null",
    { ...INSTAGRAM_BIO, landingSource: "a1b2c3d4e5f60718293a4b5c" },
    { landingSource: undefined, ...NONE },
  ],
  [
    "<script> content gives null",
    { ...INSTAGRAM_BIO, landingContent: "<script>" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "over-long content gives null",
    { ...INSTAGRAM_BIO, landingContent: "bio" + "x".repeat(300) },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "over-long campaign gives null",
    { ...INSTAGRAM_BIO, landingCampaign: "golo_prelaunch_2026q4".repeat(10) },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "over-long source gives null source and null tags",
    { ...INSTAGRAM_BIO, landingSource: "i".repeat(65) },
    { landingSource: undefined, ...NONE },
  ],
  [
    "impossible combination instagram/email/…/header gives null",
    {
      landingSource: "instagram",
      landingMedium: "email",
      landingCampaign: "golo_prelaunch_2026q4",
      landingContent: "header",
    },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "social campaign on an email source gives null",
    {
      landingSource: "hostinger_reach",
      landingMedium: "email",
      landingCampaign: "golo_prelaunch_2026q4",
      landingContent: "header",
    },
    { landingSource: "hostinger_reach", ...NONE },
  ],
  [
    "placement from another source gives null (tiktok/channel)",
    { ...INSTAGRAM_BIO, landingSource: "tiktok", landingContent: "channel" },
    { landingSource: "tiktok", ...NONE },
  ],
  [
    "malformed story placement gives null",
    { ...INSTAGRAM_BIO, landingContent: "story_abc1_d" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "tags without a source give null",
    { ...INSTAGRAM_BIO, landingSource: undefined },
    { landingSource: undefined, ...NONE },
  ],
  [
    "partial set (no content) gives null",
    { ...INSTAGRAM_BIO, landingContent: undefined },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "non-string values give null",
    { ...INSTAGRAM_BIO, landingMedium: ["organic_social"], landingContent: 7 },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "utm_source=5415551234 gives null source",
    { landingSource: "5415551234" },
    { landingSource: undefined, ...NONE },
  ],
  [
    "phone-shaped source with separators gives null source",
    { landingSource: "541-555-1234" },
    { landingSource: undefined, ...NONE },
  ],
  [
    "utm_source=chatgpt.com is still kept",
    { landingSource: "chatgpt.com" },
    { landingSource: "chatgpt.com", ...NONE },
  ],
];

const forms = [
  ["subscribe", subscribeSchema, { email: "diagnostic@example.com" }],
  ["text-link", textLinkSchema, { phone: "(541) 555-0100" }],
];

const failures = [];
let passed = 0;

for (const [form, schema, base] of forms) {
  for (const [name, attribution, expected] of cases) {
    const parsed = schema.safeParse({
      ...base,
      landingPath: "/blog",
      ...attribution,
    });
    if (!parsed.success) {
      failures.push(`${form}: ${name}: submission rejected (${parsed.error.issues[0]?.message})`);
      continue;
    }
    const wrong = Object.entries(expected).filter(
      ([key, value]) => parsed.data[key] !== value,
    );
    if (parsed.data.landingPath !== "/blog") wrong.push(["landingPath", "/blog"]);
    if (wrong.length) {
      failures.push(
        `${form}: ${name}: ${wrong
          .map(([key, value]) => `${key} = ${JSON.stringify(parsed.data[key])}, expected ${JSON.stringify(value)}`)
          .join("; ")}`,
      );
    } else {
      passed += 1;
    }
  }
}

// The page path is a path only: a query string or fragment drops it (#120),
// and the submission still goes through.
for (const [form, schema, base] of forms) {
  for (const path of ["/blog?email=x", "/blog#top"]) {
    const parsed = schema.safeParse({ ...base, ...INSTAGRAM_BIO, landingPath: path });
    if (!parsed.success) failures.push(`${form}: landingPath ${path}: submission rejected`);
    else if (parsed.data.landingPath !== undefined) failures.push(`${form}: landingPath ${path} kept, expected it dropped`);
    else passed += 1;
  }
}

if (failures.length) {
  for (const line of failures) console.error(line);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`Attribution: ${passed} cases passed (${cases.length} attribution + 2 page-path cases per form × ${forms.length} forms).`);
