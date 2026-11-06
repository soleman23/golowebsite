/**
 * The Rules Center's launch switch. While it's false, production and
 * Hostinger PR previews serve no Rules Center at all: /rules is a 404, and
 * nothing reaches the sitemap, llms.txt, the footer or any other page's links.
 * `next dev` still renders the hub, with approved records marked
 * unpublished, so the owner can review it locally.
 *
 * A code constant with no preview override, as the glossary's (#155,
 * docs/rules/product-spec.md Amendment A7). The launch PR (#247) flips it, in
 * the same deploy that moves approved records to published.
 *
 * Typed `boolean` so a `false` literal doesn't narrow the checks that read it.
 */
export const rulesLive: boolean = false;
