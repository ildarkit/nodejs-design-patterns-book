import { EventEmitter } from 'node:events';
import { preQueueMethod } from './preQueue.js';

class DB extends EventEmitter {
  query(queryString) {
    console.log(`execute: ${queryString}`);
  }

  connect() {
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
    }, 100);
  }
}

const db = preQueueMethod(new DB(), 'query', 'connected');
db.connect();
db.query('command 1');
db.query('command 2');
db.query('command 3');
setTimeout(() => {
  db.query('command 4');
  db.query('command 5');
  db.query('command 6');
}, 200);
