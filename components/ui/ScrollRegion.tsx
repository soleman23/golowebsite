"use client";

/**
 * A sideways scroller that joins the tab order only while its content
 * overflows. Chrome and Firefox already make an overflowing scroller
 * focusable on their own; Safari never does, so a keyboard user there had no
 * way to reach the clipped columns of a wide table.
 *
 * A static tabIndex={0} would also put a stop on every table that fits its
 * column. Instead this measures, and only while there's something to scroll
 * does it become a named region, so the stop says what it is.
 *
 * Until hydration the server markup is a plain div, which is what it was
 * before; the browser's own focusable scroller still covers Chrome/Firefox.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRegionProps = {
  /** Accessible name, used only while the content overflows. */
  label: string;
  className?: string;
  children: ReactNode;
};

export function ScrollRegion({ label, className, children }: ScrollRegionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth);
    measure();
    // The box resizes with the viewport; the content resizes on its own when
    // web fonts land. Either can flip it.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      tabIndex={overflows ? 0 : undefined}
      role={overflows ? "region" : undefined}
      aria-label={overflows ? label : undefined}
    >
      {children}
    </div>
  );
}
