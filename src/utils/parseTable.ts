import { ISpreadsheet } from "@/models/spreadsheet";
import type { ZodType } from "zod/v4";

export interface Table<T> {
  headers: TableHeader[];
  rows: TableRow<T>[];
}

export interface TableHeader {
  /** The name of the header */
  name: string;
  /** The 0-based column index of the header */
  column: number;
}

export interface TableRow<T> {
  /** The 0-based row index of the row */
  row: number;
  /** The cells in the row */
  cells: (string | undefined)[];
  /** The fields in this row, indexed by header name */
  fields: Record<string, string | undefined>;
  /** Header names and indices */
  headers: TableHeader[];
  /** The row as a parsed object */
  data: T;
}

/**
 * Parses a table from a spreadsheet sheet, given a Zod schema for the row data.
 * @param sheet The GoogleSpreadsheetWorksheet to parse.
 * @param headerRow Zero-based index of the row containing headers. Defaults to 2 (the third row).
 * @param schema A Zod schema describing the shape of the row data.
 * @returns A Table object containing the parsed data, or an Error if parsing fails.
 */
export async function parseTable<T>({
  rawSheet,
  schema,
  headerRowIndex = 2, // default to the third row
}: {
  rawSheet: ISpreadsheet;
  schema: ZodType<T>;
  headerRowIndex?: number;
}): Promise<Table<T> | Error> {

  const rawRows = rawSheet.rows;
  const headerRow = rawRows[headerRowIndex];
  const headers: TableHeader[] = headerRow
    .filter(row => row !== undefined)
    .filter(row => row.length > 0)
    .map((name, column) => ({ name, column }));
  const bodyRows = rawRows.slice(headerRowIndex + 1);

  const bodyRowObjects = bodyRows
    .filter(row => row.some(cell => cell)) // filter out completely empty rows
    .map(r => tableRowToObject(r, headerRow));
  const parsed: TableRow<T>[] = [];

  for (let i = 0; i < bodyRowObjects.length; i++) {
    const rowObj = bodyRowObjects[i];
    const parsedRow = schema.safeParse(rowObj);
    if (!parsedRow.success) {
      return new Error(`Row ${i + headerRowIndex + 1} does not match schema:\n${parsedRow.error.message}\nRow data: ${JSON.stringify(rowObj)}\nHeaders Row: ${JSON.stringify(headerRow)}`);
    }
    parsed.push({
      row: i + headerRowIndex + 1,
      cells: bodyRows[i],
      fields: rowObj,
      headers,
      data: parsedRow.data,
    });
  }

  return {
    headers,
    rows: parsed,
  };
}

/**
 * Converts a row of cell values into an object mapping header names to cell values.
 * @param row An array of cell values for a single row, where the index corresponds to the column index.
 * @param headerRow An array of header names, where the index corresponds to the column index.
 * @returns An object mapping header names to their corresponding cell values in the row.
 */
function tableRowToObject(row: (string | undefined)[], headerRow: (string | undefined)[]): Record<string, string | undefined> {
  const obj: Record<string, string | undefined> = {};
  for (let i = 0; i < headerRow.length; i++) {
    const headerName = headerRow[i];
    if (headerName) {
      obj[headerName] = row[i];
    }
  }
  return obj;
}