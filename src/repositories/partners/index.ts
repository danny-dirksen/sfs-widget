import { ContentProfile, PartnerInfo } from "@/models/partners";

export interface IPartnerRepository {
  getPartners(): Promise<PartnerInfo[] | GetPartnersError>;
  setPartners(): Promise<undefined | SetPartnersError>;
  getContentProfileByPic(pic: string): Promise<ContentProfile | GetContentProfileError>;
}

export class GetPartnersError extends Error {}
export class SetPartnersError extends Error {}
export class GetContentProfileError extends Error {}