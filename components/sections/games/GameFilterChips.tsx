"use client";

/**
 * The chip row for /games. Deliberately thin: the active filter arrives as a
 * prop from the server, so this never calls useSearchParams — that would make
 * Next prerender the Suspense fallback instead of the grid, and ship a games
 * page with no games in the HTML.
 *
 * Clicking a chip pushes the filter into the URL; the server re-renders the
 * filtered grid, so deep links and back/forward work without any client state.
 */

import { usePathname, useRouter } from "next/navigation";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { track } from "@/lib/analytics";

type GameFilterChipsProps = {
  items: ChipItem[];
  value: string;
  className?: string;
};

export function GameFilterChips({
  items,
  value,
  className,
}: GameFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(id: string) {
    const href = id === "all" ? pathname : `${pathname}?filter=${id}`;
    // push, not replace: the acceptance check wants the back button to walk
    // back through filters rather than leave the page.
    router.push(href, { scroll: false });
    track("game_filter", { filter: id });
  }

  return (
    <ChipFilter
      items={items}
      value={value}
      onChange={onChange}
      label="Filter games by type"
      className={className}
    />
  );
}
