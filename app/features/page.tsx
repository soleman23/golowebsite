import type { Metadata } from "next";
import Link from "next/link";
import { featureBlocks, quickAnswers, type FeatureVisual } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { PageHero } from "@/components/ui/PageHero";
import { StatusPill } from "@/components/ui/StatusPill";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { SetupCard } from "@/components/mockups/SetupCard";
import { GameStackCard } from "@/components/mockups/GameStackCard";
import { ScoringPhone } from "@/components/mockups/ScoringPhone";
import { MoneyCard } from "@/components/mockups/MoneyCard";
import { PressLadder } from "@/components/mockups/PressLadder";
import { StrokeGrid } from "@/components/mockups/StrokeGrid";
import { SettlePhone } from "@/components/mockups/SettlePhone";
import { LockerCard } from "@/components/mockups/LockerCard";
import { AlsoInThere } from "@/components/sections/features/AlsoInThere";
import { RoadmapColumns } from "@/components/sections/features/RoadmapColumns";
import { BetaQuotes } from "@/components/sections/features/BetaQuotes";
import { PricingNote } from "@/components/sections/features/PricingNote";
import { QuickAnswers } from "@/components/sections/features/QuickAnswers";
import { FinalCTA } from "@/components/sections/FinalCTA";
import styles from "./features.module.css";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every game scored, every press logged, every debt netted. What GoLo does today — round setup, live scoring, presses, handicaps and auto settle-up.",
  alternates: { canonical: "/features" },
};

/** Which mockup renders for each block, and whether it's a card or a phone. */
const VISUALS: Record<
  FeatureVisual,
  { Component: React.ComponentType; fill: boolean }
> = {
  setup: { Component: SetupCard, fill: true },
  gameStack: { Component: GameStackCard, fill: true },
  scoring: {
    Component: () => <ScoringPhone variant="features" />,
    fill: false,
  },
  money: { Component: () => <MoneyCard variant="players" />, fill: true },
  pressLadder: { Component: PressLadder, fill: true },
  strokeGrid: { Component: StrokeGrid, fill: true },
  settle: { Component: () => <SettlePhone variant="features" />, fill: false },
  locker: { Component: LockerCard, fill: true },
};

/** Quick answers double as FAQPage structured data. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: quickAnswers.map((a) => ({
    "@type": "Question",
    name: a.question,
    acceptedAnswer: { "@type": "Answer", text: a.answer },
  })),
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        kicker="EVERYTHING GOLO DOES"
        title="A scorecard that can do arithmetic, keep a bet straight, and remember who owes who."
        lead="Set the round, stack the games, tap in scores. GoLo handles the strokes, the presses, the junk and the math — and hands you one number per player before anyone leaves the lot."
        ctas={[
          { label: "Get the app", href: "/#get", variant: "primary" },
          { label: "Browse the games", href: "/games", variant: "ghost" },
        ]}
        meta={
          <>
            {siteConfig.appLive ? null : (
              <StatusPill variant="today" label="FREE WHILE WE'RE IN BETA" />
            )}
            <StatusPill
              variant="planned"
              label="NO MONEY MOVES THROUGH GOLO"
            />
            <StatusPill variant="planned" label="ONE PHONE SCORES THE GROUP" />
          </>
        }
      />

      <section className={styles.blocks} aria-label="What GoLo does">
        {featureBlocks.map((block) => {
          const { Component, fill } = VISUALS[block.visual];
          return (
            <FeatureRow
              key={block.id}
              feature={block}
              status={block.status}
              headingLevel={2}
              visualFill={fill}
              footer={
                block.link ? (
                  <Link href={block.link.href} className={styles.blockLink}>
                    {block.link.label}
                  </Link>
                ) : null
              }
            >
              <Component />
            </FeatureRow>
          );
        })}
      </section>

      <AlsoInThere />
      <RoadmapColumns />
      {siteConfig.showTestimonials ? <BetaQuotes /> : null}
      {siteConfig.appLive ? null : <PricingNote />}
      <QuickAnswers />

      <FinalCTA
        layout="split"
        page="features"
        kicker="TRACK IT. BET IT. SETTLE IT."
        title="Bring it Saturday. Let the phone keep the tally."
        buttons={[
          {
            label: "Get the app",
            href: "/#get",
            cta: "get_app",
            variant: "primary",
          },
          {
            label: "Ask us something",
            href: "/contact",
            cta: "ask_us",
            variant: "ghost",
          },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
