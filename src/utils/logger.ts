import path from "path";
import { createLogger, transports, format, } from "winston";
import { PERSISTANCE_DIRECTORY } from "./persistentData/constants";

// Logs to several files in the var directory

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  defaultMeta: { 
    service: "sfs-widget",
  },
  transports: [
    new transports.File({
      filename: path.join(PERSISTANCE_DIRECTORY, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(PERSISTANCE_DIRECTORY, "combined.log"),
    }),
    new transports.File({
      filename: path.join(PERSISTANCE_DIRECTORY, "http.log"),
      level: "http",
    }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

logger.info("Logger initialized.");