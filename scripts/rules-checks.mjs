/**
 * Rules Center link rules for scripts/check-content.mjs §3, as a function so
 * scripts/test-rules.mjs can run it on fixtures (#233). The same rules as
 * scripts/glossary-checks.mjs:
 *
 * - Until `rulesLive` is true, no page outside the Rules Center's own files
 *   may link to /rules: production serves a 404 there, and the launch PR
 *   (#242 + #247) adds the inbound links in the same deploy as the flip.
 * - A /rules#<fragment> link must name a published record or one of the
 *   hub's section ids, so a typo or an unpublished answer fails instead of
 *   landing at the top of the page.
 */

/** Files that only render when the Rules Center does. */
export const RULES_OWNED = [
  "lib/content/rules/",
  "components/sections/rules/",
  "app/rules/",
];

export const isRulesOwned = (file) => RULES_OWNED.some((prefix) => file.startsWith(prefix));

/**
 * The problem with one href, or null. `fragments` is the published records'
 * ids plus the hub's section ids (never the local-review selection).
 */
export function rulesHrefProblem(href, file, { live, fragments }) {
  const [beforeHash, fragment] = href.split("#");
  const path = beforeHash.split("?")[0].replace(/\/$/, "");
  if (path !== "/rules") return null;
  if (!live && !isRulesOwned(file)) {
    return `link to ${href}, but the Rules Center isn't live (rulesLive is false in lib/content/rules/launch.ts)`;
  }
  if (fragment !== undefined && fragment !== "" && !fragments.has(fragment)) {
    return `link to ${href}, but "${fragment}" isn't a published rule, situation or hub section`;
  }
  return null;
}
