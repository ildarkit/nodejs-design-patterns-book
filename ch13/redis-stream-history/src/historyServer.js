import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';
import JSONStream from 'JSONStream';

async function main (db, port, address) {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/', (req, res) => {
    db.createValueStream()
      .pipe(JSONStream.stringify())
      .pipe(res);
  });

  app.post('/', async (req, res) => {
    console.log(`Saving message to persistent storage: ${req.body.recordId}`);
    await db.put(req.body.recordId, req.body.message);
    res.end();
  });

  app.listen(port, address, () => {
    console.log(`Chat logging started at ${address}:${port}`);
  });
}

const port = 8090;
const address = process.env.ADDRESS || 'localhost';
const db = levelup(leveldown('./msgHistory')); 

main(db, port, address).catch(err => console.error(err));
