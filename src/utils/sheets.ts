import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import {
  Content,
  ContentProfile,
  ContentProfileTable,
  Link,
  PartnerInfo,
} from "./models";
import { parseContentSheet, removeStubs } from "./parseContentSheet";
import { parseCptSheet } from "./parseCptSheet";
import { varReadJSON, logger, varWriteJSON } from "./varUtils";
import { env } from "./env";
import assert from "assert";

// Used store sheet data.
let cpt: ContentProfileTable | null = null;
let content: Content | null = null;

// Get environment variables.
const sheetId = env.GOOGLE_SHEETS_ID!;
const creds = {
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
};

/**
 * Gets a freshly authenticated google spreadsheet context
 * @returns
 */
async function getSheet(): Promise<GoogleSpreadsheet | null> {
  try {
    // Get authenticated.
    const auth = new JWT(creds);
    // Load sheets document, properties, and worksheets
    const sheetsDoc = new GoogleSpreadsheet(sheetId, auth);
    await sheetsDoc.loadInfo();
    return sheetsDoc;
  } catch (err) {
    return null;
  }
}

/**
 * Perform initial loading and parsing of sheet data.
 * Attempts ot load json if google sheets doesn't work.
 */
async function loadContent() {
  // Load new content using sheets, or saved json as a backup.
  const sheetsDoc = await getSheet();

  // Load content
  let newContent = (await varReadJSON("content.json")) as Content | Error;
  if (newContent instanceof Error) {
    logger.error("Could not load content from json: " + newContent.message);
    logger.info("Trying sheet...");
    if (!sheetsDoc) throw new Error("Could not connect to google.");
    newContent = await parseContentSheet(sheetsDoc);
    if (newContent instanceof Error) {
      logger.error("Could not parse content from sheet: " + newContent.message);
      return;
    }
    // This is async, but we don't need to wait for it to return.
    varWriteJSON("content.json", newContent);
  }

  // Load content profile table
  let newCpt = (await varReadJSON("cpt.json")) as ContentProfileTable | Error;
  if (newCpt instanceof Error) {
    logger.error("Could not load cpt from json: " + newCpt.message);
    logger.info("Trying sheet...");
    if (!sheetsDoc) throw new Error("Could not connect to google.");
    newCpt = await parseCptSheet(sheetsDoc);
    if (newCpt instanceof Error) {
      logger.error("Could not parse cpt from sheet: " + newCpt.message);
      return;
    }
    // This is async, but we don't need to wait for it to return.
    varWriteJSON("cpt.json", newCpt);
  }

  // If both parse successfully, update static variables.
  content = newContent;
  cpt = newCpt;
  logger.info("Sheets data is loaded.");
}

/**
 * Reload and reparse sheet data.
 * @returns an Error there was one, or null if successful.
 */
export async function reloadSheet(): Promise<Error | null> {
  // Load sheet from google docs.
  const sheetsDoc = await getSheet();
  if (!sheetsDoc) throw new Error("Could not connect to google.");
  // Attempt to parse both sheets.
  const newContent = await parseContentSheet(sheetsDoc);
  const newCpt = await parseCptSheet(sheetsDoc);
  if (newContent instanceof Error) return newContent;
  if (newCpt instanceof Error) return newCpt;

  // If both parse successfully, update static variables and saved json models.
  content = newContent;
  cpt = newCpt;
  varWriteJSON("content.json", newContent);
  varWriteJSON("cpt.json", newCpt);
  return null;
}

export async function getContentProfileTable(): Promise<ContentProfileTable | null> {
  if (!cpt) await loadContent();
  if (!cpt) return null;
  return cpt;
}

export async function getContentProfile(
  pic: string | null,
): Promise<ContentProfile | null> {
  if (!cpt) await loadContent();
  if (!cpt) return null;
  if (!pic) return null;
  const partner = cpt.partners.find((p) => p.pic == pic) || null;
  return partner;
}

export async function getPartnerInfo(
  pic: string | null,
): Promise<PartnerInfo | null> {
  if (!pic) return null;
  const partner = await getContentProfile(pic);
  if (!partner) return null;
  const { name, url } = partner;
  return { pic, name, url };
}

export async function getPartnerList(): Promise<PartnerInfo[] | null> {
  if (!cpt) await loadContent();
  if (!cpt) return null;
  return cpt.partners.map(({ pic, name, url }) => ({ pic, name, url }));
}

export async function getContent(
  pic: string | null = null,
): Promise<Content | null> {
  // Make sure content is loaded.
  if (!content) await loadContent();
  if (!content) return null;

  // Find partner, send the whole thing if partner not found.
  const partner = await getContentProfile(pic);
  if (!partner) return content;

  // If partner found, send only the links in the partner's enabled languages.
  const enabledLanguageIds = partner.languages;
  const enabledLinks = content.links.filter((link) =>
    enabledLanguageIds.includes(link.languageId),
  );
  return removeStubs(content, enabledLinks);
}

loadContent();
