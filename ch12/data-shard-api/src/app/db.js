import fs from 'node:fs';

export function connect(path, cb) {
  fs.readFile(path, function (err, data) {
    if (err) return cb(err);
    data = JSON.parse(data);
    cb(null, data);
  });
}

export function findAll(db, cb) {
  return db.filter(cb);
}
