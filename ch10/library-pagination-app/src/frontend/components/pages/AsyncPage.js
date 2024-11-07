import { useEffect, useState } from 'react';
import { html } from 'htm/react';
import { useLocation } from 'react-router-dom';
import { PageContainer } from '../PageContainer.js';
import { AuthorList } from '../AuthorList.js';
import { ErrorPage } from './ErrorPage.js';
import { asyncApiContent } from '../../apiRequestData.js';
import { useData } from '../../../contextData.js';

export default function AsyncPage(props) {
  const location = useLocation();
  const [ url, setUrl ] = useState(
    (props.route || location.pathname) + location.search
  ); 
  const res = useData(
    { ...props, url },
    asyncApiContent,
  );

  return !(res.data || res.err) ? (
    html`<${PageContainer}>
      <div className="text-center">Loading...</div>
    </>`
  ) : (
    res.err ? (
      html`<${ErrorPage}
        staticContext=${props.staticContext}
        error=${res.err}
        message=${props.errorMessage}
      />`
    ) : (
      html`<${PageContainer}>
        <${props.children} data=${res.data}/> 
      </>`
    )
  ); 
}
