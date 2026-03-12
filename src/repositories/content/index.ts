import { Content } from "@/models/content";

export interface IContentRepository {
  getContent(): Promise<Content | GetContentError>;
  setContent(): Promise<undefined | SetContentError>;
}

export class GetContentError extends Error {}
export class SetContentError extends Error {}