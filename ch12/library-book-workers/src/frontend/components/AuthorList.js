import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';
import { handleItems, useNewSearch } from './helpers.js';
import { useSessionStorage } from '../session.js';

export function AuthorList({
  data,
  query,
  resetQuery,
  handleData,
  perPageItems,
  children,
  ...rest
}) {
  const newSearchData = useNewSearch(data.q, query);
  const [ offset, handleOffset ] = useSessionStorage('offset', 0); 

  function resetQueryData() {
    resetQuery();
    handleData();
  } 

  return html`
    <div>
      <${Authors}
        items=${data.authors.slice(offset, offset + perPageItems)}
        query=${query}
        resetQuery=${resetQueryData}
      >
        ${children}
      </> 
      <${PaginateItems} 
        ...${rest}
        resetPage=${newSearchData}
        handleItems=${(args) => handleItems(
          { ...args, query, handleOffset, handleData }
        )}
        perPageItems=${perPageItems}
        handleSession=${(initValue) => useSessionStorage('authorListPage', initValue)}
        offset=${offset}
        handleOffset=${handleOffset}
      /> 
    </div>
  `;
}

function Authors({ items, children, ...rest }) {
  
  return html`
    <h2 className="text-center">Books by author</h2> 
    <${QueryClean} ...${rest}/>
    ${children}
    ${items.length > 0 && html`<div className="authors">
      ${items.map((author) => html`
        <div key=${author.slug} className="author">
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
    </div>`}
    ${items.length === 0 && html`
      <div className="no-result">
        <p>No result.</p>
      </div>`
    }
  `;
}

function QueryClean({ query, resetQuery }) {
  return query && html`
    <div className="clear-search">
      <p>Search result for "${query}"</p>
      <button 
        className="clear-search-button"
        onClick=${() => resetQuery()}
      >
        Clear search
      </button>
    </div>
  `;
}
