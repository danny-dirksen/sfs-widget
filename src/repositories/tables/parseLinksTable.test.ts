import { FakeSpreadsheetRepo } from "@/testing/helpers/FakeSpreadsheetRepo";
import { parseLinksTable } from "./parseLinksTable";

describe("parseLinksTable", () => {
  it("should parse the links table correctly", async () => {
    const result = await parseLinksTable(new FakeSpreadsheetRepo());
    if (result instanceof Error) throw result;
    expect(result.links.length).toBeGreaterThan(0);
    const generalLinks = result.links.filter(link => !link.channelId);
    expect(generalLinks.length).toBeGreaterThan(0);
  });
});