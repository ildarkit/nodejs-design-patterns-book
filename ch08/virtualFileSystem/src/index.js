import { createFSAdapter } from "./virtual-adapter.js";

const fs = createFSAdapter();

fs.writeFile('file.txt', 'Hello!', () => {
  fs.readFile('file.txt', { encoding: 'utf8' }, (err, res) => {
    if (err) {
      return console.error(err)
    }
    console.log(res)
  })
})

fs.readFile('missing.txt', { encoding: 'utf8' }, (err, res) => {
  console.error(err)
})
