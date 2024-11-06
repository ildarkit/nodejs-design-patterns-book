import { html } from 'htm/react';
import { PageContainer } from '../PageContainer.js';
import { AuthorList } from '../AuthorList.js';
import { ErrorPage } from './ErrorPage.js';
import { preloadAsyncData } from './AsyncPage.js';
import { useData } from '../../../contextData.js';

export async function loadAuthors(props) {
  const path = `http://localhost:3001/api/authors/`;
  return await preloadAsyncData(path);
}

export function AuthorsIndex(props) {
  const authors = useData(props, loadAuthors); 

  return !(authors.data || authors.err) ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    authors.err ? (
      html`<${ErrorPage}
        staticContext=${props.staticContext}
        error=${authors.err}
      />`
    ) : (
      html`<${PageContainer}>
        <${AuthorList} authors=${authors.data}/>
      </>`
    )
  ); 
}
