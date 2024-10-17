export default function timestampLog(consoleObj) {
  const logHandle = {
    get(target, prop) {
      return function(...args) {
        return target[prop](
          new Date().toISOString(),
          ...args
        );
      };
    }
  };
  return new Proxy(consoleObj, logHandle);
}
