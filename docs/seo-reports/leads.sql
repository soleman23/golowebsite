-- Lead attribution for the monthly SEO/AIO report (docs/seo-reports/TEMPLATE.md).
--
-- Read-only: every statement is a SELECT, and none reads a phone number,
-- email address or user agent. Run it in the Supabase SQL editor for the
-- "golowebsite" project, or with psql as a read-only role. Never commit
-- credentials or the rows themselves; paste only the counts into the report.
--
-- Set the month in the `bounds` CTE of each query (start inclusive, end
-- exclusive, UTC). "createdAt" is stored in UTC.
--
-- The AI host list matches the GA4 "AI assistants" channel group (#66). Keep
-- the two in step: change both or neither.

-- 1. AI-referred leads, by host and by how the host was recorded.
--    landingSource is the landing URL's utm_source (ChatGPT search adds
--    utm_source=chatgpt.com); referrerHost is the outside referrer's host.
--    A lead can carry both, so it's counted once, under the first that matches.
WITH bounds AS (
  SELECT TIMESTAMP '2026-11-01' AS start_at, TIMESTAMP '2026-12-01' AS end_at
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
--    PhoneLead.source is the form's placement ("hero", "final_cta_<page>");
--    NewsletterLead.source is "blog". landingPath is null on rows from before
--    October 10, 2026 and when it wasn't captured.
WITH bounds AS (
  SELECT TIMESTAMP '2026-11-01' AS start_at, TIMESTAMP '2026-12-01' AS end_at
),
leads AS (
  SELECT 'phone' AS kind, "createdAt", "landingPath", "source" FROM "PhoneLead"
  UNION ALL
  SELECT 'newsletter', "createdAt", "landingPath", "source" FROM "NewsletterLead"
)
SELECT kind, coalesce("landingPath", '(not recorded)') AS landing_path, "source" AS placement, count(*) AS leads
FROM leads, bounds
WHERE "createdAt" >= bounds.start_at AND "createdAt" < bounds.end_at
GROUP BY kind, landing_path, placement
ORDER BY leads DESC, kind, landing_path;

-- 3. All leads by where the visit came from, in broad buckets.
WITH bounds AS (
  SELECT TIMESTAMP '2026-11-01' AS start_at, TIMESTAMP '2026-12-01' AS end_at
),
leads AS (
  SELECT 'phone' AS kind, "createdAt", "landingSource", "referrerHost" FROM "PhoneLead"
  UNION ALL
  SELECT 'newsletter', "createdAt", "landingSource", "referrerHost" FROM "NewsletterLead"
),
classified AS (
  SELECT
    kind,
    CASE
      WHEN lower(coalesce("landingSource", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        OR lower(coalesce("referrerHost", '')) ~ '(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com)$'
        THEN 'AI assistants'
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com|ecosia\.org|search\.brave\.com)$'
        OR lower(coalesce("landingSource", '')) ~ '^(google|bing|duckduckgo|yahoo|ecosia|brave)(\.[a-z.]+)?$'
        THEN 'Search'
      WHEN lower(coalesce("referrerHost", '')) ~ '(^|\.)(instagram\.com|facebook\.com|reddit\.com|x\.com|t\.co|threads\.net|tiktok\.com|youtube\.com|linkedin\.com|lnkd\.in)$'
        OR lower(coalesce("landingSource", '')) ~ '^(instagram|ig|facebook|fb|reddit|x|twitter|threads|tiktok|youtube|linkedin)(\.com|\.net)?$'
        THEN 'Social'
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
