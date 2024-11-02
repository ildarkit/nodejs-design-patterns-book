import { Author, Book } from './db/model.js';

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
