import { createBrotliCompress } from "zlib";
import { inputStream } from "./randomWords.js";

inputStream
  .pipe(createBrotliCompress())
  .pipe(process.stdout)
