"use client";

/**
 * The topic chips. State lives in BlogFilterProvider, because the heading in
 * the main column reads it too.
 */

import { usePathname, useRouter } from "next/navigation";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { track } from "@/lib/analytics";
import { useBlogFilter } from "./BlogFilterProvider";

type BlogFilterChipsProps = {
  items: ChipItem[];
  className?: string;
};

export function BlogFilterChips({ items, className }: BlogFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { active, select } = useBlogFilter();

  function onChange(id: string) {
    select(id);
    const href = id === "all" ? pathname : `${pathname}?topic=${id}`;
    // push, not replace: back should walk through topics, not leave /blog.
    router.push(href, { scroll: false });
    track("blog_filter", { category: id });
  }

  return (
    <ChipFilter
      items={items}
      value={active}
      onChange={onChange}
      label="Filter posts by topic"
      className={className}
    />
  );
}
