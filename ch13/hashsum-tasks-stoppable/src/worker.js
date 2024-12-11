import amqp from 'amqplib';
import { processTask } from './processTask.js';
import { tasks_queue, results_exchange } from './helpers.js';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(tasks_queue, { durable: false });
  await channel.assertExchange(results_exchange, 'fanout', { durable: false }); 

  channel.consume(tasks_queue, async (rawMessage) => {
    const found = processTask(
      JSON.parse(rawMessage.content.toString()));
    
    await channel.ack(rawMessage);

    if (found) {
      console.log(`Found! => ${found}`);
      await channel.publish(
        results_exchange,
        '',
        Buffer.from(`Found: ${found}`)
      ); 
    }
  });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  
  await channel.assertExchange(results_exchange, 'fanout', { durable: false });
  await channel.bindQueue(queue, results_exchange, '');
  channel.consume(queue, msg => {
    channel.close();
    connection.close();
  }, { noAck: true });
}

main().catch(err => console.error(err));
