"use client";

/**
 * Holds the /rules hub's state (docs/rules/ux.md D4, D5): the topic (in the
 * URL, ?category=, as the glossary's category) and the search text (never in
 * the URL, history or analytics). The hero's search field, the controls and
 * the copy-link buttons sit in different parts of the page, so the state
 * lives here and the server-rendered hub passes through as children. The
 * copy-link buttons reach `announce` through AnnounceContext, so the page
 * has one polite region for one-off messages.
 *
 * Also owns deep links (ux.md § Flows and states): a #fragment on load or on
 * a hash change always ends up visible. An active search is cleared and a
 * topic filter resets to All, each announced, and the entry's heading takes
 * focus, smoothly unless the reader prefers reduced motion.
 *
 * Topic filtering itself is CSS keyed off <html data-filter> (FilterBoot
 * paints it before hydration). Search hides the lists through
 * <html data-rules-search>, set here while a query is active.
 *
 * Analytics are #244's: rules_filter belongs in choose(), and the rule and
 * situation opens in reveal() through lib/openReport.
 */

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnnounceContext } from "@/components/ui/announce";
import { FilterUrlSync, useInitialFilter } from "@/components/ui/FilterUrlSync";

type RulesState = {
  /** The active topic id or "all"; null until the URL has been read. */
  active: string | null;
  /** Choose a topic: state, <html data-filter> and a history entry. */
  choose: (id: string) => void;
  query: string;
  setQuery: (query: string) => void;
  /** Query empty and topic All, in one step; focus goes to the field. */
  clear: () => void;
  /** Polite, one-off messages (copy confirmations, deep-link resets). */
  announce: (message: string) => void;
  /** Show and focus an entry or section by its id. */
  reveal: (id: string, announceOpen?: boolean) => void;
};

const RulesContext = createContext<RulesState | null>(null);

export function useRules(): RulesState {
  const ctx = useContext(RulesContext);
  if (!ctx) throw new Error("useRules must be used inside <RulesProvider>");
  return ctx;
}

/** The provider's announcements; {name} is the entry's heading. */
export type RulesRevealCopy = {
  searchCleared: string;
  filterCleared: string;
  showing: string;
};

type ProviderProps = {
  /** Accepted topic ids, "all" included. */
  ids: string[];
  copy: RulesRevealCopy;
  children: React.ReactNode;
};

/** The field's id: RULES_PAGE_IDS reserves it. */
export const RULES_SEARCH_ID = "rules-search";

/**
 * Run once `target` is laid out. A reset needs a render, and on a cold load
 * FilterUrlSync can re-apply the old ?category= for a frame or two before
 * the replaced URL reaches it, so wait for the element rather than a fixed
 * number of frames (about half a second at most).
 */
function whenShown(target: HTMLElement, run: () => void, frames = 30) {
  requestAnimationFrame(() => {
    if (target.offsetParent !== null || frames <= 0) run();
    else whenShown(target, run, frames - 1);
  });
}

/**
 * The wrapper around everything search and the topic filter can hide
 * (app/rules/page.tsx sets it; a server file can't import this constant
 * from a client module).
 */
const RULES_LISTS_ATTR = "data-rules-lists";

type Target = {
  target: HTMLElement;
  /** The heading that takes focus, if the target has one. */
  focus: HTMLElement | null;
  /** A situation or rule overview. */
  entry: boolean;
  /** Inside the lists, so search or a filter can be hiding it. */
  hideable: boolean;
};

/** What a fragment points at, and what takes focus there. */
function resolveTarget(id: string): Target | null {
  const target = document.getElementById(id);
  if (!target) return null;
  const entry = target.tagName === "ARTICLE" && Boolean(target.dataset.category);
  // An entry's heading, or a topic group's; both carry tabindex="-1".
  const focus = target.querySelector<HTMLElement>(
    entry ? "h3[tabindex], h4[tabindex]" : ":scope > h3[tabindex]",
  );
  return { target, focus, entry, hideable: Boolean(target.closest(`[${RULES_LISTS_ATTR}]`)) };
}

export function RulesProvider({ ids, copy, children }: ProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [query, setQueryState] = useState("");
  const [message, setMessage] = useState("");
  // Read by reveal(), which runs from listeners outside React's render.
  const activeRef = useRef<string | null>(null);
  const queryRef = useRef("");

  const select = useCallback((id: string) => {
    activeRef.current = id;
    setActive(id);
    document.documentElement.dataset.filter = id;
  }, []);

  useInitialFilter("category", ids, select);

  const choose = useCallback(
    (id: string) => {
      select(id);
      const href = id === "all" ? pathname : `${pathname}?category=${id}`;
      // push, not replace: back and forward walk through topics.
      router.push(href, { scroll: false });
    },
    [pathname, router, select],
  );

  const setQuery = useCallback((value: string) => {
    queryRef.current = value;
    setQueryState(value);
  }, []);

  const announce = useCallback((text: string) => {
    // Clear first, so the same message twice is announced twice.
    setMessage("");
    requestAnimationFrame(() => setMessage(text));
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    if (activeRef.current !== "all") choose("all");
    // The Clear button may be about to unmount; the field is where to go next.
    document.getElementById(RULES_SEARCH_ID)?.focus();
  }, [choose, setQuery]);

  const reveal = useCallback(
    (id: string, announceOpen = false) => {
      const resolved = resolveTarget(id);
      if (!resolved) return;
      const { target, focus, entry, hideable } = resolved;
      const name = (focus ?? target).textContent?.trim() || id;
      let note = "";
      // Search hides every list and a filter hides other topics: both give
      // way to the fragment (ux.md: the hash wins). The sources and related
      // sections are never hidden, so a jump there resets nothing.
      if (hideable && queryRef.current) {
        setQuery("");
        note = copy.searchCleared.replace("{name}", name);
      }
      if (hideable && activeRef.current && activeRef.current !== "all") {
        select("all");
        // replace: the reset isn't a step the reader took.
        router.replace(`${pathname}#${id}`, { scroll: false });
        note ||= copy.filterCleared.replace("{name}", name);
      }
      if (note) announce(note);
      else if (announceOpen && entry) announce(copy.showing.replace("{name}", name));
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      // A frame first, so a reset made just now has rendered.
      requestAnimationFrame(() =>
        whenShown(target, () => {
          target.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
          focus?.focus({ preventScroll: true });
        }),
      );
    },
    [announce, copy, pathname, router, select, setQuery],
  );

  // Deep links: the hash on arrival (once), then every hash change.
  const arrived = useRef(false);
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) reveal(id);
    };
    if (!arrived.current) {
      arrived.current = true;
      fromHash();
    }
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reveal]);

  // While searching, the ranked results replace the lists (ux.md D5).
  useEffect(() => {
    const root = document.documentElement;
    if (query.trim()) root.dataset.rulesSearch = "";
    else delete root.dataset.rulesSearch;
  }, [query]);
  useEffect(
    () => () => {
      delete document.documentElement.dataset.rulesSearch;
    },
    [],
  );

  const value = useMemo(
    () => ({ active, choose, query, setQuery, clear, announce, reveal }),
    [active, choose, query, setQuery, clear, announce, reveal],
  );

  return (
    <RulesContext.Provider value={value}>
      <Suspense fallback={null}>
        <FilterUrlSync param="category" ids={ids} onSync={select} />
      </Suspense>
      <span className="sr-only" role="status">
        {message}
      </span>
      <AnnounceContext.Provider value={announce}>{children}</AnnounceContext.Provider>
    </RulesContext.Provider>
  );
}
