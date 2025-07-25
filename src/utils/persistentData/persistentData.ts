import {
  ContentProfile,
  PartnerInfo,
} from "@/models/partners";
import { Content } from "@/models/content";
import { removeUnlinkedContent } from "./removeUnlinkedContent";
import { varReadJSON, logger, varWriteJSON } from "../varUtils";
import { PersistentData, PersistentDataSchema } from "@/models/PersistentData";
import { parseSheet } from "./parseSheet";
import { CacheLevel, multiLevelCache } from "../multiLevelCache";
import { getSheetDoc } from "./getSheetDoc";

const sheetCache: CacheLevel<PersistentData> = {
  read: async () => {
    const doc = await getSheetDoc();
    if (doc instanceof Error) return doc;
    return await parseSheet(doc);
  },
};

const fileCache: CacheLevel<PersistentData> = {
  read: async () => {
    return await varReadJSON("persistentData.json", PersistentDataSchema);
  },
  write: async (data: PersistentData) => {
    return await varWriteJSON("persistentData.json", data);
  },
};

let runtimeValue: PersistentData | null = null;
const runtimeCache: CacheLevel<PersistentData> = {
  read: async () => {
    return runtimeValue ?? new Error("No runtime cache value set.");
  },
  write: async (data: PersistentData) => {
    runtimeValue = data;
    return null; // No error
  },
};

/**
 * 3-level caching for persistent data retrieval.
 * 1. (checked first): In-memory cache (runtime).
 * 2. (checked 2nd): Local file system cache with zod validation.
 * 3. (If the L1 and L2 miss): it parses from the provided Google Sheets function.
 */
export const getPersistentData = multiLevelCache<PersistentData>([
  runtimeCache,
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
  await runtimeCache.write?.(result);
  logger.info("Sheet data reloaded successfully.");
  return null;
}

export async function getContentProfiles(): Promise<ContentProfile[] | Error> {
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners;
}

export async function getContentProfile(
  pic: string,
): Promise<ContentProfile | null | Error> {
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners.find((partner) => partner.pic === pic) ?? null;
}

export async function getPartnerInfoList(): Promise<PartnerInfo[] | Error> {
  const data = await getPersistentData();
  return data instanceof Error
    ? data
    : data.partners.map(({ pic, name, url }) => ({ pic, name, url }));
}

export async function getPartnerInfo(
  pic: string,
): Promise<PartnerInfo | Error | null> {
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