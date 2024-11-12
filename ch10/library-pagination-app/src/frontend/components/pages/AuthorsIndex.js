import { html } from 'htm/react';
import { AuthorList } from '../AuthorList.js';
import AsyncPage from './AsyncPage.js';
import { routeMapApi } from '../../routes.js';

export function AuthorsIndex(props) {
  return html`
    <${AsyncPage}
      ...${props}
      route=${routeMapApi.authors}
      itemsPerPage=${1}
    >
      ${AuthorList}
    </>`; 
}
