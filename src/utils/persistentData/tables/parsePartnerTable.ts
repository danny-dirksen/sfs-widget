import { z } from "zod";
import { parseTable } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { ContentProfile } from "@/models/partners";

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
  document: GoogleSpreadsheet,
): Promise<ContentProfile[] | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["PARTNERS"],
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    ...row.data,
    languages: row.data.languages.split(",").map((lang) => lang.trim()),
  }));
}