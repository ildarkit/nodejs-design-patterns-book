import { Author, Book } from './db/model.js';
import { authors } from './authors.js';
import { sequelize } from './db/connection.js';

export async function getAuthors() {
  const authors = await Author.findAll({
    attributes: ['id' ,'slug', 'name', 'picture']
  });
  return authors;
}

export async function getAuthorInfo(slug) {
  const author = await Author.findOne({
    attributes: ['name', 'bio', 'picture'],
    where: { slug },
    include: Book,
  });
  return author;
}

export async function importAuthorData(data) {
  const t = await sequelize.transaction();

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
        delete book.id;
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
    console.log('Data import error:', e);
    t.rollback();
  }
}
