import { z } from "zod";
import { Channel } from "@/models/content";
import { parseTable } from "@/utils/parseTable";
import { ISpreadsheetRepo } from "../../spreadsheet";

const CHANNELS_SHEET_TITLE = "CHANNELS";

// Required schema for each row in the table
const RowSchema = z.object({
  channelId: z.string(),
  channelDisplay: z.string(),
});

export async function parseChannelsTable(
  sheetRepo: ISpreadsheetRepo,
): Promise<Channel[] | Error> {
  const rawSheet = await sheetRepo.getTableByTitle(CHANNELS_SHEET_TITLE);
  if (rawSheet instanceof Error) return rawSheet;

  const table = await parseTable({
    rawSheet,
    schema: RowSchema,
  });

  if (table instanceof Error) return table;

  return table.rows.map((row) => ({
    channelId: row.data.channelId,
    name: row.data.channelDisplay,
  }));
}
