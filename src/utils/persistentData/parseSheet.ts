import { parseChannelsTable } from "./tables/parseChannelsTable";
import { parseLanguagesTable } from "./tables/parseLanguagesTable";
import { parseLinksTable } from "./tables/parseLinksTable";
import { parsePartnerTable } from "./tables/parsePartnerTable";
import { parseResourcesTable } from "./tables/parseResourcesTable";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { PersistentData } from "@/models/PersistentData";
import { validatePersistentData } from "./validatePersistentData";
import { removeUnlinkedContent } from "./removeUnlinkedContent";

export async function parseSheet(
  doc: GoogleSpreadsheet,
): Promise<PersistentData | Error> {

  const channels = await parseChannelsTable(doc);
  if (channels instanceof Error) return channels;

  const languages = await parseLanguagesTable(doc);
  if (languages instanceof Error) return languages;

  const resources = await parseResourcesTable(doc);
  if (resources instanceof Error) return resources;

  const linksTableResult = await parseLinksTable(doc);
  if (linksTableResult instanceof Error) return linksTableResult;
  const { links, resourceTranslations } = linksTableResult;

  const partners = await parsePartnerTable(doc);
  if (partners instanceof Error) return partners;

  // Combine all data into a single object, then validate it.
  const persistentData: PersistentData = {
    lastUpdated: Date.now(),
    content: {
      channels,
      languages,
      resources,
      resourceTranslations,
      links,
    },
    partners,
  };

  // Check the persistent data for consistency.
  const error = validatePersistentData(persistentData);
  if (error) return error;

  // If we reach this point, the data is valid.
  return {
    ...persistentData,
    content: removeUnlinkedContent(persistentData.content),
  }
}

// BUG: CD STILL DISPLAYS EVEN NO LINNKS ARE AVAILABLE
