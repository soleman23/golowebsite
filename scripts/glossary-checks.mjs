/**
 * Glossary link rules for scripts/check-content.mjs §3, as a function so
 * scripts/test-glossary.mjs can run it on fixtures (#155).
 *
 * - Until `glossaryLive` is true, no page outside the glossary's own files
 *   may link to /glossary: production serves a 404 there, and the launch PR
 *   (#164 + #166) adds the inbound links in the same deploy as the flip.
 * - A /glossary#<fragment> link must name a published term's slug, so a
 *   typo or an unpublished term fails instead of landing at the top of the
 *   hub. The link check proper strips fragments, so it can't see this.
 */

/** Files that only render when the glossary does. */
export const GLOSSARY_OWNED = [
  "lib/content/glossary/",
  "components/sections/glossary/",
  "app/glossary/",
];

export const isGlossaryOwned = (file) =>
  GLOSSARY_OWNED.some((prefix) => file.startsWith(prefix));

/**
 * The problem with one href, or null. `publishedSlugs` is the published
 * selection's slugs (never the local-review one).
 */
export function glossaryHrefProblem(href, file, { live, publishedSlugs }) {
  const [beforeHash, fragment] = href.split("#");
  const path = beforeHash.split("?")[0].replace(/\/$/, "");
  if (path !== "/glossary") return null;
  if (!live && !isGlossaryOwned(file)) {
    return `link to ${href}, but the glossary isn't live (glossaryLive is false in lib/content/glossary/launch.ts)`;
  }
  if (fragment !== undefined && fragment !== "" && !publishedSlugs.has(fragment)) {
    return `link to ${href}, but "${fragment}" isn't a published glossary term`;
  }
  return null;
}
