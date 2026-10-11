/**
 * One phone screen in the /how-it-works timeline: a screenshot of that moment
 * in the round, taken from the app itself.
 *
 * Server component: RoundTimeline (client) receives these as rendered
 * elements, so nothing here ships as client code.
 */

import Image from "next/image";
import type { RoundStep } from "@/lib/content";
import styles from "./RoundTimeline.module.css";

export function TimelineScreen({ screen }: { screen: RoundStep["screen"] }) {
  return (
    <Image
      src={screen}
      alt=""
      fill
      sizes="300px"
      className={styles.screenshot}
    />
  );
}
