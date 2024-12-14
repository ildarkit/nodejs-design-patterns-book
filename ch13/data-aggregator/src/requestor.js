import { AMQPPublish } from './amqpPublish.js';

async function main () {
  const request = new AMQPPublish(
    'reply_queue',
    'request_exchange',
    'amqp://localhost'
  );
  const result = [];

  await request
    .consume((res) => result.push(res)); 

  request
    .publish({ fn: 'randomSum' })
    .catch(err => console.log(err.message));

  setTimeout(() => {
    request.destroy();
    console.log('Aggregated response:', result.map(r => r.result));
  }, 100);
}

await main();
