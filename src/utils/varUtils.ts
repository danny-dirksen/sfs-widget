import path from "path";
import fs from "fs/promises";
import winston from "winston";
import { ZodType } from "zod/v4";

export const varDir = path.join(process.cwd(), "var");

// Logs to several files in the var directory
export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: path.join(varDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(varDir, "combined.log"),
    }),
    new winston.transports.File({
      filename: path.join(varDir, "http.log"),
      level: "http",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

/**
 * Saves a json file to [projectroot]/var/[filename]
 * @param filename e.g. `data.json`
 * @returns the data if successful, Error otherwise.
 */
export async function varReadJSON<T>(filename: string, schema: ZodType<T>): Promise<T | Error> {
  const filePath = path.join(varDir, filename);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    const validation = schema.safeParse(parsed);
    if (!validation.success) {
      const message = `Invalid JSON schema for ${filePath}:\n${validation.error.message}`;
      logger.error(message);
      return new Error(message);
    }
    return validation.data;
  } catch (err) {
    logger.error("An error occured while reading " + filePath);
    return new Error("Could not read " + filePath + "\n\n" + err);
  }
}

/**
 * Saves a json file to [projectroot]/var/[filename]
 * @param filename e.g. `data.json`
 * @param data json data to save.
 * @returns `null` if successful, Error otherwise.
 */
export async function varWriteJSON<T>(
  filename: string,
  data: T,
): Promise<null | Error> {
  const filePath = path.join(varDir, filename);
  // write content profiles object to a json file
  try {
    await fs.mkdir(varDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    logger.info(filename + " has been saved to a JSON file.");
    return null;
  } catch (err) {
    logger.error(`An error occured while saving to ${filePath}:\n`);
    logger.error(err);
    return err instanceof Error ? err : new Error("Could not write to " + filePath + "\n\n" + String(err));
  }
}