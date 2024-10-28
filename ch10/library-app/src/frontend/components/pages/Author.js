import { html } from 'htm/react';
import { useParams } from 'react-router-dom';
import { FourOhFour } from './FourOhFour.js';
import { Header } from '../Header.js';
import { preloadAsyncData } from './AsyncPage.js';
import { useData } from '../../../contextData.js';

export async function loadAuthor(props) {
  const authorId = props.id ? props.id : props.params.authorId;
  const path = `http://localhost:3001/api/author/${authorId}`;
  return await preloadAsyncData(path);
}

export function Author(props) {
  const { authorId } = useParams();
  const author = useData({ ...props, id: authorId }, loadAuthor);
   
  return !(author.data || author.err)  ? (
    html`<${Header}><div>Loading...</div>`
  ) : (
    author.err ? (
      html`<${FourOhFour}
        staticContext=${props.staticContext}
        error="Author not found"
      />`
    ) : (
      html`<div>
        <${Header}/>
        <h2>${author.data.name}</h2>
        <p>${author.data.bio}</p>
        <h3>Books</h3>
        <ul>
          ${author.data.books.map((book) =>
            html`<li key=${book.id}>${book.title} (${book.year})</li>`
          )}
        </ul>
      </div>`
    )
  );
}
