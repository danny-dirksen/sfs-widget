import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Channel, Content, Language, Link, Resource, ResourceTranslation } from './models';
import { env } from './env';
import assert from 'assert';

const contentSheetId = parseInt(env.GOOGLE_SHEETS_CONTENT_ID || '0');
assert(contentSheetId, 'Missing contentSheetId');

export async function parseContentSheet(sheetsDoc: GoogleSpreadsheet): Promise<Content | Error> {

  const sheet = sheetsDoc.sheetsById[contentSheetId];
  await sheet.loadCells(); // loads a range of cells

  /**
   * Shortcut for getting strings from sheet cells and ensuring length !== 0.
   * @param r Row index (e.g. 0)
   * @param c Column index (e.g. 0)
   * @returns Column value as a string, or null if empty.
   */
  const at = (r: number, c: number): string | null => {
    const val = sheet.getCell(r, c).stringValue;
    return (val && val.length > 0) ? val : null;
  }

  // Scan down from the top left to find the index of the header row.
  let headerRow: number | null = null;
  for (let r = 0; r < sheet.rowCount; r ++) {
    if (at(r, 0) === 'language.name') {
      headerRow = r;
      break;
    }
  }
  if (headerRow === null) return new Error('Could not find header row.');

  /**
   * Used for finding the index of a column with the specified label.
   * @example
   * {
   *  'lanugage': 0,
   *   'language.autonym': 1,
   *   ...
   * }
   */
  const labels: Record<string, number | null> = {
    'language.name': null,
    'language.autonym': null,
    'language.info': null,
    'resource.id': null,
    'resource.line1': null,
    'resource.line2': null,
    'resource.info': null,
    'resource.channels': null,
  }
  // Find labels in sheet header row.
  for (let c = 0; c < sheet.columnCount; c++) {
    const val = at(headerRow, c);
    if (val) labels[val] = c;
  }
  // Ensure that required labels are present.
  const missingFields = Object.keys(labels).filter(l => labels[l] === null);
  if (missingFields.length > 0) {
    throw new Error('Missing fields: ' + JSON.stringify(missingFields));
  }

  /** Start and end index of language section: [start, end) */
  const lastUpdated = Date.now();
  const languages: Language[] = [];
  const channels: Channel[] = [];
  const resources: Resource[] = [];
  const resourceTranslations: ResourceTranslation[] = [];
  const links: Link[] = [];

  // Load channel info.
  const chanStartCol = labels['resource.channels']! + 1; // Skip the 'all' column.
  const chanIdRow = headerRow + 1;
  const chanNameRow = headerRow + 2;
  for (let c = chanStartCol; c < sheet.columnCount; c ++) {
    const channelId = at(chanIdRow, c);
    const name = at(chanNameRow, c);
    if (!channelId) continue; // Skip rows without id.
    if (!name) return new Error('Channel ' + channelId + ' has id but no display name.');
    channels.push({channelId, name});
  }
  
  // Load languages and associated data one at a time.
  for (let start = headerRow + 1; start < sheet.rowCount; start ++) {
    // Skip rows without a language label.
    if (!at(start, labels['language.name']!)) continue
    // Add language to the list.
    const languageId = at(start, labels['language.name']!);
    const autonym = at(start, labels['language.autonym']!);
    const info = at(start, labels['language.info']!);
    if (!languageId || !autonym) {
      return new Error('Language is missing autonym (display name)');
    }
    languages.push({ languageId, autonym, info });
    // Find index of next language (or the end of the sheet).
    let end = sheet.rowCount;
    for (let r = start + 1; r < end; r ++) {
      if (at(r, labels['language.name']!)) {
        end = r;
        break;
      }
    }
    // Add resource translations for each language.
    for (let r = start; r < end; r ++) {
      // Ignore rows missing either id or line2.
      const resourceId = at(r, labels['resource.id']!);
      const line2 = at(r, labels['resource.line2']!);
      if (!resourceId || !line2) continue;
      const line1 = at(r, labels['resource.line1']!);
      const info = at(r, labels['resource.info']!);
      if (!resources.find(r => r.resourceId === resourceId)) {
        resources.push({ resourceId });
      }
      resourceTranslations.push({ languageId, resourceId, line1, line2, info });

      // Scan right, adding any links for this resource translation.
      for (let c = labels['resource.channels']!; c < sheet.columnCount; c ++) {
        const channelId = at(chanIdRow, c);
        const url = at(r, c);
        if (!url) continue;
        if (!channelId) {
          return new Error('Link ' + url + ' is not attached to a resource id or "all"');
        }
        const allChannels = c === labels['resource.channels']!;
        links.push({
          languageId, resourceId, url,
          channelId: allChannels ? null : channelId
        });
      }
    }
  }

  const content: Content = {
    lastUpdated,
    languages,
    channels,
    resourceTranslations,
    resources,
    links
  };

  // Remove anything that isn't covered in links.
  return removeStubs(content, links);
}

export function removeStubs(content: Content, enabledLinks: Link[]): Content {
  const { languages, resources, resourceTranslations, channels } = content;
  
  // Include only resource translations and channels that occur in enabled links.
  const enabledTranslations = resourceTranslations.filter(
    tran => (enabledLinks.some(link => (
      link.languageId === tran.languageId &&
      link.resourceId === tran.resourceId
    )))
  );
  const enabledChannels = channels.filter(
    chan => (enabledLinks.some(link => link.channelId === chan.channelId))
  );
  // Include only languages and resources that occur in the translations.
  const enabledLanguages = languages.filter(
    lang => (enabledTranslations.some(tran => tran.languageId === lang.languageId))
  );
  const enabledResources = resources.filter(
    res => (enabledTranslations.some(tran => tran.resourceId === res.resourceId))
  );
  // Return the enabled content.
  return {
    ...content,
    links: enabledLinks,
    resourceTranslations: enabledTranslations,
    channels: enabledChannels,
    languages: enabledLanguages,
    resources: enabledResources
  }
}