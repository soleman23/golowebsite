"use client";

/**
 * Site-wide session events GA4's enhanced measurement doesn't cover: scroll
 * depth at 25/50/75/90%, internal link and contact clicks, 404s, page-speed
 * readings and uncaught script errors.
 *
 * Rendered by AnalyticsLoader only while analytics is allowed, so nothing here
 * runs for a visitor who turned analytics off or sends GPC. Every event goes
 * through track(), which drops anything not in the AnalyticsEvent union.
 * Renders nothing.
 */

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { useReportWebVitals } from "next/web-vitals";
import { GA_VALUE_MAX, track } from "@/lib/analytics";

const SCROLL_MARKS = [25, 50, 75, 90] as const;
/** Cap per page view, so one broken script can't flood the property. */
const MAX_ERRORS_PER_PAGE = 5;

/**
 * Where on the page a link sits: the site nav, the footer, or the content.
 * The nav is matched by its marker, not by <header> or <nav>: page heroes
 * are <header>s and breadcrumbs are <nav>s, and both are page content.
 */
function linkLocation(link: Element): "nav" | "footer" | "main" {
  if (link.closest("footer")) return "footer";
  if (link.closest("[data-site-nav]")) return "nav";
  return "main";
}

/** The link's visible label: site copy, never visitor input. */
function linkText(link: HTMLAnchorElement): string {
  const label = link.getAttribute("aria-label") ?? link.textContent ?? "";
  return label.replace(/\s+/g, " ").trim().slice(0, GA_VALUE_MAX);
}

type WebVitalsHandler = Parameters<typeof useReportWebVitals>[0];

/**
 * Module-level so its identity never changes: Next re-registers a new
 * callback on every render and replays metrics already collected to it,
 * which would resend them on each client-side navigation.
 *
 * Registered by AnalyticsLoader, which is always mounted, not here: Next's
 * hook adds observers on every mount and never removes them, so turning
 * analytics off and on would double every later metric. track() drops the
 * sends while analytics is off.
 */
export const reportWebVital: WebVitalsHandler = (metric) => {
  // Two numeric params so each can be a correctly typed GA4 custom metric:
  // CLS is a unitless layout-shift score (good is 0.1 or less); the rest
  // (LCP, INP, FCP, TTFB) are durations in milliseconds.
  track("web_vitals", {
    metric_name: metric.name,
    metric_rating: metric.rating,
    ...(metric.name === "CLS"
      ? { cls_score: Math.round(metric.value * 10000) / 10000 }
      : { metric_ms: Math.round(metric.value) }),
  });
};

/**
 * useSearchParams needs a Suspense boundary, or the static pages it renders
 * on would bail out of prerendering.
 */
export function SessionTracking() {
  return (
    <Suspense fallback={null}>
      <SessionTrackingInner />
    </Suspense>
  );
}

function SessionTrackingInner() {
  const pathname = usePathname();
  // The /games and /blog filters change only the query string. GA counts
  // that as a new page view, so the per-page counters reset with it.
  const search = useSearchParams().toString();

  // Scroll depth, 404s and errors are per page view: reset on navigation.
  useEffect(() => {
    if (document.querySelector("[data-not-found]")) {
      track("page_not_found", { page_path: pathname.slice(0, GA_VALUE_MAX) });
    }

    const passed = new Set<number>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      // A page that fits the screen has no depth to measure.
      if (doc.scrollHeight <= window.innerHeight) return;
      const percent = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const mark of SCROLL_MARKS) {
        if (percent >= mark && !passed.has(mark)) {
          passed.add(mark);
          track("scroll_depth", { percent_scrolled: mark });
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    let errors = 0;
    const report = (description: string) => {
      if (errors >= MAX_ERRORS_PER_PAGE) return;
      errors += 1;
      track("exception", { description: description.slice(0, GA_VALUE_MAX), fatal: false });
    };
    const onError = (event: ErrorEvent) => {
      // Extensions throw into the page too; they aren't the site's errors.
      if (/^(chrome|moz|safari|safari-web)-extension:/.test(event.filename ?? "")) return;
      report(event.message || "Unknown error");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      report(reason instanceof Error ? reason.message : String(reason));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [pathname, search]);

  // One delegated listener for every link on every page. Outbound links are
  // left to enhanced measurement's own `click` event.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const location = linkLocation(link);
      if (url.protocol === "mailto:" || url.protocol === "tel:") {
        track("contact_click", {
          method: url.protocol === "mailto:" ? "email" : "phone",
          location,
        });
        return;
      }
      if (url.host !== window.location.host) return;
      track("link_click", {
        link_url: `${url.pathname}${url.hash}`.slice(0, GA_VALUE_MAX),
        link_text: linkText(link),
        location,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
