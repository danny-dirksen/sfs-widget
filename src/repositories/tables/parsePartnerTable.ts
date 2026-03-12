import { z } from "zod";
import { ContentProfile } from "@/models/partners";
import { parseTable } from "@/utils/parseTable";
import { ISpreadsheetRepo } from "../spreadsheet";

const PARTNERS_SHEET_TITLE = "PARTNERS";

// Required schema for each row in the table
const RowSchema = z.object({
  pic: z.string(),
  name: z.string(),
  url: z.string(),
  emailAddress: z.string(),
  emailSubject: z.string(),
  languages: z.string(),
});

export async function parsePartnerTable(
  sheetRepo: ISpreadsheetRepo,
): Promise<ContentProfile[] | Error> {
  const rawSheet = await sheetRepo.getTableByTitle(PARTNERS_SHEET_TITLE);
  if (rawSheet instanceof Error) return rawSheet;

  const table = await parseTable({
    rawSheet,
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    ...row.data,
    languages: row.data.languages.split(",").map((lang) => lang.trim()),
  }));
}