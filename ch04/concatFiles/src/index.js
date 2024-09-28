import concatFiles from './concatFiles.js';

const srcFiles = process.argv.slice(2);
const dest = srcFiles.pop();

concatFiles(srcFiles, dest, (err) => {
  if (err)
    console.error(err.message);
  console.log(`File ${dest} created`);
});
