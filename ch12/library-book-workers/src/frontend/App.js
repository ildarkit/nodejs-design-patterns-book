import { html } from 'htm/react';
import { Switch, Route } from 'react-router-dom';
import { routes } from '../routes.js';

export function App() {
  return html`
    <${Switch}>
      ${routes.map(route =>
        html`<${Route}
          key=${route.path}
          ...${route}
        />`
      )} 
    </>
  `;
}
