import fs from 'fs';
import path from 'path';

export default function recursiveFind(dir, keyword, queue) {
  const listeners = [];
  addTask(dir, keyword, queue, (err, value) => {
    listeners.forEach(listener => listener(err, value));
  });

  return {
    onReadyData: listener => listeners.push(listener)
  };
}

function addTask(file, keyword, queue, cb) {
  queue.addTask((done) => {
    dirTask(file, keyword, queue, done, cb); 
  }); 
}

function dirTask(file, keyword, queue, done, cb) {
  fs.stat(file, (err, stat) => {
    if (err) return done(err);

    if (stat.isDirectory()) {
      dirContent(file, keyword, queue, done, cb);
    } else if (stat.isFile()) {
      keywordContents(file, keyword, (err, res) => {
        if (err) cb(err);
        else if (res) cb(null, res.file);
      });
    }

    done(); 
  });
}

function dirContent(dir, keyword, queue, done, cb) {
  fs.readdir(dir, (err, content) => {
    if (err) return done(err);

    getContent(dir, content, keyword, (err, res) => {
      if (err) return done(err);
      if (res) {
        if (res.isFile) return cb(null, res.file);
        addTask(res.file, keyword, queue, cb);
      }
    }); 
  });
}

function getContent(dir, files, keyword, cb) {
  files.forEach(file => {
    keywordContents(path.join(dir, file), keyword, cb);
  });
}

function keywordContents(file, keyword, cb) {
  fs.stat(file, (err, stat) => {
    if (stat.isDirectory()) 
      return cb(null, { file, isFile: false });

    stat.isFile() && fs.readFile(file, (err, content) => {
      if (err) return cb(err);
      if (content.includes(keyword))
        cb(null, { file, isFile: true });
    });
  });
}
