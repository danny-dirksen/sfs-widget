import { PersistentData } from "@/models/PersistentData";


/**
 * We do not need to validate the entire `PersistentData` schema,
 * because we already do so with zod.
 * However, we still need to validate a few of the tables in
 * relation to each other.
 * This includes:
 * Making sure that ids, such as `channelId`, refer to existing objects.
 * -
 * @param param0
 */

export function validatePersistentData({
  content: {
    channels, languages, resources, resourceTranslations, links,
  }, partners,
}: PersistentData): ValidationError | null {
  // Make sure that ids are unique and refer to existing objects.
  // Channels
  const channelIds = new Set(channels.map(channel => channel.channelId));
  const referencedChannelIds = new Set<string>(
    links.map(link => link.channelId).filter(id => id !== null)
  );
  const missingChannelIds = referencedChannelIds.difference(channelIds);
  const duplicateChannelIds = findDuplicates(channels.map(channel => channel.channelId));

  // Languages
  const languageIds = new Set(languages.map(language => language.languageId));
  const referencedLanguageIds = new Set<string>([
    ...resourceTranslations.map(rt => rt.languageId),
    ...links.map(link => link.languageId),
  ]);
  const missingLanguageIds = referencedLanguageIds.difference(languageIds);
  const duplicateLanguageIds = findDuplicates(languages.map(language => language.languageId));

  // Resources
  const resourceIds = new Set(resources.map(resource => resource.resourceId));
  const referencedResourceIds = new Set<string>([
    ...resourceTranslations.map(rt => rt.resourceId),
    ...links.map(link => link.resourceId),
  ]);
  const missingResourceIds = referencedResourceIds.difference(resourceIds);
  const duplicateResourceIds = findDuplicates(resources.map(resource => resource.resourceId));

  // Resource Translations (no references)
  const duplicateTranslations = findDuplicates(
    resourceTranslations.map(rt => `"${rt.resourceId}" in "${rt.languageId}"`)
  );

  // Partners (no references. we call ids "pic" (partner identification code) for partners)
  const duplicatePartnerPics = findDuplicates(partners.map(partner => partner.pic));

  // Links (no references)
  const duplicateLinks = findDuplicates(
    links.map(link => `resourceId "${link.resourceId}" and languageId "${link.languageId}" on channel "${link.channelId ?? 'all'}"`)
  )

  // Throw an error if any duplicates are found
  const duplicateIds = [
    ...duplicateChannelIds.map(id => `Channel with channelId "${id}" is duplicated.`),
    ...duplicateLanguageIds.map(id => `Language with languageId "${id}" is duplicated.`),
    ...duplicateResourceIds.map(id => `Resource with resourceId "${id}" is duplicated.`),
    ...duplicateTranslations.map(translation => `Resource Translation ${translation} is duplicated.`),
    ...duplicatePartnerPics.map(pic => `Partner with pic "${pic}" is duplicated.`),
    ...duplicateLinks.map(link => `Link for ${link} is duplicated.`),
  ];
  if (duplicateIds.length > 0) {
    return new ValidationError(`Some entries are duplicated! Please ensure that all entries are unique.`, duplicateIds);
  }

  // Throw an error if any missing references are found
  const missingIds = [
    ...Array.from(missingChannelIds).map(id => `Channel with channelId "${id}" is referenced but does not exist.`),
    ...Array.from(missingLanguageIds).map(id => `Language with languageId "${id}" is referenced but does not exist.`),
    ...Array.from(missingResourceIds).map(id => `Resource with resourceId "${id}" is referenced but does not exist.`),
  ];
  if (missingIds.length > 0) {
    return new ValidationError(`Some references are missing! Please change the references or add the missing objects to their corresponding tables.`, missingIds);
  }

  // Check for conflicts between channel-specific links and general links
  const channelLinks = links.filter(link => link.channelId !== null);
  const generalLinks = links.filter(link => link.channelId === null);
  const conflicts = generalLinks
    .filter(generalLink => (
      channelLinks.some(channelLink =>
        channelLink.resourceId === generalLink.resourceId &&
        channelLink.languageId === generalLink.languageId
      )
    ))
    .map(generalLink => `Links for resourceId "${generalLink.resourceId}" and languageId "${generalLink.languageId}".`);
  if (conflicts.length > 0) {
    return new ValidationError(`Some links conflict with general links! This happens when a link is defined for a specific channel and also in the "All Channels" column, so we don't know which one to use.`, conflicts);
  }

  // If we reach this point, the data is valid.
  return null;
}

export class ValidationError extends Error {
  constructor(message: string, public problems: string[]) {
    super(message);
    this.name = "ValidationError";
  }

  toString() {
    return `${this.name}: ${this.message}\n\n${this.problems.map(p => `- ${p}`).join("\n")}`;
  }
}

/**
 * Finds duplicate strings in an array.
 * @param arr The array of strings to check for duplicates.
 * @returns An array of duplicate strings.
 */
function findDuplicates(arr: string[]): string[] {
  return Object.entries(countStrings(arr))
    .filter(([_, count]) => count > 1)
    .map(([str]) => str);
}

/**
 * Counts the occurrences of each string in an array.
 * @param arr The array of strings to count.
 * @returns An object mapping each string to its count.
 */
function countStrings(arr: string[]): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
}
