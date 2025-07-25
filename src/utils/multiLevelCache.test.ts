import { multiLevelCache, CacheLevel } from "./multiLevelCache";

// Goals:
// 1. Ensure that caches are read in order of priority.
// 2. Ensure that if lvl n hits, lvls 0 to n-1 are written with the data.
// 3. Ensure that if all caches fail, an error is returned.

class MockCacheLevel implements CacheLevel<string> {
  constructor(
    private data: string | Error = new Error("Cache miss"),
    private canWrite: boolean = true,
  ) {}

  async read(): Promise<string | Error> {
    return this.data;
  }

  async write(newData: string): Promise<Error | null> {
    if (this.canWrite) {
      this.data = newData;
      return null;
    } else {
      return new Error("Write failed");
    }
  }
}

describe("multiLevelCache", () => {
  it("should return data from the first successful cache read", async () => {
    const cache1 = new MockCacheLevel("data from cache 1");
    const cache2 = new MockCacheLevel("data from cache 2");
    const cache3 = new MockCacheLevel();

    const cachedFunction = multiLevelCache([cache1, cache2, cache3]);

    const result = await cachedFunction();
    expect(result).toBe("data from cache 1");
  });

  it("should write to all closer caches on a hit", async () => {
    const cache1 = new MockCacheLevel();
    const cache2 = new MockCacheLevel("data from cache 2");
    const cache3 = new MockCacheLevel();

    const cachedFunction = multiLevelCache([cache1, cache2, cache3]);

    await cachedFunction();

    expect(await cache1.read()).toBe("data from cache 2");
  });

  it("should return an error if all caches fail", async () => {
    const cache1 = new MockCacheLevel();
    const cache2 = new MockCacheLevel();
    const cache3 = new MockCacheLevel();

    const cachedFunction = multiLevelCache([cache1, cache2, cache3]);

    const result = await cachedFunction();
    expect(result).toBeInstanceOf(Error);
  });

  it("should handle write failures gracefully", async () => {
    const cache1Error = new Error("Cache miss");
    const cache1 = new MockCacheLevel(cache1Error, false); // Cannot write
    const cache2 = new MockCacheLevel("data from cache 2");
    const cache3 = new MockCacheLevel();

    const cachedFunction = multiLevelCache([cache1, cache2, cache3]);

    const result = await cachedFunction();
    expect(result).toBe("data from cache 2");
    // Ensure cache1 did not change
    expect(await cache1.read()).toBe(cache1Error);
  });
});