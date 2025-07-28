import { getSheetDoc } from "../getSheetDoc";
import { parseLinksTable } from "./parseLinksTable";

describe("parseLinksTable", () => {
  it("should parse the links table correctly", async () => {
    const sheetDoc = await getSheetDoc();
    if (sheetDoc instanceof Error) throw sheetDoc;
    const result = await parseLinksTable(sheetDoc);
    if (result instanceof Error) throw result;
    expect(result.links.length).toBeGreaterThan(0);
    const generalLinks = result.links.filter(link => !link.channelId);
    expect(generalLinks.length).toBeGreaterThan(0);
  });
});