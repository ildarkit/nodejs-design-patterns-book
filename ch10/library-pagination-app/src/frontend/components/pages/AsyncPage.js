import { useState } from 'react';
import { html } from 'htm/react';
import { useLocation } from 'react-router-dom';
import { PageContainer } from '../PageContainer.js';
import { ErrorPage } from './ErrorPage.js';
import { asyncApiContent } from '../../../api/apiRequestData.js';
import { useData } from '../../contextData.js';
import { routeMapApi } from '../../../routes.js';

export default function AsyncPage({ 
  staticContext,
  errorMessage,
  children,
}) {
  const childrenComponents = [children].flat();
  const location = useLocation();
  const pathName = routeMapApi[location.pathname] || location.pathname;
  const [ url, setUrl ] = useState(pathName + location.search);

  const res = useData(
    { url, staticContext },
    asyncApiContent,
  );

  function handleData(query) {
    setUrl(`${pathName}?${query}`);
  }

  return !(res.data || res.err) ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    res.err ? (
      html`
      <${ErrorPage}
        staticContext=${staticContext}
        error=${res.err}
        message=${errorMessage}
      />`
    ) : (
      html`
      <${PageContainer}>
        ${childrenComponents.map((child) => html`
          <${child}
            key=${child.Name}
            data=${res.data.result}
            handleData=${handleData}
            totalCount=${res.data.total_count}
          />`
        )}
      </>`
    )
  );
}
