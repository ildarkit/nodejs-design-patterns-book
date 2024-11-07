import { html } from 'htm/react';
import { Link } from 'react-router-dom';

export function AuthorList({ data }) {
  return html`
    <div>
      <h2 className="text-center">Books by author</h2>
      <div className="row">${data.map((author) =>
        html`<div key=${author.id} className="col text-center">
          <${Link} to="${`/author/${author.slug}`}">
            <img 
              className="author-picture"
              src="${`/public/authors/${author.picture}`}"
              alt="author picture"
            />
            <p>${author.name}</p>
          </>
        </div>`)}
      </div>
    </div>
  `;
}
