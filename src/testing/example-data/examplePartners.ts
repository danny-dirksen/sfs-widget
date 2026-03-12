import { PartnerInfo, ContentProfile } from "@/models/partners";
import { ISpreadsheet } from "@/models/spreadsheet";

export const EXAMPLE_PARTNER_INFO: PartnerInfo = {
  pic: "https://example.com/pic.jpg",
  name: "Example Partner",
  url: "https://example.com",
};

export const EXAMPLE_CONTENT_PROFILES: ContentProfile[] = [
  {
    pic: "https://example.com/pic1.jpg",
    name: "Partner One",
    url: "https://partnerone.com",
    emailAddress: "contact@partnerone.com",
    emailSubject: "Inquiry about partnership",
    languages: ["english", "spanish"],
  },
  {
    pic: "https://example.com/pic2.jpg",
    name: "Partner Two",
    url: "https://partnertwo.com",
    emailAddress: "contact-us@partnertwo.com",
    emailSubject: "Partnership Opportunity",
    languages: ["french"],
  },
];

export const EXAMPLE_CONTENT_PROFILES_SPREADSHEET: ISpreadsheet = {
  title: "PARTNERS",
  rows: [
    [undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined],
    ["pic", "name", "url", "emailAddress", "emailSubject", "languages"],
    ["https://example.com/pic1.jpg", "Partner One", "https://partnerone.com", "contact@partnerone.com", "Inquiry about partnership", "english, spanish"],
    ["https://example.com/pic2.jpg", "Partner Two", "https://partnertwo.com", "contact-us@partnertwo.com", "Partnership Opportunity", "french"],
  ],
};

export const EXAMPLE_PARTNERS_SPREADSHEETS: ISpreadsheet[] = [
  EXAMPLE_CONTENT_PROFILES_SPREADSHEET,
];