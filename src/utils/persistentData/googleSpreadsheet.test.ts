import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

/**
 * This test ensures that the Google Sheets client and its ESM dependencies
 * can be loaded correctly in Jest's CommonJS environment.
 */
describe("Google Sheets dependency loading", () => {
  it("loads the spreadsheet client and its ESM dependencies in Jest", () => {
    const doc = new GoogleSpreadsheet("test-sheet", { apiKey: "test-api-key" });

    expect(doc).toBeInstanceOf(GoogleSpreadsheet);
  });

  it("loads the authentication transport's dynamic ESM dependencies", async () => {
    const auth = new JWT();
    const response = await auth.transporter.request<{ ok: boolean }>({
      url: 'data:application/json,{"ok":true}',
      responseType: "json",
    });

    expect(response.data).toEqual({ ok: true });
  });
});
