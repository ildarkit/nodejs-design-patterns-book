import { EventEmitter } from 'node:events';
import { dispatch } from './dispatch.js';

export class FunctionCall extends EventEmitter {
  run({ functionName, args }) {
    if (dispatch.has(functionName)) {
      const result = dispatch.get(functionName)(args);
      this.emit('end', { functionName, args, result });
    } else
      this.emit('end', { code: 404, message: 'function not found' }); 
  }
}
