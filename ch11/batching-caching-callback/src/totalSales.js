import { Level } from 'level';
import { ValueStream } from 'level-read-stream';

const db = new Level('example-db', { valueEncoding: 'json' });
const salesDb = db.sublevel('sales', { valueEncoding: 'json' });

export async function totalSales (product) {
  const now = Date.now();
  let sum = 0;
  for await (const transaction of new ValueStream(salesDb)) {
    if (!product || transaction.product === product) {
      sum += transaction.amount;
    }
  }
  console.log(`totalSales() took: ${Date.now() - now}ms`);
  return sum;
}
