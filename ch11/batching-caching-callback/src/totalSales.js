import { Level } from 'level';
import { ValueStream } from 'level-read-stream';

const db = new Level('example-db', { valueEncoding: 'json' });
const salesDb = db.sublevel('sales', { valueEncoding: 'json' });

export function totalSales(product, cb) {
  const now = Date.now();
  let sum = 0;
  new ValueStream(salesDb)
    .on('readable', function() {
      let data;
      while ((data = this.read()) !== null) {
        if (!product || data.product === product)
          sum += data.amount; 
      }
    })
    .on('end', () => {
      console.log(`totalSales() took: ${Date.now() - now}ms`);
      cb(sum);
    });
}
