import { join } from 'node:path';
import { createWriteStream } from 'node:fs';
import { stringify } from 'node:querystring';
import superagent from 'superagent';

function authorBookUrl(author, title) {
  return 'https://openlibrary.org/search.json?' +
    stringify({ author, title }) +
    '&fields=author_key,author_name,cover_edition_key,first_publish_year,title&limit=1';
};
const jpgFileName = (id) => `${id}-M.jpg`;
const authorBioUrl = (authorKey) => `https://openlibrary.org/authors/${authorKey}.json`;
const authorPictureUrl = (authorKey) => 'https://covers.openlibrary.org/a/olid/' + 
  `${jpgFileName(authorKey)}`;
const bookCoverUrl = (bookKey) => 'https://covers.openlibrary.org/b/olid/' +
  `${jpgFileName(bookKey)}`;

async function getRequest(url) {
  const { body } = await superagent.get(url);
  return body;
}

function argsError() {
  return new Error('Named arguments required: author=author title=title');
}

function getBookArgs() {
  const book = {};
  if (process.argv.length < 3) {
    book.err = argsError();
    return book;
  }
  const args = process.argv.slice(2);
  args.forEach(arg => {
    const argItem = arg.split('=');
    if (argItem.length === 2)
      book[argItem[0]] = argItem[1];
  });
  if (!(book.author && book.title)) {
    return { err: argsError() };
  }
  return book;
}

async function authorBookRequest(getUrl) {
  const args = getBookArgs();
  if (args.err)
    return { err: args.err };

  const author = args.author;
  const title = args.title;
  const authorBook = await getRequest(getUrl(author, title));
  return getAuthorBook(authorBook.docs[0]);
}

function getAuthorBook(authorBook) {
  return {
    err: null,
    author: {
      key: authorBook.author_key[0],
      name: authorBook.author_name[0],
    },
    book: {
      key: authorBook.cover_edition_key, 
      title: authorBook.title,
      year: authorBook.first_publish_year,
    }
  };
}

async function getAuthorBio(key, getUrl) {
  const res = await getRequest(getUrl(key));
  return res.bio;
}

function saveAuthorPicture(key, getUrl, path) {
  superagent
    .get(getUrl(key))
    .pipe(
      createWriteStream(
        join(
          path,
          jpgFileName(key)
        )
      )
    );
}

function saveBookCover(key, getUrl, path) {
  superagent
    .get(getUrl(key))
    .pipe(
      createWriteStream(
        join(
          path,
          jpgFileName(key)
        )
      )
    );
}

export function slugify(value) {
  return String(value)
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

export async function getData(
  repo,
  authorPicturePath,
  bookCoverPath,
) {
  const { err, author, book } = await authorBookRequest(authorBookUrl);
  if (err)
    return { err };

  const newAuthor = await repo.getAuthor(slugify(author.name));
  if (newAuthor === null) {
    author.bio = await getAuthorBio(author.key, authorBioUrl);
    saveAuthorPicture(author.key, authorPictureUrl, authorPicturePath);
    author.picture = jpgFileName(author.key);
  }
  const newBook = await repo.getBook(slugify(`${book.title} ${book.year}`));
  if (newBook === null) {
    saveBookCover(book.key, bookCoverUrl, bookCoverPath);
    book.cover = jpgFileName(book.key);
  }
  author.books = [book];
  return { err: null, data: [author]};
}
