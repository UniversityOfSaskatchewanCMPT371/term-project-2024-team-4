/*
Logger Utility Usage:

import logger from `here`;

logger.info("text");
logger.debug("text");
logger.warn("text");
logger.error("text");

*/

import log from "loglevel";

// set default log level
log.setLevel("info");

export default log;
