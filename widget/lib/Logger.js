let fs = require('fs');
let path = require('path');

function Logger () {};

Logger.prototype.log = function (content, destination = path.dirname(__dirname) + "/var/log.txt", logToConsole = true) {
  fs.appendFile(destination, content + "\n", function (err) {
    if (err) throw err;
    if (logToConsole) {
      console.log(content)
    };
  });
}

Logger.prototype.recordEmail

module.exports = Logger;
