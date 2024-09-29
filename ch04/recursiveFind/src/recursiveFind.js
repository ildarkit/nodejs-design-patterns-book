import fs from 'fs';
import path from 'path';

export default function recursiveFind(dir, keyword, cb) {
  nextFile([dir], keyword, [], cb);
}

function nextFile(dirs, keyword, filesResult, cb) {
  if (dirs.length === 0) {
    return keywordIncludes(keyword, filesResult, cb);
  }
  const file = dirs.shift();

  fs.stat(file, (err, stat) => {
    if (err) cb(err);
    else if (stat.isDirectory()) {
      readDir(file, dirs, keyword, filesResult, cb);
    } else if (stat.isFile()) {
      filesResult.push(file);
      nextFile(dirs, keyword, filesResult, depth, cb);
    }
  });
}

function readDir(dir, dirs, keyword, filesResult, cb) {
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
          nextFile(dirs, keyword, filesResult, cb);
      });
    }
  });
}

function keywordIncludes(keyword, files, cb) {
  const result = [];
  for (let i = 0; i < files.length; i++) {
    fs.readFile(files[i], 'utf8', (err, content) => {
      if (err) cb(err);
      else if (content.includes(keyword))
        result.push(files[i]);
      if (i === files.length - 1) return cb(null, result);
    });
  }
}
