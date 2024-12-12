import zmq from 'zeromq';
import { generateTasks } from './generateTasks.js';
import { TaskQueue } from './queue.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main () {
  const ventilator = new zmq.Push();
  const confirmer = new zmq.Dealer();

  await ventilator.bind('tcp://*:5016');
  await confirmer.bind('tcp://*:5018');

  const queue = new TaskQueue(confirmer, ventilator);
  const generatorObj = generateTasks(searchHash, ALPHABET,
    maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    await queue.send(JSON.stringify(task));
  }
}

main().catch(err => console.error(err));
