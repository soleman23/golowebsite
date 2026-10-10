/**
 * One phone screen in the /how-it-works timeline. A real screenshot when the
 * step has one; until then, the closest existing mockup, laid out on a
 * 288×624 stage that RoundTimeline's CSS scales to whatever frame it's in.
 *
 * Server component: RoundTimeline (client) receives these as rendered
 * elements, so the mockups never ship as client code.
 */

import Image from "next/image";
import type { RoundStep, TimelineFallback } from "@/lib/content";
import { SetupCard } from "@/components/mockups/SetupCard";
import { StrokeGrid } from "@/components/mockups/StrokeGrid";
import { ScoringPhone } from "@/components/mockups/ScoringPhone";
import { PressLadder } from "@/components/mockups/PressLadder";
import { MoneyCard } from "@/components/mockups/MoneyCard";
import { SettlePhone } from "@/components/mockups/SettlePhone";
import styles from "./RoundTimeline.module.css";

/** Phone mockups fill the stage; card mockups sit centred on the turf. */
const FALLBACKS: Record<
  TimelineFallback,
  { render: () => React.ReactNode; phone: boolean }
> = {
  setup: { render: () => <SetupCard />, phone: false },
  strokes: { render: () => <StrokeGrid />, phone: false },
  scoring: { render: () => <ScoringPhone variant="features" framed />, phone: true },
  press: { render: () => <PressLadder />, phone: false },
  money: { render: () => <MoneyCard variant="players" />, phone: false },
  settle: { render: () => <SettlePhone variant="features" framed />, phone: true },
};

export function TimelineScreen({ screen }: { screen: RoundStep["screen"] }) {
  if (screen.src) {
    return (
      <Image
        src={screen.src}
        alt=""
        fill
        sizes="300px"
        className={styles.screenshot}
      />
    );
  }

  const { render, phone } = FALLBACKS[screen.fallback];
  return (
    <div className={styles.stage}>
      {phone ? render() : <div className={styles.stageCard}>{render()}</div>}
    </div>
  );
}
