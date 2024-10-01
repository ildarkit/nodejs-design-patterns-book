import { EventEmitter } from 'events'

export default class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  addTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
  } 

  next() { 
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task((err, value) => {
        if (err) {
          return this.emit('error', err);
        }
        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    } 
  }
}
