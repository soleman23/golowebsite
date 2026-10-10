/**
 * The top of every page: breadcrumb, kicker, the page's single <h1>, lead,
 * CTA row, status pills, an optional visual beside the copy and an optional
 * photo behind it.
 *
 * Stays a server component. The CTA row renders TrackedCta, which is a client
 * leaf of its own — importing it here doesn't pull the shell across the
 * boundary, so the hero copy and the H1 still ship as static HTML.
 */

import { preload } from "react-dom";
import { heroPhotos, type HeroPhotoKey } from "@/lib/content";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { StatusPill, type StatusVariant } from "./StatusPill";
import { TrackedCta } from "./TrackedCta";
import styles from "./PageHero.module.css";

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  /**
   * Short slug for the cta_click param — "get_app", "browse_games", "ask_us".
   * Defaults from the href so an untagged CTA still reports something useful.
   */
  cta?: string;
};

type PageHeroBase = {
  kicker: string;
  title: string;
  /** Second line of the H1, broken onto its own line and set in the accent. */
  titleAccentLine?: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  status?: { variant: StatusVariant; label: string };
  /** Small text row under the CTAs — availability notes, read time, dates. */
  meta?: React.ReactNode;
  visual?: React.ReactNode;
  /** Decorative photo behind the copy — see lib/content/heroPhotos. */
  photo?: HeroPhotoKey;
};

/**
 * `page` names the page in the cta_click param, and it's only meaningful when
 * there are CTAs to click — so the two travel together rather than `page`
 * being an optional with a placeholder default. A hero that adds CTAs and
 * forgets `page` is a type error, not an analytics report full of "page".
 */
type PageHeroProps = PageHeroBase &
  (
    | { ctas: HeroCta[]; page: string }
    | { ctas?: undefined; page?: undefined }
  );

/** "/games" → "games", "/#get" → "get", "/" → "home". */
function ctaSlug(href: string): string {
  const cleaned = href.replace(/^\/#?/, "").replace(/[#?].*$/, "");
  return cleaned === "" ? "home" : cleaned.replace(/\//g, "_");
}

/*
 * Kept in step with scripts/generate-hero-images.mjs, which writes these
 * widths from 2688x1152 and 1792x2240 sources.
 */
const PHOTO_SET = {
  desktop: { widths: [1280, 1920, 2560], width: 2688, height: 1152 },
  mobile: { widths: [480, 768, 1080], width: 1792, height: 2240 },
} as const;
/* Matches the art-direction switch in PageHero.module.css. DESKTOP is the
   exact complement, so a fractional width (767.5px when zoomed) still gets a
   preload rather than falling between the two. */
const PHONE = "(max-width: 767px)";
const DESKTOP = "not all and (max-width: 767px)";

function srcSet(key: HeroPhotoKey, variant: keyof typeof PHOTO_SET, ext: string) {
  return PHOTO_SET[variant].widths
    .map((w) => `/images/heroes/${key}-${variant}-${w}.${ext} ${w}w`)
    .join(", ");
}

/**
 * The photo is the page's LCP element, so it loads eagerly at high priority,
 * and each frame is preloaded under the same media query its <source> uses.
 * preload() rather than a rendered <link>: React puts it in <head>, where the
 * browser finds it before any CSS, while a <link> stays where it's rendered.
 * Only the AVIF is preloaded: every browser in the browserslist decodes it,
 * so it's the one the <picture> will pick.
 *
 * It's decoration — the H1 already says what the page is — so it's hidden
 * from assistive tech. It sits absolutely inside the hero and never sizes it,
 * which is what keeps it from shifting layout when it arrives.
 */
function HeroPhotoLayer({ photoKey }: { photoKey: HeroPhotoKey }) {
  const mobile = srcSet(photoKey, "mobile", "avif");
  const desktop = srcSet(photoKey, "desktop", "avif");
  for (const [media, variant, set] of [
    [PHONE, "mobile", mobile],
    [DESKTOP, "desktop", desktop],
  ] as const) {
    preload(`/images/heroes/${photoKey}-${variant}-${PHOTO_SET[variant].widths[1]}.avif`, {
      as: "image",
      type: "image/avif",
      media,
      imageSrcSet: set,
      imageSizes: "100vw",
      fetchPriority: "high",
    });
  }
  return (
    <>
      <picture>
        <source
          media={PHONE}
          type="image/avif"
          srcSet={mobile}
          sizes="100vw"
          width={PHOTO_SET.mobile.width}
          height={PHOTO_SET.mobile.height}
        />
        <source
          media={PHONE}
          type="image/webp"
          srcSet={srcSet(photoKey, "mobile", "webp")}
          sizes="100vw"
          width={PHOTO_SET.mobile.width}
          height={PHOTO_SET.mobile.height}
        />
        <source type="image/avif" srcSet={desktop} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed
            <picture> over pre-built files; next/image can't switch frames */}
        <img
          className={styles.photo}
          src={`/images/heroes/${photoKey}-desktop-1920.webp`}
          srcSet={srcSet(photoKey, "desktop", "webp")}
          sizes="100vw"
          width={PHOTO_SET.desktop.width}
          height={PHOTO_SET.desktop.height}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
      </picture>
      <div className={styles.scrim} aria-hidden="true" />
    </>
  );
}

export function PageHero({
  kicker,
  title,
  titleAccentLine,
  lead,
  breadcrumbs,
  status,
  ctas,
  page,
  meta,
  visual,
  photo,
}: PageHeroProps) {
  return (
    <header
      className={`${styles.hero} ${photo ? styles.withPhoto : ""}`}
      data-photo={photo}
      style={
        photo
          ? ({
              "--hero-subject": heroPhotos[photo].mobileSubject,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* A photo bakes its own glow into the same corner. Stacked, the CSS
          one only hazed it (+45-70% mean brightness there at 1280px) and at
          wide phone widths pulled the meta chips under AA, so it's one or
          the other. */}
      {photo ? (
        <HeroPhotoLayer photoKey={photo} />
      ) : (
        <div className={styles.glow} aria-hidden="true" />
      )}
      <div className={`${styles.inner} ${visual ? styles.withVisual : ""}`}>
        <div className={styles.copy}>
          {breadcrumbs?.length ? (
            <Breadcrumbs items={breadcrumbs} className={styles.crumbs} />
          ) : null}

          <div className={styles.kickerRow}>
            <p className={styles.kicker}>{kicker}</p>
            {status ? (
              <StatusPill variant={status.variant} label={status.label} />
            ) : null}
          </div>

          <h1 className={styles.title}>
            {title}
            {titleAccentLine ? (
              <>
                <br />
                <span className={styles.titleAccent}>{titleAccentLine}</span>
              </>
            ) : null}
          </h1>

          {lead ? <p className={styles.lead}>{lead}</p> : null}

          {ctas?.length && page ? (
            <div className={styles.ctaRow}>
              {ctas.map((cta) => (
                <TrackedCta
                  key={cta.href + cta.label}
                  href={cta.href}
                  page={page}
                  cta={cta.cta ?? ctaSlug(cta.href)}
                  className={`${styles.cta} ${
                    cta.variant === "primary" ? styles.primary : styles.ghost
                  }`}
                >
                  {cta.label}
                </TrackedCta>
              ))}
            </div>
          ) : null}

          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </div>

        {visual ? <div className={styles.visual}>{visual}</div> : null}
      </div>
    </header>
  );
}
