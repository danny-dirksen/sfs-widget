import { ISpreadsheet } from "@/models/spreadsheet";
import { ISpreadsheetRepo } from "@/repositories/spreadsheet";
import { EXAMPLE_SPREADSHEETS } from "../example-data/exampleSpreadsheets";

export class FakeSpreadsheetRepo implements ISpreadsheetRepo {
  constructor(private sheets: ISpreadsheet[] = EXAMPLE_SPREADSHEETS) {}

  async getTableByTitle(title: string): Promise<ISpreadsheet | Error> {
    const sheet = this.sheets.find(sheet => sheet.title === title);
    if (!sheet) {
      return new Error(`Sheet with title "${title}" not found`);
    }
    return sheet;
  }
}