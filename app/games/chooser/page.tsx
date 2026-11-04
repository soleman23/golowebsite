import type { Metadata } from "next";
import Link from "next/link";
import {
  chooserCopy,
  chooserExample,
  chooserFinalCta,
  chooserHero,
  chooserHow,
  chooserKeepReading,
  chooserMeta,
  chooserQuestionNames,
  chooserQuestions,
  chooserSideGames,
  chooserTable,
  chooserTableCells,
  chooserUi,
} from "@/lib/content";
import { FORMAT_RULES } from "@/lib/chooser/engine";
import { serializeAnswers } from "@/lib/chooser/url";
import { chooserView } from "@/lib/chooser/view";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import { DataTable } from "@/components/ui/DataTable";
import { KeepReading } from "@/components/sections/faq/KeepReading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SideGameChooser } from "@/components/sections/chooser/SideGameChooser";
import { ChooserPickCard } from "@/components/sections/chooser/ChooserPickCard";
import styles from "./chooser.module.css";

/**
 * Self-canonical with or without answers in the query string: a shared
 * result is the same page with a form filled in, not a page of its own.
 */
export const metadata: Metadata = pageMetadata({
  path: "/games/chooser",
  title: chooserMeta.title,
  description: chooserMeta.description,
});

/**
 * The side-game chooser (#224). Static: the form, the rules, the table and
 * the worked example are all in the HTML, and the chooser's answers live in
 * the client leaf (SideGameChooser), so reading `searchParams` never makes
 * this route dynamic (see FilterBoot for why that matters to metadata).
 *
 * The worked example runs the same engine at build time, so it can't
 * disagree with the tool above it.
 */
export default function ChooserPage() {
  const example = chooserView(chooserExample.answers, chooserCopy);
  const exampleHref = `/games/chooser${serializeAnswers(chooserExample.answers)}`;
  const table = {
    head: chooserTable.head,
    rows: FORMAT_RULES.map((rule) => {
      const cells = chooserTableCells[rule.id];
      const { min, max } = rule.players;
      return [
        chooserCopy.formats[rule.id].name,
        min === max ? `Exactly ${min}` : `${min}–${max}`,
        cells.partners,
        cells.simple,
        cells.strokes,
        cells.golo,
      ];
    }),
  };

  return (
    <>
      <PageHero
        kicker={chooserHero.kicker}
        title={chooserHero.title}
        lead={chooserHero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: chooserHero.crumb },
        ]}
        visual={
          <span className={styles.heroIcon} aria-hidden="true">
            <Icon name="stack" size={64} color="var(--accent)" />
          </span>
        }
      />

      <section id="chooser" className={styles.tool} aria-label={chooserHero.crumb}>
        <div className={styles.inner}>
          <noscript>
            <p className={styles.noscript}>{chooserUi.noscript}</p>
          </noscript>
          <SideGameChooser
            copy={chooserCopy}
            questions={chooserQuestions}
            questionNames={chooserQuestionNames}
            ui={chooserUi}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="chooser-how-heading">
        <div className={styles.inner}>
          <h2 id="chooser-how-heading" className={styles.title}>
            {chooserHow.title}
          </h2>
          <p className={styles.lead}>{chooserHow.lead}</p>
          <ol className={styles.rules}>
            {chooserHow.rules.map((rule) => (
              <li key={rule.title} className={styles.rule}>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <p className={styles.ruleBody}>{rule.body}</p>
              </li>
            ))}
          </ol>

          <h2 id="chooser-table-heading" className={`${styles.title} ${styles.spaced}`}>
            {chooserTable.title}
          </h2>
          <p className={styles.lead}>{chooserTable.lead}</p>
          <DataTable table={table} className={styles.table} wrap />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="chooser-example-heading">
        <div className={styles.inner}>
          <h2 id="chooser-example-heading" className={styles.title}>
            {chooserExample.title}
          </h2>
          <p className={styles.lead}>{chooserExample.intro}</p>
          <div className={styles.example}>
            <div className={styles.exampleSteps}>
              <ol className={styles.steps}>
                {chooserExample.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className={styles.math}>{chooserExample.math}</p>
              <p className={styles.source}>
                {chooserExample.sourcePrefix}{" "}
                <a href={chooserExample.source.href} rel="noopener noreferrer">
                  {chooserExample.source.label}
                </a>
              </p>
              <Link href={`${exampleHref}#chooser`} className={styles.open}>
                {chooserExample.open} →
              </Link>
            </div>
            {example.status === "ok" ? (
              <ol className={styles.examplePicks}>
                {example.picks.map((pick) => (
                  <li key={pick.id}>
                    <ChooserPickCard pick={pick} ui={chooserUi} idPrefix="chooser-example" />
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="chooser-side-heading">
        <div className={styles.inner}>
          <h2 id="chooser-side-heading" className={styles.title}>
            {chooserSideGames.title}
          </h2>
          <p className={styles.lead}>{chooserSideGames.lead}</p>
          <ul className={styles.sideGames}>
            {chooserSideGames.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.sideGame}>
                  <span className={styles.sideName}>{item.label}</span>
                  <span className={styles.sideBody}>{item.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KeepReading
        items={chooserKeepReading.items}
        heading={chooserKeepReading.title}
        headingId="chooser-keep-reading-heading"
      />

      <FinalCTA page="chooser" {...chooserFinalCta} />
    </>
  );
}
