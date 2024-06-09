import { GoogleSpreadsheet } from "google-spreadsheet";
import { Content } from "./models";
import assert from 'assert';

const contentSheetId = parseInt(process.env.GOOGLE_SHEETS_CONTENT_ID || '0');
assert(contentSheetId, "Missing contentSheetId");


export async function parseContentSheet(sheetsDoc: GoogleSpreadsheet): Promise<Content | null> {
  
  throw new Error("Not implemented");

  // const contentSheet = doc.sheetsById[contentSheetId];
  // await sheet.loadCells(); // loads a range of cells

  // const newLinks = {
  //   lastUpdated: common.getDate(),
  //   languages: [],
  //   channels: []
  // };

  // let startRow;
  // for (let i = 0; i < sheet.rowCount; i ++) {
  //   if (sheet.getCell(i, 0).value == "language.name") {
  //     startRow = i;
  //     break;
  //   }
  // }

  // /*
  //   create a map which column each label is at. for instance:
  //   {
  //     "lanugage": 0,
  //     "autonym": 1,
  //     "language info": 2,
  //     etc...
  //   }
  //   Looking up the property in this table, you know which column to read to find it.
  // */
  // let labelColumns = {};
  // for (let i = 0; i < sheet.columnCount; i ++) {
  //   let cellVal = sheet.getCell(startRow, i).value;
  //   if (cellVal) {
  //     labelColumns[cellVal] = i;
  //   }
  // }

  // for (let i = startRow + 1; i < sheet.rowCount; i ++) {
  //   let languageName = sheet.getCell(i, 0).value;
  //   if (languageName) {
  //     let language = {
  //       name: languageName,
  //       autonym: sheet.getCell(i, labelColumns["language.autonym"]).value,
  //       info: sheet.getCell(i, labelColumns["language.info"]).value,
  //       row: i,
  //       nextRow: sheet.rowCount,
  //       resources: []
  //     };
  //     for (let j = i; j < sheet.rowCount; j ++) {
  //       // if this row is a new language row, and it isn't the first row in the loop, then it must be the start of the next language
  //       if (sheet.getCell(j, 0).value && j != i) {
  //         language.nextRow = j;
  //         // skip the main reader to the next song
  //         i = language.nextRow - 1;
  //         break;
  //       } else {
  //         let resource = {
  //           id: sheet.getCell(j, labelColumns["resource.id"]).value,
  //           line1: sheet.getCell(j, labelColumns["resource.line1"]).value,
  //           line2: sheet.getCell(j, labelColumns["resource.line2"]).value,
  //           info: sheet.getCell(j, labelColumns["resource.info"]).value,
  //         }
  //         if (resource.id && resource.line2) {
  //           language.resources.push(resource);
  //         }
  //       }
  //     }
  //     if (language.resources.length > 0) {
  //       newLinks.languages.push(language);
  //     }
  //   }
  // }
  // // for all columns that may have a channel
  // for (let i = labelColumns["resource.channels"] + 1; i < sheet.columnCount; i ++) {
  //   let channelName = sheet.getCell(startRow + 1, i).value;
  //   // if this row contains a channel
  //   if (channelName) {
  //     let channel = {
  //       name: channelName,
  //       image: sheet.getCell(startRow + 2, i).value,
  //       languages: []
  //     }
  //     // for all stored languages
  //     for (let j = 0; j < newLinks.languages.length; j ++) {

  //       let language = {
  //         name: newLinks.languages[j].name,
  //         resources: []
  //       };
  //       let atLeastOneNonSharedLink = false;
  //       for (let k = newLinks.languages[j].row; k < newLinks.languages[j].nextRow; k ++) {
  //         let id = sheet.getCell(k, labelColumns["resource.id"]).value;
  //         let allLink = sheet.getCell(k, labelColumns["resource.channels"]).value;
  //         let link = sheet.getCell(k, i).value;
  //         let shared = (allLink && !link);
  //         if (id && (link || allLink)) {
  //           if (!shared) atLeastOneNonSharedLink = true;
  //           language.resources.push({
  //             id: id,
  //             link: (link || allLink),
  //             shared: shared
  //           });
  //         }
  //       }
  //       if (atLeastOneNonSharedLink) {
  //         channel.languages.push(language);
  //       }
  //     }
  //     if (channel.languages.length > 0) {
  //       newLinks.channels.push(channel);
  //     }
  //   }
  // }
}