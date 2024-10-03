import Queue from 'yocto-queue';

export default async function mapAsync(iterable, callback, concurrency) {  
  const tasks = new Queue();
  const consumers = new Queue();
  const result = [];

  for (let i = 0; i < concurrency; i++)
    consumer(tasks, consumers);
 
  for (const item of iterable)
    result.push(
      await runTask(
        tasks,
        consumers,
        () => callback(item)
      )
    );

  return result;
}

function consumer(tasks, consumers) {
  nextTask(tasks, consumers)
    .then((task) => {
      task().catch(console.log);
      consumer(tasks, consumers);
    });
};

function nextTask(tasks, consumers) {
  return new Promise(resolve => {
    if (tasks.size !== 0)
      return resolve(tasks.dequeue());
    consumers.enqueue(resolve);
  });
};

function runTask(tasks, consumers, task) {
  return new Promise((resolve, reject) => {
    const taskWrapper = () => {
      return Promise.resolve()
        .then(task)
        .then(resolve, reject);
    };

    if (consumers.size !== 0) {
      const consumer = consumers.dequeue();
      consumer(taskWrapper);
    } else tasks.enqueue(taskWrapper);
  });
};
