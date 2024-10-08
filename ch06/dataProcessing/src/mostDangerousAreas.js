import { Transform } from "stream";

export default class MostDangerousAreas extends Transform {
  constructor(id, options = {}) {
    options.objectMode = true;
    super(options);
    this.id = id;
    this.result = {};
  }

  _transform(data, enc, cb) {
    if (data.borough in this.result)
      this.result[data.borough] += Number(data.value);
    else this.result[data.borough] = Number(data.value);
    cb();
  }

  _flush(cb) {
    const areas = Object.entries(this.result);
    areas.sort((a, b) => b[1] - a[1]); 
    const result = areas.slice(0, 5).map(item => item[0]);
    this.push(
      `\n${this.id}. Most dangerous areas:\n\n${result.join("\n")}\n`
    );
    cb();
  }
}
