import react from 'react';
import { html } from 'htm/react';
import { Link } from 'react-router-dom';

export class Header extends react.Component {
  render() {
    return html`<header>
      <h1>
        <${Link} to="/">My library</>
      </h1>
    </header>`;
  } 
}
