import fs from "node:fs";

export class LogMiddlewareManager {
  constructor() {
    this.outboundMiddleware = [];
  }
  
  use(middleware) {
    this.outboundMiddleware.push(middleware.outbound);
  }

  executeMiddleware(middlewares, message) {
    for (const middlewareFunc of middlewares) {
      message = middlewareFunc.call(this, message)
    }
    return message;
  }

  next(message) {
    this.executeMiddleware(
      this.outboundMiddleware,
      message
    );
  }
}

export function serialize() {
  return { 
    outbound(msg) {
      if (!(typeof msg === "string" || msg instanceof String))
        msg = String(msg);
      return msg + '\n';
    }
  };
}

export function saveToFile(file) {
  return {
    outbound(msg) {
      fs.appendFile(file, msg, (err) => {
      if (err)
        console.error(err);
      });
      return msg;
    }
  };
}
