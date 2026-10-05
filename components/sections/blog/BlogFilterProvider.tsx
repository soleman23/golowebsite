"use client";

/**
 * Holds the active topic for /blog.
 *
 * The chips live in the rail and the heading lives in the main column — two
 * different grid cells — so the state they share can't hang off either one.
 *
 * Deliberately not useSearchParams: on a static route that hook forces a
 * Suspense boundary, and everything under it ships as a fallback instead of as
 * markup. Reading location.search keeps the whole grid in the static HTML.
 *
 * `active` starts at "all" so the server render and the first client render
 * agree. The URL's real value arrives after hydration — the visible cards are
 * already correct by then, because FilterBoot set <html data-filter> during
 * parse and CSS acted on it before the first paint.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BlogFilterValue = {
  active: string;
  select: (id: string) => void;
};

const BlogFilterContext = createContext<BlogFilterValue | null>(null);

export function useBlogFilter(): BlogFilterValue {
  const ctx = useContext(BlogFilterContext);
  if (!ctx) {
    throw new Error("useBlogFilter must be used inside <BlogFilterProvider>");
  }
  return ctx;
}

type ProviderProps = {
  /** Accepted topic ids, "all" included. Anything else falls back to "all". */
  ids: string[];
  children: React.ReactNode;
};

export function BlogFilterProvider({ ids, children }: ProviderProps) {
  const [active, setActive] = useState("all");
  const idKey = ids.join("|");

  useEffect(() => {
    const valid = new Set(idKey.split("|"));

    function readUrl() {
      const raw = new URLSearchParams(window.location.search).get("topic");
      const next = raw && valid.has(raw) ? raw : "all";
      setActive(next);
      document.documentElement.dataset.filter = next;
    }

    readUrl();
    // router.push doesn't fire popstate; the back button does. This is what
    // makes walking back through topics restore the cards and the chip.
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [idKey]);

  const select = useCallback((id: string) => {
    setActive(id);
    document.documentElement.dataset.filter = id;
  }, []);

  const value = useMemo(() => ({ active, select }), [active, select]);

  return (
    <BlogFilterContext.Provider value={value}>
      {children}
    </BlogFilterContext.Provider>
  );
}
