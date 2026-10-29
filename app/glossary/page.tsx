import { notFound } from "next/navigation";
import {
  glossaryDirectoryCopy,
  glossaryHero,
  glossaryLetterGroups,
  glossaryRelatedGuides,
  glossaryRouteVisible,
  glossaryStartHere,
  hubGlossaryTerms,
} from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { KeepReading } from "@/components/sections/faq/KeepReading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { GlossaryAlphabet } from "@/components/sections/glossary/GlossaryAlphabet";
import { GlossaryDirectory } from "@/components/sections/glossary/GlossaryDirectory";
import styles from "./glossary.module.css";

/**
 * The glossary hub (#156; docs/glossary/ux.md). Server-rendered: every shown
 * term, its definition and its links are in the HTML, and JavaScript only
 * adds search and filtering (#157).
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

  return (
    <>
      <PageHero
        {...glossaryHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
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
            <GlossaryDirectory groups={groups} byId={byId} />
          </section>
        </div>
      </div>

      <KeepReading
        items={glossaryRelatedGuides.items}
        heading={glossaryRelatedGuides.title}
        headingId="glossary-keep-reading-heading"
      />

      <FinalCTA page="glossary" />
    </>
  );
}
