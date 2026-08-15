/**
 * Shared validation schemas (zod). Used by both client forms (for inline
 * feedback) and server route handlers (as the source of truth — never trust
 * the client).
 */

import { z } from "zod";
// The bare topic module, not contact.ts and not the @/lib/content barrel: this
// file rides along with the home page's phone-capture form, so anything it
// imports lands in the home bundle.
import { contactTopicIds } from "@/lib/content/contactTopics";

// Accepts common US-style phone formats: digits, spaces, dashes, parens, +.
// Requires 10–15 digits once stripped.
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter a phone number.")
  .refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "Enter a valid phone number.");

export const textLinkSchema = z.object({
  phone: phoneSchema,
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "We need something to call you.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "We can’t write back without an email.")
    .email("That email doesn’t look right — check it once more.")
    .max(200),
  message: z
    .string()
    .trim()
    .min(12, "Give us a few more details — at least a sentence.")
    .max(4000, "That message is too long."),
  /**
   * Optional but preferred. The form makes you pick one; the API stays
   * forgiving so a submission without a topic still lands rather than 400ing,
   * while an id that isn't one of the six is rejected outright.
   */
  topic: z
    .enum(contactTopicIds, {
      errorMap: () => ({ message: "Pick a topic so we know where to send this." }),
    })
    .optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type TextLinkInput = z.infer<typeof textLinkSchema>;
