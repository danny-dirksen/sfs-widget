const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
const common = require('./common.js');

/**
 * 
 * @param {string} sheetID 
 * @param {object} creds 
 * @param {number | null} updateInterval 
 */
function SheetLoader(sheetID, creds, updateInterval) {
  this.sheetID = sheetID;
  this.creds = creds;
  this.updateInterval = updateInterval;
  this.cpts = null;
  this.links = null;
  this.init();
}

SheetLoader.prototype.init = function () {
  this.sheetsDoc = new GoogleSpreadsheet(this.sheetID);
  this.load(); // defined below
  if (this.updateInterval !== null) {
    let _this = this; // setInterval has its own "this" variable, so another one must be used
    setInterval(
      () => _this.load(),
      this.updateInterval * 60 * 60 * 1000
    );
    common.log(`Google sheets will be updated every ${this.updateInterval} hrs. To force an update, call api/updatelinks`);
  }
}
// updates sheet data and stores it in a json file
SheetLoader.prototype.load = async function () {
  try {
    await this.loadFromSheets();

    // write content profiles object to a json file
    await fs.writeFile(common.cptsPath, JSON.stringify(this.cpts), 'utf8', function (err) {
      if (err) {
        common.log("An error occured while writing this.cpts to File.");
        return common.log(err);
      }
      common.log("CPT table has been saved to a JSON file.");
    });
    // save json file to serve to client
    await fs.writeFile(common.linksPath, JSON.stringify(this.links), 'utf8', function (err) {
      if (err) {
          common.log("An error occured while writing links to File.");
          return common.log(err);
      }
      common.log("Resource links have been saved to JSON file.");
    });
  } catch (err) {
    common.log("Error: failed to load from sheets: " + err);
    common.log("Trying to load from previously stored json files instead...")
    // Attempt to find cpts
    fs.readFile(common.cptsPath, "utf-8", (err, data) => {
      if (err) {
        throw "Failed to load file from sheets and could not find json file here:\n\t" + common.cptsPath;
      }
      this.cpts = JSON.parse(data);
      common.log("Cpts successfully loaded from cpts.json");
    });

    // Attempt to find links
    fs.readFile(common.linksPath, "utf-8", (err, data) => {
      if (err) {
        throw "Failed to load file from sheets and could not find json file here:\n\t" + common.linksPath;
      }
      this.links = JSON.parse(data);
      common.log("Links successfully loaded from links.json");
    });
  }
}

/**
 * Attempt to parse the google sheets. This might fail and throw an exception for a variety of reasons.
 */
SheetLoader.prototype.loadFromSheets = async function() {
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

  const newCpts = {
    lastUpdated: common.getDate(),
    partners: []
  };

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
      newCpts.partners.push(partner);
    }
  }

  this.cpts = newCpts;

  // load the second sheet, "Streaming Links," containing languages, albums, and song links
  const sheet = doc.sheetsById[1548340038];
  await sheet.loadCells(); // loads a range of cells

  const newLinks = {
    lastUpdated: common.getDate(),
    languages: [],
    channels: []
  };

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
        newLinks.languages.push(language);
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
      for (let j = 0; j < newLinks.languages.length; j ++) {

        let language = {
          name: newLinks.languages[j].name,
          resources: []
        };
        let atLeastOneNonSharedLink = false;
        for (let k = newLinks.languages[j].row; k < newLinks.languages[j].nextRow; k ++) {
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
        newLinks.channels.push(channel);
      }
    }
  }

  this.links = newLinks;
}

module.exports = SheetLoader;
