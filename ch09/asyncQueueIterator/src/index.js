import AsyncQueue from "./asyncQueue.js";

async function consume(queueIter, consumer) {
  let task = await queueIter.next();
  while (!task.done) {
    console.log(consumer, task.value);
    task = await queueIter.next();
  }
  console.log(consumer, "work done");
}

async function consumeWithExit(queue, queueIter, consumer) {
  let i = 0;
  let task = await queueIter.next();
  while (!task.done) {
    i++;
    console.log(consumer, task.value);
    if (i == 20) task = queue.done(queueIter);
    else task = await queueIter.next();
  }
  console.log(consumer, "work done");
}

function main() {
  const queue = new AsyncQueue();
  for (let i = 0; i < 100; i++) {
    queue.enqueue(new Promise(resolve => {
      setTimeout(() => resolve(`task ${i} done`), 100);
    }));
  }
 
  const queueIter = queue[Symbol.asyncIterator]();
  const delayedTask = Promise
    .resolve()
    .then(() => {
      setTimeout(() => consume(queueIter, "consumer1:"), 30);
    });
  const doneTask = Promise
    .resolve()
    .then(() => {
      setTimeout(() => consumeWithExit(queue, queueIter, "consumer3:"), 20);
    });
  Promise.all([delayedTask, consume(queueIter, "consumer2:"), doneTask]);
}

main();
