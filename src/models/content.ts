import { z } from "zod/v4";

export const ChannelSchema = z.object({
  channelId: z.string(),
  name: z.string(),
});
export type Channel = z.infer<typeof ChannelSchema>;

export const LanguageSchema = z.object({
  languageId: z.string(),
  autonym: z.string(),
  info: z.string().nullable(),
});
export type Language = z.infer<typeof LanguageSchema>;

export const ResourceSchema = z.object({
  resourceId: z.string(),
});
export type Resource = z.infer<typeof ResourceSchema>;

export const ResourceTranslationSchema = z.object({
  resourceId: z.string(),
  languageId: z.string(),
  line1: z.string().nullable(),
  line2: z.string(),
  info: z.string().nullable(),
});
export type ResourceTranslation = z.infer<typeof ResourceTranslationSchema>;

export const LinkSchema = z.object({
  resourceId: z.string(),
  languageId: z.string(),
  /** If ommitted, the link shows up regardless of channel. */
  channelId: z.string().nullable(),
  url: z.string(),
});
export type Link = z.infer<typeof LinkSchema>;

export const ContentSchema = z.object({
  channels: z.array(ChannelSchema),
  languages: z.array(LanguageSchema),
  resources: z.array(ResourceSchema),
  resourceTranslations: z.array(ResourceTranslationSchema),
  links: z.array(LinkSchema),
});
export type Content = z.infer<typeof ContentSchema>;
