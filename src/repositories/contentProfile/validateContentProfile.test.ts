import { ValidationError } from "@/utils/ValidationError";
import { ContentProfile } from "@/models/partners";
import { validateContentProfile } from "./validateContentProfile";

import { mockContent } from "../content/validateContent.test";

const mockPartners: ContentProfile[] = [
  {
    pic: "partner1",
    name: "Partner One",
    emailAddress: "partner1@example.com",
    emailSubject: "Free Music for Partner One!",
    url: "https://partner1.com",
    languages: ["english", "spanish"],
  },
  {
    pic: "partner2",
    name: "Partner Two",
    emailAddress: "partner2@example.com",
    emailSubject: "Free Music for Partner Two!",
    url: "https://partner2.com",
    languages: ["english"],
  },
];

describe("validateContentProfile", () => {
  it("should return null for valid data", () => {
    const result = validateContentProfile(mockPartners, mockContent);
    expect(result).toBeNull();
  });

  it("should detect duplicate partners", () => {
    const invalidPartners: ContentProfile[] = [
      ...mockPartners,
      mockPartners[0], // Duplicate Partner One
    ];
    const result = validateContentProfile(invalidPartners, mockContent);
    expect(result).toBeInstanceOf(ValidationError);
    expect(result?.problems).toEqual([
      'Partner with pic "partner1" is duplicated.',
    ]);
  });

  it("should detect missing language references in partners", () => {
    const invalidPartners: ContentProfile[] = [
      {
        ...mockPartners[0],
        languages: ["english", "french"] // 'french' does not exist in content
      },
      ...mockPartners.slice(1),
    ];
    const result = validateContentProfile(invalidPartners, mockContent);
    expect(result).toBeInstanceOf(ValidationError);
    expect(result?.problems).toEqual([
      'Language with languageId "french" is referenced in a partner profile but does not exist in the content.'
    ]);
  });
});