/**
 * One phone screen in the /how-it-works timeline. A real screenshot when the
 * step has one; until then, HiwScreen's coded version of that moment, laid
 * out on a 288×624 stage that RoundTimeline's CSS scales to whatever frame
 * it's in.
 *
 * Server component: RoundTimeline (client) receives these as rendered
 * elements, so the mockups never ship as client code.
 */

import Image from "next/image";
import type { RoundStep } from "@/lib/content";
import { HiwScreen } from "@/components/mockups/HiwScreen";
import styles from "./RoundTimeline.module.css";

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

  return (
    <div className={styles.stage}>
      <HiwScreen moment={screen.fallback} />
    </div>
  );
}
