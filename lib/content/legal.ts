/**
 * Section trees for /privacy and /terms — headings, ids and the plain-English
 * notes, used to drive the TOC rail and scroll-spy. Populated by prompt 08.
 *
 * The privacy policy's words are authoritative and live in the page itself;
 * anything here describes structure, not legal substance.
 */

export type LegalSection = {
  id: string;
  number: string;
  heading: string;
  /** Optional "in plain English" gloss shown beside the section. */
  plain?: string;
};

export const privacySections: LegalSection[] = [];

export const termsSections: LegalSection[] = [];
