import { Content } from "@/models/content";
import { ContentRepoError, IContentRepo } from ".";
import { ISpreadsheetRepo } from "../spreadsheet";
import { validateContent } from "./validateContent";
import { parseContent } from "./tableParsers/parseContent";

export class SpreadsheetContentRepo implements IContentRepo {

  constructor(private spreadsheetRepo: ISpreadsheetRepo) {}
  async getContent(): Promise<Content | ContentRepoError> {
    const content = await parseContent(this.spreadsheetRepo);
    if (content instanceof Error) {
      return new ContentRepoError(`Failed to parse content: ${content.message}`);
    }
    const errors = validateContent(content);
    if (errors) {
      return new ContentRepoError(`Content validation failed: ${errors.message}`);
    }
    return content;
  }
}