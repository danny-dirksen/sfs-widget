export interface Channel {
  channelId: string;
  image: string | null;
};

export interface Language {
  languageId: string;
  autonym: string;
  info: string | null;
};

export interface Resource {
  resouceId: string;
};

export interface ResourceInLanguage {
  resourceId: string;
  languageId: string;
  line1: string | null;
  line2: string;
  info: string | null;
};

export interface Link {
  resourceId: string;
  languageId: string;
  channelId: string;
}

export interface Content {
  lastUpdated: number;
  channels: Channel[];
  languages: Language[];
  resources: Resource[];
  links: Link[];
};

export interface ContentProfile {
  pic: string;
  name: string;
  url: string;
  emailAddress: string;
  emailSubject: string;
  languages: string[];
};

export interface ContentProfileTable {
  lastUpdated: number;
  partners: ContentProfile[];
};