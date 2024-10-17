import timestampLog from "./timestampLog.js";

const logger = timestampLog(console);

logger.log("Log message", "Hello");
logger.error("Error message");
logger.debug("Debug message");
logger.info("Info message");
