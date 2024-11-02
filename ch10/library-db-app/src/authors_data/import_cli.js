import 'dotenv/config';
import { connection } from '../data/db/connection.js';
import { Author, Book } from '../data/db/model.js';
import { authors } from './authors.js';

async function importAuthorData(data) {
  const t = await connection.transaction();

  try {
    for (const item of data) {
      const author = await Author.create(
        {
          slug: item.name.split(' ').join('-'),
          name: item.name,
          bio: item.bio,
          picture: item.picture,
        },
        { transaction: t }
      );
      item.books.forEach(book => {
        book.slug = `${book.title.toLocaleLowerCase()}-${book.year}`;
      });
      let books = [];
      for (const book of item.books) {
        books.push(await Book.create(book, { transaction: t }));
      }
      await author.addBooks(books, { transaction: t });
    };
    await t.commit();
  } catch (e) {
    console.log('Import error:', e);
    t.rollback();
  }
}

await importAuthorData(authors);
