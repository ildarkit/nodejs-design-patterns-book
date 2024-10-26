import react from 'react';
import { html } from 'htm/react';
import { useParams } from 'react-router-dom';
import { FourOhFour } from './FourOhFour';
import { Header } from '../Header';
import { authors } from '../../../data/authors';

export function Author() {
  const { authorId } = useParams();
  const author = authors.find(
    author => author.id === authorId
  );
  if (!author) {
    return html`<${FourOhFour} error="Author not found"/>`;
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
