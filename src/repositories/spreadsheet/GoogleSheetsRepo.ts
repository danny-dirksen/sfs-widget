import { GoogleSpreadsheet, GoogleSpreadsheetCellErrorValue, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { env } from "@/utils/env";
import { JWT } from "google-auth-library";
import { GetSpreadsheetPageError, ISpreadsheetRepo } from ".";
import { ISpreadsheet } from "@/models/spreadsheet";

/**
 * Concrete implementation of ITableRepo that uses the google-spreadsheet library to fetch data from a Google Sheets document.
 */
export class GoogleSpreadsheetRepo implements ISpreadsheetRepo {

  constructor(private sheetsDoc: GoogleSpreadsheet) {}

  async getTableByTitle(sheetTitle: string): Promise<ISpreadsheet | GetSpreadsheetPageError> {
    await this.sheetsDoc.loadInfo(false);
    const sheet: GoogleSpreadsheetWorksheet | undefined = this.sheetsDoc.sheetsByTitle[sheetTitle];
    if (!sheet) {
      return new GetSpreadsheetPageError(`Sheet with title "${sheetTitle}" not found.`);
    }

    await sheet.loadCells();

    const numRows = sheet.rowCount;
    const numCols = sheet.columnCount;
    const rawRows: (string | undefined)[][] = [];

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const row: (string | undefined)[] = [];
      for (let colIndex = 0; colIndex < numCols; colIndex++) {
        const { value } = sheet.getCell(rowIndex, colIndex);
        if (value instanceof GoogleSpreadsheetCellErrorValue) {
          return new GetSpreadsheetPageError(`Error in cell at row ${rowIndex + 1}, column ${colIndex + 1}: ${value.type}, ${value.message}`);
        }
        row.push(value ? String(value) : undefined);
      }
      rawRows.push(row);
    }

    return {
      title: sheetTitle,
      rows: rawRows,
    }
  }
}

/**
 * Factory function to create a GoogleSpreadsheet instance with authentication.
 * @returns a GoogleSpreadsheet instance ready for use, but not loaded with data yet.
 */
export function createGoogleSpreadsheet(): GoogleSpreadsheet {
  const sheetId = env.GOOGLE_SHEETS_ID!;
  const creds = {
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  };
  const auth = new JWT(creds);
  return new GoogleSpreadsheet(sheetId, auth);
}