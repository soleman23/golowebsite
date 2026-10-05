"use client";

/**
 * Holds the active topic for /blog.
 *
 * The chips live in the rail and the heading lives in the main column — two
 * different grid cells — so the state they share can't hang off either one.
 *
 * `active` starts null: the page is static and the server HTML can't know
 * ?topic=, so no chip is marked current rather than the wrong one. Until
 * hydration, FilterBoot's <html data-filter> and the rules in
 * PostGrid.module.css show the right cards, chip, heading and count. From
 * then on FilterUrlSync re-reads the URL on every navigation — including a
 * plain link back to /blog, which keeps this page mounted.
 */

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { FilterUrlSync, useInitialFilter } from "@/components/ui/FilterUrlSync";

type BlogFilterValue = {
  /** null until the URL has been read. */
  active: string | null;
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
  const [active, setActive] = useState<string | null>(null);

  const select = useCallback((id: string) => {
    setActive(id);
    document.documentElement.dataset.filter = id;
  }, []);

  useInitialFilter("topic", ids, select);

  const value = useMemo(() => ({ active, select }), [active, select]);

  return (
    <BlogFilterContext.Provider value={value}>
      <Suspense fallback={null}>
        <FilterUrlSync param="topic" ids={ids} onSync={select} />
      </Suspense>
      {children}
    </BlogFilterContext.Provider>
  );
}
