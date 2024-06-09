import { GoogleSpreadsheet } from "google-spreadsheet";
import { ContentProfileTable } from "./models";
import assert from 'assert';

const cptSheetId = parseInt(process.env.GOOGLE_SHEETS_CPT_ID || '0');
assert(cptSheetId, "Missing cptSheetId");

export async function parseCptSheet(sheetsDoc: GoogleSpreadsheet): Promise<ContentProfileTable | null> {

  throw new Error("Not implemented");

  // await sheetsDoc.loadInfo(); // load document properties and worksheets

  // // get data for the first spreadsheet on the doc: "Content Profile Tables"
  // const cpt = sheetsDoc.sheetsById[378376827];
  // await cpt.loadCells();

  // const newCpts = {
  //   lastUpdated: Date.now(),
  //   partners: []
  // };

  // let cptStartRow;
  // let cptLanguagColumn;
  // for (let i = 0; i < cpt.rowCount; i ++) {
  //   if (cpt.getCell(i, 0).value == 'partner info') {
  //     cptStartRow = i;
  //     for (j = 0; j < cpt.columnCount; j ++) {
  //       // found the cell denoting the beginning of the list of languages available
  //       if (cpt.getCell(i, j).value == 'languages') {
  //         cptLanguagColumn = j;
  //         break;
  //       }
  //     }
  //     break;
  //   }
  // }

  // // start reading partners two lines below start row
  // for (let i = cptStartRow + 2; i < cpt.rowCount; i ++) {
  //   // partner identification number
  //   let pic = cpt.getCell(i, 0).value;
  //   // don't read the line unless pic is given
  //   if (pic) {
  //     // create object for new partner
  //     let partner = {
  //       pic: pic,
  //       name: cpt.getCell(i, 1).value || "",
  //       url: cpt.getCell(i, 2).value || "",
  //       emailAddress: cpt.getCell(i, 3).value || "",
  //       emailSubject: cpt.getCell(i, 4).value || "",
  //       languages: []
  //     };
  //     // add whatever languages are checked for partner to the languages list
  //     for (let j = cptLanguagColumn; j < cpt.columnCount; j ++) {
  //       let language = cpt.getCell(cptStartRow + 1, j).value;
  //       if (language) {
  //         if (cpt.getCell(i, j).value) {
  //           partner.languages.push(language);
  //         }
  //       }
  //     }
  //     // add partner to list of partners
  //     newCpts.partners.push(partner);
  //   }
  // }

  // this.cpts = newCpts;
}