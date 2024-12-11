import amqp from 'amqplib';
import { results_exchange } from './helpers.js';

async function main () {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const { queue } = await channel.assertQueue('', { exclusive: true });
  
  await channel.assertExchange(results_exchange, 'fanout', { durable: false });
  await channel.bindQueue(queue, results_exchange, '');
  channel.consume(queue, msg => {
    console.log(`Message from worker: ${msg.content.toString()}`);
  }, { noAck: true });
}

main().catch(err => console.error(err));
