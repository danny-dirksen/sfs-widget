import { z } from "zod";
import { parseTable } from "./parseTable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Link, ResourceTranslation } from "@/models/content";

// Required schema for each row in the table
const RowSchema = z.object({
  languageId: z.string().optional(),
  resourceId: z.string().optional(),
  resourceSuperTitle: z.string().optional(),
  resourceTitle: z.string().optional(),
  resourceInfo: z.string().optional(),
  allChannels: z.string().optional(),
});

export async function parseLinksTable(
  document: GoogleSpreadsheet,
): Promise<{ links: Link[]; resourceTranslations: ResourceTranslation[] } | Error> {
  const table = await parseTable({
    sheet: document.sheetsByTitle["LINKS"],
    schema: RowSchema,
  });
  
  if (table instanceof Error) return table;

  // We ignore lines without the required field ""
  const resourceTranslations: ResourceTranslation[] = table.rows.map((row): ResourceTranslation | null => {
    const {
      data: { resourceId, languageId, resourceSuperTitle, resourceTitle, resourceInfo },
    } = row;
    // Skip rows without required fields
    if (!resourceId || !languageId || !resourceTitle) return null;

    return {
      resourceId,
      languageId,
      line1: resourceSuperTitle || null,
      line2: resourceTitle,
      info: resourceInfo || null,
    };
  }).filter(rt => rt !== null);

  // This table is formmatted slightly differently than the others.
  // It contains all the fields listed above, then the rest are "channel links"
  // which must be parsed separately.
  const links: Link[] = table.rows.flatMap((row): Link[] => {
    
    const allChannelsColumn = row.headers.find(h => h.name === "allChannels")?.column;
    if (allChannelsColumn === undefined) {
      throw new Error("Missing 'allChannels' column in LINKS table");
    }
    // For each row, we extract all links from that row and combine them into a single array.
    const rowLinks: Link[] = row.headers
      // Only keep headers that are after the "allChannels" column
      .filter(h => h.column > allChannelsColumn)
      
      .map((h): Link | null => {
        const { resourceId, languageId } = row.data;
        if (!resourceId || !languageId) {
          return null;
        }
        return {
          resourceId,
          languageId,
          channelId: h.name,
          url: row.fields[h.name] || "",
        };
      })
      .filter(l => l !== null)
      .filter(link => link.url.trim() !== ""); // Filter out empty links
    return rowLinks;
  });


  return {
    links,
    resourceTranslations,
  };
}
