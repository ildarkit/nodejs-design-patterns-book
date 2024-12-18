import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';
import JSONStream from 'JSONStream';
import timestamp from 'monotonic-timestamp';

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

async function main (db, port, address) {
  let lastChunkKey;
  let lastRecordTimestamp;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/', async (req, res) => {
    lastRecordTimestamp = await getLastTimestamp(db);

    db.createReadStream({ gte: lastRecordTimestamp })
      .on('data', chunk => lastChunkKey = chunk.key) 
      .pipe(JSONStream.stringify())
      .pipe(res); 
  });

  app.post('/', async (req, res) => {
    await db.put(timestamp(), req.body.message);
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
