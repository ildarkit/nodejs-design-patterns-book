import { html } from 'htm/react';

export function AuthorBooks({ author }) {
  return html`
    <h3 className="text-center">Books</h3>
    <ul className="books">
      ${author.Books.map((book) =>
        html`<li key=${book.id} className="book">
          <div className="cover">
            <img
              className="book-cover"
              src="${`/public/covers/${book.cover}`}"
            />
          </div>
          <div className="info">
            <p className="title">${book.title}</p>
            <p>${book.year}</p>
          </div>
        </li>`
      )}
    </ul>
  `;
}
