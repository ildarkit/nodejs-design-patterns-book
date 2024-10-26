import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import { Header } from '../Header.js';
import { authors } from '../../../data/authors.js';

export function AuthorsIndex() {
  return html`<div>
    <${Header}/>
    <div>${authors.map((author) =>
      html`<div key=${author.id}>
        <p>
          <${Link} to="${`/author/${author.id}`}">
            ${author.name}
          </>
        </p>
      </div>`)}
    </div>
  </div>`;
}
