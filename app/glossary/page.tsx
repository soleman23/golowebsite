import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  glossaryCategories,
  glossaryCategoryIds,
  glossaryControlsCopy,
  glossaryDirectoryCopy,
  glossaryFinalCta,
  glossaryHero,
  glossarySearchEntries,
  glossaryTermCount,
  glossaryLetterGroups,
  glossaryLive,
  glossaryRelatedGuides,
  glossarySchemaName,
  publishedGlossaryTerms,
  glossaryRouteVisible,
  glossaryStartHere,
  heroOgImage,
  hubGlossaryTerms,
} from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { glossaryTermSetNode, organizationSummary, websiteNode } from "@/lib/schema";
import { siteConfig } from "@/lib/siteConfig";
import { JsonLd } from "@/components/ui/JsonLd";
import { FilterBoot } from "@/components/ui/FilterBoot";
import { PageHero } from "@/components/ui/PageHero";
import { KeepReading } from "@/components/sections/faq/KeepReading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { GlossaryAlphabet } from "@/components/sections/glossary/GlossaryAlphabet";
import { GlossaryDirectory } from "@/components/sections/glossary/GlossaryDirectory";
import { GlossaryProvider } from "@/components/sections/glossary/GlossaryProvider";
import { GlossarySearchField } from "@/components/sections/glossary/GlossarySearchField";
import { GlossaryControls } from "@/components/sections/glossary/GlossaryControls";
import { CopyLinkButton } from "@/components/sections/glossary/CopyLinkButton";
import styles from "./glossary.module.css";

/**
 * Self-canonical to /glossary, with or without ?category= (spec §7.3, #163).
 * The title template adds " · GoLo", as on every page; no "150+" until that
 * many terms are public. The share card is the hero photo's (#171).
 */
export const metadata: Metadata = pageMetadata({
  path: "/glossary",
  title: "Golf Glossary: Terms, Slang & Games Explained",
  description:
    "Learn golf terms, scoring rules, handicaps, slang and side games with clear definitions and real examples from GoLo Golf.",
  image: heroOgImage("glossary"),
});

/**
 * The glossary hub (#156; docs/glossary/ux.md). Server-rendered: every shown
 * term, its definition and its links are in the HTML, and JavaScript only
 * adds search and filtering (#157): a client provider holds the category
 * (?category=, through FilterBoot/FilterUrlSync like /blog) and the search
 * text (never in the URL), and handles #slug deep links.
 *
 * While lib/content/glossary/launch.ts says the glossary isn't live, a
 * production build (Hostinger, including PR previews) serves a 404 here. Only
 * `next dev` renders it, with approved terms marked Not published, so the
 * owner can review before the launch PR (#166). Metadata, schema and the
 * sitemap entry come with #163; the photo with #171.
 */
export default function GlossaryPage() {
  if (!glossaryRouteVisible()) notFound();

  const terms = hubGlossaryTerms();
  const byId = new Map(terms.map((t) => [t.id, t]));
  const groups = glossaryLetterGroups(terms);
  const startHere = glossaryStartHere.ids
    .map((id) => byId.get(id))
    .filter((t) => t !== undefined);
  const review = terms.some((t) => t.unpublished);

  // Structured data describes published terms only, never the local-review
  // selection, and only once the glossary is live.
  const published = glossaryLive ? publishedGlossaryTerms() : [];
  const jsonLd = published.length
    ? {
        "@context": "https://schema.org",
        "@graph": [
          glossaryTermSetNode(published, {
            name: glossarySchemaName,
            description: String(metadata.description),
          }),
          organizationSummary(),
          websiteNode(),
        ],
      }
    : null;

  const filterIds = ["all", ...glossaryCategoryIds];
  const chips = [
    { id: "all", label: glossaryControlsCopy.allChip, count: terms.length },
    ...glossaryCategories.map((c) => ({
      id: c.id,
      label: c.chip,
      count: terms.filter((t) => t.primaryCategory === c.id).length,
    })),
  ];
  const counts = Object.fromEntries(
    chips.map((c) => [
      c.id,
      c.id === "all"
        ? glossaryTermCount(c.count)
        : `${glossaryTermCount(c.count)} in ${glossaryCategories.find((g) => g.id === c.id)?.label}`,
    ]),
  );
  const categoryLabels = Object.fromEntries(glossaryCategories.map((c) => [c.id, c.label]));
  const copyLabels = {
    copy: glossaryControlsCopy.copy,
    copied: glossaryControlsCopy.copied,
    failed: glossaryControlsCopy.copyFailed,
  };

  return (
    <GlossaryProvider ids={filterIds}>
      <FilterBoot param="category" ids={filterIds} />
      {/* Search and copy buttons can't work without JavaScript; hide them
          rather than ship dead controls (docs/glossary/ux.md D8). */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>[data-requires-js]{display:none}</style>" }}
      />

      <PageHero
        {...glossaryHero}
        photo="glossary"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
        search={
          <GlossarySearchField
            label={glossaryControlsCopy.searchLabel}
            placeholder={glossaryControlsCopy.searchPlaceholder.replace(
              "{n}",
              String(terms.length),
            )}
          />
        }
      />

      <GlossaryControls
        chips={chips}
        counts={counts}
        categoryLabels={categoryLabels}
        entries={glossarySearchEntries(terms)}
        copy={glossaryControlsCopy}
      />

      <div className={styles.page}>
        {review ? (
          <p className={styles.reviewBanner} role="note">
            {glossaryDirectoryCopy.reviewBanner}
          </p>
        ) : null}

        <div className={styles.layout}>
          {startHere.length ? (
            <section className={styles.startHere} aria-labelledby="start-here-heading">
              <h2 id="start-here-heading" className={styles.sectionLabel}>
                {glossaryStartHere.title}
              </h2>
              <ul className={styles.startList}>
                {startHere.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.slug}`}>{t.term}</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className={styles.browse} aria-labelledby="browse-heading">
            <h2 id="browse-heading" className={styles.sectionTitle}>
              {glossaryDirectoryCopy.title}
            </h2>
            <GlossaryAlphabet groups={groups} />
            <GlossaryDirectory
              groups={groups}
              byId={byId}
              actions={(t) => (
                <CopyLinkButton
                  url={`${siteConfig.url}/glossary#${t.slug}`}
                  termId={t.id}
                  term={t.term}
                  labels={copyLabels}
                />
              )}
            />
          </section>
        </div>
      </div>

      <KeepReading
        items={glossaryRelatedGuides.items}
        heading={glossaryRelatedGuides.title}
        headingId="glossary-keep-reading-heading"
      />

      <FinalCTA page="glossary" {...glossaryFinalCta} />

      {jsonLd ? <JsonLd data={jsonLd} /> : null}
    </GlossaryProvider>
  );
}
