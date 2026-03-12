/**
 * Represents a 2d table of data, e.g. from a spreadsheet. The first dimension is rows, the second is columns.
 * To access row 2, column 3, use `spreadsheet.rows[2][3]`.
 */
export interface ISpreadsheet {
  title: string;
  rows: (string | undefined)[][];
}