import { useState, useEffect } from 'react';
import superagent from 'superagent';
import { html } from 'htm/react';
import { useParams } from 'react-router-dom';
import { FourOhFour } from './FourOhFour.js';
import { Header } from '../Header.js';

async function getAuthor(id) {
  return await superagent
    .get(`http://localhost:3001/api/author/${id}`);
}

export function Author(props) {
  const { authorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState();

  useEffect(() => { 
    getAuthor(authorId)
      .then(({ body }) => {
        setAuthor(body);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authorId]);
   
  return loading ? (
    html`<${Header}><div>Loading...</div>`
  ) : (
    !author ? (
      html`<${FourOhFour}
        staticContext=${props.staticContext}
        error="Author not found"
      />`
    ) : (
    html`<div>
      <${Header}/>
      <h2>${author.name}</h2>
      <p>${author.bio}</p>
      <h3>Books</h3>
      <ul>
        ${author.books.map((book) =>
          html`<li key=${book.id}>${book.title} (${book.year})</li>`
        )}
      </ul>
    </div>`
    )
  );
}
