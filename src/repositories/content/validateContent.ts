import { Content } from "@/models/content";
import { findDuplicates } from "@/utils/stringArrayUtils";
import { ValidationError } from "@/utils/ValidationError";

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


export function validateContent(content: Content): ValidationError | null {
  const { channels, languages, resources, resourceTranslations, links } = content;

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

  // Links (no references)
  const duplicateLinks = findDuplicates(
    links.map(link => `resourceId "${link.resourceId}" and languageId "${link.languageId}" on channel "${link.channelId ?? 'all'}"`)
  );

  // Throw an error if any duplicates are found
  const duplicateIds = [
    ...duplicateChannelIds.map(id => `Channel with channelId "${id}" is duplicated.`),
    ...duplicateLanguageIds.map(id => `Language with languageId "${id}" is duplicated.`),
    ...duplicateResourceIds.map(id => `Resource with resourceId "${id}" is duplicated.`),
    ...duplicateTranslations.map(translation => `Resource Translation ${translation} is duplicated.`),
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
      channelLinks.some(channelLink => channelLink.resourceId === generalLink.resourceId &&
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
