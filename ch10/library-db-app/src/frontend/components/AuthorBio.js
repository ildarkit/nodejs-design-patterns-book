import { html } from 'htm/react';

export function AuthorBio({ author }) {
  return html`
    <h2 className="text-center">${author.name}</h2>
    <div className="row">
      <div className="col-1"></div>
      <div className="col-10">
        <p className="bio">
          <img 
            className="portrait"
            src="${`/public/authors/${author.picture}`}"
          />
          ${author.bio}
        </p> 
      </div>
      <div className="col-1"></div>
    </div>
  `;
}
