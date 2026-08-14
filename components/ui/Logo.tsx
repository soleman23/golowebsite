/**
 * GoLo brand mark + wordmark. The mark is a lime "G" arc, a white golf ball,
 * and a lime flagstick with a white pennant. Traced from the design handoff
 * (viewBox 0 0 120 124).
 */

import Link from "next/link";
import styles from "./Logo.module.css";

type LogoProps = {
  /** Tile + wordmark size. Nav = 38, footer = 36. */
  tileSize?: number;
  markSize?: number;
  wordSize?: number;
  glow?: boolean;
  href?: string;
};

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 124"
      fill="none"
      style={{ display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M56 20 A40 40 0 1 0 95.8 64"
        stroke="var(--accent)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <line
        x1="95.8"
        y1="64"
        x2="64"
        y2="64"
        stroke="var(--accent)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="56" cy="58" r="15" fill="#fff" />
      <circle
        cx="56"
        cy="58"
        r="9"
        fill="none"
        stroke="rgba(10,36,24,0.28)"
        strokeWidth="2.4"
      />
      <line x1="56" y1="44" x2="56" y2="14" stroke="var(--accent)" strokeWidth="3.4" />
      <path d="M56 14 L86 22 L56 34 Z" fill="#fff" />
    </svg>
  );
}

export function Logo({
  tileSize = 38,
  markSize = 28,
  wordSize = 21,
  glow = true,
  href = "/#top",
}: LogoProps) {
  return (
    <Link href={href} className={styles.lockup} aria-label="GoLo — home">
      <span
        className={styles.tile}
        style={{
          width: tileSize,
          height: tileSize,
          boxShadow: glow ? "0 8px 22px rgba(212,242,58,.3)" : "none",
        }}
      >
        <LogoMark size={markSize} />
      </span>
      <span className={styles.word} style={{ fontSize: wordSize }} aria-hidden="true">
        <span className={styles.wordGo}>Go</span>
        <span className={styles.wordLo}>Lo</span>
      </span>
    </Link>
  );
}
