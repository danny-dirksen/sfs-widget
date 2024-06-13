// This module ensures that all of the essential environment variables have been set.

type Env = {
  'MAILGUN_KEY': string;
  'MAILGUN_DOMAIN': string;
  'GOOGLE_SHEETS_ID': string;
  'GOOGLE_SHEETS_CONTENT_ID': string;
  'GOOGLE_SHEETS_CPT_ID': string;
  'GOOGLE_SERVICE_ACCOUNT_EMAIL': string;
  'GOOGLE_PRIVATE_KEY': string;
  'MAILCHIMP_KEY': string;
  'MAILCHIMP_PREFIX': string;
  'NEXT_PUBLIC_MIXPANEL_KEY_DEV': string;
  'NEXT_PUBLIC_MIXPANEL_KEY_PROD': string;
};

// Typescript magic to avoid having to type all those again
const required = [
  'MAILGUN_KEY',
  'MAILGUN_DOMAIN',
  'GOOGLE_SHEETS_ID',
  'GOOGLE_SHEETS_CONTENT_ID',
  'GOOGLE_SHEETS_CPT_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'MAILCHIMP_KEY',
  'MAILCHIMP_PREFIX',
  'NEXT_PUBLIC_MIXPANEL_KEY_DEV',
  'NEXT_PUBLIC_MIXPANEL_KEY_PROD',
] as const;

const missing = required.filter(
  key => !(key in process.env) || process.env[key] === 'Placeholder'
);

if (missing.length > 0) {
  throw new Error('Environment is missing the fields ' + missing);
}

export const env = process.env as unknown as Env;