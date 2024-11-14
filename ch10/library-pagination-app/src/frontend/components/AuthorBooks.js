import { html } from 'htm/react';
import PaginateItems from './Pagination.js';
import { handleItems, useItems } from './helpers.js';

export function AuthorBooks({ books, handleData, pageItemCount, ...rest }) {
  const [ currentItems, handleOffset ] = useItems(books, pageItemCount);

  return html`
    <div>
      <${Books} items=${currentItems}/>
      <div className="row">
        <div className="col">
          <${PaginateItems} 
            ...${rest}
            handleItems=${(args) => handleItems(
              { ...args, handleOffset, handleData }
            )}
            pageItemCount=${pageItemCount}
          /> 
        </div>
      </div>
    </div>
  `;
}

function Books({ items }) {
  return html`
    <h3 className="text-center">Books</h3>
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
