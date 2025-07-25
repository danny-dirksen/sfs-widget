// This module ensures that all of the essential environment variables have been set.
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: ['.env', '.env.local'],
  quiet: true,
});

const EnvSchema = z.object({
  MAILGUN_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
  GOOGLE_SHEETS_ID: z.string(),
  GOOGLE_SHEETS_CONTENT_ID: z.coerce.number().int(),
  GOOGLE_SHEETS_CPT_ID: z.coerce.number().int(),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  MAILCHIMP_KEY: z.string(),
  MAILCHIMP_PREFIX: z.string(),
  NEXT_PUBLIC_MIXPANEL_KEY_DEV: z.string(),
  NEXT_PUBLIC_MIXPANEL_KEY_PROD: z.string(),
});

type Env = z.infer<typeof EnvSchema>;

const parsedEnv = EnvSchema.safeParse(process.env);
if (!parsedEnv.success) {
  throw new Error(`Environment variables are not set correctly:\n${parsedEnv.error.message}`);
}

export const env: Env = parsedEnv.data;