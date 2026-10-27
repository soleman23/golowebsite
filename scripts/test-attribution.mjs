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
const { campaignTags, playStoreUrl, sourceName } = await import(
  new URL("../lib/campaigns.ts", import.meta.url).href
);

const NONE = { landingMedium: null, landingCampaign: null, landingContent: null };
const INSTAGRAM_BIO = {
  landingSource: "instagram",
  landingMedium: "organic_social",
  landingCampaign: "golo_prelaunch_2026q4",
  landingContent: "bio",
};

/**
 * The printed sim-bay table tent's QR link (soleman23/golo
 * tools/store-assets/simulator-table-tent.html), as its query string says it.
 */
const TABLE_TENT = {
  landingSource: "table_tent",
  landingMedium: "print",
  landingCampaign: "golo_launch_2026q4_sim_bay",
  landingContent: "qr",
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
    "table tent QR set is kept",
    TABLE_TENT,
    { ...TABLE_TENT },
  ],
  [
    "table tent without a placement gives null",
    { ...TABLE_TENT, landingContent: undefined },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent with the old short campaign sim_bay gives null",
    { ...TABLE_TENT, landingCampaign: "sim_bay" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent with another placement gives null",
    { ...TABLE_TENT, landingContent: "bio" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent with a near-miss placement gives null",
    { ...TABLE_TENT, landingContent: "qr_code" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent with an unlisted print campaign gives null",
    { ...TABLE_TENT, landingCampaign: "golo_launch_2026q4_other" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent values are trimmed and lower-cased",
    { landingSource: "TABLE_TENT", landingMedium: " Print ", landingCampaign: "GOLO_LAUNCH_2026Q4_SIM_BAY", landingContent: "QR" },
    { ...TABLE_TENT },
  ],
  [
    "print campaign on a social source gives null",
    { ...INSTAGRAM_BIO, landingCampaign: "golo_launch_2026q4_sim_bay" },
    { landingSource: "instagram", ...NONE },
  ],
  [
    "social campaign on the table tent gives null",
    { ...TABLE_TENT, landingCampaign: "golo_prelaunch_2026q4" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "table tent with a social medium gives null",
    { ...TABLE_TENT, landingMedium: "organic_social" },
    { landingSource: "table_tent", ...NONE },
  ],
  [
    "print medium on a social source gives null",
    { ...INSTAGRAM_BIO, landingMedium: "print", landingCampaign: "golo_launch_2026q4_sim_bay", landingContent: "qr" },
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

// The tent's printed link, read the way lib/attribution.ts reads a landing
// URL: the source through sourceName(), the other three through campaignTags().
// If this fails, a change here broke a QR code that's already on paper.
{
  const query = new URLSearchParams(
    "utm_source=table_tent&utm_medium=print&utm_campaign=golo_launch_2026q4_sim_bay&utm_content=qr",
  );
  const source = sourceName(query.get("utm_source"));
  const tags = campaignTags(
    source,
    query.get("utm_medium"),
    query.get("utm_campaign"),
    query.get("utm_content"),
  );
  const got = { landingSource: source, ...tags };
  const wrong = Object.entries(TABLE_TENT).filter(([key, value]) => got[key] !== value);
  if (wrong.length) {
    failures.push(`table tent URL: ${wrong.map(([key, value]) => `${key} = ${JSON.stringify(got[key])}, expected ${JSON.stringify(value)}`).join("; ")}`);
  } else {
    passed += 1;
  }
}

// Play's install referrer: the dictionary campaign rides on the listing URL
// as one URL-encoded `referrer` value; anything else leaves the plain listing.
let playCases = 0;
{
  const PLAY = "https://play.google.com/store/apps/details?id=golf.golo.app";
  const check = (name, got, want) => {
    playCases += 1;
    if (got === want) passed += 1;
    else failures.push(`playStoreUrl: ${name}: got ${got}, expected ${want}`);
  };
  check(
    "the tent's campaign becomes the referrer",
    playStoreUrl(PLAY, TABLE_TENT),
    `${PLAY}&referrer=utm_source%3Dtable_tent%26utm_medium%3Dprint%26utm_campaign%3Dgolo_launch_2026q4_sim_bay`,
  );
  check(
    "a profile link's campaign becomes the referrer",
    playStoreUrl(PLAY, INSTAGRAM_BIO),
    `${PLAY}&referrer=utm_source%3Dinstagram%26utm_medium%3Dorganic_social%26utm_campaign%3Dgolo_prelaunch_2026q4`,
  );
  const decoded = new URL(playStoreUrl(PLAY, TABLE_TENT)).searchParams;
  check("the listing id survives", decoded.get("id"), "golf.golo.app");
  check(
    "the referrer decodes to the three tags",
    decoded.get("referrer"),
    "utm_source=table_tent&utm_medium=print&utm_campaign=golo_launch_2026q4_sim_bay",
  );
  check("no landing leaves the listing", playStoreUrl(PLAY, undefined), PLAY);
  check("a direct visit leaves the listing", playStoreUrl(PLAY, { landingPath: "/" }), PLAY);
  check(
    "a source with no dictionary campaign leaves the listing",
    playStoreUrl(PLAY, { landingSource: "chatgpt.com", landingMedium: null, landingCampaign: null, landingContent: null }),
    PLAY,
  );
  check("a placeholder href is left alone", playStoreUrl("#get", TABLE_TENT), "#get");
  check(
    "a non-Play URL is left alone",
    playStoreUrl("https://apps.apple.com/app/id1", TABLE_TENT),
    "https://apps.apple.com/app/id1",
  );
}

if (failures.length) {
  for (const line of failures) console.error(line);
  console.error(`\n${failures.length} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`Attribution: ${passed} cases passed (${cases.length} attribution + 2 page-path cases per form × ${forms.length} forms, + the table tent URL, + ${playCases} Play referrer cases).`);
