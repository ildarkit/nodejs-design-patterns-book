import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';
import JSONStream from 'JSONStream';
import timestamp from 'monotonic-timestamp';
import { Readable, Transform } from 'node:stream';

async function getLastTimestamp(db) {
  return await db.get('-1').catch(e => {
    if (!e.notFount) console.error(e);
    return 0;
  });
}

async function saveLastTimestamp(db, value, lastValue) {
  const newValue = value ? Number(value.toString()) : NaN;
  if (!Number.isNaN(newValue) && newValue !== lastValue) {
    await db.put('-1', newValue);
  }
}

function bufferToStream(binary) {
  return new Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });
}

class ChatStream extends Transform {
  constructor(chat, options) {
    super({ ...options, objectMode: true });
    this.chat = chat;
  }

  _transform(chunk, encoding, cb) {
    const key = chunk.key.toString();
    const value = chunk.value.toString().split(','); 
    if (value[0] === key && value[1] === this.chat)
      return cb(null, Buffer.from(value[2]));
    cb();
  }
}

async function main(db, port, address) {
  let lastChunkKey;
  let lastRecordTimestamp;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/messages/:chat', async (req, res) => {
    const chat = req.params.chat;
    lastRecordTimestamp = await getLastTimestamp(db);

    db.createReadStream({ gte: lastRecordTimestamp })
      .pipe(new ChatStream(chat))
      .on('data', chunk => lastChunkKey = chunk.key) 
      .pipe(JSONStream.stringify())
      .pipe(res); 
  });

  app.get('/chats', async (req, res) => {
    const chats = await db.get('chats').catch(e => {
      if (!e.notFount) console.error(e);
      return Buffer.alloc(0);
    });
    bufferToStream(Buffer.concat([Buffer.from('chats:', 'utf8'), chats]))
      .pipe(JSONStream.stringify())
      .pipe(res);
  });

  app.post('/message/add', async (req, res) => {
    const ts = timestamp();
    await db.put(
      ts,
      [ ts, req.body.chat, req.body.message ]
    );
    res.end();
  });

  const server = app.listen(port, address, () => {
    console.log(`History server started at ${address}:${port}`);
  });

  const shutDown = async () => {
    console.log('\nClosing HTTP server...');
    await saveLastTimestamp(db, lastChunkKey, lastRecordTimestamp); 
    server.close(() => console.log('Server closed'));
  };

  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);
}

const port = 8090;
const address = process.env.ADDRESS || 'localhost';
const db = levelup(leveldown('./msgHistory')); 

main(db, port, address).catch(err => console.error(err));
