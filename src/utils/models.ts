export interface Channel {
  channelId: string;
  name: string;
};

export interface Language {
  languageId: string;
  autonym: string;
  info: string | null;
};

export interface Resource {
  resourceId: string;
};

export interface ResourceTranslation {
  resourceId: string;
  languageId: string;
  line1: string | null;
  line2: string;
  info: string | null;
};

export interface Link {
  resourceId: string;
  languageId: string;
  /** If ommitted, the link shows up regardless of channel. */
  channelId: string | null;
  url: string;
}

export interface Content {
  lastUpdated: number;
  channels: Channel[];
  languages: Language[];
  resources: Resource[];
  resourceTranslations: ResourceTranslation[];
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

export interface DownloadRequestBody {
  email: string,
  languageId: string,
  resourceId: string,
  firstName: string,
  lastName: string,
}