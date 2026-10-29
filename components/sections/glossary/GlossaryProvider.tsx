"use client";

/**
 * Holds the /glossary hub's state: the category (in the URL, ?category=, the
 * same way /blog holds ?topic=) and the search text (never in the URL,
 * history or analytics). The hero's search field, the controls and the
 * copy-link buttons sit in different parts of the page, so the state lives
 * here and the server-rendered directory is passed through as children.
 *
 * Also owns deep links (docs/glossary/ux.md D6): a #slug on load or on a
 * hash change always ends up visible. An active search is cleared and a
 * category that would hide the term resets to All, each announced, and the
 * term's <dt> takes focus. A #letter-x jump focuses the letter's heading.
 *
 * Category filtering itself is CSS keyed off <html data-filter> (FilterBoot
 * paints it before hydration). Search hides the directory through
 * <html data-glossary-search>, set here while a query is active.
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
import { FilterUrlSync, useInitialFilter } from "@/components/ui/FilterUrlSync";
import { track } from "@/lib/analytics";

type GlossaryState = {
  /** The active category id or "all"; null until the URL has been read. */
  active: string | null;
  /** Choose a category: state, <html data-filter> and a history entry. */
  choose: (id: string) => void;
  query: string;
  setQuery: (query: string) => void;
  /** Query empty and category All, in one step. */
  clear: () => void;
  /** Polite, one-off messages (copy confirmations, deep-link resets). */
  announce: (message: string) => void;
  /** Show and focus a term or letter heading by its id. */
  reveal: (id: string, announceOpen?: boolean) => void;
};

const GlossaryContext = createContext<GlossaryState | null>(null);

export function useGlossary(): GlossaryState {
  const ctx = useContext(GlossaryContext);
  if (!ctx) throw new Error("useGlossary must be used inside <GlossaryProvider>");
  return ctx;
}

type ProviderProps = {
  /** Accepted category ids, "all" included. */
  ids: string[];
  children: React.ReactNode;
};

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

export function GlossaryProvider({ ids, children }: ProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [query, setQueryState] = useState("");
  const [message, setMessage] = useState("");
  // Read by reveal(), which runs from listeners outside React's render.
  const activeRef = useRef<string | null>(null);
  const queryRef = useRef("");
  /** Terms already reported as opened on this page load. */
  const opened = useRef(new Set<string>());

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
      // push, not replace: back walks through categories (GL-QA-11).
      router.push(href, { scroll: false });
      track("glossary_filter", { category: id });
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
    document.getElementById("glossary-search")?.focus();
  }, [choose, setQuery]);

  const reveal = useCallback(
    (id: string, announceOpen = false) => {
      const target = document.getElementById(id);
      if (!target) return;
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const show = () =>
        // A frame first, so a reset made just now has rendered.
        requestAnimationFrame(() =>
          whenShown(target, () => {
            target.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
            target.focus({ preventScroll: true });
          }),
        );

      if (target.tagName !== "DT") {
        // A letter heading or the A–Z bar: just move focus there.
        if (target.tabIndex === -1) show();
        return;
      }
      const name = target.querySelector("a")?.textContent ?? id;
      const category = (target.parentElement as HTMLElement | null)?.dataset.category;
      const termId = target.dataset.termId;
      if (termId && !opened.current.has(termId)) {
        opened.current.add(termId);
        track("glossary_term_open", { term_id: termId, category: category ?? "" });
      }
      let note = "";
      if (queryRef.current) {
        setQuery("");
        note = `Search cleared to show ${name}`;
      }
      if (activeRef.current && activeRef.current !== "all" && activeRef.current !== category) {
        select("all");
        // replace: the reset isn't a step the reader took.
        router.replace(`${pathname}#${id}`, { scroll: false });
        note ||= `Category cleared to show ${name}`;
      }
      if (note) announce(note);
      else if (announceOpen) announce(`Showing ${name}`);
      show();
    },
    [announce, pathname, router, select, setQuery],
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

  // A term's guide or post link. The entry is server-rendered, so its links
  // carry data attributes and one listener reports them.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLElement>("a[data-glossary-cta]");
      if (!link?.dataset.termId) return;
      track("glossary_cta_click", {
        term_id: link.dataset.termId,
        destination_type: link.dataset.glossaryCta ?? "page",
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // While searching, the ranked results replace the directory (ux.md D4).
  useEffect(() => {
    const root = document.documentElement;
    if (query.trim()) root.dataset.glossarySearch = "";
    else delete root.dataset.glossarySearch;
  }, [query]);
  useEffect(
    () => () => {
      delete document.documentElement.dataset.glossarySearch;
    },
    [],
  );

  const value = useMemo(
    () => ({ active, choose, query, setQuery, clear, announce, reveal }),
    [active, choose, query, setQuery, clear, announce, reveal],
  );

  return (
    <GlossaryContext.Provider value={value}>
      <Suspense fallback={null}>
        <FilterUrlSync param="category" ids={ids} onSync={select} />
      </Suspense>
      <span className="sr-only" role="status">
        {message}
      </span>
      {children}
    </GlossaryContext.Provider>
  );
}
