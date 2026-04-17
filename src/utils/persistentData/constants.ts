import path from "path";

/** Path to the directory where persistent data is stored, including logs and cached data. */
export const PERSISTANCE_DIRECTORY = path.join(process.cwd(), "var");

/** Next.js cache tag for content data. */
export const CONTENT_CACHE_TAG = "content-cache";
/** Next.js cache tag for partner data. */
export const PARTNERS_CACHE_TAG = "partners-cache";
