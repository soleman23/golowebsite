"use client";

/**
 * A CTA link that reports the click. Both params are categorical — the page it
 * fired on and which button it was — never anything identifying.
 */

import Link from "next/link";
import { track } from "@/lib/analytics";

type TrackedCtaProps = {
  href: string;
  page: string;
  /** Short slug: "get_app", "browse_games", "ask_us". */
  cta: string;
  className?: string;
  children: React.ReactNode;
};

export function TrackedCta({
  href,
  page,
  cta,
  className,
  children,
}: TrackedCtaProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("cta_click", { page, cta })}
    >
      {children}
    </Link>
  );
}
