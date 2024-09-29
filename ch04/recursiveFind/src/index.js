import recursiveFind from './recursiveFind.js';

recursiveFind(process.argv[2],
  process.argv[3],
  (err, res) => {
    if (err) return console.error(err.message);
    console.log(res);
  }
);
