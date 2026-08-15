/**
 * Single-path inline SVG icons. Paths traced from the design handoff's ICONS
 * map. All icons are viewBox="0 0 24 24", fill="currentColor" — set color via
 * the `color` prop or a parent's `color` CSS.
 *
 * Decorative by default (aria-hidden). Pass a `title` to make one meaningful
 * to assistive tech.
 */

export const ICON_PATHS = {
  target:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  trophy:
    "M6 3h12v2h3a1 1 0 0 1 1 1c0 2.9-1.9 5.2-4.6 5.8A6.5 6.5 0 0 1 13 15.8V18h3a1 1 0 0 1 1 1v2H7v-2a1 1 0 0 1 1-1h3v-2.2a6.5 6.5 0 0 1-4.4-3.9C3.9 11.2 2 8.9 2 6a1 1 0 0 1 1-1h3V3zM6 7H4.2c.3 1.4 1.1 2.4 2.1 2.9A8.6 8.6 0 0 1 6 8V7zm12 0v1c0 .6 0 1.2-.2 1.8 1-.5 1.7-1.4 2-2.8H18z",
  cash: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  pin: "M12 2a7 7 0 0 0-7 7c0 4.8 5.6 11.4 6.3 12.2a.9.9 0 0 0 1.4 0C13.4 20.4 19 13.8 19 9a7 7 0 0 0-7-7zm0 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z",
  drive:
    "M14 3h6.2a.8.8 0 0 1 .8.8V10a1 1 0 0 1-1.7.7l-1.8-1.8-7.7 7.7a1.4 1.4 0 0 1-2-2l7.7-7.7-1.8-1.8A1 1 0 0 1 14 3z",
  bird: "M3 13a7 7 0 0 1 7-7c2.6 0 4.9 1.4 6.1 3.5l3.5-.5a.8.8 0 0 1 .7 1.3l-2.1 2.5C18 16.1 14.9 19 11 19c-1 0-1.9-.2-2.8-.5L5 21l1.3-4.4A7 7 0 0 1 3 13zm10.5-3.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  flame:
    "M12 2c3 3 5 6 5 9.5a5 5 0 0 1-10 0c0-1.7.6-3.1 1.7-4.2-.1 1.5.6 2.4 1.4 2.7C11.6 8.4 12.5 5.7 12 2z",
  swap: "M3 8.5a1 1 0 0 1 1-1h12.1l-1.8-1.8a1 1 0 1 1 1.4-1.4l3.5 3.5a1 1 0 0 1 0 1.4l-3.5 3.5a1 1 0 0 1-1.4-1.4l1.8-1.8H4a1 1 0 0 1-1-1zM21 15.5a1 1 0 0 1-1 1H7.9l1.8 1.8a1 1 0 1 1-1.4 1.4l-3.5-3.5a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 0 1 1.4 1.4l-1.8 1.8H20a1 1 0 0 1 1 1z",
  card: "M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5zM7 7.5h10v2H7v-2zm0 4h10v2H7v-2zm0 4h6.5v2H7v-2z",
  crown:
    "M3 8.5a1.3 1.3 0 0 1 2.1-1l3.2 2.2 2.6-4.8a1.3 1.3 0 0 1 2.2 0l2.6 4.8 3.2-2.2a1.3 1.3 0 0 1 2.1 1L19.6 17a1 1 0 0 1-1 .8H5.4a1 1 0 0 1-1-.8L3 8.5zM5 19.5h14V21H5z",
  dice: "M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5zM8 7a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 8 7zm8 0a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 16 7zm-4 3.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM8 14.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zm8 0a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z",
  wolf: "M4 4l3.5 2L9 3l3 3 3-3 1.5 3L20 4l-1 7.5c-.5 4-3.4 6.5-7 6.5s-6.5-2.5-7-6.5L4 4zm5 7.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm6 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm-3 2.8c-1 0-1.8.4-1.8 1 0 .5.8 1.2 1.8 1.2s1.8-.7 1.8-1.2c0-.6-.8-1-1.8-1z",
  // Bolt — a press fires a fresh bet mid-nine.
  press: "M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z",
  stack: "M12 2l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5v2.5l-9 5-9-5V11z",
  auto: "M12 4V1L8 5l4 4V6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z",
  grid: "M3.5 3.5h7v7h-7v-7zm10 0h7v7h-7v-7zm-10 10h7v7h-7v-7zm10 0h7v7h-7v-7z",
  clock:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6zM11 6.5h2v6.1l4 2.4-1 1.7-5-3V6.5z",
  shield:
    "M12 2.2l8 3v5.6c0 4.9-3.3 9.4-8 11-4.7-1.6-8-6.1-8-11V5.2l8-3zm-1.2 12.6 5.3-5.4-1.6-1.6-3.7 3.8-1.9-1.9-1.6 1.6 3.5 3.5z",
  chat: "M4 3.5h16A1.5 1.5 0 0 1 21.5 5v10a1.5 1.5 0 0 1-1.5 1.5H9.2l-4.3 3.9a.8.8 0 0 1-1.4-.6V5A1.5 1.5 0 0 1 4 3.5z",
  share:
    "M18 2a3.2 3.2 0 0 0-3 4.4L9.7 9.5a3.2 3.2 0 1 0 0 5l5.3 3.1A3.2 3.2 0 1 0 16.5 16l-5.4-3.1a3.2 3.2 0 0 0 0-1.8L16.5 8A3.2 3.2 0 1 0 18 2z",
  mail: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v.3l-9 5.4-9-5.4v-.3zm0 2.6 8.6 5.1a.8.8 0 0 0 .8 0L21 9.1v8.4a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V9.1z",
  instagram:
    "M8 2.5h8A5.5 5.5 0 0 1 21.5 8v8a5.5 5.5 0 0 1-5.5 5.5H8A5.5 5.5 0 0 1 2.5 16V8A5.5 5.5 0 0 1 8 2.5zm0 2.2A3.3 3.3 0 0 0 4.7 8v8A3.3 3.3 0 0 0 8 19.3h8a3.3 3.3 0 0 0 3.3-3.3V8A3.3 3.3 0 0 0 16 4.7H8zm4 2.6a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 2.2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.2-3a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z",
  arrowRight:
    "M13.1 4.3a1.3 1.3 0 0 1 1.8 0l6.7 6.8a1.3 1.3 0 0 1 0 1.8l-6.7 6.8a1.3 1.3 0 0 1-1.8-1.8l4.5-4.6H3.3a1.3 1.3 0 0 1 0-2.6h14.3l-4.5-4.6a1.3 1.3 0 0 1 0-1.8z",
  warn: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6zM10.9 6.6h2.2v7.2h-2.2V6.6zm0 8.9h2.2v2.2h-2.2v-2.2z",
  star: "M12 2.6l3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2-6 3.2 1.1-6.7L2.3 9.7l6.7-1 3-6.1z",
} as const;

export type IconName = keyof typeof ICON_PATHS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  /** When provided, the icon is announced to assistive tech with this label. */
  title?: string;
  className?: string;
};

export function Icon({ name, size = 22, color, title, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color ?? "currentColor"}
      className={className}
      style={{ display: "block", flex: "0 0 auto" }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/** Rose circled-warning — the counterweight to CheckIcon in advice lists. */
export function WarnIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "block", flex: "0 0 auto" }}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="rgba(251,113,133,.16)"
        stroke="rgba(251,113,133,.5)"
        strokeWidth="1.4"
      />
      <path
        d="M12 7v6M12 16.5v.5"
        stroke="var(--negative)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Lime circled-check used in feature checklists. */
export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "block", flex: "0 0 auto" }}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="var(--accent-16)"
        stroke="var(--accent-50)"
        strokeWidth="1.4"
      />
      <path
        d="M7.5 12.4l3 3 6-6.4"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
