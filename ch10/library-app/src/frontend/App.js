import { html } from 'htm/react';
import { Switch, Route } from 'react-router-dom';
import { AuthorsIndex } from './components/pages/AuthorsIndex.js';
import { Author } from './components/pages/Author.js';
import { FourOhFour } from './components/pages/FourOhFour.js';

export function App() {
  return html`
    <${Switch}>
      <${Route} 
        path="/"
        exact
        component=${AuthorsIndex}
      />
      <${Route} 
        path="/author/:authorId"
        component=${Author}
      />
      <${Route} 
        path="*"
        component=${FourOhFour}
      />
    </>
  `;
}
