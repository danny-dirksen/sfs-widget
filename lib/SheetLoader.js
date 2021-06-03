const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
const common = require('./common.js');

function SheetLoader(sheetID, creds, updateInterval) {
  this.sheetID = sheetID;
  this.creds = creds;
  this.updateInterval = updateInterval;
  this.cpts = {};
  this.links = {};
  this.init();
}

SheetLoader.prototype.init = function () {
  this.sheetsDoc = new GoogleSpreadsheet(this.sheetID);
  this.loadSheetData(); // defined below
  let _this = this; // setInterval has its own "this" variable, so another one must be used
  setInterval(
    () => _this.loadSheetData(),
    this.updateInterval * 60 * 60 * 1000
  );
  common.log(`Google sheets will be updated every ${this.updateInterval} hrs`);
}

// updates sheet data and stores it in a json file
SheetLoader.prototype.loadSheetData = async function () {
  let doc = this.sheetsDoc;
  await doc.useServiceAccountAuth({
    client_email: this.creds.client_email,
    private_key: this.creds.private_key,
  });
  //process.stdout.write("Updating CPT... ");
  await doc.loadInfo(); // loads document properties and worksheets

  const cpt = doc.sheetsById[378376827];
  await cpt.loadCells();

  this.cpts.lastUpdated = common.getDate();
  this.cpts.partners = [];

  let cptStartRow;
  let cptLanguagColumn;
  for (let i = 0; i < cpt.rowCount; i ++) {
    if (cpt.getCell(i, 0).value == 'partner info') {
      cptStartRow = i;
      for (j = 0; j < cpt.columnCount; j ++) {
        if (cpt.getCell(i, j).value == 'languages') {
          cptLanguagColumn = j;
        }
      }
      break;
    }
  }

  for (let i = cptStartRow + 2; i < cpt.rowCount; i ++) {
    let pic = cpt.getCell(i, 0).value;
    if (pic) {
      let partner = {
        pic: pic,
        emailAddress: cpt.getCell(i, 1).value,
        emailSubject: cpt.getCell(i, 2).value,
        languages: []
      };
      for (let j = cptLanguagColumn; j < cpt.columnCount; j ++) {
        let language = cpt.getCell(cptStartRow + 1, j).value;
        if (language) {
          if (cpt.getCell(i, j).value) {
            partner.languages.push(language);
          }
        }
      }
      this.cpts.partners.push(partner);
    }
  }

  await fs.writeFile("./cpts.json", JSON.stringify(this.cpts), 'utf8', function (err) {
    if (err) {
      common.log("An error occured while writing this.cpts to File.");
      return common.log(err);
    }
    common.log("CPT table has been saved to a JSON file.");
  });

  const sheet = doc.sheetsById[1548340038];
  await sheet.loadCells(); // loads a range of cells

  // initialize the json file that will be sent
  this.links.lastUpdated = common.getDate();
  this.links.languages = [];
  this.links.channels = [];
  this.links.resources = [];

  let startRow;
  for (let i = 0; i < sheet.rowCount; i ++) {
    if (sheet.getCell(i, 0).value == "language") {
      startRow = i;
      break;
    }
  }
  for (let i = startRow + 1; i < sheet.rowCount; i ++) {
    let languageName = sheet.getCell(i, 0).value;
    if (languageName) {
      let language = {
        name: languageName,
        autonym: sheet.getCell(i, 1).value,
        row: i,
        nextRow: sheet.rowCount,
        resources: []
      };
      for (let j = i; j < sheet.rowCount; j ++) {
        // if this row is a new language row, and it isn't the first row in the loop, then it must be the start of the next language
        if (sheet.getCell(j, 0).value && j != i) {
          language.nextRow = j;
          // skip the main reader to the next song
          i = language.nextRow - 1;
          break;
        } else {
          let resource = {
            id: sheet.getCell(j, 2).value,
            line1: sheet.getCell(j, 3).value,
            line2: sheet.getCell(j, 4).value,
            info: sheet.getCell(j, 5).value,
          }
          if (resource.id && resource.line2) {
            language.resources.push(resource);
          }
        }
      }
      if (language.resources.length > 0) {
        this.links.languages.push(language);
      }
    }
  }
  // for all columns that may have a channel
  for (let i = 7; i < sheet.columnCount; i ++) {
    let channelName = sheet.getCell(startRow + 1, i).value;
    // if this row contains a channel
    if (channelName) {
      let channel = {
        name: channelName,
        image: sheet.getCell(startRow + 2, i).value,
        languages: []
      }
      // for all stored languages
      for (let j = 0; j < this.links.languages.length; j ++) {

        let language = {
          name: this.links.languages[j].name,
          resources: []
        };
        for (let k = this.links.languages[j].row; k < this.links.languages[j].nextRow; k ++) {
          let id = sheet.getCell(k, 2).value;
          let allLink = sheet.getCell(k, 6).value;
          let link = sheet.getCell(k, i).value;
          if (id && (link || allLink)) {
            language.resources.push({
              id: id,
              link: (link || allLink)
            });
          }
        }
        if (language.resources.length > 0) {
          channel.languages.push(language);
        }
      }
      if (channel.languages.length > 0) {
        this.links.channels.push(channel);
      }
    }
  }
  // save json file to serve to client
  await fs.writeFile(path.dirname(__dirname) + "/lib/links.json", JSON.stringify(this.links), 'utf8', function (err) {
    if (err) {
        common.log("An error occured while writing links to File.");
        return common.log(err);
    }
    common.log("Resource links have been saved to JSON file.");
  });
}

module.exports = SheetLoader;