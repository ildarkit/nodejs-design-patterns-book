import fs from 'fs';
import path from 'path';

export default function listNestedFiles(dir, cb) {
  nextFile([dir], [], cb);
}

function nextFile(dirs, filesResult, cb) {
  if (dirs.length === 0) {
    return cb(null, filesResult);
  }
  const file = dirs.shift();

  fs.stat(file, (err, stat) => {
    if (err) cb(err);
    else if (stat.isDirectory()) {
      readDir(file, dirs, filesResult, cb);
    } else if (stat.isFile()) {
      filesResult.push(file);
      nextFile(dirs, filesResult, depth, cb);
    }
  });
}

function readDir(dir, dirs, filesResult, cb) {
  fs.readdir(dir, (err, content) => {
    if (err) return cb(err);

    for (let i = 0; i < content.length; i++) {
      const pathFile = path.join(dir, content[i]);

      fs.stat(pathFile, (err, stat) => {
        if (err) cb(err);
        else if (stat.isFile()) {
          filesResult.push(pathFile);
        } else if (stat.isDirectory())
          dirs.push(pathFile);
        if (i === content.length - 1)
          nextFile(dirs, filesResult, cb);
      });
    }
  });
}
