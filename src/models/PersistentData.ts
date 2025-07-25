import { z } from "zod/v4";

import { ContentSchema } from "@/models/content";
import { ContentProfileSchema } from "./partners";

/**
 * The application uses one `PersistentData` object to store all data that is not
 * expected to change frequently, such as content and partner profiles.
 * It is loaded from the google sheet and may reload during the lifetime of the application.
 * This data is loaded once and gets reloaded from the google sheet via a webhook.
 */
export type PersistentData = z.infer<typeof PersistentDataSchema>;
export const PersistentDataSchema = z.object({
  lastUpdated: z.number(),
  content: ContentSchema,
  partners: z.array(ContentProfileSchema),
});
