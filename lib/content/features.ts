/**
 * /features content: the eight feature blocks, the honest roadmap columns,
 * beta pricing and the quick answers. Populated by prompt 01.
 */

import type { IconName } from "@/components/ui/Icon";

export type FeatureStatus = "today" | "testing" | "planned";

export type FeatureBlock = {
  id: string;
  icon: IconName;
  kicker: string;
  title: string;
  /** Rich lead paragraph as HTML; strong/em text uses tags. */
  bodyHtml: string;
  status: FeatureStatus;
  checklist: { lead: string; rest: string }[];
  visualSide: "left" | "right";
};

export type RoadmapColumn = {
  status: FeatureStatus;
  heading: string;
  items: string[];
};

export type QuickAnswer = { id: string; question: string; answer: string };

export const featureBlocks: FeatureBlock[] = [];

export const roadmapColumns: RoadmapColumn[] = [];

export const quickAnswers: QuickAnswer[] = [];
