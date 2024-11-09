import { useState } from 'react';
import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';

export function AuthorList({ data, ...rest }) {
  const [ currentItems, setCurrentItems ] = useState([]);

  function handleItems(startOffset, endOffset) {
    setCurrentItems(data.authors.slice(startOffset, endOffset));
  };

  return html`
    <div>
      <${Authors} items=${currentItems}/>
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

function Authors({ items }) {
  return html`
    <h2 className="text-center">Books by author</h2>
    <div className="row">${items.map((author) =>
      html`<div key=${author.id} className="col text-center">
        <${Link} to="${`/author/${author.slug}`}">
          <img 
            className="author-picture"
            src="${`/public/authors/${author.picture}`}"
            alt="author picture"
          />
          <p>${author.name}</p>
        </>
      </div>`)}
    </div>
  `;
}
