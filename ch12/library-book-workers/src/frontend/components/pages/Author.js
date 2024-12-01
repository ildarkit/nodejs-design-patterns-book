import { html } from 'htm/react';
import { AuthorBio } from '../AuthorBio.js';
import { AuthorBooks } from '../AuthorBooks.js';
import AsyncPage from './AsyncPage.js';
import { PerPageDropMenu } from '../PerPageItems.js';
import { useSessionStorage } from '../../session.js';
import { NavBar } from '../SearchBar.js';

export function Author(props) {
  return html`
    <${AsyncPage} 
      ...${props}
      errorMessage="Author not found"
    >
      ${AuthorDetailDropMenu}
    </>`;
}

function AuthorDetailDropMenu({ data, ...rest }) {
  return html`
    <${NavBar}/>
    <${AuthorBio} author=${data.author}/>
    <${PerPageDropMenu} 
      ...${rest}
      books=${data.books}
      handleSession=${(initValue) => useSessionStorage('authorPerPageItems', initValue)}
    >
      ${AuthorBooks} 
    </>`;
}
