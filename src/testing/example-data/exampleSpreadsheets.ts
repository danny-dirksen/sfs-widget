import { ISpreadsheet } from "@/models/spreadsheet";
import { EXAMPLE_CONTENT_SPREADSHEETS } from "./exampleContent";
import { EXAMPLE_PARTNERS_SPREADSHEETS } from "./examplePartners";

export const EXAMPLE_SPREADSHEETS: ISpreadsheet[] = [
  ...EXAMPLE_CONTENT_SPREADSHEETS,
  ...EXAMPLE_PARTNERS_SPREADSHEETS,
];