/**
 * Shared device frame for the marketing phone mockups: rounded frame, a
 * cover-fit background photo, and the dark scrim gradient that keeps foreground
 * text legible. Content is layered on top via children.
 *
 * The background photos are decorative (they sit under a scrim), so they're set
 * as CSS backgrounds rather than <img>/next/image; the frame carries an
 * aria-label so the mockup is announced meaningfully.
 *
 * `bg` names a backdrop rather than a file path — the matching global class in
 * app/globals.css resolves it to an AVIF/WebP/PNG image-set at mockup size.
 */

import styles from "./mockups.module.css";

/** Backdrop photos available to the phone mockups. */
export type PhoneShellBackdrop = "course" | "turf";

const BACKDROP_CLASS: Record<PhoneShellBackdrop, string> = {
  course: "golo-bd-mock-course",
  turf: "golo-bd-mock-turf",
};

type PhoneShellProps = {
  bg: PhoneShellBackdrop;
  bgPosition?: string;
  width?: number;
  height?: number;
  radius?: number;
  scrim?: string;
  label: string;
  float?: boolean;
  /**
   * Inside another device frame (the /how-it-works timeline): drop this
   * shell's own bezel and fill a 288×624 screen — the 390:844 aspect of the
   * frame it sits in, at this shell's width.
   */
  framed?: boolean;
  children: React.ReactNode;
};

const FRAMED = { width: 288, height: 624 } as const;

export function PhoneShell({
  bg,
  bgPosition = "50% 58%",
  width = 288,
  height = 580,
  radius = 40,
  scrim = "linear-gradient(180deg, rgba(6,14,9,.7) 0%, rgba(6,14,9,.55) 30%, rgba(4,12,8,.92) 100%)",
  label,
  float = false,
  framed = false,
  children,
}: PhoneShellProps) {
  const size = framed
    ? { width: FRAMED.width, height: FRAMED.height, borderRadius: 0 }
    : { width, height, borderRadius: radius };
  return (
    <div
      className={`${styles.phoneOuter} ${float ? styles.float : ""}`}
      style={{ width: "min(" + width + "px, 90vw)" }}
    >
      <div
        className={`${styles.phone} ${framed ? styles.phoneFramed : ""}`}
        style={size}
        role="img"
        aria-label={label}
      >
        <div
          className={`${styles.phoneBg} ${BACKDROP_CLASS[bg]}`}
          style={{ backgroundPosition: bgPosition }}
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
