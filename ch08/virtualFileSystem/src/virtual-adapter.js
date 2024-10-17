export function createFSAdapter() {
  return new VirtualFileSystem();
}

class VirtualFileSystem {
  constructor() {
    this.fs = {};
  }

  readFile(filename, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    const content = this.fs[filename];
    if (content) return cb && cb(null, content);
    const err = new Error(`ENOENT, open "${filename}"`);
    err.code = "ENOENT";
    err.errno = 34;
    err.path = filename;
    cb && cb(err);
  }

  writeFile(filename, contents, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    this.fs[filename] = contents;
    cb();
  }
}
