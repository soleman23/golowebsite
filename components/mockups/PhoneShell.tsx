/**
 * Shared device frame for the marketing phone mockups: rounded frame, a
 * cover-fit background photo, and the dark scrim gradient that keeps foreground
 * text legible. Content is layered on top via children.
 *
 * The background photos are decorative (they sit under a scrim), so they're set
 * as CSS backgrounds rather than <img>/next/image; the frame carries an
 * aria-label so the mockup is announced meaningfully.
 */

import styles from "./mockups.module.css";

type PhoneShellProps = {
  bg: string; // /images/*.png
  bgPosition?: string;
  width?: number;
  height?: number;
  radius?: number;
  scrim?: string;
  label: string;
  float?: boolean;
  children: React.ReactNode;
};

export function PhoneShell({
  bg,
  bgPosition = "50% 58%",
  width = 288,
  height = 580,
  radius = 40,
  scrim = "linear-gradient(180deg, rgba(6,14,9,.7) 0%, rgba(6,14,9,.55) 30%, rgba(4,12,8,.92) 100%)",
  label,
  float = false,
  children,
}: PhoneShellProps) {
  return (
    <div
      className={`${styles.phoneOuter} ${float ? styles.float : ""}`}
      style={{ width: "min(" + width + "px, 90vw)" }}
    >
      <div
        className={styles.phone}
        style={{ width, height, borderRadius: radius }}
        role="img"
        aria-label={label}
      >
        <div
          className={styles.phoneBg}
          style={{
            backgroundImage: `url('${bg}')`,
            backgroundPosition: bgPosition,
          }}
          aria-hidden="true"
        />
        <div className={styles.phoneScrim} style={{ background: scrim }} aria-hidden="true" />
        <div className={styles.phoneContent} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
