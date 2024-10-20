import Queue from "yocto-queue";

export default class AsyncQueue {
  constructor() {
    this.tasks = new Queue();
  }

  [Symbol.asyncIterator]() {
    const taskIter = this.tasks[Symbol.iterator]();
    return {
      async next() {
        const res = taskIter.next();
        if (res.done) return { done: true };
        return { done: false, value: await res.value };
      },
      ['return']() {
        return { done: true };
      },
    } 
  }

  done(iter) {
    return iter.return();
  }

  enqueue(task) {
    this.tasks.enqueue(task);
  }
}
