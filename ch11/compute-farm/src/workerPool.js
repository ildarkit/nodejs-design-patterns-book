import { EventEmitter } from 'node:events';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ThreadPool } from './threadPool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname,
  'workers', 'threadWorker.js');
const workers = new ThreadPool(workerFile, 4);

export class WorkerPool extends EventEmitter {

  async start (params) {
    const worker = await workers.acquire();
    worker.postMessage(params);

    const onMessage = msg => {
      if (msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }

      this.emit(msg.event, msg.data);
    }

    worker.on('message', onMessage);
  }
}
