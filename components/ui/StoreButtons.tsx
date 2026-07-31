"use client";

/**
 * App Store + Google Play download buttons. White pills with brand glyphs and
 * a two-line label. Size variant controls height (hero = 58, final CTA = 60).
 * Links come from siteConfig (env-driven), falling back to #get.
 *
 * Client component so clicks can be tracked. While the store URLs are still
 * unset, `destination_configured: false` on the event tells us how many people
 * are clicking a button that goes nowhere — that's the download-intent signal
 * ahead of launch.
 */

import { siteConfig } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";
import styles from "./StoreButtons.module.css";

function AppleGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0a0d10"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flex: "0 0 auto" }}
    >
      <path d="M16.7 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6 1.2 0 1.5.6 2.5.6 1 0 1.7-.9 2.3-1.9.7-1.1 1-2.2 1-2.3-.1 0-2-.8-2-3.1zM14.8 6.5c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1z" />
    </svg>
  );
}

function GooglePlayGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flex: "0 0 auto" }}
    >
      <path
        d="M3.6 2.3a1.5 1.5 0 0 0-.5 1.1v17.2c0 .5.2.9.5 1.1l9.1-9.7L3.6 2.3z"
        fill="#34d399"
      />
      <path d="M16.9 8.5 13 12l3.9 3.5 3.8-2.2c.9-.5.9-1.8 0-2.3l-3.8-2.5z" fill="#fbbf24" />
      <path d="M3.6 2.3 12.7 12l4.2-3.5L6.3 1.9c-1-.5-2-.3-2.7.4z" fill="#60a5fa" />
      <path d="M3.6 21.7c.7.7 1.7.9 2.7.4l10.6-6.6L12.7 12 3.6 21.7z" fill="#fb7185" />
    </svg>
  );
}

type StoreButtonsProps = {
  size?: "md" | "lg";
  align?: "start" | "center";
  className?: string;
};

export function StoreButtons({
  size = "md",
  align = "start",
  className,
}: StoreButtonsProps) {
  const external = (href: string) => href.startsWith("http");
  const onStoreClick = (store: "app_store" | "google_play", href: string) => {
    track("store_button_click", {
      store,
      placement: size === "lg" ? "final_cta" : "hero",
      destination_configured: external(href),
    });
  };
  return (
    <div
      className={`${styles.group} ${align === "center" ? styles.center : ""} ${className ?? ""}`}
    >
      <a
        href={siteConfig.appStoreUrl}
        className={`${styles.button} ${size === "lg" ? styles.lg : ""}`}
        aria-label="Download GoLo on the App Store"
        onClick={() => onStoreClick("app_store", siteConfig.appStoreUrl)}
        {...(external(siteConfig.appStoreUrl)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <AppleGlyph size={size === "lg" ? 25 : 24} />
        <span className={styles.label}>
          <span className={styles.labelTop}>Download on the</span>
          <span className={styles.labelMain}>App Store</span>
        </span>
      </a>

      <a
        href={siteConfig.googlePlayUrl}
        className={`${styles.button} ${size === "lg" ? styles.lg : ""}`}
        aria-label="Get GoLo on Google Play"
        onClick={() => onStoreClick("google_play", siteConfig.googlePlayUrl)}
        {...(external(siteConfig.googlePlayUrl)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <GooglePlayGlyph size={size === "lg" ? 23 : 22} />
        <span className={styles.label}>
          <span className={styles.labelTop}>Get it on</span>
          <span className={styles.labelMain}>Google Play</span>
        </span>
      </a>
    </div>
  );
}
