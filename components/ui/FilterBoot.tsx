/**
 * Publishes the URL's filter onto <html data-filter> before the browser paints.
 *
 * Why this exists: /games and /blog used to read their filter from
 * `searchParams`, which made both routes dynamic. Next 15 streams metadata for
 * dynamic routes, so <title>, the meta description, the canonical and the OG
 * tags landed in the body ~20 KB down the response and only reached <head>
 * once React hydrated — Lighthouse scored /games 91 on SEO for a description
 * that was technically present but not where a parser looks.
 *
 * So both pages are static again and render every card. The filtering is a CSS
 * concern keyed off this attribute, and this script sets it during parse —
 * before the cards below it are parsed, so a deep link like
 * /games?filter=match paints filtered on the first frame with no flash of the
 * full list.
 *
 * Render it as the FIRST child of the page, above the markup it filters.
 * Placement is the whole mechanism: move it below the grid and the grid paints
 * unfiltered first.
 *
 * With JavaScript off nothing runs, no attribute is set, and every card shows
 * under an "All" chip — which is honest, since no filtering happened.
 */

type FilterBootProps = {
  /** Query param to read: "filter" on /games, "topic" on /blog. */
  param: string;
  /** Accepted values. Anything else falls back to "all". */
  ids: readonly string[];
};

export function FilterBoot({ param, ids }: FilterBootProps) {
  // The URL is attacker-controlled, so the value is never interpolated into
  // markup — it's matched against this list and written with `dataset`, which
  // sets an attribute value and cannot introduce an element. `<` keeps a
  // literal "</script>" out of the payload the way JsonLd does.
  const js =
    `(function(){try{` +
    `var v=new URLSearchParams(location.search).get(${JSON.stringify(param)});` +
    `var ok=${JSON.stringify(ids)};` +
    `document.documentElement.dataset.filter=ok.indexOf(v)>-1?v:"all";` +
    `}catch(e){}})()`;

  return (
    <script dangerouslySetInnerHTML={{ __html: js.replace(/</g, "\\u003c") }} />
  );
}
