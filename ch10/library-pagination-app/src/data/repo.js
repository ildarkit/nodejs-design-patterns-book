import { Author, Book } from './db/model.js';
import { connection } from './db/connection.js';

export class Repository {
  constructor(conn = connection) {
    this.conn = conn;
  }

  async transaction() {
    return await this.conn.transaction();
  }

  async getAuthors() {
    const authors = await Author.findAll({
      attributes: ['id' ,'slug', 'name', 'picture']
    });
    return authors;
  }

  async getAuthorInfo(slug) {
    const author = await Author.findOne({
      attributes: ['name', 'bio', 'picture'],
      where: { slug },
      include: Book,
    });
    return author;
  }

  async getAuthor(slug) {
    return await Author.findOne({
      where: { slug },
    });
  }

  async getBook(slug) {
    return await Book.findOne({
      where: { slug },
    });
  }

  async createAuthor({ props, transaction }) {
    return await Author.create(props, { transaction });
  }
  
  async createBook({ props, transaction }) {
    return await Book.create(props, { transaction });
  }

  async addBooks({ author, books, transaction }) {
    await author.addBooks(books, { transaction });
  }
}
