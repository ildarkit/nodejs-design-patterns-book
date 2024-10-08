import { Transform } from "stream";

export default class MostCommonAreaCrime extends Transform {
  constructor(id, options = {}) {
    options.objectMode = true;
    super(options);
    this.id = id;
    this.result = new Map();
  }

  _transform(data, enc, cb) {
    let categoryCrimes = 0;
    if (this.result.has(data.borough)) {
      if (this.result.get(data.borough).has(data.major_category)) {
        categoryCrimes = this
          .result
          .get(data.borough)
          .get(data.major_category);
      } 
    }
    else
      this.result.set(data.borough, new Map());
    this
      .result
      .get(data.borough)
      .set(data.major_category,
        categoryCrimes + Number(data.value)
      );
    cb();
  }

  _flush(cb) {
    const areas = Array.from(this.result.entries())
      .map(item => [item[0], [...item[1].entries()]]); 
    areas.forEach(item => item[1].sort((a, b) => b[1] - a[1]));
    areas.sort((a, b) => b[1][0][1] - a[1][0][1]);
    const result = areas.map(item => {
      return [
        "\n\n" + item[0],
        item[1]
          .slice(0, 5)
          .map(cat => cat.join(" "))
          .join("\n")
      ].join(":\n");
    });
    this.push(
      `\n${this.id}. Most common area crimes:${result.join("")}\n`
    );
    cb();
  }
}
