import { GoogleSpreadsheet } from "google-spreadsheet";
import { ContentProfile, ContentProfileTable } from "@/models/models";
import { env } from "../env";
import assert from "assert";

const cptSheetId = parseInt(env.GOOGLE_SHEETS_CPT_ID || "0");
assert(cptSheetId, "Missing cptSheetId");

export async function parseCptSheet(
  sheetsDoc: GoogleSpreadsheet,
): Promise<ContentProfileTable | Error> {
  const sheet = sheetsDoc.sheetsById[cptSheetId];
  await sheet.loadCells(); // loads a range of cells

  /**
   * Shortcut for getting strings from sheet cells and ensuring length !== 0.
   * @param r Row index (e.g. 0)
   * @param c Column index (e.g. 0)
   * @returns Column value as a string, or null if empty.
   */
  const at = (r: number, c: number): string | null => {
    const val = sheet.getCell(r, c).stringValue;
    return val && val.length > 0 ? val : null;
  };

  /**
   * Finds all the headers in a row, to make it easier to find the column
   * of a header given its name.
   * @param row Row to look in.
   * @returns header->column number map, or an error message.
   */
  const findHeaders = (
    row: number,
    required: string[],
  ): Record<string, number> | string => {
    const headers: Record<string, number> = {};
    for (let c = 0; c < sheet.columnCount; c++) {
      const header = at(row, c);
      if (header) headers[header] = c;
    }
    const missing = required.filter((header) => !(header in headers));
    if (missing.length > 0) {
      return "Could not find headers " + JSON.stringify(missing);
    }
    return headers;
  };

  const lastUpdated = Date.now();
  const partners: ContentProfile[] = [];

  // Locate two levels of headers as landmarks.
  let l1HeaderRow: number | null = null;
  let l2HeaderRow: number | null = null;
  for (let r = 0; r < sheet.rowCount; r++) {
    if (at(r, 0) === "pic") {
      l1HeaderRow = r;
      l2HeaderRow = r + 1;
      break;
    }
  }
  if (!l1HeaderRow || !l2HeaderRow) {
    return new Error('Could not find "pic" header.');
  }

  // Find the indices of all header fields and ensure that required headers are present.
  const l1Headers = findHeaders(l1HeaderRow, [
    "pic",
    "name",
    "url",
    "emailAddress",
    "emailSubject",
    "languages",
  ]);
  if (typeof l1Headers === "string") return new Error(l1Headers);

  // Add each content profile (row in CPT)
  for (let r = l2HeaderRow + 1; r < sheet.rowCount; r++) {
    // Parse basic info about them.
    const pic = at(r, l1Headers["pic"]);
    if (!pic) continue; // Skip blank row.
    const name = at(r, l1Headers["name"]);
    const url = at(r, l1Headers["url"]);
    const emailAddress = at(r, l1Headers["emailAddress"]);
    const emailSubject = at(r, l1Headers["emailSubject"]);
    if (!name || !url || !emailAddress || !emailSubject) {
      return new Error(pic + " missing some fields.");
    }

    // Find out which languages they have enabled.
    const languages: string[] = [];
    for (let c = l1Headers["languages"]; c < sheet.columnCount; c++) {
      if (!at(r, c)) continue;
      const language = at(l2HeaderRow, c);
      if (!language) {
        return Error(
          `Row ${r} column ${c} is checked, but no language in that column.'`,
        );
      }
      languages.push(language);
    }

    partners.push({ pic, name, url, emailAddress, emailSubject, languages });
  }

  const cpt: ContentProfileTable = { lastUpdated, partners };

  return cpt;
}
