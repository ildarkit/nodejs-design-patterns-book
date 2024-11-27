import { parentPort } from 'node:worker_threads';
import { FunctionCall } from '../callFunction.js';

parentPort.on('message', msg => {
  const func = new FunctionCall();

  func.on('end', data => {
    parentPort.postMessage({ event: 'end', data });
  }); 

  func.run(msg);
})
