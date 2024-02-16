/*
Winston Logging Usage:

// import and use logger tools
const { logger, morganIntegration } = require("./config/logger");

// automatically logs http requests
app.use(morganIntegration);

// how to use logger
logger.debug('text');
logger.info('text');
logger.warn('text');
logger.error('text');
logger.fatal('text');
*/

// import necessary modules
const winston = require("winston"); // multi-level logging and transports
require("winston-daily-rotate-file");
const morgan = require("morgan"); // middleware to log http requests
const path = require("path");
const fs = require("fs");

// create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

// define a variable for multi-level logging levels ordered from highest to lowest priority
const logLevels = {
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
	},
	colors: {
		fatal: "bold red",
		error: "red",
		warn: "yellow",
		info: "green",
		debug: "blue",
	},
};

// Winston configuration settings
const logger = winston.createLogger({
	level: "debug",
	levels: logLevels.levels,

	// defines how the log lines will look like
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.printf(
			(info) => `${info.timestamp} ${info.level}: ${info.message}`,
		),
		winston.format.colorize({ all: true }), // Optional: colorize log output
	),

	// defines where the logs will be shown
	// in this case, console & log folder
	transports: [
		new winston.transports.Console(),
		new winston.transports.DailyRotateFile({
			filename: "logs/%DATE%.log",
			datePattern: "YYYY-MM-DD",
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "14d",
		}),
	],
});

// apply colors to winston
winston.addColors(logLevels.colors);

// morgan stream integration
const morganIntegration = morgan("combined", {
	stream: { write: (message) => logger.info(message.trim()) },
});

module.exports = { logger, morganIntegration };
