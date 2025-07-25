import { z } from "zod";
import { parseTable } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Resource } from "@/models/content";

// Required schema for each row in the table
const RowSchema = z.object({
  resourceId: z.string(),
});

export async function parseResourcesTable(
  document: GoogleSpreadsheet,
): Promise<Resource[] | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["RESOURCES"],
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    resourceId: row.data.resourceId,
  }));
}
