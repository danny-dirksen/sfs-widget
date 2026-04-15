import { parseChannelsTable } from "./content/tableParsers/parseChannelsTable";
import { parseLanguagesTable } from "./content/tableParsers/parseLanguagesTable";
import { parseLinksTable } from "./content/tableParsers/parseLinksTable";
import { parseResourcesTable } from "./content/tableParsers/parseResourcesTable";
import { parsePartnerTable } from "./contentProfile/tableParsers/parsePartnerTable";

import { PersistentData } from "@/repositories/persistentData";
import { removeUnlinkedContent } from "./removeUnlinkedContent";
import { ISpreadsheetRepo } from "./spreadsheet";
import { parseContent } from "./content/tableParsers/parseContent";
import { validateContentProfile } from "./contentProfile/validateContentProfile";
import { validateContent } from "./content/validateContent";

export async function parseSheet(
  doc: ISpreadsheetRepo,
): Promise<PersistentData | Error> {

  const content = await parseContent(doc);
  if (content instanceof Error) return content;

  // Check the persistent data for consistency.
  const contentValidationError = validateContent(content);
  if (contentValidationError) return contentValidationError;

  // Parse and validate partners separately, since they are referenced by the content and must be validated together.
  const partners = await parsePartnerTable(doc);
  if (partners instanceof Error) return partners;

  // Combine all data into a single object, then validate it.
  const persistentData: PersistentData = {
    lastUpdated: Date.now(),
    content,
    partners,
  };

  // Check the persistent data for consistency.
  const contentProfileValidationError = validateContentProfile(partners, content);
  if (contentProfileValidationError) return contentProfileValidationError;

  // If we reach this point, the data is valid.
  return {
    ...persistentData,
    content: removeUnlinkedContent(persistentData.content),
  }
}

// BUG: CD STILL DISPLAYS EVEN NO LINNKS ARE AVAILABLE
