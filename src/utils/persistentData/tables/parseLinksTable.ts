/**
 * This table is a bit special because each row represents both
 * a resource translation and a set of links for it for each channel.
 */

import { z } from "zod";
import { parseTable, TableRow } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Link, ResourceTranslation } from "@/models/content";

// Required schema for each row in the table
// We don't know all of the channel IDs in advance, so we only define the known fields.
const LinkRowSchema = z.object({
  languageId: z.string().optional(),
  resourceId: z.string().optional(),
  resourceSuperTitle: z.string().optional(),
  resourceTitle: z.string().optional(),
  resourceInfo: z.string().optional(),
  allChannels: z.string().optional(),
});
type LinkRow = z.infer<typeof LinkRowSchema>;

export async function parseLinksTable(
  document: GoogleSpreadsheet,
): Promise<{ links: Link[]; resourceTranslations: ResourceTranslation[] } | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["LINKS"],
    schema: LinkRowSchema,
  });
  
  if (table instanceof Error) return table;

  const parsedRows = table.rows.map(parseLinksTableRow)
    .filter(r => r !== null);


  return {
    resourceTranslations: parsedRows.map(row => row.resourceTranslation),
    links: parsedRows.flatMap(row => row.links),
  };
}

function parseLinksTableRow(row: TableRow<LinkRow>): {
  resourceTranslation: ResourceTranslation,
  links: Link[],
} | null {
  const {
    languageId,
    resourceId,
    resourceInfo,
    resourceSuperTitle,
    resourceTitle,
    allChannels,
  } = row.data;

  // For this table, we silently ignore rows that do not have the required fields.
  if (!languageId || !resourceId || !resourceTitle) {
    return null;
  }

  const resourceTranslation: ResourceTranslation = {
    languageId,
    resourceId,
    line1: resourceSuperTitle ?? null,
    line2: resourceTitle,
    info: resourceInfo ?? null,
  };

  // Find the column index of the "allChannels" column
  // Channel-specific links come after this column
  const allChannelsColumn = row.headers.find(h => h.name === "allChannels")?.column;
  if (allChannelsColumn === undefined) {
    throw new Error("Missing 'allChannels' column in LINKS table");
  }

  // For each row, we extract all links from that row and combine them into a single array.
  const links: Link[] = row.headers
    // Only pay attention to headers that are after the "allChannels" column
    .filter(h => h.column > allChannelsColumn)
    .map((h): Link => {
      return {
        resourceId,
        languageId,
        channelId: h.name,
        url: row.fields[h.name] || "",
      };
    })
    // Filter out empty links
    .filter(link => link.url.trim() !== "");

  if (allChannels) {
    links.push({
      resourceId,
      languageId,
      channelId: null,
      url: allChannels,
    })
  }

  return { resourceTranslation, links };
}