import { html } from 'htm/react';
import { useParams } from 'react-router-dom';
import { FourOhFour } from './FourOhFour.js';
import { Header } from '../Header.js';
import { authors } from '../../../data/authors.js';

export function Author(props) {
  const { authorId } = useParams();
  const author = authors.find(
    author => author.id === authorId
  );
  if (!author) {
    return html`<${FourOhFour}
      staticContext=${props.staticContext}
      error="Author not found"
    />`;
  }
  return html`<div>
    <${Header}/>
    <h2>${author.name}</h2>
    <p>${author.bio}</p>
    <h3>Books</h3>
    <ul>
      ${author.books.map((book) =>
        html`<li key=${book.id}>${book.title} (${book.year})</li>`
      )}
    </ul>
  </div>`;
}
