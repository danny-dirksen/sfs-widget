import { Content, Link} from "@/models/content";

/**
 * Removes content that is not linked to any enabled links.
 * This is useful for filtering out unused resources, translations, channels, etc.
 * @param content The full content object before filtering.
 * @param enabledLinks Optional. The links that are enabled for the current context (e.g., based on partner profile).
 * If not provided, all links in the content will be used.
 * @returns Filtered content object with only linked resources, translations, channels, and languages.
 */
export function removeUnlinkedContent(content: Content, enabledLinks: Link[] = content.links): Content {
  const { languages, resources, resourceTranslations, channels } = content;

  return {
    ...content,
    links: enabledLinks,
    // Include only resource translations that have links in their language and resource.
    resourceTranslations: resourceTranslations.filter((tran) =>
      enabledLinks.some(
        (link) =>
          link.languageId === tran.languageId &&
          link.resourceId === tran.resourceId,
      ),
    ),

    // Include only channels that have links with their channelId.
    channels: channels.filter((chan) =>
      enabledLinks.some((link) => link.channelId === chan.channelId),
    ),

    // Include only languages that have links with their languageId.
    languages: languages.filter((lang) =>
      enabledLinks.some((link) => link.languageId === lang.languageId),
    ),

    // Include only resources that have links with their resourceId.
    resources: resources.filter((res) =>
      enabledLinks.some((link) => link.resourceId === res.resourceId),
    ),
  };
}
