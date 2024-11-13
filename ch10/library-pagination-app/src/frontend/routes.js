import { AuthorsIndex } from './components/pages/AuthorsIndex.js';
import { Author } from './components/pages/Author.js';
import { ErrorPage } from './components/pages/ErrorPage.js';
import { routeMapServer } from '../server/routes.js';

export { routeMapApi } from '../api/routes.js';

export const routes = [
  {
    path: routeMapServer.index,
    exact: true,
    component: AuthorsIndex,
  },
  {
    path: routeMapServer.author,
    component: Author,
  },
  {
    path: '*',
    component: ErrorPage,
  },
];
