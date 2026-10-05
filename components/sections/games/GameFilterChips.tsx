"use client";

/**
 * The chip row for /games, and the owner of the filter once JS is running.
 *
 * Before hydration the page is static HTML and can't know ?filter=. FilterBoot
 * sets <html data-filter> during parse, and GamesGrid.module.css uses it to
 * hide cards, light the matching chip and show the matching result line —
 * every result line ships, the non-default ones `hidden` (so anything reading
 * the HTML without CSS sees one line), and CSS reveals the match. So `active` starts null: the server
 * HTML marks no chip current rather than claiming "All".
 *
 * After hydration three things stay in step: React state (aria-current and
 * the announcement), <html data-filter>, and the URL. FilterUrlSync re-reads
 * the URL on every navigation; a chip click applies its filter immediately
 * and then pushes the URL.
 */

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { FilterStatus } from "@/components/ui/FilterStatus";
import { FilterUrlSync, useInitialFilter } from "@/components/ui/FilterUrlSync";
import { track } from "@/lib/analytics";
import styles from "./GamesGrid.module.css";

type GameFilterChipsProps = {
  items: ChipItem[];
};

function resultLine(item: ChipItem): string {
  const count = item.count ?? 0;
  return item.id === "all"
    ? `All ${count} games`
    : `${count} ${count === 1 ? "game" : "games"}`;
}

export function GameFilterChips({ items }: GameFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const messages = useMemo(
    () =>
      Object.fromEntries(
        items.map((i) => [
          i.id,
          i.id === "all" ? resultLine(i) : `${i.label}: ${resultLine(i)}`,
        ]),
      ),
    [items],
  );

  const apply = useCallback((id: string) => {
    setActive(id);
    document.documentElement.dataset.filter = id;
  }, []);

  useInitialFilter("filter", ids, apply);

  function onChange(id: string) {
    apply(id);
    const href = id === "all" ? pathname : `${pathname}?filter=${id}`;
    // push, not replace: the acceptance check wants the back button to walk
    // back through filters rather than leave the page.
    router.push(href, { scroll: false });
    track("game_filter", { filter: id });
  }

  return (
    <>
      <Suspense fallback={null}>
        <FilterUrlSync param="filter" ids={ids} onSync={apply} />
      </Suspense>
      <ChipFilter
        items={items}
        value={active}
        onChange={onChange}
        label="Filter games by type"
        className={styles.chips}
      />
      <span className={styles.result}>
        {items.map((item) => (
          <span key={item.id} data-for={item.id} hidden={item.id !== "all"}>
            {resultLine(item)}
          </span>
        ))}
      </span>
      <FilterStatus active={active} messages={messages} />
    </>
  );
}
