/**
 * The glossary's content contract (spec §8.2, adjusted to this repo).
 * docs/glossary/inventory.md is the editorial source for every id, slug,
 * category and alias; docs/glossary/editorial-review.md for the lifecycle and
 * the review record.
 *
 * A record is internal until a selector in ./selectors turns it into a
 * PublicGlossaryTerm. Only that shape reaches a page, the client, llms.txt or
 * structured data, so the review record and sources never leave the server.
 */

export type GlossaryCategoryId =
  | "scoring"
  | "formats"
  | "side-games"
  | "handicaps"
  | "shots"
  | "course-rules"
  | "equipment"
  | "slang";

export type PublicationStatus =
  | "planned"
  | "draft"
  | "in-review"
  | "approved"
  | "published"
  | "archived";

/**
 * Who owns the term's search intent (docs/glossary/canonical-map.md). Every
 * shown term also has a hub anchor at /glossary#<slug>, whatever this says.
 * `detail` is reserved for #169 and fails validation until that route exists.
 */
export type CanonicalTarget =
  | { kind: "hub"; anchor: string }
  | { kind: "existing"; path: string }
  | { kind: "detail"; path: string };

export type GlossarySource = {
  title: string;
  url: string;
  kind: "official-rules" | "handicapping" | "editorial" | "first-party";
  /** e.g. "Rule 23", "Definitions: Four-Ball", "Appendix C". */
  ref?: string;
  /**
   * The date someone actually opened it for this record. Without it the
   * source is a reference still to check, not a check.
   */
  accessedOn?: string;
};

/** What a note is: the label it shows under (docs/glossary/ux.md). */
export type NoteKind = "rules" | "handicapping" | "convention" | "house-rules";

export type ReviewStage = "rules" | "product" | "seo" | "approval";

export type ReviewEntry = {
  stage: ReviewStage;
  /** "owner", or "agent" for prepared work the owner then signed. */
  by: string;
  /** ISO date the stage actually happened. */
  on: string;
  note?: string;
};

export type CtaIntent = "games" | "handicaps" | "settle-up" | "download" | "none";

export type GlossaryTerm = {
  /** Stable and internal; never changes once created. */
  id: string;
  /** The public fragment: /glossary#<slug>. */
  slug: string;
  term: string;
  /** Strict synonyms only (inventory.md § Alias decisions). */
  aliases: string[];

  primaryCategory: GlossaryCategoryId;
  tags: string[];
  priority: "mvp" | "expansion";

  /** The answer, plain text, normally 20–45 words. */
  shortDefinition: string;
  explanation?: string;
  example?: string;
  /** A rule, convention or house-rule note, labelled by its kind. */
  ruleNote?: { kind: NoteKind; text: string };
  /**
   * What GoLo does about this term. Checked by the full claim guard, unlike
   * the rest of the record, and needs a live capability in capabilityIds.
   */
  goloNote?: string;

  relatedTermIds: string[];
  relatedContentPaths: string[];

  canonical: CanonicalTarget;
  /** Registry ids this record depends on. Not a public support badge. */
  capabilityIds: string[];
  ctaIntent?: CtaIntent;

  sources: GlossarySource[];

  status: PublicationStatus;
  /** Internal: never rendered, never in the client or structured data. */
  reviewedBy?: string;
  /** Internal, as reviewedBy. */
  reviewLog?: ReviewEntry[];
  /**
   * The latest approval date; shown as "Reviewed <date>" on a published term.
   * After a re-review it can be later than publishedOn.
   */
  reviewedOn?: string;
  /** Set by the launch PR only. */
  publishedOn?: string;
  /** Only for a substantive editorial change. */
  updatedOn?: string;
};

/**
 * What a page and the client may see. `unpublished` marks an approved term
 * shown in local review (`next dev`); production selectors never produce it.
 */
export type PublicGlossaryTerm = Omit<
  GlossaryTerm,
  "status" | "reviewedBy" | "reviewLog" | "sources" | "priority"
> & { unpublished?: true };

/** The search index entry the client leaf gets: only what search shows. */
export type GlossarySearchEntry = {
  id: string;
  slug: string;
  term: string;
  category: GlossaryCategoryId;
  shortDefinition: string;
  aliases: string[];
  tags: string[];
};
