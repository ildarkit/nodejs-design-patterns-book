import { Author, Book } from './db/model.js';
import { connection } from './db/connection.js';

export class Repository {
  constructor(conn = connection) {
    this.conn = conn;
  }

  async transaction() {
    return await this.conn.transaction();
  }

  async getAuthors({ offset, limit }) {
    offset = !offset || offset < 0 ? 0 : offset;
    limit = !limit || limit < 0 ? 100 : limit; 
    const total_count = await Author.count();
    const authors = await Author.findAll({
      attributes: ['id' ,'slug', 'name', 'picture'],
      offset,
      limit,
    });
    return { result: { authors }, total_count };
  }

  async getAuthorInfo({ slug, offset, limit }) {
    offset = !offset || offset < 0 ? 0 : offset;
    limit = !limit || limit < 0 ? 100 : limit;
    const total_count = await Book.count({
      include: [{
        model: Author,
        where: { slug },
      }],
    });
    const author = await Author.findOne({
      attributes: ['name', 'bio', 'picture'],
      where: { slug }, 
    });
    const books = author ? await Book.findAll({
      offset,
      limit,
      include: [{
        model: Author,
        where: { slug },
      }],
    }) : [];
    return { result: { author, books }, total_count };
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
