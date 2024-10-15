import http from "node:http";
import Queue from "./queue.js";
import { TASKS_SIZE } from "./task.js";

const server = http
  .createServer()
  .listen(8080, () => console.log("Server started on localhost:8080"));

const queue = new Queue(({ enqueue }) => {
  server.on("request", (req, res) => {
    req
      .on("error", err => {
        console.error(err.message);
      })
      .on("data", (chunk) => {
        enqueue(chunk);
      });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("{result: 'task running'}");
  });
});

for (let i = 0; i < TASKS_SIZE + 1; i++) {
  const data = await queue.dequeue();
  console.log(String(data));
}
console.log("All tasks finish");
