import { ISpreadsheet } from "@/models/spreadsheet";

export interface ISpreadsheetRepo {
  /**
   * Get a spreadsheet from the spreadsheet by its title.
   * @returns an ISpreadsheet object containing the spreadsheet's data, or a GetSpreadsheetPageError if the spreadsheet cannot be found or loaded.
   * @param spreadsheetTitle The title of the spreadsheet to retrieve.
   */
  getTableByTitle(spreadsheetTitle: string): Promise<ISpreadsheet | GetSpreadsheetPageError>;
}

export class GetSpreadsheetPageError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'GetSpreadsheetPageError';
    if (cause) {
      this.stack += `\nCaused by: ${cause.stack}`;
      this.cause = cause;
    }
  }
}