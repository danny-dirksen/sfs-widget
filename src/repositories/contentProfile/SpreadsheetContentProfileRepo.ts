import { ContentProfile } from "@/models/partners";
import { IContentProfileRepo, ContentProfileRepoError } from ".";
import { ISpreadsheetRepo } from "../spreadsheet";
import { parsePartnerTable } from "./tableParsers/parsePartnerTable";

export class SpreadsheetContentProfileRepo implements IContentProfileRepo {
  constructor(private repo: ISpreadsheetRepo) {}

  async listContentProfiles(): Promise<ContentProfile[] | ContentProfileRepoError> {
    return this.fetchContentProfiles();
  }

  async getContentProfileByPic(pic: string): Promise<ContentProfile | ContentProfileRepoError> {
    const result = await this.fetchContentProfiles();
    if (result instanceof ContentProfileRepoError) {
      return result;
    }

    const partner = result.find((p) => p.pic.toLowerCase() === pic.toLowerCase());
    if (!partner) {
      return new ContentProfileRepoError(`Content profile with pic ${pic} not found`);
    }
    return partner;
  }

  private async fetchContentProfiles(): Promise<ContentProfile[] | ContentProfileRepoError> {
    const result = await parsePartnerTable(this.repo);
    if (result instanceof Error) {
      return new ContentProfileRepoError(`Failed to get content profiles: ${result.message}`, {
        cause: result,
      });
    }
    return result;
  }
}