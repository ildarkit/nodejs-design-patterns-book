import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../PageContainer.js';

export function ErrorPage({ staticContext, error, message }) {
  const statusCode = error && error.status || !error && 404 || 503;
  if (staticContext)
    staticContext.statusCode = statusCode;

  return html`
    <${PageContainer}>
      <div className="text-center">
        <h2>${statusCode}</h2>
        <h3>
          ${statusCode >= 400 && statusCode < 500 && message ?
              message : statusCode >= 500 ?
              'Something went wrong. Please try again later.' :
              'Page not found'}
        </h3>
        <${Link} to="/">Go back to the home page</>
      </div>
    </>`;
}
