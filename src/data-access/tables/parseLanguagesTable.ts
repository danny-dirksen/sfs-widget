import { z } from "zod";
import { parseTable } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Language } from "@/models/content";

// Required schema for each row in the table
const RowSchema = z.object({
  languageId: z.string(),
  languageDisplay: z.string(),
  languageInfo: z.string().optional(),
});

export async function parseLanguagesTable(
  document: GoogleSpreadsheet,
): Promise<Language[] | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["LANGUAGES"],
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    languageId: row.data.languageId,
    autonym: row.data.languageDisplay,
    info: row.data.languageInfo || null,
  }));
}
