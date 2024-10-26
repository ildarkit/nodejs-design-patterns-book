import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import { Header } from '../Header.js';

export function FourOhFour(props) {
  if (props.staticContext)
    props.staticContext.statusCode = 404; 

  return html`<div>
    <${Header}/>
    <div>
      <h2>404</h2>
      <h3>${props.error || 'Page not found'}</h3>
      <${Link} to="/">Go back to the home page</>
    </div>
  </div>`;
}
