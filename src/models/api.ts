/**
 * Shared client/server types and schema validators for API requests and responses.
 */

import { z } from "zod/v4";

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export const ContactInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});

export type DownloadRequestBody = z.infer<typeof DownloadRequestBodySchema>;
export const DownloadRequestBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  languageId: z.string(),
  resourceId: z.string(),
});

export type PartnerJoinRequestBody = z.infer<typeof PartnerJoinRequestBodySchema>;
export const PartnerJoinRequestBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export const AnalyticsEventSchema = z.object({
  userId: z.string(),
  eventName: z.string(),
  properties: z.record(z.string(), z.any()),
});