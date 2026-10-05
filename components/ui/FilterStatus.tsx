"use client";

/**
 * Screen-reader announcement for a filter change the reader made: a chip,
 * back/forward, a link. Not for the first read of the URL — on a deep link the
 * page already shows what's filtered, and "2 games" spoken unprompted as the
 * page loads sounds like something happened.
 *
 * The visible counts aren't live regions for the same reason. CSS picks which
 * one shows (see FilterBoot), so they'd only ever announce at the wrong time.
 *
 * Messages carry the filter's name ("Match play: 2 games"), so two filters
 * with the same count still change the text and still get announced.
 */

import { useEffect, useRef, useState } from "react";

type FilterStatusProps = {
  /** The active filter id, or null until the URL has been read. */
  active: string | null;
  /** What to announce for each filter id. */
  messages: Record<string, string>;
};

export function FilterStatus({ active, messages }: FilterStatusProps) {
  const [text, setText] = useState("");
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (active === null) return;
    if (previous.current !== null && previous.current !== active) {
      setText(messages[active] ?? "");
    }
    previous.current = active;
  }, [active, messages]);

  return (
    <span className="sr-only" role="status">
      {text}
    </span>
  );
}
