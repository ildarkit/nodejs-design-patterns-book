import express from 'express';
import consul from 'consul';
import portfinder from 'portfinder';
import { nanoid } from 'nanoid';

const serviceType = process.argv[2];
const { pid } = process;

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
    console.log(`Handling request from ${pid}`)
    res.end(`${serviceType} response from ${pid}\n`)
  })

  app.listen(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
})
