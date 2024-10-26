import react from 'react';
import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import { Header } from '../Header.js';
import { authors } from '../../../data/authors';

export class AuthorsIndex extends react.Component {
  render() {
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
}
