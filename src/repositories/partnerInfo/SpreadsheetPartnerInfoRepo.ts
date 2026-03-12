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
}

function contentProfileToPartnerInfo({ name, pic, url }: ContentProfile): PartnerInfo {
  return { name, pic, url };
}
