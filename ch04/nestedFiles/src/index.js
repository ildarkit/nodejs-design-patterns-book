import listNestedFiles from './listFiles.js';

listNestedFiles(process.argv[2],
  (err, res) => {
    if (err) return console.error(err.message);
    console.log(res);
  }
);
