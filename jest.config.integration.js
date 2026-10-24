const baseConfig = require("./jest.config");

/** @type {import("jest").Config} **/
module.exports = {
  ...baseConfig,
  testMatch: ["**/src/**/*.integration.[jt]s?(x)"],
};