import { GoogleSpreadsheet } from "google-spreadsheet";
import { env } from "../env";
import { JWT } from "google-auth-library";

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
export async function getSheetDoc(): Promise<GoogleSpreadsheet | Error> {
  try {
    // Get authenticated.
    const auth = new JWT(creds);
    // Load sheets document, properties, and worksheets
    const sheetsDoc = new GoogleSpreadsheet(sheetId, auth);
    await sheetsDoc.loadInfo(false);
    return sheetsDoc;
  } catch (err) {
    return err instanceof Error ? err : new Error("Failed to get Google Sheets document: " + String(err));
  }
}