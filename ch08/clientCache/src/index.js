import superagent from "superagent";
import requestCache from "./requestCache.js";

const superagentCached = requestCache(superagent);

superagentCached
  .get("http://www.example.com")
  .end((err, res) => {
    if (err)
      console.error(err.message);
    else console.log(res.text);
  });

setTimeout(() => {
  superagentCached
    .get("http://www.example.com")
    .end((err, res) => {
      if (err)
        console.error(err.message);
      else console.log(res.text);
    });
}, 500);
