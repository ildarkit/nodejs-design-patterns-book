import { AuthorsIndex, loadAuthors } from './components/pages/AuthorsIndex.js';
import { Author, loadAuthor } from './components/pages/Author.js';
import { ErrorPage } from './components/pages/ErrorPage.js';

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
    component: ErrorPage,
  },
];
