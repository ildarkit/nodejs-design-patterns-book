import { createGzip } from "zlib";
import { inputStream } from "./randomWords.js";

inputStream
  .pipe(createGzip())
  .pipe(process.stdout)
