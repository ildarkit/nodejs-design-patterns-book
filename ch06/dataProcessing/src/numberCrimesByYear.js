import { Transform } from "stream";

export default class NumberCrimesByYear extends Transform {
  constructor(id, options = {}) {
    options.objectMode = true;
    super(options);
    this.id = id;
    this.result = {};
  }

  _transform(data, enc, cb) {
    if (data.year in this.result)
      this.result[data.year] += Number(data.value);
    else this.result[data.year] = Number(data.value);
    cb();
  }

  _flush(cb) {
    const years = Object.keys(this.result);
    years.sort();
    let i = 0;
    let prev = this.result[years[i]];
    let res = 0;
    let answer = "Crimes go up\n";
    this.push(`${this.id}. Number of crimes group by years (year, crimes):\n\n`);
    while (++i < years.length) {
      this.push(`${years[i - 1]} - ${this.result[years[i - 1]]}\n`);
      res += this.result[years[i]] - prev;
      prev = this.result[years[i]];
    }
    this.push(
      `${years[years.length - 1]} - ${this.result[years[years.length - 1]]}\n`
    );
    if (res < 0)
      answer = "Crimes go down\n";
    this.push(answer);
    cb();
  }
}
