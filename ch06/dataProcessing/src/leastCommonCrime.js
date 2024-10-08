import { Transform } from "stream";

export default class LeastCommonCrime extends Transform {
  constructor(id, options = {}) {
    options.objectMode = true;
    super(options);
    this.id = id;
    this.result = {};
  }

  _transform(data, enc, cb) {
    if (data.major_category in this.result) {
      this.result[data.major_category] += Number(data.value); 
    }
    else
      this.result[data.major_category] = Number(data.value); 
    cb();
  }

  _flush(cb) {
    const mostCrimes = Object.entries(this.result);
    mostCrimes.sort((a, b) => b[1] - a[1]);
    const result = mostCrimes
      .slice(0, 5)
      .map(item => item.join(" "))
      .join("\n");
    this.push(
      `\n${this.id}. Least common crimes (category, crimes):\n\n${result}\n`
    );
    cb();
  }
}
