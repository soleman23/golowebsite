import type { Metadata } from "next";
import {
  appCtaLabel,
  hiwFinalCta,
  hiwHero,
  hiwRoundHeader,
  roundSteps,
} from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import { PageHero, type HeroCta } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RoundTimeline } from "@/components/sections/howItWorks/RoundTimeline";
import { TimelineScreen } from "@/components/sections/howItWorks/TimelineScreen";
import { StrokesExplainer } from "@/components/sections/howItWorks/StrokesExplainer";
import { BetMath } from "@/components/sections/howItWorks/BetMath";
import { GuestsSection } from "@/components/sections/howItWorks/GuestsSection";
import { DoesntDo } from "@/components/sections/howItWorks/DoesntDo";
import { WatchIt } from "@/components/sections/howItWorks/WatchIt";
import { GameGuides } from "@/components/sections/howItWorks/GameGuides";
import { FinalCTA } from "@/components/sections/FinalCTA";
import styles from "./howItWorks.module.css";

// No hero photo yet, so no `image`: the page shares the default card. Add
// one alongside a `photo` prop on PageHero once there's a source frame.
export const metadata: Metadata = pageMetadata({
  path: "/how-it-works",
  title: "How GoLo Works: Golf Side-Game Scoring, Handicaps and Settling Up",
  description:
    "Follow one foursome through 18 holes: round setup, handicap strokes, live side-game scoring, presses, and settling up in the fewest payments.",
});

const heroCtas: HeroCta[] = [
  {
    label: hiwHero.walkLabel,
    href: "#round",
    variant: "primary",
    cta: "walk_round",
  },
  // The video CTA only exists while there's a video to jump to.
  ...(siteConfig.showHowItWorksVideo
    ? [
        {
          label: hiwHero.watchLabel,
          href: "#watch",
          variant: "ghost" as const,
          cta: "watch_video",
        },
      ]
    : []),
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        kicker={hiwHero.kicker}
        title={hiwHero.title}
        lead={hiwHero.lead}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How it works" }]}
        page="how_it_works"
        ctas={heroCtas}
        meta={
          <nav aria-label="Jump to a moment in the round">
            <ul className={styles.chips}>
              {roundSteps.map((step) => (
                <li key={step.id}>
                  {/* Plain fragment links: they work with JS off, and
                      RoundTimeline centres the step when it's running. */}
                  <a href={`#${step.id}`} className={styles.chip}>
                    <span className={styles.chipNum} aria-hidden="true">
                      {step.n}
                    </span>
                    {step.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <section
        id="round"
        className={styles.round}
        aria-labelledby="round-heading"
      >
        <div className={styles.roundHead}>
          <SectionHeader
            kicker={hiwRoundHeader.kicker}
            title={hiwRoundHeader.title}
            lead={hiwRoundHeader.lead}
            headingId="round-heading"
          />
        </div>
        <RoundTimeline
          steps={roundSteps}
          screens={roundSteps.map((step) => (
            <TimelineScreen key={step.id} screen={step.screen} />
          ))}
        />
      </section>

      <StrokesExplainer />
      <BetMath />
      <GuestsSection />
      <DoesntDo />
      {siteConfig.showHowItWorksVideo ? <WatchIt /> : null}
      <GameGuides />

      <FinalCTA
        layout="split"
        page="how_it_works"
        kicker={hiwFinalCta.kicker}
        title={hiwFinalCta.title}
        buttons={[
          {
            label: appCtaLabel,
            href: "/#get",
            cta: "get_app",
            variant: "primary",
          },
          {
            label: "Read the FAQ",
            href: "/faq",
            cta: "read_faq",
            variant: "ghost",
          },
        ]}
      />
    </>
  );
}
