class LazyBufferWrapper {
  constructor(size) {
    this.size = size;
    this.buf = null;
  }
  write(...args) {
    this.buf = Buffer.alloc(this.size);
    this.buf.write(...args);
  }
};

export function createLazyBuffer(size) { 
  const bufferHandle = {
    get(target, prop) {
      let result = null;
      if (prop === 'write')
        result = target[prop].bind(target);
      else if (target.buf) {
        result = target.buf[prop];
        if (typeof result === 'function')
          result = result.bind(target.buf);
      }
      return result;
    }
  };

  return new Proxy(
    new LazyBufferWrapper(size),
    bufferHandle
  );
}
