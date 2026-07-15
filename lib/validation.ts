/**
 * Shared validation schemas (zod). Used by both client forms (for inline
 * feedback) and server route handlers (as the source of truth — never trust
 * the client).
 */

import { z } from "zod";

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
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(4000, "That message is too long."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type TextLinkInput = z.infer<typeof textLinkSchema>;
