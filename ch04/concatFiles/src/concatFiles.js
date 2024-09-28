import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp';

export default function concatFiles(srcFiles, dest, cb) {
  const content = [];
  nextFile(srcFiles, dest, 0, content, cb);
}

function nextFile(files, dest, index, content, cb) {
  if (index === files.length)
    return saveFile(dest, content.join(''), cb);

  fs.readFile(files[index], 'utf8', (err, fileContent) => {
    if (err) return cb(err);
    content.push(fileContent);
    nextFile(files, dest, index + 1, content, cb);
  });
}

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename))
    .then(
      () => fs.writeFile(filename, contents, cb),
      err => cb(err)
    );
}
