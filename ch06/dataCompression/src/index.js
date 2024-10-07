import { fork } from "child_process";
import { Readable, Transform } from "stream";
import { DATASIZE } from "./randomWords.js";

const sources = ["src/deflateStream.js", "src/brotliStream.js", "src/gzipStream.js"];

class TimeCount extends Transform {
  constructor(sources, dataSize, options = {}) {
    super(options);
    this.startTime = performance.now();
    this.sources = sources;
    this.dataSize = dataSize;
    this.result = {};
  }

  _transform(data, enc, cb) {
    const record = JSON.parse(data);
    if (record.source in this.result) {
      if (record.bytesCount === 0)
        this.result[record.source]
          .elapsed = performance.now() - this.result[record.source].elapsed;
      else
        this.result[record.source].bytesCount += record.bytesCount;
    }
    else {
      this.result[record.source] = {
        bytesCount: record.bytesCount,
        elapsed: performance.now()
      };
    }
    cb();
  }

  _flush(cb) {
    const result = [];
    for (const source in this.result) {
      result.push({
        source,
        elapsed: `${this.result[source].elapsed.toFixed(2)}ms`,
        efficiency: `${100 - (this.result[source].bytesCount * 100 /
          this.dataSize).toFixed(2)}%`,
      });
    }
    this.push(JSON.stringify(result));
    cb();
  }
}

function bytesCount(sources, destination) {
  let channelLength = sources.length;
  const channels = sources.map(source => {
    const child = fork(source, { silent: true });
    return child.stdout;
  });
  for (let i = 0; i < channels.length; i++) {
    channels[i]
      .on('readable', function() {
        let chunk;
        let bytesCount = 0;
        while ((chunk = this.read()) !== null) {
          bytesCount += chunk.length;
        }
        destination.write(
          JSON.stringify({source: sources[i], bytesCount})
        );
      })
      .on('end' , () => {
        if (--channelLength === 0)
          destination.end();
      });
  }
}

const timeStream = new TimeCount(sources, DATASIZE);
bytesCount(sources, timeStream);
timeStream
  .pipe(process.stdout);
