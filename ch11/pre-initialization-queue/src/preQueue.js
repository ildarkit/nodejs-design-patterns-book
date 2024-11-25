class TargetMethodQueue {
  ready = false;

  constructor(target, methodName) {
    this.target = target;
    this.targetMethod = methodName;
    this.queue = [];
  }

  deactivate() {
    this.ready = true;
    this.queue.forEach(command => command());
    this.queue = [];
  }

  runMethod(...args) {
    if (!this.ready) {
      return new Promise((resolve, reject) => {
        const method = () => {
          Promise.resolve()
            .then(this.target[this.targetMethod](...args))
            .then(resolve, reject);
        };
        this.queue.push(method);
      });
    }
    return this.target[this.targetMethod](...args);
  }
}

export function preQueueMethod(target, targetMethod, queueRunEvent) {
  const queue = new TargetMethodQueue(target, targetMethod);
  const handler = {
    get(target, name) {
      if (name === targetMethod && name in target)
        return queue.runMethod.bind(queue);
      return target[name];
    },
  }; 
  target.on(queueRunEvent, () => {
    queue.deactivate();
    console.log(`queue deactivated`);
  });
  return new Proxy(target, handler);
}


