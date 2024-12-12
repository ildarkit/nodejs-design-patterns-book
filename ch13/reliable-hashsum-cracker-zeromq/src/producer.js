import zmq from 'zeromq';
import { generateTasks } from './generateTasks.js';
import { TaskQueue } from './queue.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main () {
  const ventilator = new zmq.Dealer();
  const queue = new TaskQueue(ventilator);
  const generatorObj = generateTasks(searchHash, ALPHABET,
    maxLength, BATCH_SIZE);

  await ventilator.bind('tcp://*:5016');

  for (const task of generatorObj) {
    await queue.send(JSON.stringify(task));
  } 
}

main().catch(err => console.error(err));
