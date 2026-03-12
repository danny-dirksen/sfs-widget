import { ContentProfile, PartnerInfo } from "@/models/partners";
import { IPartnerInfoRepo, PartnerRepoError } from ".";
import { IContentProfileRepo, ContentProfileRepoError } from "../contentProfile";

export class SpreadsheetPartnerInfoRepo implements IPartnerInfoRepo {
  constructor(private contentProfileRepo: IContentProfileRepo) {}

  async listPartners(): Promise<PartnerInfo[] | PartnerRepoError> {
    const profiles = await this.contentProfileRepo.listContentProfiles();
    if (profiles instanceof ContentProfileRepoError) {
      return new PartnerRepoError(`Failed to list partners: ${profiles.message}`, {
        cause: profiles,
      });
    }
    return profiles.map(contentProfileToPartnerInfo);
  }

  async setPartners(partners: PartnerInfo[]): Promise<undefined | PartnerRepoError> {
    // Not enough information to implement this method, and since spreadsheets are the source of truth, we can just ignore it for now
    return undefined;
  }
}

function contentProfileToPartnerInfo({ name, pic, url }: ContentProfile): PartnerInfo {
  return { name, pic, url };
}
