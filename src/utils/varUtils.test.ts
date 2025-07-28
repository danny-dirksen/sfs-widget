import path from "path";
import fs from "fs/promises";
import { varReadJSON, varWriteJSON, varDir } from "./varUtils";
import { z } from "zod/v4";

describe("varUtils", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const testData = { name: "Alice", age: 30 };

  it("should read and write JSON files correctly", async () => {
    const filename = "testData.json";

    // Write data to file
    const writeResult = await varWriteJSON(filename, testData);
    expect(writeResult).toBeNull();

    // Read data from file
    const readResult = await varReadJSON(filename, testSchema);
    expect(readResult).toEqual(testData);

    // Rewrite the file with different data
    const newData = { name: "Bob", age: 25 };
    const writeNewResult = await varWriteJSON(filename, newData);
    expect(writeNewResult).toBeNull();

    // Confirm that the new data is read correctly
    const newReadResult = await varReadJSON(filename, testSchema);
    expect(newReadResult).toEqual(newData);

    // Clean up the test file
    const filePath = path.join(varDir, filename);

    await fs.unlink(filePath);
  });

  it("should return null for non-existant files", async () => {
    const filename = "dne-1204u29u02592.json";
    const readResult = await varReadJSON(filename, testSchema);
    expect(readResult).toBeNull();
  });
});