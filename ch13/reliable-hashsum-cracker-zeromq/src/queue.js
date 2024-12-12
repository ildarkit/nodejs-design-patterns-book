import Queue from 'yocto-queue';

export class TaskQueue {
  queue = new Queue();
  socket;
  max;
  sending = false;

  constructor(sender, max = 100) {
    this.sender = sender;
    this.max = max;
  }

  send(msg) {
    if (this.queue.size > this.max) {
      throw new Error("Queue is full");
    }
    this.queue.enqueue(msg);
    this.trySend();
  }

  async trySend() {
    if (this.sending) {
      return;
    }
    this.sending = true;

    while (this.queue.size) {
      await this.sender.send(this.queue.peek());
      const [msg] = await this.sender.receive();
      if (msg.length === 0) this.queue.dequeue();
      else break;
    }

    this.sending = false;
  }
}
