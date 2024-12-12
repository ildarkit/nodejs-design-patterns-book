import zmq from 'zeromq';
import { processTask } from './processTask.js';

async function main () {
  const fromVentilator = new zmq.Pull();
  const toSink = new zmq.Push();
  const resolver = new zmq.Dealer();

  fromVentilator.connect('tcp://localhost:5016');
  toSink.connect('tcp://localhost:5017');
  resolver.connect('tcp://localhost:5018');

  for await (const rawMessage of fromVentilator) {
    let found;
    let result = null;
    try {
      found = processTask(JSON.parse(rawMessage.toString()));
    } catch (error) {
      console.error(error);
      result = error.message;
    } finally {
      await resolver.send(result);
    }
    if (found) {
      console.log(`Found! => ${found}`);
      await toSink.send(`Found: ${found}`);
    }
  }
}

main().catch(err => console.error(err));
