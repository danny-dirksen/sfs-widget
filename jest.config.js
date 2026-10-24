const { createJsWithTsPreset } = require("ts-jest");

// Transform dependency JavaScript as well as TypeScript into Jest-compatible CommonJS.
const tsJestTransformCfg = createJsWithTsPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // Don't transform node modules, with the exception of a few ESM dependencies that need to be transformed.
  // This is a workaround for Jest's handling of ESM dependencies in CommonJS tests.
  transformIgnorePatterns: [
    "/node_modules/(?!(ky|gaxios|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)",
  ],
  testMatch: ["**/src/**/*.test.[jt]s?(x)"],
  testTimeout: 20_000,
};