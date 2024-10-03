class PromiseClass {
  static async all(iterable) {
    const result = [];
    const promises = iterable.map(
      item => Promise.resolve().then(() => item)
    );
    for (const promise of promises)
      result.push(await promise);
    return result;
  }
}

const promise = new Promise(
  resolve => setTimeout(resolve(4) ,50)
);
PromiseClass.all([1, 2, 3, promise])
  .then(console.log)
  .catch((err) => console.error(err.message));
