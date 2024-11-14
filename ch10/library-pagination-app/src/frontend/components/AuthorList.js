import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';
import { handleItems, useItems } from './helpers.js';

export function AuthorList({ data, handleData, pageItemCount, ...rest }) {
  const [ currentItems, handleOffset ] = useItems(data.authors, pageItemCount); 

  return html`
    <div>
      <${Authors} items=${currentItems}/>
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
