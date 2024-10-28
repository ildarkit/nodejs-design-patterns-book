import { html } from 'htm/react';
import { Link } from 'react-router-dom';
import { Header } from '../Header.js';
import { FourOhFour } from './FourOhFour.js';
import { preloadAsyncData } from './AsyncPage.js';
import { useData } from '../../../contextData.js';

export async function loadAuthors(props) {
  const path = `http://localhost:3001/api/authors/`;
  return await preloadAsyncData(path);
}

export function AuthorsIndex(props) {
  const authors = useData(props, loadAuthors); 

  return !(authors.data || authors.err) ? (
    html`<${Header}><div>Loading...</div>`
  ) : (
    authors.err ? (
      html`<${FourOhFour}
        staticContext=${props.staticContext}
        error="Authors not found"
      />`
    ) : (
      html`<div>
        <${Header}/>
        <div>${authors.data.map((author) =>
          html`<div key=${author.id}>
            <p>
              <${Link} to="${`/author/${author.id}`}">
                ${author.name}
              </>
            </p>
          </div>`)}
        </div>
      </div>`
    )
  );
}
