import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hubRules,
  publishedGlossaryTerms,
  rulesDirectoryCopy,
  rulesFinalCta,
  rulesHero,
  rulesReviewCopy,
  rulesRouteVisible,
  rulesSituationsCopy,
} from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EditionNotice } from "@/components/sections/rules/EditionNotice";
import { OfficialSourcesPanel } from "@/components/sections/rules/OfficialSourcesPanel";
import { QuickSituations } from "@/components/sections/rules/QuickSituations";
import { RelatedResources } from "@/components/sections/rules/RelatedResources";
import { RuleDirectory } from "@/components/sections/rules/RuleDirectory";
import { RuleNumberGrid } from "@/components/sections/rules/RuleNumberGrid";
import type { GlossaryLinkTarget } from "@/components/sections/rules/RulesEntry";
import { ScenarioAnswer } from "@/components/sections/rules/ScenarioAnswer";
import styles from "./rules.module.css";

/**
 * Spec §9's title, trimmed so it fits with the template's " · GoLo"
 * (Amendment A14). Self-canonical to /rules with or without ?category=.
 * Schema, the sitemap entry and llms.txt come with #243; the photo with
 * #235.
 *
 * A function rather than a `metadata` export: a static export is resolved
 * even when the page calls notFound(), and the 404's payload would carry
 * this title and canonical before launch.
 */
export function generateMetadata(): Metadata {
  if (!rulesRouteVisible()) return {};
  return pageMetadata({
    path: "/rules",
    title: "Golf Rules Explained: Penalties, Relief & Questions",
    description:
      "Plain answers for a lost ball, out of bounds, penalty areas, cart paths and bunkers, plus all 25 Rules of Golf summarised, with the official text linked.",
  });
}

/**
 * The Rules Center hub (#234; docs/rules/ux.md). Server-rendered: every
 * answer, overview and link is in the HTML and readable without JavaScript,
 * and nothing is collapsed (D2). Search, topic chips and deep-link handling
 * come with #236 as client leaves around this; the entries already carry
 * the stable ids and data-category they'll use.
 *
 * While lib/content/rules/launch.ts says the Rules Center isn't live, a
 * production build (Hostinger, including PR previews) serves a 404 here.
 * Only `next dev` renders it, with approved records marked Not published,
 * so the owner can review before the launch PR (#247).
 */
export default function RulesPage() {
  if (!rulesRouteVisible()) notFound();

  const { overviews, scenarios } = hubRules();
  const review = [...overviews, ...scenarios].some((r) => r.unpublished);
  const empty = !overviews.length && !scenarios.length;

  const rulesByNumber = new Map(overviews.map((r) => [r.number, r]));
  const scenariosById = new Map(scenarios.map((s) => [s.id, s]));
  // Published terms only: an entry never links to a glossary term that
  // production doesn't serve.
  const glossary = new Map<string, GlossaryLinkTarget>(
    publishedGlossaryTerms().map((t) => [t.slug, { slug: t.slug, term: t.term }]),
  );

  return (
    <>
      {/* The copy-link buttons (and #236's search and chips) can't work
          without JavaScript; hide them rather than ship dead controls. */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>[data-requires-js]{display:none}</style>" }}
      />

      <PageHero
        {...rulesHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Golf rules" }]}
      />

      <div className={styles.page}>
        {review || empty ? (
          <p className={styles.reviewBanner} role="note">
            {empty ? rulesReviewCopy.empty : rulesReviewCopy.banner}
          </p>
        ) : null}

        <EditionNotice />

        <QuickSituations scenarios={scenarios} />

        {scenarios.length ? (
          <section id="situations" className={styles.section} aria-labelledby="situations-heading">
            <h2 id="situations-heading" className={styles.sectionTitle}>
              {rulesSituationsCopy.title}
            </h2>
            <p className={styles.intro}>{rulesSituationsCopy.intro}</p>
            {scenarios.map((s) => (
              <ScenarioAnswer key={s.id} scenario={s} rules={rulesByNumber} glossary={glossary} />
            ))}
          </section>
        ) : null}

        {overviews.length ? (
          <section id="all-rules" className={styles.section} aria-labelledby="all-rules-heading">
            <h2 id="all-rules-heading" className={styles.sectionTitle}>
              {rulesDirectoryCopy.title}
            </h2>
            <p className={styles.intro}>{rulesDirectoryCopy.intro}</p>
            <RuleNumberGrid overviews={overviews} />
            <RuleDirectory overviews={overviews} scenarios={scenariosById} glossary={glossary} />
          </section>
        ) : null}

        <OfficialSourcesPanel />
        <RelatedResources />
      </div>

      <FinalCTA page="rules" {...rulesFinalCta} />
    </>
  );
}
