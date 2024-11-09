import { useState } from 'react';
import { html } from 'htm/react';
import PaginateItems from './Pagination.js';

export function AuthorBooks({ books, ...rest }) {
  const [ currentItems, setCurrentItems ] = useState([]);

  function handleItems(startOffset, endOffset) { 
    setCurrentItems(books.slice(startOffset, endOffset));
  };

  return html`
    <div>
      <${Books} items=${currentItems}/>
      <div className="row">
        <div className="col">
          <${PaginateItems} 
            ...${rest}
            handleItems=${handleItems}
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
