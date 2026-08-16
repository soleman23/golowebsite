"use client";

/**
 * The chip row for /games, and the owner of the filter once JS is running.
 *
 * Deliberately not useSearchParams: on a static route that hook forces a
 * Suspense boundary, and the chips would ship as a fallback instead of as
 * markup. Reading location.search directly keeps the row in the static HTML.
 *
 * Three things stay in step — React state (for the active chip and the count),
 * <html data-filter> (which CSS filters on), and the URL. FilterBoot sets the
 * attribute before paint; from hydration on, this component does.
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { track } from "@/lib/analytics";
import styles from "./GamesGrid.module.css";

type GameFilterChipsProps = {
  items: ChipItem[];
  className?: string;
};

export function GameFilterChips({ items, className }: GameFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("all");

  // Starts at "all" so the server render and the first client render agree.
  // The real value arrives here, after hydration — the visible list is already
  // correct by then because FilterBoot set the attribute during parse.
  useEffect(() => {
    const ids = new Set(items.map((i) => i.id));

    function readUrl() {
      const raw = new URLSearchParams(window.location.search).get("filter");
      const next = raw && ids.has(raw) ? raw : "all";
      setActive(next);
      document.documentElement.dataset.filter = next;
    }

    readUrl();
    // router.push doesn't fire popstate; the back button does. This is what
    // makes walking back through filters restore both the cards and the chip.
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [items]);

  function onChange(id: string) {
    setActive(id);
    document.documentElement.dataset.filter = id;
    const href = id === "all" ? pathname : `${pathname}?filter=${id}`;
    // push, not replace: the acceptance check wants the back button to walk
    // back through filters rather than leave the page.
    router.push(href, { scroll: false });
    track("game_filter", { filter: id });
  }

  const count = items.find((i) => i.id === active)?.count ?? 0;

  return (
    <>
      <ChipFilter
        items={items}
        value={active}
        onChange={onChange}
        label="Filter games by type"
        className={className}
      />
      <span className={styles.result} aria-live="polite">
        {active === "all"
          ? `All ${count} games`
          : `${count} ${count === 1 ? "game" : "games"}`}
      </span>
    </>
  );
}
