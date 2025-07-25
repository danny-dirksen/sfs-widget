import { logger } from "./varUtils";

/**
 * Multi-level caching function.
 * - It reads from multiple caches in order, returning the first successful read.
 * - If all caches fail, returns an error.
 * - If a cache read is successful, it writes the data to all caches closer to the hit level.
 * @returns A function that returns a promise resolving to the cached data or an error.
 */
export function multiLevelCache<T>(
  /** An array of caches to read from and write to. */
  levels: CacheLevel<T>[],
): () => Promise<T | Error> {
  return async () => {
    for (let i = 0; i < levels.length; i++) {
      const cache = levels[i];
      const data = await cache.read();
      if (data instanceof Error) continue; // Skip to next cache if read fails

      // If read is successful, write to all closer caches.
      for (let j = 0; j < i; j++) {
        // If the cache has a write function, write the data.
        const writeError = await levels[j].write?.(data);
        if (writeError instanceof Error) {
          logger.error(`Failed to write to cache ${j}: ${writeError.message}`);
        }
      }
      return data;
    }
    return new Error("All caches failed to provide data.");
  };
}

/**
 * Represents a cache level with read and optional write operations.
 * @template T - The type of data stored in the cache.
 */
export interface CacheLevel<T> {
  /** Reads data from the cache. Returns data or an error if read fails/misses. */
  read: () => Promise<T | Error>;
  /** Optional. Writes data to the cache. Returns null on success or an error on failure. */
  write?: (data: T) => Promise<null | Error>;
}