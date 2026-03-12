import { PartnerInfo } from "@/models/partners";

export interface IPartnerInfoRepo {  
  listPartners(): Promise<PartnerInfo[] | PartnerRepoError>;
  setPartners(partners: PartnerInfo[]): Promise<undefined | PartnerRepoError>;
}

export class PartnerRepoError extends Error {}