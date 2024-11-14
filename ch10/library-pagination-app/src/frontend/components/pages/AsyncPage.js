import { useEffect, useState } from 'react';
import { html } from 'htm/react';
import { useLocation } from 'react-router-dom';
import { PageContainer } from '../PageContainer.js';
import { AuthorList } from '../AuthorList.js';
import { ErrorPage } from './ErrorPage.js';
import { asyncApiContent } from '../../../api/apiRequestData.js';
import { useData } from '../../contextData.js';
import { routeMapApi } from '../../../routes.js';

export default function AsyncPage(props) {
  const location = useLocation();
  const pathName = routeMapApi[location.pathname] || location.pathname;
  const [ url, setUrl ] = useState(pathName + location.search);

  const res = useData(
    { ...props, url },
    asyncApiContent,
  );

  function handleUrl(query) {
    setUrl(pathName + query);
  }

  return !(res.data || res.err) ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    res.err ? (
      html`
      <${ErrorPage}
        staticContext=${props.staticContext}
        error=${res.err}
        message=${props.errorMessage}
      />`
    ) : (
      html`
      <${PageContainer}>
        <${props.children} 
          data=${res.data.result}
          handleUrl=${handleUrl}
          pageItemCount=${props.itemsPerPage}
          totalCount=${res.data.total_count}
        /> 
      </>`
    )
  ); 
}
