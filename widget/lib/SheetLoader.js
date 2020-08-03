const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const Logger = require('./Logger.js');
const logger = new Logger();

function SheetLoader(sheetID, creds, updateInterval) {
  this.sheetID = sheetID;
  this.creds = creds;
  this.updateInterval = updateInterval;
  this.init()
}

SheetLoader.prototype.init = function () {
  this.sheetsDoc = new GoogleSpreadsheet(this.sheetID);
  this.loadSheetData(); // defined below
  let _this = this; // setInterval has its own "this" variable, so another one must be used
  setInterval(
    () => _this.loadSheetData(),
    this.updateInterval * 60 * 60 * 1000
  );
  logger.log(`Google sheets will be updated every ${this.updateInterval} hrs`);
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

  // gets a formatted string version of the current date and time
  let ts = Date.now();
  let date = new Date(ts);
  let dateString = "" + date.getHours() + ":" + date.getMinutes() + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

  let cptObject = {
    "lastUpdated": dateString,
    "partners": {}
  };

  let allLanguages = [];

  let cptStartRow;
  let cptLanguagColumn = 10000;
  for (let i = 0; i < cpt.rowCount; i ++) {
    if (cpt.getCell(i, 0).value == 'partner info') {
      cptStartRow = i;
      for (j = 0; j < cpt.columnCount; j ++) {
        if (cpt.getCell(i, j).value == 'languages') {
          cptLanguagColumn = j;
        }
        let language = cpt.getCell(i + 1, j).value;
        if (j >= cptLanguagColumn && language != null) {
          allLanguages.push(language);
        }
      }
      break;
    }
  }
  for (let i = cptStartRow + 2; i < cpt.rowCount; i ++) {
    let pic = cpt.getCell(i, 0).value;
    if (pic != null) {
      let partner = {
        "emailAddress": cpt.getCell(i, 1).value,
        "emailSubject": cpt.getCell(i, 2).value,
        "languages": []
      }
      for (let j = cptLanguagColumn; j < cpt.columnCount; j ++) {
        let language = cpt.getCell(cptStartRow + 1, j).value;
        if (language != null) {
          if (cpt.getCell(i, j).value != null) {
            partner.languages.push(language);
          }
        }
      }
      if (partner.languages.length == 0) {
        partner.languages = partner.languages.concat(allLanguages);
      }
      cptObject.partners[pic] = partner;
    }
  }

  //logger.log(cptObject)
  await fs.writeFile("cpt.json", JSON.stringify(cptObject), 'utf8', function (err) {
    if (err) {
        logger.log("An error occured while writing cptObject to File.");
        return logger.log(err);
    }
    logger.log("JSON file containing cpt has been saved.");
  });

  const sheet = doc.sheetsById[1548340038];
  await sheet.loadCells(); // loads a range of cells

  //process.stdout.write("Done.\nUpdating Sheets... ");

  // initialize the json file that will be sent
  let songsObject = {
    "lastUpdated": dateString,
    "channels": {},
    "languages": {}
  };

  // find the row on the spreadsheet at which the data starts
  let startRow;
  for (let i = 0; i < sheet.rowCount; i ++) {
    // look for a cell that says "language"
    if (sheet.getCell(i, 0).value == "language") {
      startRow = i;
      break;
    }
  }
  // store all channels
  for (let i = 4; i < sheet.columnCount; i ++) {
    let channelName = sheet.getCell(startRow + 1, i).value;
    if (channelName != null) {
      // store it in the channels list. If cells are blank, null values are stored.
      channelPath = sheet.getCell(startRow + 2, i).value;
      songsObject.channels[channelName] = {
        "column": i,
        "path": channelPath
      };
    }
  }
  // add all languages, in which the link data is stored
  for (let i = startRow + 1; i < sheet.rowCount; i ++) {
    let languageName = sheet.getCell(i, 0).value; // get language name
    if (languageName != null) {
      let autonym = sheet.getCell(i, 1).value; // language autonym
      let language = {
        "autonym": autonym,
        "albums": {}
      };
      for (let j = i; j < sheet.rowCount; j ++) {
        // stop looking for albums for this language once the j pointer reaches the next language
        if (j != i && sheet.getCell(j, 0).value != null) {
          break;
        }
        // refers to the current list of albums
        let albums = language.albums;
        let albumTitle = sheet.getCell(j, 4).value;
        if (albumTitle != null) {
          let album = {
            "order": j - i,
            "line1": sheet.getCell(j, 3).value,
            "line2": albumTitle,
            "info": sheet.getCell(j, 5).value,
            "channels": {}
          };
          // gets all channel links for album
          for (let k = 6; k < sheet.columnCount; k ++) {
            let albumLink = sheet.getCell(j, k).value;
            if (albumLink != null) {
              let channelName = sheet.getCell(startRow + 1, k).value;
              album.channels[channelName] = {
                "link": albumLink
              };
            }
          }
          albums[sheet.getCell(j, 2).value] = album;
        }
      }
      songsObject.languages[languageName] = language;
    }
  }

  // save json file to serve to client
  await fs.writeFile("../public/songs.json", JSON.stringify(songsObject), 'utf8', function (err) {
    if (err) {
        logger.log("An error occured while writing songsObject to File.");
        return logger.log(err);
    }
    logger.log("JSON file containing links has been saved.");
  });
  //process.stdout.write("Done.\n");
}

module.exports = SheetLoader;
