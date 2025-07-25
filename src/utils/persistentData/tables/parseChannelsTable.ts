import { z } from "zod";
import { parseTable } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Channel } from "@/models/content";

// Required schema for each row in the table
const RowSchema = z.object({
  channelId: z.string(),
  channelDisplay: z.string(),
});

export async function parseChannelsTable(
  document: GoogleSpreadsheet,
): Promise<Channel[] | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["CHANNELS"],
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    channelId: row.data.channelId,
    name: row.data.channelDisplay,
  }));
}
