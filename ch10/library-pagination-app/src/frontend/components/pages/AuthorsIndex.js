import { html } from 'htm/react';
import { PageContainer } from '../PageContainer.js';
import { AuthorList } from '../AuthorList.js';
import { ErrorPage } from './ErrorPage.js';
import { asyncApiContent } from './AsyncPage.js';
import { useData } from '../../../contextData.js';
import { routeMapApi } from '../../routes.js';

export function AuthorsIndex(props) {
  const authors = useData(
    { ...props, url: routeMapApi.authors },
    asyncApiContent
  );

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
