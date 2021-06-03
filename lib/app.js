// modules
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const SheetLoader = require('./SheetLoader');
const common = require('./common.js');
const Mailer = require('./Mailer.js');


// data files to immport
let apis = require('./apis.json');
//readDataFiles();

// global variables
const PORT = process.env.PORT || 3000;

// instanciate modules
const mailer = new Mailer(apis);
// updates every 24 hours
const sheetLoader = new SheetLoader('1ae0nTowaSivDqV6CHlac59VW-6jGwPB8qcillwafMiU', apis.sheets, 1);
// these two objects contain information about
let cpts = sheetLoader.cpts; // Object representing Content Profile Tables. See Specification.
let links = sheetLoader.links; // object containing links to each album.

// main app
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); // tells app to parse request bodies
app.use(bodyParser.json()); // tells app to convert these parsed bodies into json
app.disable('x-powered-by');


// run static website
app.use(express.static(common.root + '/build'));

// send personalized list of links to the client
app.get('/api/links', (req, res) => {
  let pic = req.query.pic || null;
  let cpt = cpts.partners.find(partner => partner.pic && (partner.pic === pic)) || null;
  if (pic && cpt && cpt.languages.length > 0) {
    let trimmedLinks = JSON.parse(JSON.stringify(links));
    trimmedLinks.languages = trimmedLinks.languages.filter(linkLang => {
      return cpt.languages.some(cptLang => linkLang.name === cptLang);
    });
    trimmedLinks.channels.forEach(channel => {
      channel.languages = channel.languages.filter(linkLang => {
        return cpt.languages.some(cptLang => linkLang.name === cptLang);
      });
    });
    trimmedLinks.channels = trimmedLinks.channels.filter(channel => {
      return channel.languages.length > 0;
    });
    if (trimmedLinks.languages.length > 0) {
      res.json(trimmedLinks);
    } else {
      common.log("Warning: their are no links for any of partner " + pic + "'s languages (" + cpt.languages + "). Serving them all languages until sufficient links are added or the CPT is changed.");
      res.json(links);
    }
  } else {
    res.json(links);
  }
});

// for when the user submits a form to recieve a download link
app.post('/email/download/', (req, res) => {
  let email = req.body.email;
  let resourceInfo = links.languages
    .find(language => language.name === req.body.language).resources
    .find(resource => resource.id === req.body.resource);
  let resourceName = (resourceInfo.line1 || "Songs for Saplings") + " - " + (resourceInfo.line2 || "Listen Now");
  let downloadLink = links.channels
    .find(channel => channel.name.toLowerCase() === "download").languages
    .find(language => language.name.toLowerCase() === req.body.language).resources
    .find(resource => resource.id === req.body.resource).link;
  common.log(email, common.root + '/var/mailingList.txt');
  mailer.download({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: email,
    resourceName: resourceName,
    downloadLink: downloadLink
  })
  res.status(200).end();
})

// for when the user submits a form to recieve a download link
app.post('/email/unsubscribe/', (req, res) => {
  console.dir(req);
  let email = req.query.email;
  mailer.unsubscribe(email);
  res.status(200).end();
});

app.post('/analytics/', (req, res) => {
  let data = JSON.stringify(req.body);
  fs.appendFile(common.root + "/var/usageData.json", data + '\n' , function (err) {
     if (err) throw err;
  });
  res.status(200).end();
});

// starts server
app.listen(PORT, () => common.log(`Server Started on port ${PORT}`));
