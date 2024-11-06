import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { Repository } from '../data/repo.js';
import { authors } from './authors.js';
import { getData, slugify } from './openLibraryApi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC=resolve(__dirname, '../..', 'public');
const AUTHOR_PICTURE_PATH = join(PUBLIC, 'authors');
const BOOK_COVER_PATH = join(PUBLIC, 'covers');

async function importAuthorData(repository, data) {
  const transaction = await repository.transaction();

  try {
    for (const item of data) {
      const slug = slugify(item.name);
      const key = item.key ? item.key : null;
      let author = await repository.getAuthor(slug);
      if (author === null)
        author = await repository.createAuthor({
          props: {
            key,
            slug,
            name: item.name,
            bio: item.bio,
            picture: item.picture,
          },
          transaction
        });
      item.books.forEach(book => {
        book.slug = slugify(`${book.title} ${book.year}`);
      });
    let books = [];
      for (const book of item.books) {
        const bookRecord = await repository.getBook(book.slug);
        if (bookRecord === null)
          books.push(await repository.createBook({ props: book, transaction }));
    }
      await repository.addBooks({ author, books, transaction });
    };
    await transaction.commit();
  } catch (e) {
    console.log('Import error:', e);
    transaction.rollback();
  }
}

async function main(repo, authorPicturePath, bookCoverPath) {
  let importData = authors;
  if (process.argv.length > 2) {
    const { err, data } = await getData(repo, authorPicturePath, bookCoverPath);
    if (err) {
      console.error(err);
      return;
    }
    importData = data;
  }
  await importAuthorData(repo, importData);
}

await main(new Repository(), AUTHOR_PICTURE_PATH, BOOK_COVER_PATH);
