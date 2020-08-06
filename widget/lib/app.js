//modules
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const SheetLoader = require('./SheetLoader');
const Logger = require('./Logger.js');
const Mailer = require('./Mailer.js');

var app = express();
app.disable('x-powered-by');



const logger = new Logger();
const mailer = new Mailer();
const key = '1ae0nTowaSivDqV6CHlac59VW-6jGwPB8qcillwafMiU';
const creds = require('./creds.json');
const PORT = process.env.PORT || 3000;
const sheetLoader = new SheetLoader(key, creds, 24); // updates every 24 hours
const rootPath = path.dirname(__dirname);
const cpts = require('./cpt.json');

app.use(express.static(rootPath + '/public'));

app.get('/', (req, res) => {
  app.set('trust proxy', true)
  const ip = req.ip;
  res.set('clientIP', ip);
  res.sendFile(rootPath + '/public/widget.html');
});

app.get('/api/cpt', (req, res) => {
  res.json()
});

app.post('/analytics/', (req, res) => {
  //logger.log(req.headers);
  res.end();
});

app.post('/mailinglist/', (req, res) => {
  logger.log(req.headers.emailaddress, '../var/mailingList.txt');
  res.end();
});

app.post('/downloadlink/', (req, res) => {
  mailer.sendDownloadLink()
  res.end()
})

app.listen(PORT, () => logger.log(`Server Started on port ${PORT}`));
