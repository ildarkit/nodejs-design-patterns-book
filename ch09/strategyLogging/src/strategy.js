import fs from "node:fs";

class Log {
  debug() {}
  info() {}
  warn() {}
  error() {}
}

export class ConsoleStrategy extends Log {
  debug(msg) {
    console.debug(msg);
   }

  info(msg) {
    console.info(msg);
  }

  error(msg) {
    console.error(msg);
  }

  warn(msg) {
    console.warn(msg);
  }
}

export class FileStrategy extends Log {
  debug(msg) {
    fs.appendFile('debug.log', msg, (err) => {
      if (err)
        console.error(err);
    });
   }

  info(msg) {
    fs.appendFile('info.log', msg, (err) => {
      if (err)
        console.error(err);
    });
  }

  error(msg) {
    fs.appendFile('error.log', msg, (err) => {
      if (err)
        console.error(err);
    });
  }

  warn(msg) {
    fs.appendFile('warn.log', msg, (err) => {
      if (err)
        console.error(err);
    });
  }
}
