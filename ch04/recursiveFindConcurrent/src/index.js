import recursiveFind from './recursiveFindConcurrent.js';
import TaskQueue from './TaskQueue.js';

const queue = new TaskQueue(process.argv[4])
  .on('error', (err) => {
    console.error(`Error emitted ${err}`);
  });
const finder = recursiveFind(
  process.argv[2],
  process.argv[3],
  queue,
);
finder.onReadyData((err, res) => {
  if (err) return console.error(err.message);
  if (res) console.log(res);
});
