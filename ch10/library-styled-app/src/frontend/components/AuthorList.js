import { html } from 'htm/react';
import { Link } from 'react-router-dom';

export function AuthorList({ authors }) {
  return html`
    <div>
      <h2 className="text-center">Books by author</h2>
      <div className="row">${authors.map((author) =>
        html`<div key=${author.id} className="col text-center">
          <${Link} to="${`/author/${author.id}`}">
            <img src="${`/public/authors/${author.picture}`}" alt="author picture"/>
            <p>${author.name}</p>
          </>
        </div>`)}
      </div>
    </div>
  `;
}
