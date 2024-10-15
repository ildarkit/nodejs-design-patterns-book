import http from "node:http";
import { Buffer } from "node:buffer";
import { TASKS_SIZE } from "./task.js";

const OPTIONS = {
  hostname: "localhost",
  port: 8080,
  path: "/",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

function sendRequest(task, options = OPTIONS) {
  const postData = JSON.stringify({ task });
  options.headers["Content-Length"] = Buffer.byteLength(postData);
  const req = http.request(options, (res) => {
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`response: ${chunk}`);
    });
  });
  req.on("error", (err) => {
    console.error(err.message);
  });
  req.write(postData);
  req.end();
}

for (let i = 0; i < TASKS_SIZE; i++) {
  sendRequest("Task" + i); 
}

setTimeout(() => {
  sendRequest("Last Task");
}, 2000);
