/**
 * Integrity checks for glossary records (spec §8.4, #155). Pure: the caller
 * passes the capability registry, the set of served paths and today's date,
 * so `npm run lint:content` runs it on the real records and
 * scripts/test-glossary.mjs on fixtures.
 *
 * Each problem is one line that starts with the record's id.
 */

import { isGlossaryCategoryId } from "./categories";
import { normalizeGlossaryText } from "./search";
import type { GlossaryTerm, ReviewStage } from "./types";

export type GlossaryValidationContext = {
  capabilities: readonly { id: string; status: string }[];
  /** Every path the site serves: static routes, posts, guides, public files. */
  servedPaths: ReadonlySet<string>;
  /** YYYY-MM-DD. No review or publication can be dated after it. */
  today: string;
  /**
   * Normalised aliases allowed on more than one record. Empty by policy
   * (docs/glossary/inventory.md § Alias decisions); an entry needs a reason
   * there first.
   */
  ambiguousAliases?: readonly string[];
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const STAGES: readonly ReviewStage[] = ["rules", "product", "seo", "approval"];
const CTA_INTENTS = ["games", "handicaps", "settle-up", "download", "none"];
/** Markup in a plain-text field: a tag, a comment or an entity. */
const MARKUP = /<\s*[a-z/!]|&[a-z#][a-z0-9]*;/i;
/** House voice (CLAUDE.md): no emoji, no exclamation marks. */
const EMOJI = /\p{Extended_Pictographic}/u;

function realDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Copy fields a reader sees, with their names for the message. */
function copyFields(t: GlossaryTerm): [string, string][] {
  const fields: [string, string | undefined][] = [
    ["term", t.term],
    ["shortDefinition", t.shortDefinition],
    ["explanation", t.explanation],
    ["example", t.example],
    ["ruleNote", t.ruleNote?.text],
    ["goloNote", t.goloNote],
    ...t.aliases.map((a, i): [string, string] => [`aliases[${i}]`, a]),
  ];
  return fields.filter((f): f is [string, string] => typeof f[1] === "string");
}

export function validateGlossary(
  terms: readonly GlossaryTerm[],
  ctx: GlossaryValidationContext,
): string[] {
  const problems: string[] = [];
  const say = (t: { id: string }, message: string) =>
    problems.push(`${t.id || "(no id)"}: ${message}`);

  const ids = new Map<string, number>();
  const slugs = new Map<string, string>();
  const names = new Map<string, string>();
  for (const t of terms) ids.set(t.id, (ids.get(t.id) ?? 0) + 1);

  const capabilityStatus = new Map(ctx.capabilities.map((c) => [c.id, c.status]));
  const ambiguous = new Set(ctx.ambiguousAliases ?? []);
  /** normalised alias → ids carrying it */
  const aliasOwners = new Map<string, string[]>();

  for (const t of terms) {
    // Identity
    if (!SLUG.test(t.id)) say(t, `id "${t.id}" isn't a lower-case slug`);
    if (!SLUG.test(t.slug)) say(t, `slug "${t.slug}" isn't a lower-case slug`);
    if ((ids.get(t.id) ?? 0) > 1) say(t, "duplicate id");
    const slugOwner = slugs.get(t.slug);
    if (slugOwner) say(t, `slug "${t.slug}" is already used by ${slugOwner}`);
    else slugs.set(t.slug, t.id);
    const name = normalizeGlossaryText(t.term);
    if (!name) say(t, "empty term name");
    const nameOwner = names.get(name);
    if (nameOwner) say(t, `term "${t.term}" duplicates ${nameOwner}`);
    else names.set(name, t.id);

    if (!isGlossaryCategoryId(t.primaryCategory)) {
      say(t, `unknown category "${t.primaryCategory}"`);
    }
    if (!t.shortDefinition.trim()) say(t, "empty shortDefinition");

    // Copy
    for (const [field, value] of copyFields(t)) {
      if (MARKUP.test(value)) say(t, `${field} contains markup; glossary copy is plain text`);
      if (value.includes("!")) say(t, `${field} has an exclamation mark (house voice)`);
      if (EMOJI.test(value)) say(t, `${field} has an emoji (house voice)`);
    }

    // Aliases
    const own = new Set<string>();
    for (const alias of t.aliases) {
      const norm = normalizeGlossaryText(alias);
      if (!norm) {
        say(t, `empty alias`);
        continue;
      }
      if (norm === name) say(t, `alias "${alias}" is the term's own name`);
      if (own.has(norm)) say(t, `alias "${alias}" is listed twice`);
      own.add(norm);
      aliasOwners.set(norm, [...(aliasOwners.get(norm) ?? []), t.id]);
    }

    // Links
    for (const related of t.relatedTermIds) {
      if (related === t.id) say(t, "relates to itself");
      else if (!ids.has(related)) say(t, `related term "${related}" isn't a record`);
    }
    for (const path of t.relatedContentPaths) {
      if (!ctx.servedPaths.has(path)) say(t, `related path ${path} isn't a served page`);
    }
    if (t.canonical.kind === "hub") {
      if (t.canonical.anchor !== t.slug) {
        say(t, `hub anchor "${t.canonical.anchor}" isn't the slug "${t.slug}"`);
      }
    } else if (t.canonical.kind === "existing") {
      if (!ctx.servedPaths.has(t.canonical.path)) {
        say(t, `canonical ${t.canonical.path} isn't a served page`);
      }
      if (t.canonical.path.startsWith("/glossary")) {
        say(t, "an existing canonical can't be a glossary path");
      }
    } else {
      say(t, "detail canonicals wait for standalone term pages (#169)");
    }

    // Capabilities
    for (const id of t.capabilityIds) {
      if (!capabilityStatus.has(id)) say(t, `capability "${id}" isn't in the registry`);
    }
    if (t.goloNote && !t.capabilityIds.some((id) => capabilityStatus.get(id) === "live")) {
      say(t, "goloNote needs at least one live capability in capabilityIds");
    }
    if (t.ctaIntent && !CTA_INTENTS.includes(t.ctaIntent)) {
      say(t, `unknown ctaIntent "${t.ctaIntent}"`);
    }

    // Sources
    for (const s of t.sources) {
      if (!/^https:\/\//.test(s.url)) say(t, `source "${s.title}" needs an https URL`);
      if (s.accessedOn !== undefined) {
        if (!realDate(s.accessedOn)) say(t, `source "${s.title}" accessedOn isn't a YYYY-MM-DD date`);
        else if (s.accessedOn > ctx.today) say(t, `source "${s.title}" accessedOn is in the future`);
      }
    }

    // Dates
    for (const field of ["reviewedOn", "publishedOn", "updatedOn"] as const) {
      const value = t[field];
      if (value === undefined) continue;
      if (!realDate(value)) say(t, `${field} "${value}" isn't a YYYY-MM-DD date`);
      else if (value > ctx.today) say(t, `${field} ${value} is in the future`);
    }
    if (t.reviewedOn && t.publishedOn && t.publishedOn < t.reviewedOn) {
      say(t, "publishedOn is before reviewedOn");
    }
    if (t.updatedOn && t.publishedOn && t.updatedOn < t.publishedOn) {
      say(t, "updatedOn is before publishedOn");
    }
    for (const entry of t.reviewLog ?? []) {
      if (!realDate(entry.on)) say(t, `review log ${entry.stage} date "${entry.on}" isn't a YYYY-MM-DD date`);
      else if (entry.on > ctx.today) say(t, `review log ${entry.stage} is dated in the future`);
    }

    // Publication requirements
    const reviewed = t.status === "approved" || t.status === "published";
    if (reviewed) {
      if (!t.reviewedOn) say(t, `${t.status} without reviewedOn`);
      if (!t.reviewedBy) say(t, `${t.status} without reviewedBy`);
      const stages = new Set((t.reviewLog ?? []).map((e) => e.stage));
      const missing = STAGES.filter((s) => !stages.has(s));
      if (missing.length) say(t, `${t.status} without a review log entry for ${missing.join(", ")}`);
      const unchecked = t.sources.filter((s) => !s.accessedOn);
      if (unchecked.length) {
        say(t, `${t.status} with unchecked sources: ${unchecked.map((s) => s.title).join("; ")}`);
      }
      const needsOfficial =
        t.primaryCategory === "handicaps" ||
        t.ruleNote?.kind === "rules" ||
        t.ruleNote?.kind === "handicapping";
      const official = t.sources.some(
        (s) => (s.kind === "official-rules" || s.kind === "handicapping") && s.accessedOn,
      );
      if (needsOfficial && !official) {
        say(t, `${t.status} rules-sensitive record without a checked official source`);
      }
    }
    if (t.status === "published" && !t.publishedOn) say(t, "published without publishedOn");
    if (!reviewed && t.publishedOn) say(t, `publishedOn set on a ${t.status} record`);
  }

  for (const [alias, owners] of aliasOwners) {
    const nameOwner = names.get(alias);
    if (nameOwner && !owners.includes(nameOwner)) {
      problems.push(`${owners.join(", ")}: alias "${alias}" is the name of ${nameOwner}`);
    }
    if (owners.length > 1 && !ambiguous.has(alias)) {
      problems.push(
        `${owners.join(", ")}: alias "${alias}" resolves to more than one record (list it as deliberately ambiguous or remove it)`,
      );
    }
  }

  return problems;
}
