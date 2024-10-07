import { Readable } from "stream";
import { generate } from "random-words";

export const DATASIZE = 1 * 1024 * 1024;

export class RandomStream extends Readable {
  constructor(size = DATASIZE, options = {}) {
    super(options);
    this.emittedBytes = 0;
    this.limit = size;
  }

  _read() {
    while (true) {
      const chunk = generate({ exactly: 100, join: " " });
      if (chunk.length + this.emittedBytes < this.limit) {
        this.push(chunk, 'utf8');
        this.emittedBytes += chunk.length;
      } else {
        const lastChunkSize = this.limit - this.emittedBytes;
        this.push(chunk.slice(0, lastChunkSize), 'utf8');
        this.emittedBytes += lastChunkSize;
        break;
      }
    }
    this.push(null);
  }
}  

export const inputStream = new RandomStream();
