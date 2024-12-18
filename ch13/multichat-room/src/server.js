import dotenv from 'dotenv/config';
import { createServer } from 'http';
import staticHandler from 'serve-handler';
import WebSocket, { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import superagent from 'superagent';
import JSONStream from 'JSONStream';
import { isJsonString } from './helpers.js';

const historyHost = 'http://localhost:8090';

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
});

const wss = new WebSocketServer({ server });
wss.on('connection', client => {
  console.log('Client connected');

  client.on('message', async (msg) => {
    const chatMsg = JSON.parse(msg);
    client.chat = chatMsg.chat;
    if (chatMsg.message) {
      console.log(`Message from chat '${chatMsg.chat}': ${chatMsg.message}`);
      await superagent
        .post(`${historyHost}/message/add`)
        .send({ chat: chatMsg.chat, message: chatMsg.message });
      redisClient.xadd('chat_stream', '*', 'message', msg);
    }
    else {
      console.log(`Current chat '${chatMsg.chat}'`);
      loadData(`${historyHost}/messages/${chatMsg.chat}`, client);
    } 
  });

  loadData(`${historyHost}/chats`, client); 
});

function loadData(url, client) {
  superagent
    .get(url)
    .on('error', err => console.error(err))
    .pipe(JSONStream.parse('*'))
    .on('data', msg => {
      const message = msg.value ? msg.value : msg;
      client.send(message, { binary: false });
    });
}

function broadcast (msg) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      const data = isJsonString(msg) ? JSON.parse(msg) : msg;
      if (data.chat && data.chat === client.chat)
        client.send(data.message);
      else if (!data.chat)
        client.send(data);
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
