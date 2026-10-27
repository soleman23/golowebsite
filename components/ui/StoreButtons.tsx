"use client";

/**
 * The download row: Google Play and App Store pills with brand glyphs and a
 * two-line label, then a line pointing iPhone owners at the web app. Size
 * variant controls height (hero = 58, final CTA = 60).
 *
 * Google Play is live, so it always links to the listing (in code, in
 * lib/siteConfig.ts). The App Store app isn't out: until siteConfig.iosLive
 * is true its slot is a plain "Coming soon to the App Store" tile — not a
 * link, not a badge — and the web-app line is the iPhone path that works
 * today. When iosLive flips, the tile becomes the App Store link and the
 * web-app line goes.
 *
 * `destination_configured: false` on store_button_click means a store link
 * fell back to "#get": a misconfiguration worth alerting on.
 *
 * claim-ok-file: the App Store link and its "Download on the" label render
 * only once siteConfig.iosLive is set.
 */

import { siteConfig } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";
import { storeButtonsCopy as copy } from "@/lib/content/nav";
import styles from "./StoreButtons.module.css";

function AppleGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
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
  const placement = size === "lg" ? "final_cta" : "hero";
  const external = (href: string) => href.startsWith("http");
  const onStoreClick = (store: "app_store" | "google_play", href: string) => {
    track("store_button_click", {
      store,
      placement,
      destination_configured: external(href),
    });
  };
  const buttonClass = `${styles.button} ${size === "lg" ? styles.lg : ""}`;
  const appStoreLink = (
    <a
      href={siteConfig.appStoreUrl}
      className={buttonClass}
      aria-label={copy.appStore.label}
      onClick={() => onStoreClick("app_store", siteConfig.appStoreUrl)}
      {...(external(siteConfig.appStoreUrl)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <AppleGlyph size={size === "lg" ? 25 : 24} />
      <span className={styles.label}>
        <span className={styles.labelTop}>{copy.appStore.top}</span>
        <span className={styles.labelMain}>{copy.appStore.main}</span>
      </span>
    </a>
  );
  return (
    <div className={`${styles.row} ${align === "center" ? styles.rowCenter : ""} ${className ?? ""}`}>
      <div className={`${styles.group} ${align === "center" ? styles.center : ""}`}>
        {/* The live store first: until the App Store app is out, its
            "coming soon" tile follows Google Play, so on a phone, where the
            two stack, the button that works is the one on top. */}
        {siteConfig.iosLive ? appStoreLink : null}
        <a
          href={siteConfig.googlePlayUrl}
          className={buttonClass}
          aria-label={copy.googlePlay.label}
          onClick={() => onStoreClick("google_play", siteConfig.googlePlayUrl)}
          {...(external(siteConfig.googlePlayUrl)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <GooglePlayGlyph size={size === "lg" ? 23 : 22} />
          <span className={styles.label}>
            <span className={styles.labelTop}>{copy.googlePlay.top}</span>
            <span className={styles.labelMain}>{copy.googlePlay.main}</span>
          </span>
        </a>
        {siteConfig.iosLive ? null : (
          <div className={`${buttonClass} ${styles.soon}`}>
            <AppleGlyph size={size === "lg" ? 25 : 24} />
            <span className={styles.label}>
              <span className={styles.labelTop}>{copy.appStoreSoon.top}</span>
              <span className={styles.labelMain}>{copy.appStoreSoon.main}</span>
            </span>
          </div>
        )}
      </div>

      {siteConfig.iosLive ? null : (
        <p className={styles.webApp}>
          {copy.webApp.lead}{" "}
          <a
            href={siteConfig.webAppUrl}
            className={styles.webAppLink}
            aria-label={copy.webApp.label}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_click", { page: placement, cta: "web_app" })}
          >
            {copy.webApp.link} →
          </a>
        </p>
      )}
    </div>
  );
}
