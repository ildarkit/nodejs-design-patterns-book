import coloredConsole from "./coloredConsole.js";

const logger = coloredConsole(console);
logger.log("Log message");
logger.error("Error message");
logger.debug("Debug message");
logger.info("Info message");
logger.yellow("Yellow color message");
logger.red("Red color message");
logger.green("Green color message");
