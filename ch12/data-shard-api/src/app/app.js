import express from 'express';
import portfinder from 'portfinder';
import { nanoid } from 'nanoid';
import { consulService } from './consul.js';
import { connect, findAll } from './db.js';

const serviceType = process.argv[2];
const dbStringConnect = `${serviceType}-data.json`;
const { pid } = process;

function startApp(port, address, cb) {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/api/people/byFirstName/:letter', (req, res) => {
    console.log(`Handling request from ${pid}`);
    const nameLetter = req.params.letter;

    connect(dbStringConnect, function(err, data) {
      if (err) console.error(err);

      const result = findAll(data, (record) => {
        const nameComponents = record.fullname.split(' ');
        const firstName = nameComponents[0].includes('.') ?
          nameComponents[1] : nameComponents[0];
        return firstName.charAt(0) === nameLetter.toLocaleUpperCase();
      });

      res.json(result);
    });
  })

  app.listen(port, address, cb);
}

async function main () {
  const port = await portfinder.getPortPromise();
  const address = process.env.ADDRESS || 'localhost';
  const serviceId = nanoid();

  const [ registerService, unregisterService ] = consulService({
    id: serviceId,
    name: serviceType,
    address,
    port,
  });

  process.on('exit', unregisterService);
  process.on('uncaughtException', async (err) => { 
    err && console.error(err);
    await unregisterService();
  });
  process.on('SIGINT', unregisterService);

  startApp(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} on port ${port}`);
  }); 
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
