import { asyncRoutine } from './asyncRoutine.js';
import { createAsyncCancelable } from './createAsyncCancelable.js';
import { CancelError } from './cancelError.js';

const cancelableNested = createAsyncCancelable(function * () {
  const resA = yield asyncRoutine('A');
  console.log(resA);
  const resB = yield asyncRoutine('B');
  console.log(resB);
  const resC = yield asyncRoutine('C');
  console.log(resC);
});

const cancelable = createAsyncCancelable(function * () {
  const resAA = yield asyncRoutine('AA');
  console.log(resAA);
  yield* cancelableNested().generator;
  const resBB = yield asyncRoutine('BB');
  console.log(resBB);
});

const { promise, cancel } = cancelable();
promise.catch(err => {
  if (err instanceof CancelError) {
    console.log('Function canceled');
  } else {
    console.error(err);
  }
});

setTimeout(() => {
  cancel();
}, 150);
