import mapAsync from './mapAsync.js';

function* makeRangeIterator(start = 0, end = 1_000_000, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

const start = performance.now();
const items = await mapAsync(
  [...makeRangeIterator()],
  (item) => item * 2,
  4,
);
console.log(`time = ${performance.now() - start}`);
console.log(items);
