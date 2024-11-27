import { CancelError } from './cancelError.js';

export function createAsyncCancelable(generatorFunction) {
  return function asyncCancelable(...args) {
    const generator = generatorFunction(...args);
    let cancelRequested = false;

    function cancel() {
      cancelRequested = true;
    }

    const promise = new Promise((resolve, reject) => {
      async function nextStep (prevResult) {
        if (cancelRequested) {
          return reject(new CancelError());
        }

        if (prevResult.done) {
          return resolve(prevResult.value);
        }

        try {
          nextStep(generator.next(await prevResult.value));
        } catch (err) {
          try {
            nextStep(generator.throw(err));
          } catch (err2) {
            reject(err2);
          }
        }
      }

      nextStep({});
    })

    return { promise, cancel, generator };
  }
}
