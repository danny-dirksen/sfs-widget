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

export interface PartnerInfo {
  pic: string;
  name: string;
  url: string;
};

export interface ContentProfile extends PartnerInfo {
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

export interface TrackingEvent {
  userId: string;
  eventName: string;
  properties: object;
}

export interface Navigation {
  pic: string | null;
  channel: string | null;
  language: string | null;
  resource: string | null;
}

export type PopupComponent = (props: any) => JSX.Element;

export interface Popup {
  name: string;
  Component: PopupComponent;
  props: any;
};