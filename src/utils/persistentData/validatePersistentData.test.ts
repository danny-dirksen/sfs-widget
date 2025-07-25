import { validatePersistentData, ValidationError } from "./validatePersistentData";
import { PersistentData } from "@/models/PersistentData";

const mockPersistentData: PersistentData = {
  lastUpdated: Date.now(),
  content: {
    languages: [
      { languageId: "english", autonym: "English", info: "This is English." },
      { languageId: "spanish", autonym: "Español", info: "Esto es Español." },
    ],
    channels: [
      { channelId: "spotify", name: "Spotify" },
      { channelId: "youtube", name: "YouTube" },
    ],
    resources: [
      { resourceId: "volume1" },
      { resourceId: "volume2" },
    ],
    resourceTranslations: [
      { resourceId: "volume1", languageId: "english", line1: "Volume 1", line2: "God and Creation", info: "This is God and Creation, the first volume." },
      { resourceId: "volume1", languageId: "spanish", line1: "Volumen 1", line2: "Dios y Creación", info: "Este es Dios y Creación, el primer volumen." },
      { resourceId: "volume2", languageId: "english", line1: "Volume 2", line2: "The Fall and Salvation", info: "This is The Fall and Salvation, the second volume." },
      { resourceId: "volume2", languageId: "spanish", line1: "Volumen 2", line2: "La Caída y la Salvación", info: "Este es La Caída y la Salvación, el segundo volumen." },
    ],
    links: [
      // Volume 1
      { resourceId: "volume1", languageId: "english", channelId: "spotify", url: "https://spotify.com/volume1" },
      { resourceId: "volume1", languageId: "english", channelId: "youtube", url: "https://youtube.com/volume1" },
      { resourceId: "volume1", languageId: "spanish", channelId: "spotify", url: "https://spotify.com/volume1-es" },
      { resourceId: "volume1", languageId: "spanish", channelId: "youtube", url: "https://youtube.com/volume1-es" },

      // Volume 2
      { resourceId: "volume2", languageId: "english", channelId: "spotify", url: "https://spotify.com/volume2" },
      { resourceId: "volume2", languageId: "english", channelId: "youtube", url: "https://youtube.com/volume2" },
      { resourceId: "volume2", languageId: "spanish", channelId: "spotify", url: "https://spotify.com/volume2-es" },
      { resourceId: "volume2", languageId: "spanish", channelId: "youtube", url: "https://youtube.com/volume2-es" },
    ],
  },
  partners: [
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
  ],
};

describe("validatePersistentData", () => {
  it("should return null for valid data", () => {
    const result = validatePersistentData(mockPersistentData);
    expect(result).toBeNull();
  });

  it("should detect missing references", () => {
    const invalidData: PersistentData = {
      ...mockPersistentData,
      content: {
        ...mockPersistentData.content,
        // Missing spanish
        languages: [mockPersistentData.content.languages[0]],
        // Missing youtube channel
        channels: [mockPersistentData.content.channels[0]],
        // Missing volume2
        resources: [mockPersistentData.content.resources[0]],
      }
    };
    const result = validatePersistentData(invalidData);
    expect(result).toBeInstanceOf(ValidationError);
    expect(result?.message).toContain("Some references are missing!");
    expect(result?.problems).toEqual([
      'Channel with channelId "youtube" is referenced but does not exist.',
      'Language with languageId "spanish" is referenced but does not exist.',
      'Resource with resourceId "volume2" is referenced but does not exist.',
    ]);
  });

  it("should detect duplicate entries", () => {
    const validContent = mockPersistentData.content;
    const invalidData: PersistentData = {
      ...mockPersistentData,
      content: {
        ...validContent,
        languages: [
          ...validContent.languages,
          validContent.languages[0], // Duplicate English
        ],
        channels: [
          ...validContent.channels,
          validContent.channels[0], // Duplicate Spotify
        ],
        resources: [
          ...validContent.resources,
          validContent.resources[0], // Duplicate Volume 1
        ],
        resourceTranslations: [
          ...validContent.resourceTranslations,
          validContent.resourceTranslations[0], // Duplicate English Volume 1
        ],
        links: [
          ...validContent.links,
          validContent.links[0], // Duplicate link for Volume 1 English Spotify
        ],
      },
      partners: [
        ...mockPersistentData.partners,
        mockPersistentData.partners[0], // Duplicate Partner One
      ],
    };

    const result = validatePersistentData(invalidData);
    expect(result).toBeInstanceOf(ValidationError);
    expect(result?.problems).toEqual([
      'Channel with channelId "spotify" is duplicated.',
      'Language with languageId "english" is duplicated.',
      'Resource with resourceId "volume1" is duplicated.',
      'Resource Translation "volume1" in "english" is duplicated.',
      'Partner with pic "partner1" is duplicated.',
      'Link for resourceId "volume1" and languageId "english" on channel "spotify" is duplicated.',
    ]);
  });

  it("should detect conflicts between channel-specific links and general links", () => {
    const invalidData = {
      ...mockPersistentData,
      content: {
        ...mockPersistentData.content,
        links: [
          ...mockPersistentData.content.links,
          // Adding a general link for Volume 1 English
          { resourceId: "volume1", languageId: "english", channelId: null, url: "https://general-link.com/volume1" },
        ],
      },
    };

    const result = validatePersistentData(invalidData);
    expect(result).toBeInstanceOf(ValidationError);
    expect(result?.problems).toEqual([
      'Links for resourceId "volume1" and languageId "english".'
    ]);
  });
});