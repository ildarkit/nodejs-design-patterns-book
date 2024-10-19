import { ConsoleStrategy, FileStrategy } from "./strategy.js";

class Logging {
  constructor(logger) {
    this.logger = logger;
  }

  debug(msg) {
    this.logger.debug(msg);
  }

  info(msg) {
    this.logger.info(msg);
  }

  warn(msg) {
    this.logger.warn(msg);
  }

  error(msg) {
    this.logger.error(msg);
  }
}

let log = new Logging(new ConsoleStrategy());
log.debug("debug msg");
log.error("error msg");
log.info("info msg");
log.warn("warn msg");

log = new Logging(new FileStrategy());
log.debug("debug msg");
log.error("error msg");
log.info("info msg");
log.warn("warn msg");
