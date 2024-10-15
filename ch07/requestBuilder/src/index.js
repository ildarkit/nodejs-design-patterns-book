import { pipeline } from "stream";
import RequestBuilder from "./requestBuilder.js";

const req = new RequestBuilder()
  .setUrl("http://www.google.com")
  .setHeaders({
    "Content-Type": "text/html; charset=utf-8",
  })
  .build();

req
  .invoke()
  .then(res => {
    pipeline(res, process.stdout, (err) => {
      if (err)
        console.error(err.message);
    });
  });
