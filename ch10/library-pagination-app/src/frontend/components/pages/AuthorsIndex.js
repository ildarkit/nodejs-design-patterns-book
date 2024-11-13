import { html } from 'htm/react';
import { AuthorList } from '../AuthorList.js';
import AsyncPage from './AsyncPage.js';

export function AuthorsIndex(props) {
  return html`
    <${AsyncPage}
      ...${props}
      itemsPerPage=${1}
    >
      ${AuthorList}
    </>`; 
}
