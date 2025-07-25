import { z } from "zod/v4";

/** Represents basic partner information. */
export type PartnerInfo = z.infer<typeof PartnerInfoSchema>;
export const PartnerInfoSchema = z.object({
  pic: z.string(),
  name: z.string(),
  url: z.string(),
});

/**
 * Represents extendened partner information including contact details and languages.
 */
export type ContentProfile = z.infer<typeof ContentProfileSchema>;
export const ContentProfileSchema = z.object({
  pic: z.string(),
  name: z.string(),
  url: z.string(),
  emailAddress: z.string(),
  emailSubject: z.string(),
  languages: z.array(z.string()),
});