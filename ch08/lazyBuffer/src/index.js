import { createLazyBuffer } from "./lazy-buffer.js";

const contents = "Test lazy string";
const buf = createLazyBuffer(contents.length);
console.log(`buf length = ${buf.length}`);
buf.write(contents);
console.log(`buf length after write = ${buf.length}`);
console.log(String(buf));
console.log(buf.subarray(0, 4).toString());
