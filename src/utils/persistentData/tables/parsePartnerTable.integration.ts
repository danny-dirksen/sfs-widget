import { parsePartnerTable } from "./parsePartnerTable";
import { getSheetDoc } from "../getSheetDoc";

describe("parsePartnerTable", () => {
  it("should parse the partner table correctly", async () => {
    const document = await getSheetDoc();
    if (document instanceof Error) throw document;
    const partners = await parsePartnerTable(document);
    if (partners instanceof Error) {
      throw partners;
    }

    expect(partners).toBeInstanceOf(Array);
    expect(partners.length).toBeGreaterThan(0);
    expect(partners[0]).toHaveProperty("pic");
    expect(partners[0].languages).toBeInstanceOf(Array);
    expect(partners[0].languages.length).toBeGreaterThan(0);
  });
});
