import dotenv from 'dotenv/config';
import { createServer } from 'http';
import staticHandler from 'serve-handler';
import WebSocket, { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import superagent from 'superagent';
import JSONStream from 'JSONStream';

const options = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
};
const redisClient = new Redis(options);
const redisClientXRead = new Redis(options);

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
})

const wss = new WebSocketServer({ server });
wss.on('connection', client => {
  console.log('Client connected');

  client.on('message', async (msg) => {
    console.log(`Message: ${msg}`);
    await superagent
      .post('http://localhost:8090')
      .send({ message: msg.toString() });
    redisClient.xadd('chat_stream', '*', 'message', msg);
  });

  // Load message history
  superagent
    .get('http://localhost:8090')
    .on('error', err => console.error(err))
    .pipe(JSONStream.parse('*'))
    .on('data', msg => {
      client.send(msg.value, { binary: false })
    });
});

function broadcast (msg) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

let lastRecordId = '$';

async function processStreamMessages() {
  while (true) {
    const [[, records]] = await redisClientXRead.xread(
      'BLOCK', '0', 'STREAMS', 'chat_stream', lastRecordId);
    for (const [recordId, [, message]] of records) {
      console.log(`Message from stream: ${message}`); 
      broadcast(message);
      lastRecordId = recordId;
    }
  }
}

processStreamMessages().catch(err => console.error(err));

server.listen(process.argv[2] || 8080);
