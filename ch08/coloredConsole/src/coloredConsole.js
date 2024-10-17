export default function coloredConsole(consoleObj) {
  consoleObj.yellow = function(...args) {
    consoleObj.log("\x1b[33m", ...args);
  }
  consoleObj.red = function(...args) {
    consoleObj.log("\x1b[31m", ...args);
  }
  consoleObj.green = function(...args) {
    consoleObj.log("\x1b[32m", ...args);
  }
  return consoleObj;
}
