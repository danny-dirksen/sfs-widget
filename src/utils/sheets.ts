import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Content, ContentProfile, ContentProfileTable } from "./models";
import { parseContentSheet } from './parseContentSheet';
import { parseCptSheet } from './parseCptSheet';
import { varReadJSON, logger } from './varUtils';
import assert from 'assert';

// Used store sheet data.
let cpt: ContentProfileTable | null = null;
let content: Content | null = null;

// Get credentials from environment.
const creds: {private_key: string, client_email: string} = require("../../.env.gcloud.json");
assert(('private_key' in creds) && ('client_email' in creds), "'creds' is missing fields")

// Get sheet ids from environment.
const sheetId = process.env.SHEETS_ID!;
assert(sheetId, "Missing sheet id");

async function getSheet(): Promise<GoogleSpreadsheet> {
  // Get authenticated.
  const auth = new JWT({
    // email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // key: process.env.GOOGLE_PRIVATE_KEY,
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  // Load sheets document, properties, and worksheets
  const sheetsDoc = new GoogleSpreadsheet(sheetId, auth);
  await sheetsDoc.loadInfo();
  return sheetsDoc;
}

/**
 * Perform initial loading and parsing of sheet data.
 */
async function loadSheet() {
  const sheetsDoc = await getSheet();
  // Load new content using sheets, or saved json as a backup.
  const newContent = await parseContentSheet(sheetsDoc)
    || (await varReadJSON("content.json") as Content | null);
  const newCpt = await parseCptSheet(sheetsDoc)
    || (await varReadJSON("cpt.json") as ContentProfileTable | null);
  assert(newContent && newCpt, "Failed to load cpt and content.")

  // If both parse successfully, update static variables.
  content = newContent;
  cpt = newCpt;
  logger.info("Sheets data is loaded.");
}

/**
 * Reload and reparse sheet data.
 * @returns `true` if both successfully reloaded.
 */
export async function reloadSheet(): Promise<boolean> {
  // Load sheet from google docs.
  const sheetsDoc = await getSheet();
  // Attempt to parse both sheets.
  const newContent = await parseContentSheet(sheetsDoc);
  const newCpt = await parseCptSheet(sheetsDoc);
  if (!newContent || !newCpt) return false;

  // If both parse successfully, update static variables.
  content = newContent;
  cpt = newCpt;
  return true;
}

export async function getContentProfileTable(): Promise<ContentProfileTable | null> {
  if (!cpt) await loadSheet();
  if (!cpt) return null;
  return cpt;
};


export async function getPartner(pic: string | null): Promise<ContentProfile | null> {
  if (!cpt) await loadSheet();
  if (!cpt) return null;
  if (!pic) return null;
  const partner = cpt.partners.find(p => p.pic == pic) || null;
  return partner;
}

export async function getContent(pic: string | null): Promise<Content | null> {
  // Make sure content is loaded.
  if (!content) await loadSheet();
  if (!content) return null;

  // Find partner, send the whole thing if partner not found.
  const partner = await getPartner(pic);
  if (!partner) return content;

  // Send a filtered version of content if partner found.
  const { languages, resources, links, channels } = content;
  // Filter links and languages by languageId.
  const enabledLanguageIds = partner.languages;
  const enabledLanguages = languages.filter(lang => lang.languageId in enabledLanguageIds);
  const enabledLinks = links.filter(link => link.languageId in enabledLanguageIds);
  // Filter resources and channels by whether they occur in any of the enabled links.
  const enabledResources = resources.filter(
    res => (enabledLinks.some(link => link.resourceId = res.resouceId))
  );
  const enabledChannels = channels.filter(
    chan => (enabledLinks.some(link => link.channelId = chan.channelId))
  );
  // Return enabled content.
  return {
    ...content,
    languages: enabledLanguages,
    resources: enabledResources,
    links: enabledLinks,
    channels: enabledChannels
  }
};

loadSheet();