import react from 'react';
import { html } from 'htm/react';
import { Routes, Route } from 'react-router-dom';
import { AuthorsIndex } from './components/pages/AuthorsIndex';
import { Author } from './components/pages/Author';
import { FourOhFour } from './components/pages/FourOhFour';

export class App extends react.Component {
  render() {
    return html`
      <${Routes}>
        <${Route} 
          path="/"
          Component=${AuthorsIndex}
        />
        <${Route} 
          path="/author/:authorId"
          Component=${Author}
        />
        <${Route} 
          path="*"
          Component=${FourOhFour}
        />
      </>
    `;
  }
}
