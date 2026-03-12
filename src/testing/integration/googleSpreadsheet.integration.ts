import { createGoogleSpreadsheet } from "@/repositories/spreadsheet/GoogleSheetsRepo";
import { GoogleSpreadsheetRepo } from "@/repositories/spreadsheet/GoogleSheetsRepo";

// Ensure that fetching of sheets works on google.
// Start with the CHANNELS table, ensuring headers are as expected, and that there are at least 2 rows of data (the first row is the header, so at least 3 rows total).

describe("GoogleSpreadsheetRepo", () => {
  it("should fetch the CHANNELS sheet and have the expected structure", async () => {
    const doc = await createGoogleSpreadsheet();
    const spreadsheetRepo = new GoogleSpreadsheetRepo(doc);

    if (doc instanceof Error) {
      throw new Error("Failed to get Google Sheets document: " + doc.message);
    }
    const result = await spreadsheetRepo.getTableByTitle("CHANNELS");
    if (result instanceof Error) throw result;

    expect(result.title).toBe("CHANNELS");
    expect(result.rows.length).toBeGreaterThan(4); // At least 5 rows (1 header + 4 data)
    const headerRow = result.rows[2];
    expect(headerRow.slice(0, 2)).toEqual(["channelId", "channelDisplay"]); // Check first 2 headers, can be expanded as needed
  });
});