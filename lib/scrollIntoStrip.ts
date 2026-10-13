/**
 * Scrolls a focused chip or rail row into view inside its own scroller, and
 * nothing else. Chrome won't scroll a half-visible element into view when it
 * takes focus, which leaves a chip and its focus ring hanging off the edge of
 * a scrolling row.
 *
 * Not element.scrollIntoView(): that scrolls every ancestor, the page
 * included, so a focus event the reader didn't cause (browsers fire one on the
 * focused element when you come back to the tab) could drag the page back up
 * to a strip they'd scrolled away from. The browser already brings a
 * keyboard-focused element into the viewport on its own; revealFocusRing
 * covers the two places where it doesn't bring in the whole ring.
 *
 * Honours the scroller's scroll-padding, which is where the rails keep room
 * for the ring.
 *
 * In a strip that snaps, it stops on a snap point. Snapping pulls any other
 * resting place back to the nearest chip start, which can leave the focused
 * chip half out of the strip, and snapping used to be switched off while a
 * chip had focus to stop that. The strip then jumped to a snap point as focus
 * left it. Stopping on a snap point in the first place leaves snapping
 * nothing to correct, so it stays on.
 */
export function scrollIntoStrip(el: HTMLElement) {
  const strip = scrollParent(el);
  if (!strip) return;

  const box = strip.getBoundingClientRect();
  const style = getComputedStyle(strip);
  // The scrollport inside the borders, less scroll-padding ("auto" reads as 0).
  const left = box.left + strip.clientLeft + px(style.scrollPaddingLeft);
  const right = box.left + strip.clientLeft + strip.clientWidth - px(style.scrollPaddingRight);
  const top = box.top + strip.clientTop + px(style.scrollPaddingTop);
  const bottom = box.top + strip.clientTop + strip.clientHeight - px(style.scrollPaddingBottom);

  const r = el.getBoundingClientRect();
  let dx = r.left < left ? r.left - left : r.right > right ? r.right - right : 0;
  const dy = r.top < top ? r.top - top : r.bottom > bottom ? r.bottom - bottom : 0;
  // Scrolling left, the chip's start lands on the edge, which is already a
  // snap point. Scrolling right, carry on to the first one that shows it all.
  if (dx > 0 && /\b(x|inline|both)\b/.test(style.scrollSnapType)) {
    dx = snapAtOrPast(strip, el, left, dx);
  }
  // Round away from zero: a scroll offset that lands half a pixel short puts
  // the edge of the ring back under the clip.
  if (dx || dy) strip.scrollBy({ left: awayFromZero(dx), top: awayFromZero(dy) });
}

/**
 * The smallest scroll of at least `need` that lines a snap area's start up
 * with the strip's start edge, without passing `el`'s own: past that, its
 * start would go out of view. A chip wider than the strip only gets its own
 * start. The browser stops a scroll past the end at the end, which counts as
 * a snap point too.
 */
function snapAtOrPast(strip: HTMLElement, el: HTMLElement, left: number, need: number) {
  const startOf = (area: Element) =>
    area.getBoundingClientRect().left - px(getComputedStyle(area).scrollMarginLeft) - left;
  const own = startOf(el);
  let best = own;
  for (const area of strip.querySelectorAll(el.tagName)) {
    const align = getComputedStyle(area).scrollSnapAlign.split(" ");
    if (align[align.length - 1] === "none") continue;
    const d = startOf(area);
    if (d >= need && d < best) best = d;
  }
  return best;
}

/** Nearest ancestor that scrolls on its own; never the page itself. */
function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(node);
    if (/auto|scroll/.test(overflowX) || /auto|scroll/.test(overflowY)) return node;
  }
  return null;
}

function px(value: string) {
  return parseFloat(value) || 0;
}

function awayFromZero(n: number) {
  return n < 0 ? Math.floor(n) : Math.ceil(n);
}
