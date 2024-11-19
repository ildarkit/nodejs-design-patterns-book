import { html } from 'htm/react';
import { AuthorList } from '../AuthorList.js';
import AsyncPage from './AsyncPage.js';
import { PerPageDropMenu } from '../PerPageItems.js';
import { useSessionStorage } from '../../session.js';
import { NavBar, SearchForm } from '../SearchBar.js';

export function AuthorsIndex(props) {
  return html`
    <${AsyncPage} ...${props}>
      ${AuthorListDropMenu}
    </>`; 
}

function AuthorListDropMenu({ data, handleData, ...rest }) {
  return html`
    <${NavBar} handleData=${handleData}>
      ${SearchForm}
    </>
    <${PerPageDropMenu} 
      ...${rest}
      data=${data}
      handleSession=${(initValue) => useSessionStorage('authorsListPerPageItems', initValue)}
    >
      ${AuthorList} 
    </>`;
}
