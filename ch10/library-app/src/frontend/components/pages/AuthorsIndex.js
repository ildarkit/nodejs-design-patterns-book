import { useState, useEffect } from 'react';
import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import superagent from 'superagent';
import { Header } from '../Header.js';

async function getAuthors() {
  return await superagent
    .get('http://localhost:3001/api/authors');
}

export function AuthorsIndex() {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    getAuthors().then(({ body }) => {
      setAuthors(body);
      setLoading(false);
    });
  }, []);

  return loading ? (
    html`<${Header}><div>Loading...</div>`
  ) : (
  html`<div>
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
  </div>`
  );
}
