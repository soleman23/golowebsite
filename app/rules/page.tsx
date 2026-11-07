import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hubRules,
  publishedGlossaryTerms,
  rulesCategories,
  rulesCategoryIds,
  rulesControlsCopy,
  rulesCount,
  rulesDirectoryCopy,
  rulesFinalCta,
  rulesHero,
  rulesBreadcrumb,
  rulesReviewCopy,
  rulesRouteVisible,
  rulesSearchEntries,
  rulesSelection,
  rulesSituationsCopy,
  type RulesCategoryId,
} from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { FilterBoot } from "@/components/ui/FilterBoot";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EditionNotice } from "@/components/sections/rules/EditionNotice";
import { OfficialSourcesPanel } from "@/components/sections/rules/OfficialSourcesPanel";
import { QuickSituations } from "@/components/sections/rules/QuickSituations";
import { RelatedResources } from "@/components/sections/rules/RelatedResources";
import { RuleDirectory } from "@/components/sections/rules/RuleDirectory";
import { RuleNumberGrid } from "@/components/sections/rules/RuleNumberGrid";
import { RulesControls } from "@/components/sections/rules/RulesControls";
import type { GlossaryLinkTarget } from "@/components/sections/rules/RulesEntry";
import { RulesProvider } from "@/components/sections/rules/RulesProvider";
import { RulesSearchField } from "@/components/sections/rules/RulesSearchField";
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
      "Plain answers for a lost ball, out of bounds, penalty areas, cart paths and bunkers, plus all 25 Rules of Golf summarized, with the official text linked.",
  });
}

/**
 * The Rules Center hub (#234; docs/rules/ux.md). Server-rendered: every
 * answer, overview and link is in the HTML and readable without JavaScript,
 * and nothing is collapsed (D2). JavaScript only adds search and topic
 * filters (#236): a client provider holds the topic (?category=, through
 * FilterBoot/FilterUrlSync like the glossary) and the search text (never in
 * the URL), and handles #fragment deep links. Filtering and search hide
 * entries with CSS, so the lists stay in the static HTML.
 *
 * While lib/content/rules/launch.ts says the Rules Center isn't live, a
 * production build (Hostinger, including PR previews) serves a 404 here.
 * Only `next dev` renders it, with approved records marked Not published,
 * so the owner can review before the launch PR (#247).
 */
export default function RulesPage() {
  if (!rulesRouteVisible()) notFound();

  const { overviews, scenarios } = hubRules();
  // The banner is local review's alone: production never says "approved".
  const localReview = rulesSelection() === "review";
  const review = [...overviews, ...scenarios].some((r) => r.unpublished);
  const empty = !overviews.length && !scenarios.length;

  const rulesByNumber = new Map(overviews.map((r) => [r.number, r]));
  const scenariosById = new Map(scenarios.map((s) => [s.id, s]));
  // Published terms only: an entry never links to a glossary term that
  // production doesn't serve.
  const glossary = new Map<string, GlossaryLinkTarget>(
    publishedGlossaryTerms().map((t) => [t.slug, { slug: t.slug, term: t.term }]),
  );

  // Topic filters: ?category= ids, the count line for each, and which topics
  // each section has entries in, so CSS can hide a section a topic empties.
  const filterIds = ["all", ...rulesCategoryIds];
  const inTopic = (id: RulesCategoryId) =>
    scenarios.filter((s) => s.category === id).length +
    overviews.filter((r) => r.category === id).length;
  const { nouns } = rulesControlsCopy;
  const counts: Record<string, string> = {
    all: rulesCount(scenarios.length + overviews.length, nouns.entry),
    ...Object.fromEntries(
      rulesCategories.map((c) => [
        c.id,
        `${rulesCount(inTopic(c.id), nouns.entry)} ${rulesControlsCopy.inTopic.replace("{topic}", c.label)}`,
      ]),
    ),
  };
  // A topic with nothing on the page gets no chip; ?category= for it still
  // resolves, to an honest "0 entries".
  const chips = [
    { id: "all", label: rulesControlsCopy.allChip },
    ...rulesCategories.filter((c) => inTopic(c.id)).map((c) => ({ id: c.id, label: c.chip })),
  ];
  const topicLabels = Object.fromEntries(rulesCategories.map((c) => [c.id, c.label]));
  const topicsOf = (items: readonly { category: RulesCategoryId }[]) =>
    [...new Set(items.map((i) => i.category))].join(" ");

  return (
    <RulesProvider
      ids={filterIds}
      copy={{
        searchCleared: rulesControlsCopy.searchCleared,
        filterCleared: rulesControlsCopy.filterCleared,
        bothCleared: rulesControlsCopy.bothCleared,
        showing: rulesControlsCopy.showing,
      }}
    >
      <FilterBoot param="category" ids={filterIds} />
      {/* Search, chips and copy buttons can't work without JavaScript; hide
          them rather than ship dead controls (ux.md § Flows and states). */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>[data-requires-js]{display:none}</style>" }}
      />

      <PageHero
        {...rulesHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: rulesBreadcrumb }]}
        search={
          empty ? undefined : (
            <RulesSearchField
              label={rulesControlsCopy.searchLabel}
              placeholder={rulesControlsCopy.searchPlaceholder}
            />
          )
        }
      />

      <div className={styles.page}>
        {localReview && (review || empty) ? (
          <p className={styles.reviewBanner} role="note">
            {empty ? rulesReviewCopy.empty : rulesReviewCopy.banner}
          </p>
        ) : null}

        <EditionNotice />

        {empty ? null : (
          <RulesControls
            chips={chips}
            counts={counts}
            topicLabels={topicLabels}
            entries={rulesSearchEntries({ overviews, scenarios })}
            copy={{
              chipsLabel: rulesControlsCopy.chipsLabel,
              clear: rulesControlsCopy.clear,
              situations: rulesControlsCopy.situations,
              rules: rulesControlsCopy.rules,
              showAll: rulesControlsCopy.showAll,
              closest: rulesControlsCopy.closest,
              also: rulesControlsCopy.also,
              refs: rulesControlsCopy.refs,
              nouns,
              inTopic: rulesControlsCopy.inTopic,
              noMatch: rulesControlsCopy.noMatch,
              noMatchShort: rulesControlsCopy.noMatchShort,
              noMatchHint: rulesControlsCopy.noMatchHint,
              elsewhere: rulesControlsCopy.elsewhere,
              searchAll: rulesControlsCopy.searchAll,
              rulesIndex: rulesControlsCopy.rulesIndex,
            }}
          />
        )}

        {/* Everything search and the topic filter hide; RulesProvider's
            hash reveal clears both for a fragment inside it. */}
        <div className={styles.lists} data-rules-lists="">
          <QuickSituations scenarios={scenarios} />

          {scenarios.length ? (
            <section
              id="situations"
              className={styles.section}
              aria-labelledby="situations-heading"
              data-cats={topicsOf(scenarios)}
            >
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
            <section
              id="all-rules"
              className={styles.section}
              aria-labelledby="all-rules-heading"
              data-cats={topicsOf(overviews)}
            >
              <h2 id="all-rules-heading" className={styles.sectionTitle}>
                {rulesDirectoryCopy.title(overviews.length)}
              </h2>
              <p className={styles.intro}>{rulesDirectoryCopy.intro}</p>
              <RuleNumberGrid overviews={overviews} />
              <RuleDirectory overviews={overviews} scenarios={scenariosById} glossary={glossary} />
            </section>
          ) : null}
        </div>

        <OfficialSourcesPanel />
        <RelatedResources />
      </div>

      <FinalCTA page="rules" {...rulesFinalCta} />
    </RulesProvider>
  );
}
