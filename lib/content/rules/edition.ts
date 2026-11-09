/**
 * The Rules of Golf edition every record is written against, and when the
 * official clarifications were last checked (docs/rules/source-map.md).
 *
 * The R&A said on January 14, 2026 that the next edition is published on
 * January 1, 2028. From that day `lint:content` fails until #251 moves the
 * records to it, so stale advice can't ship quietly.
 */

import type { RulesEditionId } from "./types";

export type RulesEdition = {
  id: RulesEditionId;
  label: string;
  effectiveFrom: string;
  /** The day the next edition takes effect. */
  supersededOn: string;
  /** The USGA's "Updated <date>" on its clarifications page, as last read. */
  clarificationsUpdated: string;
  /** When someone last read the clarifications pages for this edition. */
  clarificationsCheckedOn: string;
};

export const rulesEdition: RulesEdition = {
  id: "2023",
  label: "2023 Rules of Golf",
  effectiveFrom: "2023-01-01",
  supersededOn: "2028-01-01",
  clarificationsUpdated: "2026-10-02",
  // Re-read on launch day (#247): still "Updated October 2, 2026".
  clarificationsCheckedOn: "2026-11-07",
};

/** Quarterly updates, so a check older than this has missed one. */
export const CLARIFICATIONS_STALE_AFTER_DAYS = 100;
