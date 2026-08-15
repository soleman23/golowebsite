"use client";

/**
 * Sticky top nav. Desktop shows the full link row + "Get the app" pill. Below
 * ~760px the links collapse into an accessible hamburger drawer (the handoff
 * explicitly asks for this on mobile), keeping the logo and CTA visible.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./Nav.module.css";

/**
 * Is `href` the section the reader is currently in?
 *
 * Matched on prefix, so /games/nassau lights up Games and /blog/who-pays-first
 * lights up Blog.
 *
 * Anchor links ("How it works" → /#how) never light up. They point at a
 * section of the home page, and knowing whether that section is on screen
 * needs a scroll-spy the nav doesn't have — so on the home page the whole row
 * stays unhighlighted rather than claiming a position it can't verify.
 */
function isCurrent(href: string, pathname: string): boolean {
  if (href.startsWith("/#") || href === "/") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // A drawer left open across a client-side navigation would cover the page it
  // just moved to, with body scroll still locked.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className={styles.nav} aria-label="Primary">
      <Logo />

      {/* Desktop links */}
      <div className={styles.desktop}>
        <ul className={styles.links}>
          {navLinks.map((link) => {
            const current = isCurrent(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.link} ${current ? styles.linkActive : ""}`}
                  aria-current={current ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/#get" className={styles.cta}>
          Get the app
        </Link>
      </div>

      {/* Mobile controls */}
      <div className={styles.mobileControls}>
        <Link href="/#get" className={styles.cta}>
          Get the app
        </Link>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerBar} ${open ? styles.barTop : ""}`} />
          <span className={`${styles.burgerBar} ${open ? styles.barMid : ""}`} />
          <span className={`${styles.burgerBar} ${open ? styles.barBot : ""}`} />
        </button>
      </div>

      {/* Drawer */}
      <div
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        hidden={!open}
      >
        <ul className={styles.drawerLinks}>
          {navLinks.map((link) => {
            const current = isCurrent(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.drawerLink} ${
                    current ? styles.drawerLinkActive : ""
                  }`}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {open ? (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <span className="sr-only" aria-hidden="true">
        {siteConfig.name}
      </span>
    </nav>
  );
}
