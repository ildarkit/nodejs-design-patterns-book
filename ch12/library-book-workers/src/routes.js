import { asyncApiContent } from './api/apiRequestData.js';
import { AuthorsIndex } from './frontend/components/pages/AuthorsIndex.js';
import { Author } from './frontend/components/pages/Author.js';
import { ErrorPage } from './frontend/components/pages/ErrorPage.js';

const loadData = (props) => asyncApiContent(props);

export const routeMapServer = {
  index: '/',
  author: '/author/:authorId',
};

export const routeMapApi = {
  [routeMapServer.index]: `${routeMapServer.index}authors`,
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
