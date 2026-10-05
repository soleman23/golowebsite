"use client";

/**
 * Keeps a filter's state in step with the URL on every navigation — a chip
 * click, back/forward, and a plain link to the same page with a different
 * query or none (the nav's "Blog" from /blog?topic=rules). Renders nothing.
 *
 * A mount-time read plus a popstate listener missed that last case: the App
 * Router keeps the page mounted when only the query changes, and Link never
 * fires popstate. useSearchParams sees every one.
 *
 * On a static route useSearchParams bails out of prerendering up to the
 * nearest Suspense boundary, so render this inside its own
 * <Suspense fallback={null}>. Only this empty leaf then renders client-side;
 * the chips and cards stay in the static HTML.
 *
 * It also owns clean-up: <html> outlives the page under the App Router, and a
 * filter left on it would follow you to the next page. Both effects are
 * layout effects, so the attribute is right before paint — on arrival, on
 * Back, and on the way out.
 */

import { useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

type FilterUrlSyncProps = {
  /** Query param to read: "filter" on /games, "topic" on /blog. */
  param: string;
  /** Accepted values. Anything else resolves to "all". */
  ids: readonly string[];
  /** Must be stable (useCallback) — it's an effect dependency. */
  onSync: (id: string) => void;
};

export function FilterUrlSync({ param, ids, onSync }: FilterUrlSyncProps) {
  const raw = useSearchParams().get(param);
  const next = raw && ids.includes(raw) ? raw : "all";

  useLayoutEffect(() => {
    onSync(next);
  }, [next, onSync]);

  useLayoutEffect(
    () => () => {
      delete document.documentElement.dataset.filter;
    },
    [],
  );

  return null;
}
