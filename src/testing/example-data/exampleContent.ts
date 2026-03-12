import { Channel, Language, Resource, ResourceTranslation, Link, Content } from "@/models/content";

import { ISpreadsheet } from "@/models/spreadsheet";

export const EXAMPLE_CHANNELS_SPREADSHEET: ISpreadsheet = {
  title: "CHANNELS",
  rows: [
    [undefined, undefined],
    [undefined, undefined],
    ["channelId", "channelDisplay"],
    ["channel1", "Channel One"],
    ["channel2", "Channel Two"],
    ["channel3", "Channel Three"],
  ],
};

export const EXAMPLE_CHANNELS: Channel[] = [
  { channelId: "channel1", name: "Channel One" },
  { channelId: "channel2", name: "Channel Two" },
  { channelId: "channel3", name: "Channel Three" },
];

export const EXAMPLE_LANGUAGES_SPREADSHEET: ISpreadsheet = {
  title: "LANGUAGES",
  rows: [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    ["languageId", "languageDisplay", "languageInfo"],
    ["lang1", "Language One", "Info about Language One"],
    ["lang2", "Language Two", ""],
    ["lang3", "Language Three"],
  ],
};

export const EXAMPLE_LANGUAGES: Language[] = [
  { languageId: "lang1", autonym: "Language One", info: "Info about Language One" },
  { languageId: "lang2", autonym: "Language Two", info: null },
  { languageId: "lang3", autonym: "Language Three", info: null },
];

export const EXAMPLE_RESOURCES_SPREADSHEET: ISpreadsheet = {
  title: "RESOURCES",
  rows: [
    [undefined],
    [undefined],
    ["resourceId"],
    ["res1"],
    ["res2"],
    ["res3"],
  ],
};

export const EXAMPLE_RESOURCES: Resource[] = [
  { resourceId: "res1" },
  { resourceId: "res2" },
  { resourceId: "res3" },
];

export const EXAMPLE_RESOURCE_TRANSLATIONS_SPREADSHEET: ISpreadsheet = {
  title: "RESOURCE_TRANSLATIONS",
  rows: [
    [undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined],
    ["resourceId", "languageId", "line1", "line2", "info"],
    ["res1", "lang1", "Line 1 for Resource 1 in Language 1", "Line 2 for Resource 1 in Language 1", "Info about this translation"],
    ["res2", "lang2", "", "Line 2 for Resource 2 in Language 2", ""],
    ["res3", "lang3", undefined, "Line 2 for Resource 3 in Language 3"],
  ],
};

export const EXAMPLE_RESOURCE_TRANSLATIONS: ResourceTranslation[] = [
  {
    resourceId: "res1",
    languageId: "lang1",
    line1: "Line 1 for Resource 1 in Language 1",
    line2: "Line 2 for Resource 1 in Language 1",
    info: "Info about this translation",
  },
  {
    resourceId: "res2",
    languageId: "lang2",
    line1: "",
    line2: "Line 2 for Resource 2 in Language 2",
    info: null,
  },
  {
    resourceId: "res3",
    languageId: "lang3",
    line1: null,
    line2: "Line 2 for Resource 3 in Language 3",
    info: null,
  },
];

export const EXAMPLE_LINKS_SPREADSHEET: ISpreadsheet = {
  title: "LINKS",
  rows: [
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    ["resourceId", "languageId", "resourceInfo", "resourceSuperTitle", "resourceTitle", "allChannels", "channel1", "channel2"],
    ["res1", "lang1", "Info about this resource", "Super Title for Resource 1", "Title for Resource 1", "http://example.com/allchannels/res1/lang1", "http://example.com/channel1/res1/lang1", "http://example.com/channel2/res1/lang1"],
    ["res2", "lang2", "", "", "Title for Resource 2", "", "http://example.com/channel1/res2/lang2", ""],
    ["res3", "lang3", undefined, undefined, "Title for Resource 3", undefined, "", "http://example.com/channel2/res3/lang3"],
  ],
};

export const EXAMPLE_LINKS: Link[] = [
  {
    resourceId: "res1",
    languageId: "lang1",
    channelId: null,
    url: "http://example.com/allchannels/res1/lang1",
  },
  {
    resourceId: "res1",
    languageId: "lang1",
    channelId: "channel1",
    url: "http://example.com/channel1/res1/lang1",
  },
  {
    resourceId: "res1",
    languageId: "lang1",
    channelId: "channel2",
    url: "http://example.com/channel2/res1/lang1",
  },
  {
    resourceId: "res2",
    languageId: "lang2",
    channelId: "channel1",
    url: "http://example.com/channel1/res2/lang2",
  },
  {
    resourceId: "res3",
    languageId: "lang3",
    channelId: "channel2",
    url: "http://example.com/channel2/res3/lang3",
  },
];

export const EXAMPLE_CONTENT: Content = {
  channels: EXAMPLE_CHANNELS,
  languages: EXAMPLE_LANGUAGES,
  resources: EXAMPLE_RESOURCES,
  resourceTranslations: EXAMPLE_RESOURCE_TRANSLATIONS,
  links: EXAMPLE_LINKS,
};

export const EXAMPLE_CONTENT_SPREADSHEETS: ISpreadsheet[] = [
  EXAMPLE_CHANNELS_SPREADSHEET,
  EXAMPLE_LANGUAGES_SPREADSHEET,
  EXAMPLE_RESOURCES_SPREADSHEET,
  EXAMPLE_RESOURCE_TRANSLATIONS_SPREADSHEET,
  EXAMPLE_LINKS_SPREADSHEET,
];