import { ContentProfile } from "@/models/partners";

export interface IContentProfileRepo {
  listContentProfiles(): Promise<ContentProfile[] | ContentProfileRepoError>;
  // setContentProfiles(contentProfiles: ContentProfile[]): Promise<undefined | ContentProfileRepoError>;
  getContentProfileByPic(pic: string): Promise<ContentProfile | ContentProfileRepoError>;
  setContentProfiles?(contentProfiles: ContentProfile[]): Promise<undefined | ContentProfileRepoError>;
}

export class ContentProfileRepoError extends Error {}