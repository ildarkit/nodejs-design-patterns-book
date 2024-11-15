import { html } from 'htm/react';
import { AuthorList } from '../AuthorList.js';
import AsyncPage from './AsyncPage.js';
import { PerPageDropMenu } from '../PerPageItems.js';

export function AuthorsIndex(props) {
  return html`
    <${AsyncPage} ...${props}>
      ${AuthorListDropMenu}
    </>`; 
}

function AuthorListDropMenu({ data, ...rest }) {
  return html`
    <${PerPageDropMenu} ...${rest} authors=${data.authors}>
      ${AuthorList} 
    </>`;
}
