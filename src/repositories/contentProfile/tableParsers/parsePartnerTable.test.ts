import { EXAMPLE_CONTENT_PROFILES } from "@/testing/example-data/examplePartners";
import { parsePartnerTable } from "./parsePartnerTable";
import { FakeSpreadsheetRepo } from "@/testing/helpers/FakeSpreadsheetRepo";

describe("parsePartnerTable", () => {
  it("should parse the partner table correctly", async () => {
    const partners = await parsePartnerTable(new FakeSpreadsheetRepo());
    if (partners instanceof Error) {
      throw partners;
    }
    expect(partners).toMatchObject(EXAMPLE_CONTENT_PROFILES);
  });
});
