import { EventEmitter } from "events";
import { readFile } from "fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
  }

  find(...files) {
    for (const file of files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }

        this.emit('fileread', file);
        const match = content.match(this.regex);
        if (match) {
          match.forEach(elem => this.emit('found', file, elem));
        }
      });
    }
    return this;
  }
}

const helloFinder = new FindRegex(/hello \w+/);
helloFinder
  .find('file1.txt', 'file2.txt')
  .on(
    'found', 
    (file, match) => console.log(`Matched "${match}" in file ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`));
