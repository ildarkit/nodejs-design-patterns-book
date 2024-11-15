import { html } from 'htm/react';
import PaginateItems from './Pagination.js';
import { handleItems, useItems } from './helpers.js';

export function AuthorBooks({ books, handleData, perPageItems, children, ...rest }) {
  const [ currentItems, handleOffset ] = useItems(books, perPageItems);

  return html`
    <div>
      <${Books} items=${currentItems}>
        ${children}
      </>
      <${PaginateItems} 
        ...${rest}
        handleItems=${(args) => handleItems(
          { ...args, handleOffset, handleData }
        )}
        perPageItems=${perPageItems}
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
