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

app.use(express.static(__dirname + '/public'));

/*

app.get('/', (req, res) => {
  app.set('trust proxy', true)
  const ip = req.ip;
  res.set('clientIP', ip);
  res.sendFile(path.join(rootPath, 'public', 'sfsWidget.html'));
});

app.get('/api/cpt', (req, res) => {
  res.json()
});

// code for delivering specific assets (not resources or fonts)
app.get('/public/sfsInfo.js', (req, res) => res.sendFile(path.join(rootPath, 'public', 'sfsInfo.json')));
logger.log(path.join(rootPath, 'public', 'sfsStyle.css'));
app.get('/public/sfsStyle.css', (req, res) => res.sendFile(path.join(rootPath, 'public', 'sfsStyle.css')));
app.get('/public/sfsWidget.js', (req, res) => res.sendFile(path.join(rootPath, 'public', 'sfsWidget.js')));
app.get('/public/songs.json', (req, res) => res.sendFile(path.join(rootPath, 'public', 'songs.json')));


// all files in the resource folder are publicly available.
fs.readdir(path.join(rootPath, 'public', 'resources'), function (err, files) {
    //handling error
    if (err) {
        return logger.log('Unable to scan directory: ' + err);
    }
    // serve all files using forEach
    files.forEach(function (file) {
        var filePath = path.join(rootPath, 'public', 'resources', file);
        app.get('/public/resources/' + file, (req, res) => res.sendFile(filePath));

        fs.readdir(path.join(filePath, file), function (err, files2) {
            //handling error
            if (err) {
                return logger.log('Unable to scan directory: ' + err);
            }
            // serve all files using forEach
            files2.forEach(function (file2) {
                var filePath2 = path.join(filePath, file2);
                app.get('/public/resources/' + file + '/' + file2, (req, res) => res.sendFile(filePath2));



            });
        });

    });
});

// serve all font files. Don't put sensative stuff in here.
fs.readdir(path.join(rootPath, 'public', 'resources', 'fonts'), function (err, files) {
    // handling error
    if (err) {
        return logger.log('Unable to scan directory: ' + err);
    }
    // serve all files using forEach
    files.forEach(function (file) {
        var filePath = path.join(rootPath, 'public', 'resources', 'fonts', file);
        app.get('/public/resources/fonts/' + file, (req, res) => res.sendFile(filePath));
    });
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
*/

app.listen(PORT, () => logger.log(`Server Started on port ${PORT}`));
