import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import PaginateItems from './Pagination.js';
import { handleItems, useNewSearchedData } from './helpers.js';
import { useSessionStorage, useStoredOffset } from '../session.js';

export function AuthorList({
  data,
  query,
  resetQuery,
  handleData,
  perPageItems,
  children,
  ...rest
}) {
  const newSearchData = useNewSearchedData(data.q, query);
  const [ offset, handleOffset ] = useStoredOffset(
    perPageItems, newSearchData); 

  console.log(`offset = ${offset}`);

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
      /> 
    </div>
  `;
}

function Authors({ items, children, ...rest }) {
  
  return html`
    <h2 className="text-center">Books by author</h2> 
    <${QueryClean} ...${rest}/>
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

function QueryClean({ query, resetQuery }) {
  return query && html`
    <div className="clean-search">
      <p>Search for "${query}"</p>
      <button 
        className="clean-search-button"
        onClick=${() => resetQuery()}
      >
        Clean search
      </button>
    </div>
  `;
}
