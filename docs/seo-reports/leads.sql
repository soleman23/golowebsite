-- Lead attribution for the monthly SEO/AIO report (docs/seo-reports/TEMPLATE.md).
--
-- Every query is a SELECT, and none reads a phone number, email address or
-- user agent. Never commit credentials or the rows themselves; paste only
-- the counts into the report.
--
-- Run it with psql, which prints all three results and sets the month once
-- (start inclusive, end exclusive):
--
--   psql "$DIRECT_URL" -v start_at=2026-11-01 -v end_at=2026-12-01 -f docs/seo-reports/leads.sql
--
-- Use DIRECT_URL (port 5432), not DATABASE_URL. DATABASE_URL is the
-- transaction-mode pooler (6543) with Prisma-only parameters
-- (?pgbouncer=true&connection_limit=1) that psql rejects.
--
-- All three queries run inside one READ ONLY transaction, so nothing here
-- can write, whatever role the connection uses, and nothing is left behind
-- on the connection afterwards. Don't replace this with a session-level
-- SET: on a pooled connection it can outlive this script and make the
-- site's own lead INSERTs fail.
--
-- The Supabase SQL editor shows only the last result and doesn't know psql
-- variables. If you use it, run one query at a time as
-- BEGIN TRANSACTION READ ONLY; <query>; COMMIT; and replace :'start_at' and
-- :'end_at' with quoted dates ('2026-11-01').
--
-- Months here are UTC ("createdAt" is stored in UTC). Search Console's days
-- are Pacific time, so a month's edges differ by 7–8 hours between the two.
--
-- The AI host list matches the GA4 "AI assistants" channel group (#66). Keep
-- the two in step: change both or neither.

BEGIN TRANSACTION READ ONLY;

-- 1. AI-referred leads, by host and by how the host was recorded.
--    landingSource is the landing URL's utm_source (ChatGPT search adds
--    utm_source=chatgpt.com); referrerHost is the outside referrer's host.
--    A lead can carry both, so it's counted once, under the first that matches.
WITH bounds AS (
  SELECT TIMESTAMP :'start_at' AS start_at, TIMESTAMP :'end_at' AS end_at
),
leads AS (
  SELECT 'phone' AS kind, "createdAt", "landingSource", "referrerHost" FROM "PhoneLead"
  UNION ALL
  SELECT 'newsletter', "createdAt", "landingSource", "referrerHost" FROM "NewsletterLead"
),
ai AS (
  SELECT
    kind,
    CASE
      WHEN lower(coalesce("landingSource", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        THEN 'utm_source'
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        THEN 'referrer'
    END AS recorded_as,
    CASE
      WHEN lower(coalesce("landingSource", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        THEN lower("landingSource")
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        THEN lower("referrerHost")
    END AS host
  FROM leads, bounds
  WHERE "createdAt" >= bounds.start_at AND "createdAt" < bounds.end_at
)
SELECT kind, recorded_as, host, count(*) AS leads
FROM ai
WHERE recorded_as IS NOT NULL
GROUP BY kind, recorded_as, host
ORDER BY leads DESC, kind, host;

-- 2. All leads by landing path and form placement.
--    Both fields arrive from the browser, and a crafted request can put any
--    text in them, so only known values are shown: the site's own paths and
--    the placements the forms set. Anything else is collapsed to "(other …)"
--    and can't carry personal data into a report. When a post or guide is
--    published, add its slug to the lists below. Until then it shows as
--    "(unlisted post)". `npm run lint:content` fails while a published post
--    or guide is missing from them.
--    PhoneLead.source is "hero" or "final_cta_<page>"; NewsletterLead.source is
--    "blog" or "post". landingPath is null on rows from before
--    October 10, 2026 and when it wasn't captured.
WITH bounds AS (
  SELECT TIMESTAMP :'start_at' AS start_at, TIMESTAMP :'end_at' AS end_at
),
leads AS (
  SELECT 'phone' AS kind, "createdAt", "landingPath", "source" FROM "PhoneLead"
  UNION ALL
  SELECT 'newsletter', "createdAt", "landingPath", "source" FROM "NewsletterLead"
),
labelled AS (
  SELECT
    kind,
    CASE
      WHEN "landingPath" IS NULL THEN '(not recorded)'
      WHEN "landingPath" ~ '^/(features|how-it-works|games|blog|faq|about|contact|privacy|terms|cookies|acceptable-use|delete-account|glossary)?$'
        THEN "landingPath"
      WHEN "landingPath" ~ '^/games/(skins|nassau|best-score|wolf|bingo-bango-bongo|scramble|closest-to-pin|longest-drive|birdies)$'
        THEN "landingPath"
      WHEN "landingPath" ~ '^/blog/(gimmes|nine-hole-games|best-ball-vs-scramble|no-handicap-fair-game|different-tees|golf-games-for-3-players|side-games-for-beginners|five-dollar-birdie|closest-to-the-pin-rules|skins-vs-nassau|match-play-vs-stroke-play|golf-games-for-2-players|net-vs-gross-scoring|first-tee-checklist|group-accountant|what-we-got-wrong|settle-up-screen|pressing|index-vs-course-handicap|sandbagging|bandon|scottsdale-trip-structure|rangefinder|who-pays-first|nassau|skins-carryover|wolf|bingo-bango-bongo)$'
        THEN "landingPath"
      WHEN "landingPath" LIKE '/blog/%' THEN '/blog/(unlisted post)'
      WHEN "landingPath" LIKE '/games/%' THEN '/games/(unlisted guide)'
      ELSE '(other path)'
    END AS landing_path,
    CASE
      WHEN "source" ~ '^(hero|blog|post|final_cta_(home|faq|features|how_it_works|blog|contact|post|games|privacy|terms|cookies|acceptable-use|game_(skins|nassau|best-score|wolf|bingo-bango-bongo|closest-to-pin|longest-drive|birdies)))$'
        THEN "source"
      ELSE '(other placement)'
    END AS placement
  FROM leads, bounds
  WHERE "createdAt" >= bounds.start_at AND "createdAt" < bounds.end_at
)
SELECT kind, landing_path, placement, count(*) AS leads
FROM labelled
GROUP BY kind, landing_path, placement
ORDER BY leads DESC, kind, landing_path;

-- 3. All leads by where the visit came from, in broad buckets.
WITH bounds AS (
  SELECT TIMESTAMP :'start_at' AS start_at, TIMESTAMP :'end_at' AS end_at
),
leads AS (
  SELECT 'phone' AS kind, "createdAt", "landingSource", "referrerHost" FROM "PhoneLead"
  UNION ALL
  SELECT 'newsletter', "createdAt", "landingSource", "referrerHost" FROM "NewsletterLead"
),
classified AS (
  SELECT
    kind,
    -- landingSource (an explicit utm_source) decides first, as in query 1;
    -- referrerHost only when there's no recognized tag.
    CASE
      WHEN lower(coalesce("landingSource", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$' THEN 'AI assistants'
      WHEN lower(coalesce("landingSource", '')) ~ '^(google|bing|duckduckgo|yahoo|ecosia|brave)(\.[a-z.]+)?$' THEN 'Search'
      WHEN lower(coalesce("landingSource", '')) ~ '^(instagram|ig|facebook|fb|reddit|x|twitter|threads|tiktok|youtube|linkedin)(\.com|\.net)?$' THEN 'Social'
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$' THEN 'AI assistants'
      WHEN lower(coalesce("referrerHost", '')) ~ '^(www\.)?google\.[a-z.]+$|^com\.google\.android\.googlequicksearchbox$|(^|\.)(bing\.com|duckduckgo\.com|search\.yahoo\.com|ecosia\.org|search\.brave\.com)$' THEN 'Search'
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(instagram\.com|facebook\.com|reddit\.com|x\.com|t\.co|threads\.net|tiktok\.com|youtube\.com|linkedin\.com|lnkd\.in)$' THEN 'Social'
      WHEN "landingSource" IS NOT NULL OR "referrerHost" IS NOT NULL
        THEN 'Other referrer or tag'
      ELSE 'Direct or not recorded'
    END AS bucket
  FROM leads, bounds
  WHERE "createdAt" >= bounds.start_at AND "createdAt" < bounds.end_at
)
SELECT bucket, kind, count(*) AS leads
FROM classified
GROUP BY bucket, kind
ORDER BY bucket, kind;

COMMIT;
