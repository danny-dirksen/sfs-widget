import { z } from "zod";
import { Language } from "@/models/content";
import { parseTable } from "@/utils/parseTable";
import { ISpreadsheetRepo } from "../spreadsheet";

const LANGUAGES_SHEET_TITLE = "LANGUAGES";

// Required schema for each row in the table
const RowSchema = z.object({
  languageId: z.string(),
  languageDisplay: z.string(),
  languageInfo: z.string().optional(),
});

export async function parseLanguagesTable(
  sheetRepo: ISpreadsheetRepo,
): Promise<Language[] | Error> {
  const rawSheet = await sheetRepo.getTableByTitle(LANGUAGES_SHEET_TITLE);
  if (rawSheet instanceof Error) return rawSheet;

  const table = await parseTable({
    rawSheet,
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    languageId: row.data.languageId,
    autonym: row.data.languageDisplay,
    info: row.data.languageInfo || null,
  }));
}
