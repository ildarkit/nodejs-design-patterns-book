import { URL } from "node:url";
import http from "node:http";
import { Buffer } from "node:buffer";

class HTTPRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.options.method = options.method || "GET";
    if (this.options.method === "POST" &&
      !("Content-Length" in options.headers))
      this.options.headers["Content-Length"] = Buffer.byteLength(options.body || 0); 
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const req = http.request(this.url, this.options, res => {
        res.on("error", (err) => reject(err)); 
        resolve(res);
      });
      req.on("error", (err) => reject(err));
      if (this.method === "POST" && this.options.body)
        req.write(this.options.body);
      req.end();
    });
  }
}

export default class RequestBuilder {
  setMethod(method) {
    this.method = method;
    return this;
  }

  setUrl(url) {
    this.url = new URL(url);
    return this;
  }

  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  build() {
    return new HTTPRequest(
      this.url,
      {
        method: this.method,
        headers: this.headers,
        body: this.body 
      }
    );
  }
}
