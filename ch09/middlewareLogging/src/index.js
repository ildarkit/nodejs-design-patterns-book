import { ConsoleTemplate, FileTemplate } from "./template.js";
import { serialize, saveToFile } from "./middleware.js";

let log = new ConsoleTemplate();
log.use(serialize());
log.use(saveToFile("console.log"));

log.debug("debug msg");
log.error("error msg");
log.info("info msg");
log.warn("warn msg");

log = new FileTemplate();
log.use(serialize());
log.use(saveToFile("filelog.log"));

log.debug("debug msg to file");
log.error("error msg to file");
log.info("info msg to file");
log.warn("warn msg to file");
log.debug("debug msg1 to file");
log.error("error msg1 to file");
log.info("info msg1 to file");
log.warn("warn msg1 to file");
