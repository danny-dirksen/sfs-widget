import { subscribe } from "./subscribe";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { logger } from "../logger";

jest.mock("@mailchimp/mailchimp_marketing");
jest.mock("../logger");

const mockGetListMember = jest.fn();
const mockSetListMember = jest.fn();

(mailchimp as any).lists = {
  getListMember: mockGetListMember,
  setListMember: mockSetListMember,
};

const mockLogger = logger as any;

const email = "test@example.com";
const firstName = "Test";
const lastName = "User";
const listId = "2458faf7dd";

describe("subscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true if already subscribed", async () => {
    mockGetListMember.mockResolvedValue({ status: "subscribed", email_address: email });
    const result = await subscribe(email, firstName, lastName);
    expect(result).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("has already subscribed")
    );
  });

  it("returns true if already unsubscribed", async () => {
    mockGetListMember.mockResolvedValue({ status: "unsubscribed", email_address: email });
    const result = await subscribe(email, firstName, lastName);
    expect(result).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("has already unsubscribed")
    );
  });

  it("subscribes new user successfully", async () => {
    mockGetListMember.mockRejectedValue(new Error("Not Found")); // Simulate member not found
    mockSetListMember.mockResolvedValue({ email_address: email, full_name: `${firstName} ${lastName}` });
    const result = await subscribe(email, firstName, lastName);
    expect(result).toBe(true);
    expect(mockSetListMember).toHaveBeenCalledWith(
      listId,
      email,
      expect.objectContaining({
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: firstName, LNAME: lastName },
      })
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("Subscribed")
    );
  });

  it("returns false and logs error if getListMember fails", async () => {
    mockGetListMember.mockResolvedValue(new Error("fail"));
    const result = await subscribe(email, firstName, lastName);
    expect(result).toBe(false);
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("returns false and logs error if setListMember fails", async () => {
    mockGetListMember.mockRejectedValue(new Error("Not Found")); // Simulate member not found
    mockSetListMember.mockResolvedValue(new Error("Bad Request"));
    const result = await subscribe(email, firstName, lastName);
    expect(result).toBe(false);
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
