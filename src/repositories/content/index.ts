import { Content } from "@/models/content";

export interface IContentRepo {
  getContent(): Promise<Content | ContentRepoError>;
  setContent?(): Promise<undefined | ContentRepoError>;
}

export class ContentRepoError extends Error {}