import { html } from 'htm/react';
import { AuthorBio } from '../AuthorBio.js';
import { AuthorBooks } from '../AuthorBooks.js';
import AsyncPage from './AsyncPage.js';

export function Author(props) {
  return html`
    <${AsyncPage} ...${props} errorMessage="Author not found">
      ${AuthorDetail}
    </>`;
}

function AuthorDetail({ data }) {
  return html`
    <${AuthorBio} author=${data}/>
    <${AuthorBooks} author=${data}/>
  `;
}
