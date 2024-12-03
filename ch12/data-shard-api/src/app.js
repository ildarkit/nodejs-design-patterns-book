import fs from 'node:fs';
import express from 'express';
import consul from 'consul';
import portfinder from 'portfinder';
import { nanoid } from 'nanoid';

const serviceType = process.argv[2];
const dbStringConnect = `${serviceType}-data.json`;
const { pid } = process;

function connect(path, cb) {
  fs.readFile(path, function (err, data) {
    if (err) return cb(err);
    data = JSON.parse(data);
    cb(null, data);
  });
}

function findAll(db, cb) {
  return db.filter(cb);
}

async function main () {
  const consulClient = consul();

  const port = await portfinder.getPortPromise();
  const address = process.env.ADDRESS || 'localhost';
  const serviceId = nanoid();

  function registerService () {
    consulClient.agent.service.register({
      id: serviceId,
      name: serviceType,
      address,
      port,
      tags: [serviceType]
    }, () => {
      console.log(`${serviceType} registered successfully`);
    })
  }

  function unregisterService (err) {
    err && console.error(err);
    console.log(`deregistering ${serviceId}`);
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0)
    });
  }

  process.on('exit', unregisterService);
  process.on('uncaughtException', unregisterService);
  process.on('SIGINT', unregisterService);

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

    res.end(`${serviceType} response from ${pid}\n`);
  })

  app.listen(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
