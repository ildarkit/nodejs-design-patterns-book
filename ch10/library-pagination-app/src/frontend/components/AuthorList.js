import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';
import { handleItems, useNewData } from './helpers.js';
import { useSessionStorage, useStoredOffsetItems } from '../session.js';

export function AuthorList({
  data,
  handleData,
  perPageItems,
  children,
  ...rest
}) {
  const isNewData = useNewData(data); 
  const [ currentItems, handleOffset ] = useStoredOffsetItems(
    data.authors, perPageItems, isNewData); 

  return html`
    <div>
      <${Authors} items=${currentItems}>
        ${children}
      </> 
      <${PaginateItems} 
        ...${rest}
        resetPage=${isNewData}
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
    <div className="authors">
      ${items.map((author) => html`
        <div key=${author.id} className="author">
          <${Link} to="${`/author/${author.slug}`}">
            <img 
              className="author-picture"
              src="${`/public/authors/${author.picture}`}"
              alt="author picture"
            />
            <p>${author.name}</p>
          </>
        </div>
      `)}
      ${items.length === 0 && html`
        <div className="no-result">
          <h3 className="text-center">No result.</h3>
        </div>`
      }
    </div>
  `;
}
