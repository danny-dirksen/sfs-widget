import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
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


export async function parseTable<T>({
  sheet,
  headerRow = 2, // default to the third row
  schema,
}: {
  sheet: GoogleSpreadsheetWorksheet;
  /** Zero-based row index of the header row. */
  headerRow?: number;
  schema: ZodType<T>;
}): Promise<Table<T> | Error> {

  await sheet.loadCells();

  /**
   * Shortcut for getting strings from sheet cells and ensuring length !== 0.
   * @param r Row index (e.g. 0)
   * @param c Column index (e.g. 0)
   * @returns Column value as a string, or null if empty.
   */
  const at = (r: number, c: number): string | undefined => {
    const val = sheet.getCell(r, c).stringValue;
    return val && val.length > 0 ? val : undefined;
  };

  // Get a list of named headers.
  const headers: TableHeader[] = [];
  for (let c = 0; c < sheet.columnCount; c++) {
    const headerName = at(headerRow, c);
    if (headerName) {
      headers.push({ name: headerName, column: c });
    }
  }
  

  const rows: TableRow<T>[] = [];
  
  // Parse each row below the header row.
  for (let r = headerRow + 1; r < sheet.rowCount; r++) {
    const cells: (string | undefined)[] = [];
    const fields: Record<string, (string | undefined)> = {};

    for (let c = 0; c < headers.length; c++) {
      const cellValue = at(r, c);
      const headerName = at(headerRow, c);
      if (headerName) {
        cells.push(cellValue);
        if (cellValue !== undefined) fields[headerName] = cellValue;
      }
    }

    // Skip empty rows.
    if (Object.keys(fields).length === 0) continue;

    // Parse the row data using the provided schema.
    const parsed = schema.safeParse(fields);
    if (!parsed.success) {
      return new Error(`Row ${r} does not match schema:\n${parsed.error.message}`);
    }
    rows.push({
      row: r,
      cells,
      fields,
      headers,
      data: parsed.data,
    });
  }

  return { headers, rows };
}