import { html } from 'htm/react';
import PaginateItems from './Pagination.js';
import { handleItems, useOffset } from './helpers.js';
import { useSessionStorage } from '../session.js';

export function AuthorBooks({ books, handleData, perPageItems, children, ...rest }) {
  const [ offset, handleOffset ] = useOffset(perPageItems);

  return html`
    <div>
      <${Books} items=${books.slice(offset, offset + perPageItems)}>
        ${children}
      </>
      <${PaginateItems} 
        ...${rest}
        handleItems=${(args) => handleItems(
          { ...args, handleOffset, handleData }
        )}
        perPageItems=${perPageItems}
        handleSession=${(initValue) => useSessionStorage('authorBooksPage', initValue)}
      /> 
    </div>
  `;
}

function Books({ items, children }) {
  return html`
    <h3 className="text-center">Books</h3>
    ${children}
    <ul className="books">
      ${items.map((book) =>
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
