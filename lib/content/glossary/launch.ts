/**
 * The glossary's launch switch. While it's false, production and Hostinger PR
 * previews serve no glossary at all: /glossary is a 404, and nothing reaches
 * the sitemap, llms.txt, the footer or any other page's links. `next dev`
 * still renders the hub, with approved terms marked unpublished, so the owner
 * can review it locally.
 *
 * A code constant with no preview override, by the owner's decision on #155
 * (October 28, 2026): preview URLs are public, and nothing confirms a preview
 * build can be given its own environment. The launch PR (#166) flips it, in
 * the same deploy that moves approved records to published.
 *
 * Typed `boolean` so a `false` literal doesn't narrow the checks that read it.
 */
export const glossaryLive: boolean = true;
