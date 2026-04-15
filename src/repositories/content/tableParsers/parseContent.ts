import { removeUnlinkedContent } from "@/repositories/removeUnlinkedContent";
import { ISpreadsheetRepo } from "@/repositories/spreadsheet";
import { validateContent } from "@/repositories/content/validateContent";
import { parseChannelsTable } from "./parseChannelsTable";
import { parseLanguagesTable } from "./parseLanguagesTable";
import { parseLinksTable } from "./parseLinksTable";
import { parseResourcesTable } from "./parseResourcesTable";
import { Content } from "@/models/content";

export async function parseContent(
  doc: ISpreadsheetRepo,
): Promise<Content | Error> {

  const channels = await parseChannelsTable(doc);
  if (channels instanceof Error) return channels;

  const languages = await parseLanguagesTable(doc);
  if (languages instanceof Error) return languages;

  const resources = await parseResourcesTable(doc);
  if (resources instanceof Error) return resources;

  const linksTableResult = await parseLinksTable(doc);
  if (linksTableResult instanceof Error) return linksTableResult;
  const { links, resourceTranslations } = linksTableResult;

  // Combine all data into a single object, then validate it.
  const content: Content = {
    channels,
    languages,
    resources,
    resourceTranslations,
    links,
  };

  // If we reach this point, the data is valid.
  return removeUnlinkedContent(content);
}

// BUG: CD STILL DISPLAYS EVEN NO LINNKS ARE AVAILABLE
