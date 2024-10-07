import { createDeflate } from "zlib";
import { inputStream } from "./randomWords.js";

inputStream
  .pipe(createDeflate())
  .pipe(process.stdout)
