import { Transform } from "stream";

export default class StreamChannel extends Transform {
  constructor(channel, options = {}) {
    super(options);
    this.channel = channel;
  }

  _transform(chunk, enc, cb) {
    const buf = Buffer.alloc(5 + chunk.length);
    buf.writeUInt8(this.channel, 0);
    buf.writeUInt32BE(chunk.length, 1);
    chunk.copy(buf, 5);
    this.push(buf);
    cb();
  }
}
