import { AMQPReply } from './amqpReply.js';

function randomSum() {
  const a = Math.round(Math.random() * 100);
  const b = Math.round(Math.random() * 100);
  return a + b;
}

const fnMap = new Map();
fnMap.set(randomSum.name, randomSum);

async function main() {
  const reply = new AMQPReply(
    'reply_queue',
    'request_exchange',
    'amqp://localhost'
  );
  await reply.initialize();

  reply.handleRequest(req => {
    console.log('Request received:', req);
    const result = fnMap.get(req.fn)();
    return { result };
  });
}

main().catch(err => console.error(err));
