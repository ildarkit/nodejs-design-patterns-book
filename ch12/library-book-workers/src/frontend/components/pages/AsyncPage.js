import { useState } from 'react';
import { html } from 'htm/react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { PageContainer } from '../PageContainer.js';
import { ErrorPage } from './ErrorPage.js';
import { asyncApiContent } from '../../../api/apiRequestData.js';
import { useData } from '../../contextData.js';
import { routeMapApi } from '../../../routes.js';
import { useSessionStorage } from '../../session.js';

export default function AsyncPage({ 
  staticContext,
  errorMessage,
  children,
}) {
  const childrenComponents = [children].flat();
  const location = useLocation();
  const pathName = routeMapApi[location.pathname] || location.pathname;
  const [ query, setQuery ] = useSessionStorage('searchDataQuery', '');

  const res = useData(
    { url: paramsUrl(pathName, query), staticContext },
    asyncApiContent,
  );

  function handleData(query) {
    query = query || '';
    setQuery(query);
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
        ${childrenComponents.map((child, index) => html`
          <${child}
            key=${index}
            data=${res.data.result}
            query=${query}
            resetQuery=${() => setQuery('')}
            handleData=${handleData}
            totalCount=${res.data.total_count}
          />`
        )}
      </>`
    )
  );
}

function paramsUrl(url, query) {
  const q = queryString.stringify({ q: query });
  return query ? `${url}?${q}` : `${url}`;
}
