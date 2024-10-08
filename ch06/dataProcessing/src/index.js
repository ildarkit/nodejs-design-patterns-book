import { Open } from "unzipper";
import { parse } from "csv-parse";
import NumberCrimesByYear from "./numberCrimesByYear.js";
import MostDangerousAreas from "./mostDangerousAreas.js";
import MostCommonAreaCrime from "./mostCommonAreaCrime.js"
import LeastCommonCrime from "./leastCommonCrime.js";

function writeStream(stream) {
  stream.pipe(process.stdout);
}

const csvParser = parse({ columns: true });

const dir = await Open.file(process.argv[2]);
const parsedDataStream = dir.files[0]
  .stream()
  .pipe(csvParser);

const numberCrimesByYearStream = parsedDataStream
  .pipe(new NumberCrimesByYear(1));
const mostDangerousAreasStream = parsedDataStream
  .pipe(new MostDangerousAreas(2));
const mostCommonAreaCrimeStream = parsedDataStream
  .pipe(new MostCommonAreaCrime(3));
const leastCommonCrimeStream = parsedDataStream
  .pipe(new LeastCommonCrime(4));

writeStream(numberCrimesByYearStream);
writeStream(mostDangerousAreasStream);
writeStream(mostCommonAreaCrimeStream);
writeStream(leastCommonCrimeStream);
