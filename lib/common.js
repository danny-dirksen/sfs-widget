let fs = require('fs')
let path = require('path')

let common = {}

common.log = (content, destination = path.dirname(__dirname) + "/var/log.txt", logToConsole = true) => {
  if (logToConsole) {
    console.log(content)
  }
  fs.appendFile(destination, content + "\n", function (err) {
    if (err) throw err
  })
}

common.root = path.dirname(__dirname)

// gets a formatted string version of the current date and time
common.getDate = () => {
  let ts = Date.now();
  let date = new Date(ts);
  return "" + date.getHours() + ":" + date.getMinutes() + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

module.exports = common
