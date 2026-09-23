import { z } from "zod";

/**
 * Mirrors the CMS schema (CMS `endpoints/submitContact.ts`). Errors are
 * reported per field; the UI shows the localized message for that field.
 */
export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().pipe(z.email().max(200)),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{6,20}$/),
  interest: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Anti-spam fields that travel with the form but never reach the CMS. */
export const antiSpamSchema = z.object({
  /** Honeypot: hidden from humans, bots fill it. */
  website: z.string().max(0).optional().default(""),
  /** When the form was rendered (ms since epoch). */
  startedAt: z.coerce.number().int().positive(),
});

export const MIN_FILL_TIME_MS = 2_500;
