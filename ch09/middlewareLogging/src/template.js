import fs from "node:fs";
import { LogMiddlewareManager } from "./middleware.js";

export class ConsoleTemplate extends LogMiddlewareManager {
  constructor() {
    super();
  }

  debug(msg) {
    console.debug(msg);
    this.next(msg);
  }

  info(msg) {
    console.info(msg);
    this.next(msg);
  }

  error(msg) {
    console.error(msg);
    this.next(msg);
  }

  warn(msg) {
    console.warn(msg);
    this.next(msg);
  }
}

export class FileTemplate extends LogMiddlewareManager {
  constructor() {
    super();
  }

  debug(msg) {
    fs.appendFile('debug.log', msg + '\n', (err) => {
      if (err)
        console.error(err);
    });
    this.next(msg);
   }

  info(msg) {
    fs.appendFile('info.log', msg + '\n', (err) => {
      if (err)
        console.error(err);
    });
    this.next(msg);
  }

  error(msg) {
    fs.appendFile('error.log', msg + '\n', (err) => {
      if (err)
        console.error(err);
    });
    this.next(msg);
  }

  warn(msg) {
    fs.appendFile('warn.log', msg + '\n', (err) => {
      if (err)
        console.error(err);
    });
    this.next(msg); 
  }
}
