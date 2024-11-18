import { html } from 'htm/react';
import { AuthorList } from '../AuthorList.js';
import AsyncPage from './AsyncPage.js';
import { PerPageDropMenu } from '../PerPageItems.js';
import { useSessionStorage } from '../../session.js';
import { SearchBar } from '../SearchBar.js';

export function AuthorsIndex(props) {
  return html`
    <${AsyncPage} ...${props}>
      ${AuthorListDropMenu}
    </>`; 
}

function AuthorListDropMenu({ data, handleData, ...rest }) {
  return html`
    <${SearchBar} handleData=${handleData}/>
    <${PerPageDropMenu} 
      ...${rest}
      authors=${data.authors}
      handleSession=${(initValue) => useSessionStorage('authorsListPerPageItems', initValue)}
    >
      ${AuthorList} 
    </>`;
}
