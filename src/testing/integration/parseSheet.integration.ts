// Integration test for parsing the content sheet.
// This test assumes that the Google Spreadsheet is set up correctly and contains the expected data.
// It will fail if the sheet structure changes or if the data is not as expected.
// This ensures that we do not deploy code that breaks the parsing logic.

import { createGoogleSpreadsheet, GoogleSpreadsheetRepo } from "@/repositories/spreadsheet/GoogleSheetsRepo";
import { parseSheet } from "../../repositories/content/tableParsers/parseContent";

describe("parseSheet", () => {
  it("should parse the sheet and return valid PersistentData", async () => {
    const doc = await createGoogleSpreadsheet();
    const spreadsheetRepo = new GoogleSpreadsheetRepo(doc);

    if (doc instanceof Error) {
      throw new Error("Failed to get Google Sheets document: " + doc.message);
    }
    const result = await parseSheet(spreadsheetRepo);
    if (result instanceof Error) throw result;

    // Ensure that general links are included
    const generalLinks = result.content.links.filter(l => !l.channelId);
    expect(generalLinks.length).toBeGreaterThan(0);
  });
});