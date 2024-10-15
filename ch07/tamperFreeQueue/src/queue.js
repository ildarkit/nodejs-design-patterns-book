import _Queue from "yocto-queue";

export default class Queue {
  constructor(executor) {
    this.queue = new _Queue();
    this.consumerQueue = new _Queue(); 
    executor({ enqueue: this.#enqueue.bind(this) });
  }

  async #enqueue(element) {
    if (this.consumerQueue.size > 0) {
      const resolve = this.consumerQueue.dequeue();
      return resolve(element);
    }
    this.queue.enqueue(element);
  }

  async dequeue() {
    return new Promise((resolve) => {
      if (this.queue.size > 0)
        return resolve(this.queue.dequeue());
      this.consumerQueue.enqueue(resolve);
    });
  }
}
