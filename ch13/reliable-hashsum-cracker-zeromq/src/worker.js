import zmq from 'zeromq';
import { processTask } from './processTask.js';

async function run(ventilator, sink, signal) {
  while (true) {
    const rawMessage = await ventilator.receive();
    if (signal.aborted) {
      await ventilator.send('worker close'); 
      break;
    }
    let found;
    let result = null;
    try {
      found = processTask(JSON.parse(rawMessage.toString()));
    } catch (error) {
      console.error(error);
      result = error.message;
    } finally { 
      await ventilator.send(result);
    }
    if (found) {
      console.log(`Found! => ${found}`);
      await sink.send(`Found: ${found}`);
    }
  }
}

function main() {
  const abortTask = new AbortController();
  const ventilator = new zmq.Dealer();
  const sink = new zmq.Push();

  const shutDown = () => {
    console.log('Worker shutdown');
    abortTask.abort(); 
    setTimeout(() => {
      ventilator.close();
      sink.close();
    }, 0);
  };

  ventilator.connect('tcp://localhost:5016');
  sink.connect('tcp://localhost:5017');

  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);

  run(ventilator, sink, abortTask.signal)
    .catch(err => console.error(err));
}

main();
