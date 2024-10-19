import { ConsoleTemplate, FileTemplate } from "./template.js";

let log = new ConsoleTemplate();
log.debug("debug msg");
log.error("error msg");
log.info("info msg");
log.warn("warn msg");

log = new FileTemplate();
log.debug("debug msg");
log.error("error msg");
log.info("info msg");
log.warn("warn msg");
