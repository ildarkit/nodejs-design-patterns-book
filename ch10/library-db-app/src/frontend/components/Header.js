import react from 'react';
import { html } from 'htm/react';
import { Link } from 'react-router-dom';

export function Header() {
  return html`<header>
    <h1 className="text-center">
      <${Link} to="/">My library</>
    </h1>
  </header>`;
}
