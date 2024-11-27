import { EventEmitter } from 'node:events';
import { dispatch } from './dispatch.js';

export class FunctionCall extends EventEmitter {
  run({ functionName, args }) {
    if (!(functionName in dispatch)) {
      this.emit('end', { code: 404, message: 'function not found' });
      return;
    }
    const result = dispatch[functionName](...args);
    this.emit('end', { message: result });
  }
}
