"use client";

/**
 * The topic chips. Same deal as GameFilterChips on /games: the active topic
 * arrives as a prop resolved on the server, so this never calls
 * useSearchParams — that would have Next prerender a Suspense fallback and
 * ship a blog index with no posts in the HTML.
 */

import { usePathname, useRouter } from "next/navigation";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { track } from "@/lib/analytics";

type BlogFilterChipsProps = {
  items: ChipItem[];
  value: string;
  className?: string;
};

export function BlogFilterChips({
  items,
  value,
  className,
}: BlogFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(id: string) {
    const href = id === "all" ? pathname : `${pathname}?topic=${id}`;
    // push, not replace: back should walk through topics, not leave /blog.
    router.push(href, { scroll: false });
    track("blog_filter", { category: id });
  }

  return (
    <ChipFilter
      items={items}
      value={value}
      onChange={onChange}
      label="Filter posts by topic"
      className={className}
    />
  );
}
