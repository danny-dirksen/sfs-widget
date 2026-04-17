import {
  ContentProfile,
  PartnerInfo,
} from "@/models/partners";
import { Content } from "@/models/content";
import { removeUnlinkedContent } from "./removeUnlinkedContent";
import { varReadJSON, varWriteJSON } from "./fileUtils";
import { logger } from "../logger";
import { PersistentData, PersistentDataSchema } from "@/models/PersistentData";
import { parseSheet } from "./parseSheet";
import { CacheLevel, multiLevelCache } from "../multiLevelCache";
import { getSheetDoc } from "./getSheetDoc";
import { cacheTag, revalidatePath, revalidateTag } from 'next/cache'
import { PARTNERS_CACHE_TAG, CONTENT_CACHE_TAG } from "./constants";

const sheetCache: CacheLevel<PersistentData> = {
  read: async () => {
    const doc = await getSheetDoc();
    if (doc instanceof Error) return doc;
    return await parseSheet(doc);
  },
};

const fileCache: CacheLevel<PersistentData> = {
  read: async () => {
    return await varReadJSON("persistentData.json", PersistentDataSchema) ?? new Error("File not found.");
  },
  write: async (data: PersistentData) => {
    return await varWriteJSON("persistentData.json", data);
  },
};

/**
 * Simple caching for persistent data retrieval.
 * 1. (checked 1st): Local file system cache with zod validation.
 * 2. (If the L1 misses): it parses from the provided Google Sheets function.
 */
export const getPersistentData = multiLevelCache<PersistentData>([
  fileCache,
  sheetCache,
]);

/**
 * Reload and reparse sheet data.
 * @returns an Error there was one, or null if successful.
 */
export async function reloadSheet(): Promise<Error | null> {
  const result = await sheetCache.read();
  if (result instanceof Error) {
    logger.error("Failed to reload sheet data: " + result.message);
    return result;
  }
  // Don't care if they fail, just log them.
  await fileCache.write?.(result);
  logger.info("Sheet data reloaded successfully.");

  revalidatePath("/"); // Revalidate the homepage to update the cache there as well.
  revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
  revalidateTag(PARTNERS_CACHE_TAG, { expire: 0 });
  return null;
}

export async function getContentProfiles(): Promise<ContentProfile[] | Error> {
  "use cache";
  cacheTag(PARTNERS_CACHE_TAG);
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners;
}

export async function getContentProfile(
  pic: string,
): Promise<ContentProfile | null | Error> {
  "use cache";
  cacheTag(PARTNERS_CACHE_TAG);
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners.find((partner) => partner.pic === pic) ?? null;
}

export async function getPartnerInfoList(): Promise<PartnerInfo[] | Error> {
  "use cache";
  cacheTag(PARTNERS_CACHE_TAG);
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners.map(({ pic, name, url }) => ({ pic, name, url }));
}

export async function getPartnerInfo(
  pic: string,
): Promise<PartnerInfo | Error | null> {
  "use cache";
  cacheTag(PARTNERS_CACHE_TAG);
  const data = await getPersistentData();
  if (data instanceof Error) return data;
  const partner = data.partners.find((p) => p.pic === pic);
  return partner
    ? { pic: partner.pic, name: partner.name, url: partner.url }
    : null;
}

export async function getContent(
  pic: string | null = null,
): Promise<Content | Error> {
  "use cache";
  cacheTag(CONTENT_CACHE_TAG);
  const data = await getPersistentData();
  if (data instanceof Error) return data;
  const { content } = data;

  
  const contentProfile = pic ? await getContentProfile(pic) : null;
  if (contentProfile instanceof Error) return contentProfile;
  // If no pic is provided or if the partner does not have language restrictions, return all content.
  if (!contentProfile || contentProfile.languages.length === 0) return content;

  // If partner found, send only the links in the partner's enabled languages.
  const enabledLanguageIds = contentProfile.languages;
  const enabledLinks = content.links.filter((link) => (
    enabledLanguageIds.includes(link.languageId)
  ));
  return removeUnlinkedContent(content, enabledLinks);
}

// If not in test mode, make sure we have the persistent data loaded for faster access.
if (process.env.NODE_ENV !== "test") {
  getPersistentData();
}