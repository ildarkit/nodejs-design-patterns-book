import mapAsync from './mapAsync.js';

function* makeRangeIterator(start = 0, end = 1_000_000, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

const start = performance.now();
await mapAsync(
  [...makeRangeIterator()],
  (item) => item * 2,
  1
);
console.log(`time = ${performance.now() - start}`);
