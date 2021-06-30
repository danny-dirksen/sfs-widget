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
  let doc = this.sheetsDoc; // load google sheets doc containing both sheets
  // access doc using credentials
  await doc.useServiceAccountAuth({
    client_email: this.creds.client_email,
    private_key: this.creds.private_key,
  });

  await doc.loadInfo(); // load document properties and worksheets

  // get data for the first spreadsheet on the doc: "Content Profile Tables"
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
        // found the cell denoting the beginning of the list of languages available
        if (cpt.getCell(i, j).value == 'languages') {
          cptLanguagColumn = j;
          break;
        }
      }
      break;
    }
  }

  // start reading partners two lines below start row
  for (let i = cptStartRow + 2; i < cpt.rowCount; i ++) {
    // partner identification number
    let pic = cpt.getCell(i, 0).value;
    // don't read the line unless pic is given
    if (pic) {
      // create object for new partner
      let partner = {
        pic: pic,
        name: cpt.getCell(i, 1).value || "",
        url: cpt.getCell(i, 2).value || "",
        emailAddress: cpt.getCell(i, 3).value || "",
        emailSubject: cpt.getCell(i, 4).value || "",
        languages: []
      };
      // add whatever languages are checked for partner to the languages list
      for (let j = cptLanguagColumn; j < cpt.columnCount; j ++) {
        let language = cpt.getCell(cptStartRow + 1, j).value;
        if (language) {
          if (cpt.getCell(i, j).value) {
            partner.languages.push(language);
          }
        }
      }
      // add partner to list of partners
      this.cpts.partners.push(partner);
    }
  }

  // write content profiles object to a json file
  await fs.writeFile("./lib/cpts.json", JSON.stringify(this.cpts), 'utf8', function (err) {
    if (err) {
      common.log("An error occured while writing this.cpts to File.");
      return common.log(err);
    }
    common.log("CPT table has been saved to a JSON file.");
  });

  // load the second sheet, "Streaming Links," containing languages, albums, and song links
  const sheet = doc.sheetsById[1548340038];
  await sheet.loadCells(); // loads a range of cells

  // initialize the json file that will be sent
  this.links.lastUpdated = common.getDate();
  this.links.languages = [];
  this.links.channels = [];


  let startRow;
  for (let i = 0; i < sheet.rowCount; i ++) {
    if (sheet.getCell(i, 0).value == "language.name") {
      startRow = i;
      break;
    }
  }

  /*
    create a map which column each label is at. for instance:
    {
      "lanugage": 0,
      "autonym": 1,
      "language info": 2,
      etc...
    }
    Looking up the property in this table, you know which column to read to find it.
  */
  let labelColumns = {};
  for (let i = 0; i < sheet.columnCount; i ++) {
    let cellVal = sheet.getCell(startRow, i).value;
    if (cellVal) {
      labelColumns[cellVal] = i;
    }
  }

  for (let i = startRow + 1; i < sheet.rowCount; i ++) {
    let languageName = sheet.getCell(i, 0).value;
    if (languageName) {
      let language = {
        name: languageName,
        autonym: sheet.getCell(i, labelColumns["language.autonym"]).value,
        info: sheet.getCell(i, labelColumns["language.info"]).value,
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
            id: sheet.getCell(j, labelColumns["resource.id"]).value,
            line1: sheet.getCell(j, labelColumns["resource.line1"]).value,
            line2: sheet.getCell(j, labelColumns["resource.line2"]).value,
            info: sheet.getCell(j, labelColumns["resource.info"]).value,
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
  for (let i = labelColumns["resource.channels"] + 1; i < sheet.columnCount; i ++) {
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
        let atLeastOneNonSharedLink = false;
        for (let k = this.links.languages[j].row; k < this.links.languages[j].nextRow; k ++) {
          let id = sheet.getCell(k, labelColumns["resource.id"]).value;
          let allLink = sheet.getCell(k, labelColumns["resource.channels"]).value;
          let link = sheet.getCell(k, i).value;
          let shared = (allLink && !link);
          if (id && (link || allLink)) {
            if (!shared) atLeastOneNonSharedLink = true;
            language.resources.push({
              id: id,
              link: (link || allLink),
              shared: shared
            });
          }
        }
        if (atLeastOneNonSharedLink) {
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
