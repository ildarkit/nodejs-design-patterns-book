import { AuthorsIndex, loadAuthors } from './components/pages/AuthorsIndex.js';
import { Author, loadAuthor } from './components/pages/Author.js';
import { FourOhFour } from './components/pages/FourOhFour.js';

export const routes = [
  {
    path: '/',
    exact: true,
    component: AuthorsIndex,
    loadData: (props) => loadAuthors(props),
  },
  {
    path: '/author/:authorId',
    component: Author,
    loadData: (props) => loadAuthor(props),
  },
  {
    path: '*',
    component: FourOhFour,
  },
];
