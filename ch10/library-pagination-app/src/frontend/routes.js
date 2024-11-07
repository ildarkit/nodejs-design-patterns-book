import { AuthorsIndex } from './components/pages/AuthorsIndex.js';
import { Author } from './components/pages/Author.js';
import { ErrorPage } from './components/pages/ErrorPage.js';
import { asyncApiContent } from './apiRequestData.js';

const loadData = (props) => asyncApiContent(props);

const routeMapServer = {
  index: '/',
  author: '/author/:authorId',
};

export const routeMapApi = {
  authors: routeMapServer.index + 'authors',
  author: routeMapServer.author,
};

export const routes = [
  {
    path: routeMapServer.index,
    exact: true,
    component: AuthorsIndex,
    loadData,
  },
  {
    path: routeMapServer.author,
    component: Author,
    loadData,
  },
  {
    path: '*',
    component: ErrorPage,
  },
];
