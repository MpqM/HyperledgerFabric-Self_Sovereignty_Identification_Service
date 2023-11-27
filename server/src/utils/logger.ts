import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = "logs";
const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf((info) => { return `[${info.timestamp}][${info.level}] ${info.message}`; });

const logger = winston.createLogger({
  format: combine(timestamp({ format: "YY/MM/DD HH:mm:ss" }), logFormat),
  transports: [
    new winstonDaily({ level: "info", datePattern: "YYYY-MM-DD", dirname: logDir, filename: `%DATE%.log`, maxFiles: 30, zippedArchive: true, }),
    new winstonDaily({ level: "warn", datePattern: "YYYY-MM-DD", dirname: logDir + "/warn", filename: `%DATE%.warn.log`, maxFiles: 30, zippedArchive: true, }),
    new winstonDaily({ level: "error", datePattern: "YYYY-MM-DD", dirname: logDir + "/error", filename: `%DATE%.error.log`, maxFiles: 30, zippedArchive: true, }), 
  ], 
});

if (process.env.NODE_ENV !== "production") { logger.add( new winston.transports.Console({ format: combine(colorize({ all: true }), logFormat), }) ); }

export default logger;
