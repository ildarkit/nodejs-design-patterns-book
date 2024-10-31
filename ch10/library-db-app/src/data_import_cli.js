import 'dotenv/config';
import { importAuthorData } from './data/repo.js';
import { authors } from './data/authors.js';

await importAuthorData(authors);
