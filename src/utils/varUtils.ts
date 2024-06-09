import path from 'path';
import fs from 'fs';
import winston from 'winston';

const varDir = path.join(__dirname, '..', '..', 'var');

// Logging
export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: path.join(varDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(varDir, 'combined.log') }),
    new winston.transports.File({ filename: path.join(varDir, 'http.log'), level: 'http' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

/**
 * Saves a json file to [projectroot]/var/[filename]
 * @param filename e.g. `data.json`
 * @returns the data if successful, null otherwise.
 */
export async function varReadJSON(filename: string): Promise<object | null> {
  const filePath = path.join(varDir, filename);
  return new Promise<any>((resolve: (value: object | null) => void) => {
    fs.readFile(path.join(filePath), "utf-8", (err, data) => {
      if (err) {
        logger.error("An error occured while reading " + filePath);
        logger.error(err);
        resolve(null);
      } else {
        logger.info(filename + " has been read.");
        resolve(JSON.parse(data));
      }
    });

  });
}

/**
 * Saves a json file to [projectroot]/var/[filename]
 * @param filename e.g. `data.json`
 * @param data json data to save.
 * @returns `true` if successful
 */
export async function varWriteJSON(filename: string, data: object): Promise<boolean> {
  const filePath = path.join(varDir, filename);
  // write content profiles object to a json file
  return new Promise<any>((resolve: (value: any) => void) => {
    fs.writeFile(filePath, JSON.stringify(data), 'utf8', function (err) {
      if (err) {
        logger.error("An error occured while saving to " + filePath);
        logger.error(err);
        resolve(false);
      } else {
        logger.info(filename + " has been saved to a JSON file.");
        resolve(true);
      }
    });
  });
}