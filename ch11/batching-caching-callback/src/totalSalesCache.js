import { totalSales as totalSalesOriginal } from './totalSales.js';

const CACHE_TTL = 30 * 1000;
const cache = new Map();

export function totalSales(product, cb) {
  if (cache.has(product)) {
    console.log('Cache hit');
    return cb(cache.get(product));
  }

  totalSalesOriginal(product, (sum) => {
    cache.set(product, sum);
    cb(sum);
    setTimeout(() => {
      cache.delete(product);
    }, CACHE_TTL);
  });
}
