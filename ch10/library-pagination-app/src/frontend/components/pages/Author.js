import { html } from 'htm/react';
import { useRouteMatch } from 'react-router-dom';
import { ErrorPage } from './ErrorPage.js';
import { PageContainer } from '../PageContainer.js';
import { AuthorBio } from '../AuthorBio.js';
import { AuthorBooks } from '../AuthorBooks.js' 
import { asyncApiContent } from './AsyncPage.js';
import { useData } from '../../../contextData.js';
import { routeMapApi } from '../../routes.js';

export function Author(props) {
  const match = useRouteMatch(routeMapApi.author);
  const author = useData(
    { ...props, id: match.params.authorId, url: match.url },
    asyncApiContent
  );

  return !(author.data || author.err)  ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    author.err ? (
      html`<${ErrorPage}
        staticContext=${props.staticContext}
        error=${author.err}
        message="Author not found"
      />`
    ) : (
      html`<${PageContainer}>
        <div>
          <${AuthorBio} author=${author.data}/>
          <${AuthorBooks} author=${author.data}/>
        </div>
      </>`
    )
  );
}
