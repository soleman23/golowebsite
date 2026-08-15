/**
 * The six contact topics — the contract shared by the form, the zod schema in
 * lib/validation.ts, and the `topic` column on ContactMessage.
 *
 * Deliberately its own module with NO imports. lib/validation.ts needs the ids,
 * and validation is pulled into the home page's phone-capture form — importing
 * them from contact.ts would drag every /contact string (and, through it,
 * faq.ts) into the home bundle. The rest of the page's copy lives in contact.ts.
 */

export const contactTopicIds = [
  "bug",
  "idea",
  "course",
  "account",
  "partner",
  "press",
] as const;

export type ContactTopicId = (typeof contactTopicIds)[number];

export type ContactTopic = {
  id: ContactTopicId;
  label: string;
  hint: string;
};

export const contactTopics: ContactTopic[] = [
  {
    id: "bug",
    label: "Support / bug",
    hint: "Something’s broken or the math looks wrong.",
  },
  {
    id: "idea",
    label: "Feature request",
    hint: "You’ve got a better idea. We want it.",
  },
  {
    id: "course",
    label: "Course data",
    hint: "Wrong par, wrong tees, missing course.",
  },
  {
    id: "account",
    label: "Account & data",
    hint: "Export, deletion, or a login you can’t get past.",
  },
  {
    id: "partner",
    label: "Partnerships",
    hint: "Courses, leagues, clubs, events.",
  },
  { id: "press", label: "Press", hint: "Media, interviews, brand assets." },
];

/** Human label for a topic id — used in the notification subject line. */
export function contactTopicLabel(
  id: string | null | undefined,
): string | undefined {
  return contactTopics.find((t) => t.id === id)?.label;
}
