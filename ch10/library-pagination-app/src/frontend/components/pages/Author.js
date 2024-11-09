import { html } from 'htm/react';
import { AuthorBio } from '../AuthorBio.js';
import { AuthorBooks } from '../AuthorBooks.js';
import AsyncPage from './AsyncPage.js';

export function Author(props) {
  return html`
    <${AsyncPage} 
      ...${props}
      errorMessage="Author not found"
      itemsPerPage=10
    >
      ${AuthorDetail}
    </>`;
}

function AuthorDetail({ data, ...rest }) {
  return html`
    <${AuthorBio} author=${data.author}/>
    <${AuthorBooks} ...${rest} books=${data.books}/>
  `;
}
