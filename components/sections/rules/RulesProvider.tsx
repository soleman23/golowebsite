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
 * a hash change always ends up visible. An active search is cleared, and a
 * topic filter that hides the target resets to All (one that shows it
 * stays, as on the glossary), announced in one message; the entry's heading
 * takes focus, smoothly unless the reader prefers reduced motion.
 *
 * Topic filtering itself is CSS keyed off <html data-filter> (FilterBoot
 * paints it before hydration). Search hides the lists through
 * <html data-rules-search>, set here while a query is active.
 *
 * Analytics (#244, lib/rulesAnalytics.ts): rules_filter from choose();
 * rules_rule_open and rules_scenario_open from reveal(), once per entry per
 * page load through lib/openReport, with the source of the in-page link that
 * led there; and one click listener for the official, related and CTA links,
 * which are server-rendered and carry their ids as data-* attributes.
 * rules_search is RulesControls'. None of them carries the search text.
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
import { normalizeRulesText } from "@/lib/content/rules/search";
import { createOpenReporter } from "@/lib/openReport";
import {
  rulesCategoryParam,
  rulesCtaDestination,
  rulesOfficialParams,
  rulesRelatedParams,
  rulesRuleNumber,
  rulesScenarioId,
  trackRules,
  type RulesOpenSource,
} from "@/lib/rulesAnalytics";

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
  bothCleared: string;
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

/** What an open reports: the record, and how the reader got there. */
type RulesOpen =
  | { kind: "rule"; rule: `${number}`; source: RulesOpenSource }
  | { kind: "scenario"; scenario: string; source: RulesOpenSource };

/**
 * An in-page link's click, kept until the hash change it causes reaches
 * reveal(). A click that changes nothing (the same fragment, a new tab)
 * leaves it behind, so it counts only for its own target and only briefly.
 */
type PendingOpen = { id: string; source: RulesOpenSource; at: number };
const PENDING_OPEN_MS = 1000;

/** The results list's id (RulesControls renders it). */
const RULES_RESULTS_ID = "rules-results";
/** FinalCTA's section id: the closing band, the hub's one CTA placement. */
const FINAL_CTA_ID = "get";

/** Where an in-page link sits decides the source of the open it leads to. */
function openSource(link: Element): RulesOpenSource {
  if (link.closest(`#${RULES_RESULTS_ID}`)) return "search";
  if (link.hasAttribute("data-rules-related")) return "related";
  return "browse";
}

function decodeFragment(hash: string): string | null {
  try {
    return decodeURIComponent(hash);
  } catch {
    return null;
  }
}

/**
 * Run once `target` is laid out. A reset needs a render, and on a cold load
 * FilterUrlSync can re-apply the old ?category= until the replaced URL
 * reaches it, so wait for the element rather than a fixed number of frames.
 * After about half a second it hands over to `giveUp`; the provider then
 * retries when the topic next changes (a slow connection).
 */
function whenShown(target: HTMLElement, run: () => void, giveUp: () => void, frames = 30) {
  requestAnimationFrame(() => {
    if (target.offsetParent !== null) run();
    else if (frames <= 0) giveUp();
    else whenShown(target, run, giveUp, frames - 1);
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

/** What to call a target when announcing it: its heading, never its whole text. */
function targetName(target: HTMLElement, focus: HTMLElement | null, id: string): string {
  const labelledBy = target.getAttribute("aria-labelledby");
  const label = focus ?? (labelledBy ? document.getElementById(labelledBy) : null);
  return label?.textContent?.trim() || target.getAttribute("aria-label") || id;
}

/**
 * Whether the topic `active` hides `target`, by the same rules as the CSS
 * in app/rules/rules.module.css: the quick cards and number grid go under
 * any topic, anything with a data-category shows only under its own, and a
 * section shows only under a topic in its data-cats.
 */
function hiddenByTopic(target: HTMLElement, active: string): boolean {
  if (active === "all") return false;
  if (target.closest("#quick-situations, #rules-numbers")) return true;
  const own = target.closest<HTMLElement>("[data-category]")?.dataset.category;
  if (own) return own !== active;
  const cats = target.closest<HTMLElement>("[data-cats]")?.dataset.cats?.split(" ");
  return cats ? !cats.includes(active) : false;
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
  // A reveal still waiting for its target to show (see whenShown).
  const pending = useRef<{ target: HTMLElement; show: () => void } | null>(null);
  const pendingOpen = useRef<PendingOpen | null>(null);
  const [opens] = useState(() =>
    createOpenReporter<RulesOpen>(
      (_id, open) =>
        open.kind === "rule"
          ? trackRules("rules_rule_open", { rule_number: open.rule, source: open.source })
          : trackRules("rules_scenario_open", { scenario_id: open.scenario, source: open.source }),
      () => window.__goloAnalyticsAllowed === true,
    ),
  );

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
      // The reader's choice only: a chip, Clear, "Search all". Not the
      // initial read of ?category= and not a deep link resetting it.
      const category = rulesCategoryParam(id);
      if (category) trackRules("rules_filter", { category });
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
    (id: string, announceOpen = false, arrival = false) => {
      const via = pendingOpen.current;
      pendingOpen.current = null;
      const resolved = resolveTarget(id);
      if (!resolved) return;
      const { target, focus, entry, hideable } = resolved;
      const name = targetName(target, focus, id);
      if (entry) {
        // Arrival waits for the saved choice to apply (lib/openReport).
        const source: RulesOpenSource = arrival
          ? "deep_link"
          : via && via.id === id && performance.now() - via.at < PENDING_OPEN_MS
            ? via.source
            : "browse";
        const rule = rulesRuleNumber(target.dataset.ruleNumber);
        const scenario = rulesScenarioId(target.dataset.scenarioId);
        const open: RulesOpen | null = rule
          ? { kind: "rule", rule, source }
          : scenario
            ? { kind: "scenario", scenario, source }
            : null;
        if (open) (arrival ? opens.arrive : opens.open)(id, open);
      }
      // Search hides every list, and a topic hides the others' entries: each
      // gives way to the fragment (ux.md: the hash wins). The sources and
      // related sections are never hidden, so a jump there resets nothing.
      const clearSearch = hideable && queryRef.current !== "";
      const clearTopic = hideable && hiddenByTopic(target, activeRef.current ?? "all");
      if (clearSearch) setQuery("");
      if (clearTopic) {
        select("all");
        // replace: the reset isn't a step the reader took. Any other
        // parameter stays.
        const params = new URLSearchParams(window.location.search);
        params.delete("category");
        const search = params.toString();
        router.replace(`${pathname}${search ? `?${search}` : ""}#${id}`, { scroll: false });
      }
      // One message: two at once in two regions, and a reader may hear one.
      const note = clearSearch && clearTopic
        ? copy.bothCleared
        : clearSearch
          ? copy.searchCleared
          : clearTopic
            ? copy.filterCleared
            : announceOpen && entry
              ? copy.showing
              : "";
      if (note) announce(note.replace("{name}", () => name));
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const show = () => {
        pending.current = null;
        target.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
        focus?.focus({ preventScroll: true });
      };
      pending.current = null;
      // A frame first, so a reset made just now has rendered.
      requestAnimationFrame(() =>
        whenShown(target, show, () => {
          pending.current = { target, show };
        }),
      );
    },
    [announce, copy, opens, pathname, router, select, setQuery],
  );

  // A reveal that timed out while FilterUrlSync held the old topic: run it
  // once the topic changes and the target is laid out.
  useEffect(() => {
    const waiting = pending.current;
    if (!waiting) return;
    requestAnimationFrame(() => {
      if (pending.current === waiting && waiting.target.offsetParent !== null) waiting.show();
    });
  }, [active]);

  // Deep links: the hash on arrival (once), then every hash change.
  const arrived = useRef(false);
  useEffect(() => {
    const fromHash = (arrival = false) => {
      // A malformed escape (#%) names nothing on the page; ignore it rather
      // than let the URIError take the hub down.
      const id = decodeFragment(window.location.hash.slice(1));
      if (id) reveal(id, false, arrival);
    };
    const onHashChange = () => fromHash();
    if (!arrived.current) {
      arrived.current = true;
      fromHash(true);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [reveal]);

  // The hub's links, from one listener (capture, so it runs before any
  // handler that navigates). An in-page jump notes its source for the open
  // it leads to; an official, related or CTA link reports its own event.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (href.startsWith("#") && event.button === 0 && !modified) {
        const id = decodeFragment(href.slice(1));
        if (id) pendingOpen.current = { id, source: openSource(link), at: performance.now() };
      }
      if (link.hasAttribute("data-rules-official")) {
        const params = rulesOfficialParams(link.dataset.rulesOfficial, link.dataset.officialRule);
        if (params) trackRules("rules_official_click", params);
      }
      if (link.hasAttribute("data-rules-related")) {
        const params = rulesRelatedParams(link.dataset.rulesRelated, link.dataset.contentId);
        if (params) trackRules("rules_related_click", params);
      }
      if (link.closest(`#${FINAL_CTA_ID}`)) {
        const destination = rulesCtaDestination(link.href, window.location.origin);
        if (destination) {
          trackRules("rules_cta_click", { placement: "final_cta", destination_type: destination });
        }
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // While searching, the ranked results replace the lists (ux.md D5). A
  // query of punctuation alone ("#" on the way to "#18") searches nothing,
  // so the lists stay.
  useEffect(() => {
    const root = document.documentElement;
    if (normalizeRulesText(query)) root.dataset.rulesSearch = "";
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
