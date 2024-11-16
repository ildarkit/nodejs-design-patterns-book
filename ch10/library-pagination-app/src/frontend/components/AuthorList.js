import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';
import { handleItems } from './helpers.js';
import { useSessionStorage, useStoredOffsetItems } from '../session.js';

export function AuthorList({
  authors,
  handleData,
  perPageItems,
  children,
  ...rest
}) {
  const [ currentItems, handleOffset ] = useStoredOffsetItems(
    authors, perPageItems); 

  return html`
    <div>
      <${Authors} items=${currentItems}>
        ${children}
      </> 
      <${PaginateItems} 
        ...${rest}
        handleItems=${(args) => handleItems(
          { ...args, handleOffset, handleData }
        )}
        perPageItems=${perPageItems}
        handleSession=${(initValue) => useSessionStorage('authorListPage', initValue)}
      /> 
    </div>
  `;
}

function Authors({ items, children }) {
  return html`
    <h2 className="text-center">Books by author</h2>
    ${children}
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
