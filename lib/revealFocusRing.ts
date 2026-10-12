/**
 * Scrolls the rest of a focus ring's box into view when Tab lands somewhere
 * the browser only brings part of it into view. Two places on the site do
 * this. In a textarea, Chrome scrolls just far enough to show the caret's
 * line. On an open accordion item, it shows the question button and leaves
 * the rest of the answer, and the bottom of the ring, below the fold.
 *
 * scrollIntoStrip explains why focus handlers here don't usually scroll the
 * page: a focus the reader didn't cause would drag it. So this one is
 * guarded:
 *
 * - It only runs for focus that a Tab key press moved. When you come back to
 *   the tab, the browser fires focus on the focused element again, and a click
 *   or tap fires it too. None of those comes from a Tab key press, and the
 *   browser doesn't scroll for them either.
 * - It only runs when the box fits between the nav and the bottom edge.
 *   Revealing a taller box would push its other end out of view, and maybe the
 *   focused element with it.
 * - It goes where the browser's own scroll would take the focused element,
 *   then only as much further as the box needs. Where that scroll already
 *   shows the whole box, the page lands exactly where it would have.
 *
 * Chrome works out its own scroll before the focus event fires, so the
 * position read here is where the page was when Tab was pressed (or, with
 * reduced motion, where Chrome has already jumped to). Scrolling a frame later
 * replaces Chrome's smooth scroll with one to the final position, instead of
 * being overridden by it.
 */

let tabbing = false;

if (typeof window !== "undefined") {
  // Tab moves focus after the keydown's listeners have run, so the flag is
  // set when focus fires and cleared straight after.
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Tab") return;
      tabbing = true;
      setTimeout(() => {
        tabbing = false;
      });
    },
    true,
  );
}

type Span = { top: number; bottom: number };

export function revealFocusRing(box: Element | null) {
  const focused = document.activeElement;
  if (!box || !focused || !tabbing) return;

  // The area html's scroll-padding leaves clear: under the nav, and above the
  // bottom edge with room for the ring.
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const area = {
    top: px(style.scrollPaddingTop),
    bottom: root.clientHeight - px(style.scrollPaddingBottom),
  };

  const b = box.getBoundingClientRect();
  if (b.height > area.bottom - area.top) return;

  // The browser's scroll for the focused element: none if it's in view, to
  // the nearest edge if it's partly in view, to the centre if it's out of
  // view. For a textarea this is the field, not the caret's line.
  const f = focused.getBoundingClientRect();
  const y = window.scrollY;
  const max = root.scrollHeight - root.clientHeight;
  let target = clamp(y + browserScroll(f, area), max);
  // Then on to the nearest edge, if that leaves the box cut off.
  target = clamp(target + toNearestEdge(shift(b, target - y), area), max);
  if (target === y) return;

  requestAnimationFrame(() => {
    if (box.contains(document.activeElement)) window.scrollTo({ top: target });
  });
}

function browserScroll(r: Span, area: Span) {
  if (r.top >= area.top && r.bottom <= area.bottom) return 0;
  if (r.bottom > area.top && r.top < area.bottom) return toNearestEdge(r, area);
  return (r.top + r.bottom - area.top - area.bottom) / 2;
}

function toNearestEdge(r: Span, area: Span) {
  if (r.top < area.top) return r.top - area.top;
  if (r.bottom > area.bottom) return r.bottom - area.bottom;
  return 0;
}

function shift(r: Span, dy: number): Span {
  return { top: r.top - dy, bottom: r.bottom - dy };
}

/** Rounded to a whole pixel, as the browser's own scroll offsets are. */
function clamp(y: number, max: number) {
  return Math.round(Math.min(Math.max(y, 0), max));
}

function px(value: string) {
  return parseFloat(value) || 0;
}
