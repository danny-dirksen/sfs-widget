import { z } from "zod";
import { Resource } from "@/models/content";
import { parseTable } from "@/utils/parseTable";
import { ISpreadsheetRepo } from "../spreadsheet";

const RESOURCES_SHEET_TITLE = "RESOURCES";

// Required schema for each row in the table
const RowSchema = z.object({
  resourceId: z.string(),
});

export async function parseResourcesTable(
  sheetRepo: ISpreadsheetRepo,
): Promise<Resource[] | Error> {
  const rawSheet = await sheetRepo.getTableByTitle(RESOURCES_SHEET_TITLE);
  if (rawSheet instanceof Error) return rawSheet;

  const table = await parseTable({
    rawSheet,
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    resourceId: row.data.resourceId,
  }));
}
