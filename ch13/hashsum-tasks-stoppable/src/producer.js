import amqp from 'amqplib';
import { generateTasks } from './generateTasks.js';
import { tasks_queue, results_exchange } from './helpers.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main () {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(tasks_queue, { durable: false });

  const generatorObj = generateTasks(searchHash, ALPHABET,
    maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    channel.sendToQueue(tasks_queue,
      Buffer.from(JSON.stringify(task)));
  }

  const { queue } = await channel.assertQueue('', { exclusive: true });
  
  await channel.assertExchange(results_exchange, 'fanout', { durable: false });
  await channel.bindQueue(queue, results_exchange, '');
  channel.consume(queue, async () => {
    console.log('Result was received. Close connection.');
    await channel.purgeQueue(tasks_queue);
    channel.close();
    connection.close();
  }, { noAck: true }); 
}

main().catch(err => console.error(err));
